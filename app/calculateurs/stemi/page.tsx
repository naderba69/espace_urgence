"use client";
// Localisation du STEMI / équivalent ST+ : dérivations avec sus-décalage → territoire, artère coupable, conduite.
// Règles : ESC 2017/2023 (STEMI), Matetzky (IDM inf), Smith's ECG Blog (postérieur/aVR), O'Keefe.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { PrintButton } from "@/components/Chrome";
import { trackEvent } from "@/lib/analytics";
import { HeartPulse, ArrowRight, AlertTriangle, Info } from "lucide-react";

const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"] as const;
type Lead = (typeof LEADS)[number];

interface Result {
  title: { fr: string; ar: string };
  artery: { fr: string; ar: string };
  severity: { fr: string; ar: string };
  actions: { fr: string; ar: string }[];
  critical: boolean;
}

function infer(sel: Set<Lead>, depV1V3: boolean, rsV2: boolean, st3gt2: boolean, depAVL: boolean): Result | null {
  const h = (l: Lead) => sel.has(l);
  const inf = [h("II"), h("III"), h("aVF")].filter(Boolean).length >= 2;
  const ant = h("V1") || h("V2") || h("V3") || h("V4");
  const latH = h("I") || h("aVL");
  const latL = h("V5") || h("V6");
  const anyEle = sel.size > 0;

  // aVR : élévation aVR + dépression diffuse (proximal IVA / tronc commun)
  if (h("aVR") && (!ant && !inf) && depV1V3) {
    return {
      title: { fr: "Sus-décalage aVR + dépression sous-endocardique diffuse", ar: "ارتفاع aVR مع نقصان تحت بطاني منتشر" },
      artery: { fr: "Tronc commun gauche ou IVA proximale (ou sub-occlusion multivasculaire)", ar: "الجذع المشترك الأيسر أو IVA قريبة" },
      severity: { fr: "Maximale — cathétérisme < 90 min, anticiper le choc", ar: "قصوى — قسطرة <90 دقيقة، توقّع الصدمة" },
      actions: [
        { fr: "Appel SAMU réanimateur + plateau coronarographie immédiat", ar: "اتصال مستعجلات الإنعاش + قسطرة فورية" },
        { fr: "Éviter les dérivés nitrés et les volumes importants", ar: "تجنّب النترات والحجوم الكبيرة" },
        { fr: "Surveillance continue + défibrillateur prêt", ar: "مراقبة مستمرة + مزيل رجفان جاهز" },
      ],
      critical: true,
    };
  }

  // postérieur isolé (équivalent STEMI)
  if (!anyEle && (depV1V3 || rsV2)) {
    return {
      title: { fr: "IDM postérieur (équivalent ST+) — dépression V1–V3 ± R/S ≥ 1 en V2", ar: "احتشاء خلفي (مكافئ ST+) — نقصان V1–V3 ± R/S‎ ≥1 في V2" },
      artery: { fr: "RCA ou circonflexe (LCx)", ar: "تاجية يمنى أو محيطية" },
      severity: { fr: "Haute — à traiter comme un STEMI", ar: "عالية — عُدّه ST+ حقيقياً" },
      actions: [
        { fr: "ECG 18 dérivations (V7–V9) → sus-décalage même discret", ar: "تخطيط 18 استمباراً (V7–V9) → ارتفاع ولو يسيراً" },
        { fr: "Reperfusion comme STEMI si fenêtre < 12 h", ar: "إعادة تروية كاحتشاء حاد إن كانت النافذة <12 س" },
      ],
      critical: true,
    };
  }

  // inférieur
  if (inf) {
    const rca = st3gt2 || depAVL;
    const res: Result = {
      title: { fr: "IDM inférieur (II, III, aVF)", ar: "احتشاء سفلي (II, III, aVF)" },
      artery: rca
        ? { fr: "Artère coronaire droite (RCA) — ST III > II ou ST ↓ aVL", ar: "تاجية يمنى (RCA) — ST III‎ >II أو نقصان aVL" }
        : { fr: "Circonflexe (LCx) probable — ST III ≤ II", ar: "محيطية (LCx) محتملة — ST III‎ ≤II" },
      severity: { fr: "Haute — surveiller : bradycardie/BAV possible (RCA)", ar: "عالية — راقب بطء قلب/حصار (يمين)" },
      actions: [],
      critical: false,
    };
    if (rca) {
      res.actions.push(
        { fr: "ECG 18 dérivations : V3R–V4R (extension ventricule droit ?)", ar: "تخطيط 18: V3R–V4R (امتداد بطين أيمن؟)" },
        { fr: "⚠️ Si VD atteint : PAS de dérivés nitrés — remplissage prudent si hypotension", ar: "⚠️ إن شمل البطين الأيمن: لا نترات — امتلاء حذر عند هبوط الضغط" },
      );
    }
    if (depV1V3) {
      res.actions.push({ fr: "Dépression V1–V3 associée : extension postérieure probable → V7–V9", ar: "نقصان V1–V3 مرافق: امتداد خلفي محتمل → V7–V9" });
      res.critical = true;
    }
    res.actions.push({ fr: "Reperfusion < 12 h : angioplastie (cible) ou thrombolyse + héparine", ar: "إعادة تروية <12 س: قسطرة تاجية (مفضلة) أو تحليل جلطة + هيبارين" });
    return res;
  }

  // antéro-septal / étendu
  if (ant) {
    const etendu = ant && (latH || latL) && (h("V5") || h("V6") || h("I"));
    return {
      title: etendu
        ? { fr: "IDM antéro-latéral étendu", ar: "احتشاء أمامي-جانبي موسّع" }
        : { fr: "IDM antéro-septal (V1–V4)", ar: "احتشاء أمامي حاجزي (V1–V4)" },
      artery: etendu
        ? { fr: "IVA proximale (avant la 1re diagonale) ou tronc commun partiel", ar: "IVA قريبة (قبل الفرع الأول)" }
        : { fr: "IVA moyenne (après les perforantes)", ar: "IVA متوسطة" },
      severity: etendu
        ? { fr: "Maximale — risque de choc cardiogénique et FV", ar: "قصوى — خطر صدمة قلبية ورجفان" }
        : { fr: "Haute", ar: "عالية" },
      actions: [
        { fr: "Reperfusion < 12 h : angioplastie en priorité (porte-à-aiguille < 120 min) sinon thrombolyse < 3 h du début", ar: "إعادة تروية <12 س: قسطرة بالأولوية (باب-إبرة <120 د) وإلا تحليل <3 س من البداية" },
        { fr: "Surveiller : troubles du rythme (ESV/FV), OAP de contraste, collapsus", ar: "راقب: اضطرابات نظم، وذمة رئة، انهيار" },
        { fr: "Morphine selon titration si douleur persistante ; oxygène seulement si SpO2 < 90 %", ar: "مورفين معاير للألم؛ أكسجين فقط إذا SpO2<90%" },
      ],
      critical: etendu,
    };
  }

  // latéral isolé
  if (latH || latL) {
    return {
      title: { fr: "IDM latéral (I, aVL, V5, V6)", ar: "احتشاء جانبي (I, aVL, V5, V6)" },
      artery: { fr: "Circonflexe (LCx) ou 1re diagonale", ar: "محيطية أو قطريّة أولى" },
      severity: { fr: "Modérée à haute selon l'extension", ar: "متوسطة إلى عالية حسب الامتداد" },
      actions: [
        { fr: "ECG de contrôle à 15–20 min si symptôme persistant (ST d'amplitude croissante)", ar: "تخطيط مراقبة كل 15–20 د إذا استمر الألم" },
        { fr: "Reperfusion selon fenêtre horaire", ar: "إعادة تروية حسب النافذة الزمنية" },
      ],
      critical: false,
    };
  }

  // seulement aVR sans contexte
  if (h("aVR")) {
    return {
      title: { fr: "Sus-décalage aVR isolé", ar: "ارتفاع aVR معزول" },
      artery: { fr: "Non localisant — contexte clinique décisif (TV, TVp, EP, péricardite)", ar: "غير محدد — السياق حاسم (خباطة، التهاب تامور، انصمام رئوي)" },
      severity: { fr: "À évaluer avec ECG complet", ar: "قيّم بتخطيط كامل" },
      actions: [
        { fr: "Vérifier axe, QRS, et tous les segments (péricardite diffuse ?)", ar: "تحقق المحور والمستشعرات الكاملة" },
      ],
      critical: false,
    };
  }

  return null;
}

