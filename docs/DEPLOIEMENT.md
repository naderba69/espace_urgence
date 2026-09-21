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

## ⚡ إعدادات التخزين المؤقت (v18.0)

الملفات المُجزّأة `_next/static/**` لا تتغيّر أبداً، لذا يجب أن تُخزَّن سنة كاملة؛ أما `sw.js`
وصفحات HTML فيجب أن يُعاد التحقّق منهما في كل زيارة (وإلا يبقى التحديث أسابيع في الطريق).

| المنصة | الملف | الحالة |
|---|---|---|
| **Vercel** | `vercel.json` | ✅ جاهز في المستودع — لا شيء تفعله |
| **Netlify** | `public/_headers` | ✅ جاهز (يُنسخ تلقائياً إلى `out/`) |
| **Cloudflare Pages** | `public/_headers` | ✅ جاهز |
| **GitHub Pages** | — | ⚠️ لا يدعم ترويسات مخصّصة: الملفات تُخدَم بسياسة Pages الافتراضية. الأثر محدود (الأسماء مُجزّأة)، والحماية الفعلية من العمل دون اتصال تأتي من خدمة العمل |

للتحقّق بعد النشر:

```bash
curl -I https://<votre-domaine>/_next/static/chunks/<un-fichier>.js | grep -i cache-control
# attendu : public, max-age=31536000, immutable
curl -I https://<votre-domaine>/sw.js | grep -i cache-control
# attendu : public, max-age=0, must-revalidate
curl -I https://<votre-domaine>/reval/acr-adulte | grep -i cache-control
# attendu : public, max-age=3600  (v17.4 — ملف إعادة التقييم لكل بروتوكول)
```

> **التحقّق من العمل دون اتصال بعد النشر (v18.0)** : افتح `/protocoles`، ثم اقطع الشبكة
> (وضع الطيران) وأعد تحميل الصفحة: القائمة تُفتح، والنقر على أي بطاقة يفتح الفيشة كاملة
> بلوحة إعادة التقييم. المخزون المسبق الآن 1114 ملفاً (~17,2 ميغا خام) — يُنزَّل مرّة واحدة
> لكل إصدار، ويشمل حمولات تنقّل صفحات التفاصيل الثلاث (98 بروتوكول + 74 دواء + 122 حاسبة).
> للتصغير: احذف كتلة `collectRoutePayloads` من `scripts/gen-precache.mjs` (تعود 526 ملفاً).

> الخادم المحلي `scripts/static-out.mjs` يطبّق نفس القواعد تماماً، فما تقيسه محلياً
> يشبه ما سيحدث على الاستضافة الحقيقية.

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

---

## 🐞 استكشاف الأخطاء: فشل CI عند `actions/configure-pages`

إذا فشل workflow النشر عند خطوة `configure-pages` برسالة مثل
`Get Pages site failed: Not Found` أو `unable to obtain pages site information`،
فالسبب **ليس الكود** بل أن GitHub Pages غير مفعّل على المستودع.

**الإصلاح (مرة واحدة، من مالِك المستودع):**

1. افتح المستودع على GitHub ← **Settings** (الإعدادات).
2. من القائمة الجانبية ← **Pages**.
3. تحت **Build and deployment** ← **Source** اختر: **GitHub Actions**.
4. احفظ، ثم أعد تشغيل الـ workflow من تبويب **Actions** ← **Re-run all jobs**.

> ملاحظة: البناء (`npm ci` + `vitest` + `next build`) قد ينجح بالكامل بينما
> تفشل خطوة النشر فقط — هذا هو التوقيع المميز لغياب تفعيل Pages.
