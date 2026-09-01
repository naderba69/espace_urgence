# دليل النشر — أرى "Espace Urgence TN" على الإنترنت في ~10 دقائق

التطبيق **ثابت بالكامل** (export statique) — يعمل على أي استضافة مجانية، بلا سيرفر ولا قاعدة بيانات.

---

## الخيار الأسهل: Vercel (مجاني) ✅

### أ. ارفع الكود إلى GitHub
```bash
cd espace-urgence-tn
git init
git add -A
git commit -m "Espace Urgence TN"
# أنشئ مستودعاً جديداً على github.com (New repository) ثم:
git remote add origin https://github.com/<اسم_مستخدمك>/espace-urgence-tn.git
git branch -M main
git push -u origin main
```

### ب. انشر على Vercel
1. ادخل **vercel.com** ← سجّل بحساب GitHub
2. **Add New → Project** ← اختر مستودع `espace-urgence-tn`
3. Vercel يتعرف تلقائياً: Framework = **Next.js**، Build = `npm run build`، المخرجات = `out`
4. اضغط **Deploy** ← بعد ~دقيقتين تحصل على رابط مثل `https://espace-urgence-tn.vercel.app`
5. (اختياري) **Settings → Domains** لربط اسم نطاق خاص

### ج. فعّل توشكية التحديث التلقائي
كل `git push` على main = نشر تلقائي جديد. لا شيء آخر للقيام به.

---

## بدائل مجانية مكافئة

| المنصة | الطريقة |
|---|---|
| **Netlify** | `npx netlify deploy --dir=out --prod` أو اسحب مجلد `out` على app.netlify.com |
| **GitHub Pages** | `npm run build` ثم ادفع `out/` إلى فرع `gh-pages` (اضبط `basePath` إن لزم) |
| **Cloudflare Pages** | مشروع جديد ← GitHub ← أمر البناء `npm run build`، مجلد `out` |

---

## ✅ قائمة فحص قبل الإعلان العام

- [ ] **`npm test` يمرّ** (دوال الجرعات والحاسبات — 23 اختباراً)
- [ ] محتوى **مُدقَّق من طبيب** (جرعات، أسماء تجارية تونسية، أرقام عاجلة)
- [ ] استبدل `G-XXXXXXXXXX` في `lib/analytics.ts` إن أردت الإحصاءات
- [ ] دقّق رقم مركز السموم **71 335 500** محلياً
- [ ] جرّب PWA على هاتف حقيقي: "إضافة إلى الشاشة الرئيسية" ← افتح بلا شبكة
- [ ] جرّب الكاميرا/المايكرو على رابط HTTPS الفعلي (لا localhost)
- [ ] فعّل وظائف AI بمفتاح **خاص بك** على **جهازك** فقط (المفتاح يبقى محلياً)

## 🔧 بعد أي تعديل على المحتوى

```bash
npm run build        # تحقق محلي
npx serve out        # شاهد النسخة النهائية
git add -A && git commit -m "..." && git push   # نشر تلقائي عبر Vercel
```

⏱️ معدل ما تحتاجه بين الكتابة والنشر: أقل من 3 دقائق.