export default function StemiPage() {
  const { lang } = useApp();
  useRegisterRecent("calculateur:stemi");
  const [sel, setSel] = useState<Set<Lead>>(new Set());
  const [depV1V3, setDepV1V3] = useState(false);
  const [rsV2, setRsV2] = useState(false);
  const [st3gt2, setSt3gt2] = useState(true);
  const [depAVL, setDepAVL] = useState(false);

  const res = useMemo(() => infer(sel, depV1V3, rsV2, st3gt2, depAVL), [sel, depV1V3, rsV2, st3gt2, depAVL]);

  const toggle = (l: Lead) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(l) ? n.delete(l) : n.add(l);
      trackEvent("calculator_use", { id: "stemi" });
      return n;
    });

  const inferior = ["II", "III", "aVF"].filter((l) => sel.has(l as Lead)).length >= 2;
  const nothing = sel.size === 0 && !depV1V3 && !rsV2;

  const bool = (v: boolean, set: (b: boolean) => void, fr: string, ar: string) => (
    <button
      onClick={() => set(!v)}
      className={`touch rounded-xl border-2 px-4 py-2.5 text-start text-sm font-bold ${v ? "border-teal-500 bg-teal-600/15 text-teal-700 dark:text-teal-300" : "border-line bg-surface2"}`}
      aria-pressed={v}
    >
      {lang === "ar" ? ar : fr}
    </button>
  );

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <HeartPulse className="h-7 w-7 text-red-500" aria-hidden />
          <T fr="Localisation du ST+" ar="تحديد موضع ST+" />
        </h1>
        <PrintButton />
      </header>

      <p className="text-sm opacity-75">
        {lang === "ar"
          ? "اختر الاستمبارات التي بها ارتفاع ST ثم الواصفات. النتيجة فورية ومحلية (بدون إنترنت)."
          : "Cochez les dérivations avec sus-décalage ST, puis les modificateurs. Résultat immédiat, calculé localement (fonctionne hors-ligne)."}
      </p>

      {/* Étape 1 : dérivations */}
      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 font-bold text-teal-600 dark:text-teal-400">
          <T fr="1. Sus-décalage ST ≥ seuil (V2–V3 : 2,5 mm H<40 ans, 2 mm H≥40, 1,5 mm F ; 1 mm ailleurs)" ar="1. ارتفاع ST ≥ العتبة (V2–V3: 2.5 مم رجال <40، 2 مم رجال ≥40، 1.5 مم نساء؛ 1 مم في الباقي)" />
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LEADS.map((l) => (
            <button
              key={l}
              onClick={() => toggle(l)}
              className={`touch rounded-xl border-2 py-3 text-center font-black tabular-nums ${sel.has(l) ? "border-red-500 bg-red-600/15 text-red-600 dark:text-red-400" : "border-line bg-surface2"}`}
              aria-pressed={sel.has(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Étape 2 : modificateurs */}
      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <p className="mb-1 font-bold text-teal-600 dark:text-teal-400"><T fr="2. Modificateurs" ar="2. واصفات" /></p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {bool(depV1V3, setDepV1V3, "Dépression ST en V1–V3", "نقصان ST في V1–V3")}
          {bool(rsV2, setRsV2, "Onde R/S ≥ 1 en V2 (suspicion postérieur)", "‏R/S‎ ≥1 في V2 (اشتباه خلفي)")}
          {inferior && bool(st3gt2, setSt3gt2, "ST ↑ III > II ? (RCA si oui)", "ست III > II؟ (يمين إذا نعم)")}
          {inferior && bool(depAVL, setDepAVL, "Dépression ST en aVL ? (RCA si oui)", "نقصان في aVL؟ (يمين إذا نعم)")}
        </div>
      </div>

      {/* Résultat */}
      {res ? (
        <div className={`rounded-2xl border-2 p-4 ${res.critical ? "border-red-600 bg-red-600/10" : "border-teal-600 bg-teal-600/10"}`}>
          <p className={`flex items-center gap-2 font-black ${res.critical ? "text-red-600 dark:text-red-400" : "text-teal-700 dark:text-teal-300"}`}>
            {res.critical ? <AlertTriangle className="h-5 w-5" aria-hidden /> : <Info className="h-5 w-5" aria-hidden />}
            {lang === "ar" ? res.title.ar : res.title.fr}
          </p>
          <p className="mt-1 font-bold"><T fr="Artère probable : " ar="الشريان المحتمل: " />{lang === "ar" ? res.artery.ar : res.artery.fr}</p>
          <p className="text-sm font-semibold opacity-90"><T fr="Gravité : " ar="الخطورة: " />{lang === "ar" ? res.severity.ar : res.severity.fr}</p>
          {res.actions.length > 0 && (
            <ul className="ms-5 mt-2 list-disc space-y-1 text-sm leading-relaxed">
              {res.actions.map((a, i) => <li key={i}>{lang === "ar" ? a.ar : a.fr}</li>)}
            </ul>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/protocoles/sca-stemi" className="touch inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500">
              <T fr="Protocole SCA ST+" ar="بروتوكول ST+" />
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link href="/calculateurs/perfusions" className="touch inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-bold">
              <T fr="PSE : héparine, noradrénaline, nitrés…" ar="مضخات: هيبارين، نورأدر، نترات…" />
            </Link>
          </div>
        </div>
      ) : nothing ? (
        <p className="rounded-xl bg-surface2 p-4 text-center text-sm opacity-70">
          <T fr="Aucune dérivation sélectionnée — cochez les dérivations avec ST+ pour obtenir la localisation." ar="لم تُختر استمبارات — اختر ما به ارتفاع ST لتحديد الموضع." />
        </p>
      ) : (
        <p className="rounded-xl bg-surface2 p-4 text-center text-sm opacity-70">
          <T fr="Combinaison atypique : confronter avec la clinique et le protocole SCA." ar="تركيبة غير نمطية: قارن مع السريرة وبروتوكول المتلازمة." />
        </p>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {lang === "ar"
          ? "الانتقاء التشغيلي لا يغني عن تخطيط 12/18 استمباراً وقرار الطبيب. النافذة 12 س (24 س إذا أعراض مستمرة)."
          : "Cet outil ne remplace ni l'ECG 12/18 dérivations ni la décision médicale. Fenêtre de reperfusion : 12 h (24 h si symptômes persistants)."}
      </p>
      <p className="text-xs opacity-60">
        {lang === "ar" ? "المصادر: ESC STEMI 2017/2023، Matetzky، Smith ECG Blog، RE.NAU." : "Sources : ESC STEMI 2017/2023, Matetzky, Smith's ECG Blog, RE.NAU."}
      </p>
    </div>
  );
}

