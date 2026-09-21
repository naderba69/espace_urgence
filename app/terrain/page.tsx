"use client";
// v5.1 — وضع الميدان: جرعات الدواء الأول لكل حالة حيوية محسوبة فوراً بوزن افتراضي قابل للضغظ ±، بلا كتابة.
import { useState } from "react";
import { useWakeLock } from "@/lib/hooks";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import Badge from "@/components/ui/Badge";

interface Sit { id: string; href: string; fr: string; ar: string; actFr: string; actAr: string; dose: (w: number, ped: boolean) => string; prep?: (w: number, ped: boolean) => string | null; sev: 1 | 2 | 3 }

const SITS: Sit[] = [
  {
    id: "rcp-a", sev: 1, href: "/calculateurs/rcp-equipe", fr: "Arrêt cardiaque adulte", ar: "توقف قلب الكبير",
    actFr: "MCE + défibrillation dès disponibilité", actAr: "تدليك + صدمة فور الجهوزية",
    dose: () => "Adrénaline 1 mg = 10 mL (1:10 000) q3-5 min · choc 150-200 J",
    prep: () => "1 mL ampoule (1:1000) + 9 mL NaCl = 10 mL → injecter 10 mL",
  },
  {
    id: "rcp-p", sev: 1, href: "/calculateurs/rcp-peds", fr: "Arrêt cardiaque enfant", ar: "توقف قلب الطفل",
    actFr: "5 insufflations puis 15:2", actAr: "5 نفخات ثم 15:2",
    dose: (w) => `Adrénaline ${(w * 0.01).toFixed(2)} mg = ${(w * 0.1).toFixed(1)} mL (1:10 000) · choc ${Math.round(w * 2)} J`,
    prep: (w) => `1 mL ampoule + 9 mL NaCl (=1:10 000) → injecter ${(w * 0.1).toFixed(1)} mL`,
  },
  {
    id: "neo", sev: 1, href: "/calculateurs/neonat-ran", fr: "Nouveau-né (minute d'or)", ar: "وليد (الدقيقة الذهبية)",
    actFr: "VPP efficace dans les 60 s", actAr: "تهوية فعالة خلال 60 ث",
    dose: (w) => `Adrénaline 0,01-0,03 mg/kg = ${(w * 0.1).toFixed(1)}-${(w * 0.3).toFixed(1)} mL/kg (1:10 000)`,
    prep: (w) => `1 mL ampoule + 9 mL NaCl → injecter ${(w * 0.1).toFixed(1)}-${(w * 0.3).toFixed(1)} mL/kg`,
  },
  {
    id: "ana", sev: 1, href: "/calculateurs/anaphylaxie", fr: "Anaphylaxie", ar: "صدمة الحساسية",
    actFr: "Adrénaline IM cuisse sans retard", actAr: "أدرنالين عضلياً بالفخذ دون تأخير",
    dose: (w, ped) => `IM 1:1000 → ${Math.min(ped && w < 30 ? 0.3 : 0.5, +(w * 0.01).toFixed(2)).toFixed(2)} mL`,
  },
  {
    id: "mal", sev: 1, href: "/calculateurs/etat-mal", fr: "Crise convulsive > 5 min", ar: "نوبة صرعية > 5 د",
    actFr: "Protéger + O2, ne rien mettre en bouche", actAr: "حماية + أكسجين، لا شيء بالفم",
    dose: (w) => `Midazolam IM ${Math.min(10, +(w * 0.2).toFixed(1)).toFixed(1)} mg`,
    prep: (w, ped) => { const v = Math.min(10, +(w * 0.2).toFixed(1)) / 5; return ped && v < 0.5 ? `compléter à 1 mL NaCl → injecter 1 mL` : `ampoule 5 mg/mL → injecter ${v.toFixed(1)} mL`; },
  },
  {
    id: "asth", sev: 2, href: "/calculateurs/asthme", fr: "Asthme aigu", ar: "ربو حاد",
    actFr: "Position assise + nébulisation", actAr: "جلوس + رذّة",
    dose: (w) => `Salbutamol ${w < 20 ? 2.5 : 5} mg néb. q20 min`,
  },
  {
    id: "hypo", sev: 1, href: "/calculateurs/hypoglycemie", fr: "Hypoglycémie", ar: "نقص السكر",
    actFr: "Conscient → oral ; sinon IV", actAr: "واعٍ → فموي؛ وإلا وريدي",
    dose: (w, ped) => (ped ? `D10 IV ${Math.round(w * 5)} mL (5 mL/kg)` : "D50 50 mL IV ou glucagon 1 mg IM"),
  },
  {
    id: "opio", sev: 1, href: "/calculateurs/opioides", fr: "Surdosage opioïde", ar: "فرط الأفيون",
    actFr: "Ventiler d'abord", actAr: "التهوية أولاً",
    dose: () => "Naloxone 0,4 mg IM/IV ou 4 mg IN q2-3 min",
  },
  {
    id: "ecl", sev: 1, href: "/calculateurs/eclampsie", fr: "Éclampsie", ar: "ارتعاج",
    actFr: "Protéger + O2, pas de diazépam 1ʳ ligne", actAr: "حماية + أكسجين، لا ديازيبام أولاً",
    dose: () => "MgSO4 4 g IV (8 mL de 50 %) sur 20 min",
  },
  {
    id: "hpp", sev: 1, href: "/calculateurs/hpp", fr: "Hémorragie post-partum", ar: "نزف ما بعد الولادة",
    actFr: "Massage utérin immédiat", actAr: "تمسيد رحمي فوراً",
    dose: () => "Ocytocine 10 UI + ATX 1 g IV",
  },
  {
    id: "hyperK", sev: 1, href: "/calculateurs/hyperkalemie", fr: "Hyperkaliémie (ECG anormal)", ar: "فرط بوتاسيوم (تخطيط مضطرب)",
    actFr: "Calcium avant tout", actAr: "كالسيوم قبل كل شيء",
    dose: (w, ped) => (ped ? `Gluconate 10 % ${Math.min(10, w)} mL IV` : "Gluconate 10 % 10 mL IV 5-10 min"),
  },
  {
    id: "chal", sev: 1, href: "/calculateurs/coup-chaleur", fr: "Coup de chaleur", ar: "ضربة الحر",
    actFr: "Refroidir immédiatement (eau)", actAr: "برّد فوراً (ماء)",
    dose: () => "Stop refroidissement actif à 39 °C",
  },
  {
    id: "hdo", sev: 2, href: "/calculateurs/hemo-digestive", fr: "Hémorragie digestive", ar: "نزف هضمي",
    actFr: "2 voies veineuses + groupage", actAr: "طريقان وريديان + زمرة",
    dose: () => "IPP : ésoméprazole 80 mg IV bolus",
  },
  {
    id: "sync", sev: 3, href: "/calculateurs/syncope", fr: "Syncope", ar: "إغماء",
    actFr: "ECG + orthostatiques", actAr: "تخطيط + قياسات انتصابية",
    dose: () => "PAS debout − décubitus ≥ 20 = positif",
  },
  {
    id: "tet", sev: 2, href: "/calculateurs/tetanos", fr: "Plaie / tétanos", ar: "جرح / كزاز",
    actFr: "Nettoyage + parage", actAr: "تنظيف + تنضير",
    dose: () => "Rappel Td/Tdap ± Ig 250 UI IM (si incomplète + risque)",
  },
  {
    id: "rau", sev: 3, href: "/calculateurs/rau", fr: "Rétention urinaire", ar: "احتباس بولي",
    actFr: "Sondage + mesurer le volume", actAr: "قَثطرة + قياس الحجم",
    dose: () => "≥ 1 L : surveiller diurèse/créat ; pas de clampage",
  },
  {
    id: "agit", sev: 2, href: "/calculateurs/agitation", fr: "Agitation menaçante", ar: "هياج مهدِّد",
    actFr: "Dé-escalade verbale d'abord", actAr: "تهدئة لفظية أولاً",
    dose: () => "Halopéridol 5 mg IM (± midazolam 5 mg IM)",
  },
  {
    id: "sev", sev: 2, href: "/calculateurs/sevrage-alcool", fr: "Sevrage alcool", ar: "انسحاب كحول",
    actFr: "Thiamine avant glucosé", actAr: "ثيامين قبل الغلوكوز",
    dose: () => "Diazépam 10 mg PO symptom-triggered",
  },
  {
    id: "oap", sev: 1, href: "/protocoles/oap", fr: "OAP / détresse pulm.", ar: "وذمة رئة حادة",
    actFr: "Assis + CPAP si disponible", actAr: "جلوس + CPAP إن توفر",
    dose: () => "Furosémide 40 mg IV (×2 si déjà traité) ± nitrés si PAS > 100",
  },
  {
    id: "sep", sev: 1, href: "/calculateurs/sepsis-commandement", fr: "Sepsis / choc septique", ar: "إنتان / صدمة إنتانية",
    actFr: "Cultures puis antibiotiques < 1 h", actAr: "مزارع ثم مضادات خلال ساعة",
    dose: (w) => `Ceftriaxone 2 g IV + cristalloïdes ${w * 30} mL (30 mL/kg)`,
  },
  {
    id: "pno", sev: 1, href: "/protocoles/pneumothorax-suffocant", fr: "PNO suffocant", ar: "استرواح خانق",
    actFr: "Exsufflation immédiate (clinique)", actAr: "سحب هواء فوراً (سريري)",
    dose: () => "Aiguille 14-16 G 4ᵉ EIC, ligne axillaire ant. puis tube",
  },
  {
    id: "brul", sev: 1, href: "/calculateurs/brulures", fr: "Brûlure grave", ar: "حرق شديد",
    actFr: "Refroidir 20 min (eau) puis couvrir", actAr: "تبريد 20 د (ماء) ثم تغطية",
    dose: (w) => `Parkland : ${4 * w} mL de Ringer par %SCQ (moitié en 8 h)`,
  },
];

