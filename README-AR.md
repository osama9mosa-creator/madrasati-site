# نشر مدرستي مجانًا من iPad

هذه الحزمة تحافظ على واجهة HTML الحالية وتجهزها كتطبيق ويب قابل للتثبيت على Android وiPhone. المحتوى يحتاج HTTPS حتى تعمل حسابات Supabase.

## نشر GitHub Pages

1. فك ضغط الحزمة في تطبيق **الملفات** على iPad.
2. في GitHub أنشئ مستودعًا جديدًا باسم `madrasati-site` واجعله **Public**؛ GitHub Pages على الخطة المجانية متاح للمستودعات العامة.
3. ارفع كل محتويات المجلد إلى جذر المستودع؛ يجب أن يكون `index.html` في الجذر بجوار `supabase-client.mjs` و`sw.js`.
4. افتح **Settings > Pages**، واختر **Deploy from a branch**، ثم الفرع `main` والمجلد `/(root)` واحفظ.
5. بعد نشر GitHub Pages سيظهر رابط شبيه بـ`https://YOUR-ACCOUNT.github.io/madrasati-site/`.
6. في مشروع Supabase افتح **Authentication > URL Configuration**، وضع الرابط الفعلي للموقع في **Site URL** وأضفه في **Redirect URLs**، ثم احفظ.

GitHub Pages ينشر الصفحات للعامة. يحتوي هذا المشروع على HTML ومفتاح Supabase **Publishable** المخصص للعميل وبيانات دورات تجريبية فقط؛ لا ترفع أي مفتاح Secret أو كلمة مرور أو بيانات شخصية.

## إضافته إلى الهاتف

- **iPhone:** افتح رابط الموقع في Safari، ثم **Share > Add to Home Screen**.
- **Android:** افتح الرابط في Chrome، ثم **Install app** أو **Add to Home screen**.

هذه نسخة PWA قابلة للتثبيت من المتصفح، وليست ملف APK/IPA ولا منشورة في App Store أو Google Play.

## الملفات

- `index.html`: الواجهة الحالية بعد ربطها بمشروع Supabase.
- `supabase-client.mjs`: عميل API للدورات والحساب والسلة والمفضلة.
- `manifest.webmanifest`, `sw.js`, وملفات `icon-*.png`: إعداد التثبيت وأيقونات وغلاف الصفحة المؤقت.

## المراجع الرسمية

- [نشر GitHub Pages من فرع](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [إعداد روابط إعادة التوجيه في Supabase Auth](https://supabase.com/docs/guides/auth/redirect-urls)
- [إضافة موقع إلى الشاشة الرئيسية على iPhone](https://support.apple.com/en-us/guide/iphone/iphea86e5236/ios)
