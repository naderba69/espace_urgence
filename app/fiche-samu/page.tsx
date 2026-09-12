"use client";
// Fiche d'intervention SAMU/SMUR — saisie locale (aucune donnée envoyée),
// copie en texte structuré, impression, sauvegarde automatique sur l'appareil.
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import { Check, Copy, Eraser, Printer } from "lucide-react";

const STORE_KEY = "eutn:fiche-samu";

interface FicheState {
  missionType: string;
  vehicule: string;
  equipe: string;
  hAppel: string;
  hDepart: string;
  hSurLieux: string;
  hDepartLieux: string;
  hHopital: string;
  age: string;
  sexe: string;
  atcd: string;
  motif: string;
  fc: string;
  ta: string;
  fr: string;
  spo2: string;
  gcs: string;
  glycemie: string;
  temp: string;
  gestes: string[];
  traitements: string;
  evolution: string;
  destination: string;
  transmissions: string;
}

const EMPTY: FicheState = {
  missionType: "", vehicule: "", equipe: "",
  hAppel: "", hDepart: "", hSurLieux: "", hDepartLieux: "", hHopital: "",
  age: "", sexe: "", atcd: "", motif: "",
  fc: "", ta: "", fr: "", spo2: "", gcs: "", glycemie: "", temp: "",
  gestes: [],
  traitements: "", evolution: "", destination: "", transmissions: "",
};

const GESTES = [
  { fr: "VVP ×2", ar: "خط وريدي ×2" },
  { fr: "O₂", ar: "أكسجين" },
  { fr: "BAVU / VNI", ar: "بالون تهوية / VNI" },
  { fr: "Intubation", ar: "تنبيب" },
  { fr: "Aspiration", ar: "شفط" },
  { fr: "PLS", ar: "وضعية آمنة جانبية" },
  { fr: "ECG / scope", ar: "تخطيط / مراقبة" },
  { fr: "DSA / choc", ar: "مزيل رجفان / صعق" },
  { fr: "Immobilisation / collier", ar: "تثبيت / طوق" },
  { fr: "PSE", ar: "مضخات PSE" },
  { fr: "Sonde vésicale", ar: "قسطرة بولية" },
  { fr: "Pansement / hémostase", ar: "ضماد / إرقاء" },
];