const SEV_TAG: Record<1 | 2 | 3, { fr: string; ar: string; cls: string }> = {
  1: { fr: "Vital", ar: "حيوي", cls: "border-red-600 bg-red-600/15 text-red-500" },
  2: { fr: "Urgent", ar: "عاجل", cls: "border-amber-500 bg-amber-500/10 text-amber-500" },
  3: { fr: "Important", ar: "مهم", cls: "border-line bg-surface2 opacity-80" },
};

export default function TerrainPage() {
  useRegisterRecent("terrain");
  const { lang } = useApp();
  const [ped, setPed] = useState(false);
  const [w, setW] = useState(70);
  const [wake, setWake] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  useWakeLock(wake);

  const step = ped ? 1 : 5;
  const change = (d: number) => setW((x) => Math.max(ped ? 2 : 10, Math.min(ped ? 60 : 150, x + d)));

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-red-500"><T fr="Mode terrain" ar="وضع الميدان" /></h1>
        <p className="text-xs font-bold opacity-60"><T fr="Doses instantanées — vérifiez avant d'administrer." ar="جرعات فورية — تحقق قبل الإعطاء." /></p>
      </header>

      <div className="card flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex gap-2">
          <button onClick={() => { setPed(false); setW(70); }} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-2 text-sm font-black ${!ped ? "border-red-600 bg-red-600 text-white" : "border-line"}`}>
            <T fr="Adulte" ar="كبير" />
          </button>
          <button onClick={() => { setPed(true); setW(15); }} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-2 text-sm font-black ${ped ? "border-red-600 bg-red-600 text-white" : "border-line"}`}>
            <T fr="Enfant" ar="طفل" />
          </button>
        </div>
        <div className="flex items-center gap-2" dir="ltr">
          <button onClick={() => change(-step)} aria-label="moins"
            className="touch h-12 w-12 rounded-xl border border-line bg-surface2 text-2xl font-black">−</button>
          <p className="w-20 text-center text-3xl font-black tabular-nums text-blue-500">{w}<span className="text-sm opacity-60"> kg</span></p>
          <button onClick={() => change(step)} aria-label="plus"
            className="touch h-12 w-12 rounded-xl border border-line bg-surface2 text-2xl font-black">+</button>
        </div>
        <button onClick={() => setWake((x) => !x)} aria-pressed={wake}
          className={`touch rounded-full border px-4 py-2 text-sm font-black ${wake ? "border-blue-500 bg-blue-600 text-white" : "border-line"}`}>
          <T fr={wake ? "Écran actif ✓" : "Écran actif"} ar={wake ? "شاشة نشطة ✓" : "شاشة نشطة"} />
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {[...SITS].sort((a, b) => a.sev - b.sev).map((s) => (
          <li key={s.id} className={`card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 ${s.sev === 1 ? "sev-strip sev-critical" : s.sev === 2 ? "sev-strip sev-urgent" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-lg font-black">
                <Badge tone={s.sev === 1 ? "critical" : s.sev === 2 ? "urgent" : "neutral"}>
                  {lang === "ar" ? SEV_TAG[s.sev].ar : SEV_TAG[s.sev].fr}
                </Badge>
                {lang === "ar" ? s.ar : s.fr}
              </p>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined") void navigator.clipboard?.writeText(`${lang === "ar" ? s.ar : s.fr} — ${s.actFr} — ${s.dose(w, ped)}`);
                    setCopiedId(s.id); setTimeout(() => setCopiedId(null), 1200);
                  }}
                  aria-label={lang === "ar" ? "نسخ" : "copier"}
                  className="touch rounded-lg border border-line px-3 py-1.5 text-xs font-black">
                  {copiedId === s.id ? "✓" : "⧉"}
                </button>
                <Link href={s.href} className="touch rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-black text-white active:scale-[.98]">
                  <T fr="Assistant" ar="المساعد" />
                </Link>
              </div>
            </div>
            <p className="text-sm font-bold text-amber-500">{lang === "ar" ? s.actAr : s.actFr}</p>
            <p className="rounded-xl bg-surface2 p-2 text-sm font-black text-blue-500" dir="ltr">{s.dose(w, ped)}</p>
            {s.prep?.(w, ped) && (
              <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-2 text-xs font-black text-amber-500" dir="ltr">
                {lang === "ar" ? "تحضير: " : "Prépa : "}{s.prep(w, ped)}
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className="text-xs opacity-60"><T fr="Pensé gants/terrain: gros boutons, zéro saisie, hors-ligne." ar="مصمم للقفازات/الميدان: أزرار كبيرة، بلا كتابة، دون اتصال." /></p>
    </div>
  );
}
