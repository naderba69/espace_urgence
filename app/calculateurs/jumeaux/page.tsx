"use client";
// v13.1 — مُفرّق التوائم : أزواج الأدوية المتشابهة جنباً إلى جنب + سطر التمييز + قاعدة التوقف.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Scale } from "lucide-react";

type Pair = {
  id: string; sev: number;
  a: { fr: string; ar: string }; b: { fr: string; ar: string };
  line: { fr: string; ar: string }; risk: { fr: string; ar: string };
};

const PAIRS: Pair[] = [
  { id: "kcl", sev: 3,
    a: { fr: "KCl 10 % concentré", ar: "KCl ١٠٪ مركّز" }, b: { fr: "KCl dilué (perfusé)", ar: "KCl مخفّف (تسريب)" },
    line: { fr: "L'ampoule concentrée porte la mention « À DILUER » (2 g/20 mL).", ar: "الأمبول المركّز يحمل عبارة «للتخفيف» (٢ غ/٢٠ مل)." },
    risk: { fr: "KCl concentré en IV direct = arrêt cardiaque.", ar: "KCl مركّز وريدي مباشر = توقف قلب." } },
  { id: "suxroc", sev: 3,
    a: { fr: "Succinylcholine (6-10 min)", ar: "سكسينيل كولين (٦-١٠ د)" }, b: { fr: "Rocuronium (45-60 min)", ar: "روكورونيوم (٤٥-٦٠ د)" },
    line: { fr: "Même volume par seringue; seule la DURÉE les sépare.", ar: "نفس حجم السرنجة؛ المدة وحدها تفصل بينهما." },
    risk: { fr: "Échange = patient conscient paralysé longtemps, ou apnée prolongée.", ar: "التبديل = مريض واعٍ مشلول طويلاً، أو انقطاع نفس ممتد." } },
  { id: "midmor", sev: 3,
    a: { fr: "Midazolam 10 mg/1 mL", ar: "ميدازولام ١٠ مغ/١ مل" }, b: { fr: "Morphine 10 mg/1 mL", ar: "مورفين ١٠ مغ/١ مل" },
    line: { fr: "Deux ampoules identiques « 1 mL — 10 »: lire la matière active entière.", ar: "أمبولان متطابقان «١ مل — ١٠»: اقرأ المادة الفعالة كاملة." },
    risk: { fr: "Morphine à la place du midazolam = dépression respiratoire sous-estimée.", ar: "المورفين بدل الميدازولام = اكتئاب تنفسي مُستهان به." } },
  { id: "nalnal", sev: 2,
    a: { fr: "Naloxone (antagoniste pur)", ar: "نالوكسون (معاكس صافٍ)" }, b: { fr: "Nalbuphine (agoniste-antagoniste)", ar: "نالبوفين (مختلط)" },
    line: { fr: "Une lettre (« -ox- » vs « -uph- ») change tout l'effet.", ar: "حرف واحد (‑وكس vs ‑وبوفين) يغيّر المفعول كلياً." },
    risk: { fr: "Nalbuphine dans l'overdose = effet partiel qui rassure à tort.", ar: "النالبوفين في الجرعة الزائدة = مفعول جزئي يطمئن ظلماً." } },
  { id: "phenfos", sev: 2,
    a: { fr: "Phénytoïne (mg)", ar: "فينيتوين (مغ)" }, b: { fr: "Fos-phénytoïne (mg ÉP)", ar: "فوسفينيتوين (مغ مكافئ)" },
    line: { fr: "Le fos- se dose en « mg ÉP » (équivalent phénytoïne).", ar: "الفوس- يُقاس بـ«مغ مكافئ» (مكافئ فينيتوين)." },
    risk: { fr: "Confondre les unités = dose doublée ou moitié.", ar: "خلط الوحدات = جرعة مضاعفة أو نصفها." } },
  { id: "adreno", sev: 2,
    a: { fr: "Adrénaline", ar: "أدرينالين" }, b: { fr: "Noradrénaline", ar: "نورأدرينالين" },
    line: { fr: "Lire le « nor- » sur l'ampoule; un préfixe, deux médicaments.", ar: "اقرأ «نور-» على الأمبول؛ بادئة واحدة ودواءان مختلفان." },
    risk: { fr: "Noradrénaline en extravasation = nécrose cutanée; profils différents.", ar: "النورأدرينالين المتسرّب = نخر جلدي؛ وبروفيلان مختلفان." } },
  { id: "naclg5", sev: 2,
    a: { fr: "NaCl 0,9 %", ar: "ملح ٠٫٩٪" }, b: { fr: "Glucosé 5 %", ar: "غلوكوز ٥٪" },
    line: { fr: "Deux poches transparentes: l'étiquette seule fait la différence.", ar: "كيسان شفافان: الملصق وحده هو الفرق." },
    risk: { fr: "G5 % en remplissage = de l'eau sans volume efficace.", ar: "غلوكوز ٥٪ في التعبئة = ماء بلا حجم فعّال." } },
  { id: "in-su", sev: 2,
    a: { fr: "Insuline rapide (transparente)", ar: "أنسولين سريع (شفاف)" }, b: { fr: "Insuline lente/NPH (trouble)", ar: "أنسولين بطيء/NPH (عكّار)" },
    line: { fr: "Rapide = claire; NPH = trouble après resuspension douce.", ar: "السريع = صافٍ؛ NPH = عكّار بعد إعادة الخلط اللطيف." },
    risk: { fr: "Lente en bolus (DKA) = Action retardée au pire moment.", ar: "البطيء كبولوس في الحماض الكيتوني = مفعول متأخر في أسوأ لحظة." } },
  { id: "halobip", sev: 2,
    a: { fr: "Halopéridol (neuroleptique)", ar: "هالوبيريدول (مضاد ذهان)" }, b: { fr: "Bipéridène (anticholinergique)", ar: "بيبيريدين (مضاد كوليني)" },
    line: { fr: "Les deux petites ampoules se côtoient: l'un provoque la dystonie, l'autre la soigne.", ar: "أمبولان صغيران متجاوران: أحدهما يسبّب الاختلاج والآخر يعالجه." },
    risk: { fr: "Inversion = dystonie aggravée ou agitation traitée… à l'envers.", ar: "القلب = اختلاج يتفاقم أو هياج يُعالج بالمقلوب." } },
  { id: "salsal", sev: 2,
    a: { fr: "Salbutamol (secours)", ar: "سالبوتامول (إنقاذ)" }, b: { fr: "Salmétérol (fond, LABA)", ar: "سالميتيرول (وقائي ممتد)" },
    line: { fr: "« -butamol » agit en minutes; « -métérol » en heures.", ar: "«‑بوتامول» يفعِل بدقائق؛ «‑ميتيرول» بساعات." },
    risk: { fr: "LABA seul dans la crise = aucun secours immédiat.", ar: "الممتد وحده في الأزمة = لا إنقاذ فوري." } },
  { id: "furofur", sev: 1,
    a: { fr: "Furosémide (diurétique)", ar: "فوروسيميد (مدرّ)" }, b: { fr: "Furadantine/nitrofurantoïne (ATB urinaire)", ar: "فورادانتين/نيتروفورانتوين (مضاد بولي)" },
    line: { fr: "« Furo-sémide » pousse l'eau dehors; « Fura-dantine » traite l'infection.", ar: "«فوروسيميد» يطرح الماء؛ «فورادانتين» يعالج العدوى." },
    risk: { fr: "Diurétique sur patient déshydraté; nitrofurantoïne si clairance < 30.", ar: "مدرّ على مريض جافّ؛ نيتروفورانتوين إذا التصفية < ٣٠." } },
  { id: "rivo", sev: 2,
    a: { fr: "Rivotril en GOUTTES (1 g ≈ 0,1 mg)", ar: "ريفوتريل بالنقط (١ ن ≈ ٠٫١ مغ)" }, b: { fr: "Rivotril en mg (comprimé)", ar: "ريفوتريل بالمغ (قرص)" },
    line: { fr: "2,6 mg/mL en flacon-gouttes: compter les gouttes PUIS convertir.", ar: "٢٫٦ مغ/مل بقارورة نقط: عُدّ النقط ثم حوّل." },
    risk: { fr: "Confondre gouttes et milligrammes = erreur ×10.", ar: "خلط النقط بالمغ = خطأ ×١٠." } },
];