export default function FicheSamuPage() {
  const { lang, t } = useApp();
  useRegisterRecent("page:fiche-samu");
  const [s, setS] = useState<FicheState>(EMPTY);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setS({ ...EMPTY, ...(JSON.parse(raw) as Partial<FicheState>) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORE_KEY, JSON.stringify(s));
  }, [s]);

  const L = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const set = (k: keyof FicheState) => (v: string) => setS((p) => ({ ...p, [k]: v }));

  const toggleGeste = (g: string) =>
    setS((p) => ({
      ...p,
      gestes: p.gestes.includes(g) ? p.gestes.filter((x) => x !== g) : [...p.gestes, g],
    }));

  const text = useMemo(() => {
    const gestesTxt = s.gestes.length ? s.gestes.join(", ") : "—";
    const line = (label: string, v: string) => `${label}: ${v || "—"}`;
    if (lang === "ar") {
      return [
        "فيشة تدخّل — SAMU / SMUR",
        "════════════════════════",
        line("نوع التدخل", s.missionType),
        line("الآلية", s.vehicule),
        line("الفريق", s.equipe),
        line("الساعات (نداء | انطلاق | وصول | مغادرة | مستشفى)", [s.hAppel, s.hDepart, s.hSurLieux, s.hDepartLieux, s.hHopital].filter(Boolean).join(" | ")),
        line("المريض", [s.age && `${s.age} سنة`, s.sexe].filter(Boolean).join(" — ")),
        line("السوابق", s.atcd),
        line("سبب النداء", s.motif),
        line("الفحص (نبض | ضغط | تنفس | تشبع | غلاسكو | سكر | حرارة)", [s.fc, s.ta, s.fr, s.spo2, s.gcs, s.glycemie, s.temp].filter(Boolean).join(" | ")),
        line("الإجراءات", gestesTxt),
        line("العلاجات", s.traitements),
        line("التطور", s.evolution),
        line("التوجيه", s.destination),
        line("الإبلاغ (تنظيم / مستقبل)", s.transmissions),
        `حرر بتاريخ: ${new Date().toLocaleDateString("fr-TN")} — التوقيع: ________`,
      ].join("\n");
    }
    return [
      "FICHE D'INTERVENTION — SAMU / SMUR",
      "══════════════════════════════════",
      line("Type de mission", s.missionType),
      line("Véhicule", s.vehicule),
      line("Équipe", s.equipe),
      line("Horaires (appel | départ | sur lieux | départ | hôpital)", [s.hAppel, s.hDepart, s.hSurLieux, s.hDepartLieux, s.hHopital].filter(Boolean).join(" | ")),
      line("Patient", [s.age && `${s.age} ans`, s.sexe].filter(Boolean).join(" — ")),
      line("Antécédents", s.atcd),
      line("Motif d'appel", s.motif),
      line("Bilan (FC | TA | FR | SpO₂ | GCS | glycémie | T°)", [s.fc, s.ta, s.fr, s.spo2, s.gcs, s.glycemie, s.temp].filter(Boolean).join(" | ")),
      line("Gestes réalisés", gestesTxt),
      line("Traitements", s.traitements),
      line("Évolution", s.evolution),
      line("Orientation", s.destination),
      line("Transmissions (régulateur / accueil)", s.transmissions),
      `Fait le ${new Date().toLocaleDateString("fr-TN")} — signature : ________`,
    ].join("\n");
  }, [s, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    if (window.confirm(L("Effacer toute la fiche ?", "حذف الفيشة كاملة؟"))) {
      setS(EMPTY);
      try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-teal-600";
  const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide opacity-70";

  const field = (label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; ph?: string }) => (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        className={inputCls}
        type={opts?.type || "text"}
        value={value}
        placeholder={opts?.ph}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );

  const area = (label: string, value: string, onChange: (v: string) => void, rows = 3) => (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea className={inputCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{t("fiche.title")}</h1>
          <p className="mt-1 text-sm opacity-70">{t("fiche.intro")}</p>
        </div>
      </header>

      {/* Confidentialité */}
      <div className="rounded-2xl border border-teal-600/30 bg-teal-600/10 p-4 text-sm font-semibold">
        {t("fiche.privacy")}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button onClick={copy} className="touch flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-teal-500 active:scale-95">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? L("Copié ✓", "تم النسخ ✓") : L("Copier en texte", "نسخ كنص")}
        </button>
        <button onClick={() => window.print()} className="touch flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold hover:bg-teal-600/10 active:scale-95">
          <Printer className="h-4 w-4" aria-hidden />{L("Imprimer / PDF", "طباعة / PDF")}
        </button>
        <button onClick={clear} className="touch flex items-center gap-2 rounded-xl border border-red-600/40 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-600/10 active:scale-95">
          <Eraser className="h-4 w-4" aria-hidden />{L("Effacer", "حذف")}
        </button>
      </div>

      {/* Mission */}
      <section className="card rounded-2xl border border-line bg-surface p-4 print:break-inside-avoid">
        <h2 className="mb-3 font-black text-teal-600">1 · {L("Mission", "التدخل")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className={labelCls}>{L("Type", "النوع")}</span>
            <select className={inputCls} value={s.missionType} onChange={(e) => set("missionType")(e.target.value)}>
              <option value="">—</option>
              <option value={L("Primaire (sur place)", "أولي (على العرين)")}>{L("Primaire (sur place)", "أولي (على العرين)")}</option>
              <option value={L("Secondaire (inter-hospitalier)", "ثانوي (بين مستشفيات)")}>{L("Secondaire (inter-hospitalier)", "ثانوي (بين مستشفيات)")}</option>
              <option value={L("Plan / afflux", "خطة / تدفق")}>{L("Plan / afflux", "خطة / تدفق")}</option>
            </select>
          </label>
          {field(L("Véhicule", "الآلية"), s.vehicule, set("vehicule"), { ph: "SAMU-05 / SMUR…" })}
          {field(L("Équipe", "الفريق"), s.equipe, set("equipe"), { ph: "Med + IDE + AM" })}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          {field(L("Appel", "النداء"), s.hAppel, set("hAppel"), { type: "time" })}
          {field(L("Départ", "الانطلاق"), s.hDepart, set("hDepart"), { type: "time" })}
          {field(L("Sur lieux", "على العرين"), s.hSurLieux, set("hSurLieux"), { type: "time" })}
          {field(L("Départ lieux", "المغادرة"), s.hDepartLieux, set("hDepartLieux"), { type: "time" })}
          {field(L("Hôpital", "المستشفى"), s.hHopital, set("hHopital"), { type: "time" })}
        </div>
      </section>

      {/* Patient + bilan */}
      <section className="card rounded-2xl border border-line bg-surface p-4 print:break-inside-avoid">
        <h2 className="mb-3 font-black text-teal-600">2 · {L("Patient & bilan", "المريض والفحص")}</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {field(L("Âge (ans)", "العمر (سنة)"), s.age, set("age"), { type: "number" })}
          <label className="block">
            <span className={labelCls}>{L("Sexe", "الجنس")}</span>
            <select className={inputCls} value={s.sexe} onChange={(e) => set("sexe")(e.target.value)}>
              <option value="">—</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </label>
          {field(L("Glycémie (g/L)", "السكر (غ/ل)"), s.glycemie, set("glycemie"), { type: "number" })}
          {field(L("T° (°C)", "الحرارة (°)"), s.temp, set("temp"), { type: "number" })}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          {field(L("FC /min", "النبض /د"), s.fc, set("fc"), { type: "number" })}
          {field(L("PAS /mmHg", "الانقباضي"), s.ta, set("ta"), { type: "number" })}
          {field(L("FR /min", "التنفس /د"), s.fr, set("fr"), { type: "number" })}
          {field(L("SpO₂ %", "التشبع %"), s.spo2, set("spo2"), { type: "number" })}
          {field(L("GCS /15", "غلاسكو /15"), s.gcs, set("gcs"), { type: "number" })}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {field(L("Antécédents", "السوابق"), s.atcd, set("atcd"), { ph: L("ATCD, traitements…", "السوابق، العلاجات…") })}
          {field(L("Motif d'appel", "سبب النداء"), s.motif, set("motif"))}
        </div>
      </section>

      {/* Gestes */}
      <section className="card rounded-2xl border border-line bg-surface p-4 print:break-inside-avoid">
        <h2 className="mb-3 font-black text-teal-600">3 · {L("Gestes réalisés", "الإجراءات المنجزة")}</h2>
        <div className="flex flex-wrap gap-2">
          {GESTES.map((g) => {
            const lbl = lang === "ar" ? g.ar : g.fr;
            const on = s.gestes.includes(lbl);
            return (
              <button
                key={g.fr}
                onClick={() => toggleGeste(lbl)}
                aria-pressed={on}
                className={`touch rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${
                  on ? "border-teal-600 bg-teal-600 text-white" : "border-line hover:bg-teal-600/10"
                }`}
              >
                {lbl}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {area(L("Traitements", "العلاجات"), s.traitements, set("traitements"))}
          {area(L("Évolution", "التطور"), s.evolution, set("evolution"))}
        </div>
      </section>

      {/* Orientation */}
      <section className="card rounded-2xl border border-line bg-surface p-4 print:break-inside-avoid">
        <h2 className="mb-3 font-black text-teal-600">4 · {L("Orientation & transmissions", "التوجيه والإبلاغ")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {field(L("Destination", "التوجيه"), s.destination, set("destination"), { ph: L("SAUV / réanimation / bloc…", "قاعة الإنعاش / الرعاية المركزة / المشرحة…") })}
          {area(L("Transmissions", "الإبلاغ"), s.transmissions, set("transmissions"), 2)}
        </div>
      </section>
    </div>
  );
}
