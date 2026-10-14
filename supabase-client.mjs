import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = globalThis.MADRASATI_CONFIG;
if (!config?.url || !config?.publishableKey) {
  throw new Error("Set MADRASATI_CONFIG.url and publishableKey before loading the client.");
}

export const supabase = createClient(config.url, config.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const courseFields = "id,category_id,title,description,instructor,price_sar,old_price_sar,rating,students_count,duration,lesson_count,level,accent,symbol,featured,categories(title)";

function toCardCourse(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.categories?.title ?? "",
    teacher: row.instructor,
    price: Number(row.price_sar),
    old: row.old_price_sar == null ? null : Number(row.old_price_sar),
    rating: Number(row.rating).toFixed(1),
    students: Number(row.students_count).toLocaleString("ar-SA"),
    duration: row.duration,
    lessons: row.lesson_count,
    level: row.level,
    accent: row.accent,
    symbol: row.symbol,
    featured: row.featured,
    desc: row.description,
  };
}

async function requireUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("سجّل الدخول أولًا.");
  return data.user.id;
}

export const madrasatiApi = {
  async categories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id,title,sort_order")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },

  async courses({ query = "", categoryId = null } = {}) {
    const trimmed = query.trim();
    let result;
    if (trimmed) {
      result = await supabase.rpc("search_courses", {
        p_query: trimmed,
        p_category_id: categoryId,
      });
      if (!result.error && result.data?.length) {
        const categoryRows = await this.categories();
        const categoryNames = new Map(categoryRows.map((category) => [category.id, category.title]));
        return result.data.map((row) => toCardCourse({
          ...row,
          categories: { title: categoryNames.get(row.category_id) },
        }));
      }
      if (result.error) throw result.error;
      return [];
    }

    let request = supabase
      .from("courses")
      .select(courseFields)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("title");
    if (categoryId) request = request.eq("category_id", categoryId);
    result = await request;
    if (result.error) throw result.error;
    return result.data.map(toCardCourse);
  },

  async signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCart() {
    const { data, error } = await supabase
      .from("cart_items")
      .select("course_id,quantity,created_at,courses(id,title,price_sar,accent,symbol)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async addToCart(courseId) {
    const userId = await requireUserId();
    const { error } = await supabase.from("cart_items").upsert(
      { user_id: userId, course_id: courseId, quantity: 1 },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );
    if (error) throw error;
  },

  async removeFromCart(courseId) {
    const { error } = await supabase.from("cart_items").delete().eq("course_id", courseId);
    if (error) throw error;
  },

  async getFavorites() {
    const { data, error } = await supabase
      .from("favorites")
      .select("course_id,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => row.course_id);
  },

  async toggleFavorite(courseId) {
    const { data, error } = await supabase
      .from("favorites")
      .select("course_id")
      .eq("course_id", courseId)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      const removed = await supabase.from("favorites").delete().eq("course_id", courseId);
      if (removed.error) throw removed.error;
      return false;
    }
    const userId = await requireUserId();
    const inserted = await supabase.from("favorites").insert({ user_id: userId, course_id: courseId });
    if (inserted.error) throw inserted.error;
    return true;
  },

  async createCheckoutOrder() {
    const { data, error } = await supabase.rpc("create_checkout_order");
    if (error) throw error;
    return data?.[0] ?? null;
  },

  async myCourses() {
    const { data, error } = await supabase
      .from("course_entitlements")
      .select("course_id,granted_at,courses(id,title,description,instructor,duration,lesson_count)")
      .order("granted_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};