export default function JumeauxPage() {
  useRegisterRecent("calculateur:jumeaux");
  const { lang } = useApp();
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const list = useMemo(() => {
    if (!needle) return PAIRS;
    return PAIRS.filter((p) =>
      [p.a.fr, p.b.fr, p.line.fr, p.risk.fr].some((s) => s.toLowerCase().includes(needle)) ||
      [p.a.ar, p.b.ar, p.line.ar, p.risk.ar].some((s) => s.includes(q.trim()))
    );
  }, [needle, q]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Scale className="h-6 w-6" />}
        title={lang === "ar" ? "مُفرّق التوائم" : "Frères jumeaux : ne pas confondre"}
        sub={lang === "ar" ? "الأدوية المتشابهة جنباً إلى جنب: سطر التمييز، خطر التبديل، وقاعدة التوقف." : "Médicaments jumeaux côte à côte : discriminant, risque en cas d'échange, règle STOP."}
      />

      <div className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Règle STOP" ar="قاعدة التوقف" /></Badge></div>
        <p className="mt-2 text-sm font-black">
          <T fr="Deux lectures AVANT toute injection: le nom complet sur l'ampoule, puis la dose. Si le doute persiste 3 secondes — arrêter et vérifier." ar="قراءتان قبل أي حقن: الاسم الكامل على الأمبول، ثم الجرعة. إذا بقي الشك ٣ ثوانٍ — توقّف وتحقّق." />
        </p>
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
        <span className="shrink-0 text-xs font-black opacity-70"><T fr="Filtrer" ar="تصفية" /></span>
        <input type="text" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "ar" ? "اكتب حرفين…" : "Taper 2 lettres…"}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label={lang === "ar" ? "تصفية الأزواج" : "Filtrer les paires"} />
        {q && <button onClick={() => setQ("")} className="touch rounded-full px-2 text-xs font-black opacity-70" aria-label={lang === "ar" ? "مسح" : "Effacer"}>×</button>}
      </label>

      <p className="text-xs font-black opacity-60" dir="ltr">{list.length} / {PAIRS.length}</p>

      <ul className="flex flex-col gap-3">
        {list.map((p) => (
          <li key={p.id} className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${p.sev === 3 ? "sev-critical" : "sev-urgent"}`}>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-line bg-surface2 p-2 text-center">
                <p className="text-sm font-black">{lang === "ar" ? p.a.ar : p.a.fr}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface2 p-2 text-center">
                <p className="text-sm font-black">{lang === "ar" ? p.b.ar : p.b.fr}</p>
              </div>
            </div>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--accent)" }}>≠ {p.line[lang === "ar" ? "ar" : "fr"]}</p>
            <p className="mt-1 text-sm font-black" style={{ color: p.sev === 3 ? "var(--sev-critical)" : "var(--sev-urgent)" }}>
              {p.risk[lang === "ar" ? "ar" : "fr"]}
            </p>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Aucun couple ne correspond." ar="لا زوج مطابق." />
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/dose-check" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Vérification de dose" ar="التحقق من الجرعة" /></Link>
        <Link href="/calculateurs/garde-fous" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Ne pas oublier avant…" ar="لا تنسَ قبل أن…" /></Link>
        <Link href="/calculateurs/dilutions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Ne pas mélanger" ar="لا تخلط" /></Link>
      </div>
    </div>
  );
}
