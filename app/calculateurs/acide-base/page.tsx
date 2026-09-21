"use client";
// v10.0-A1 — حموضة/قلوية خطوة بخطوة : اضطراب أولي + تعويض + فجوة أنيونية.
import { useMemo, useState } from "react";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";

type Step = { id: string; ok: boolean; text: React.ReactNode };

function Num({ label, value, onChange, step }: { label: string; value: string; onChange: (v: string) => void; step: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}</span>
      <input
        type="number" inputMode="decimal" step={step} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none"
        dir="ltr"
      />
    </label>
  );
}

export default function AcideBasePage() {
  useRegisterRecent("calculateur:acide-base");
  const { lang } = useApp();
  const [ph, setPh] = useState("7.40");
  const [pco2, setPco2] = useState("40");
  const [hco3, setHco3] = useState("24");
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [chronic, setChronic] = useState(false);

  const r = useMemo(() => {
    const P = parseFloat(ph), C = parseFloat(pco2), H = parseFloat(hco3);
    const N = parseFloat(na), L = parseFloat(cl);
    if (![P, C, H].every(Number.isFinite)) return null;
    const steps: Step[] = [];
    // 1 — pH
    const acid = P < 7.35, alk = P > 7.45;
    steps.push({
      id: "ph", ok: !acid && !alk,
      text: acid
        ? <T fr={`pH ${P.toFixed(2)} : acidémie.`} ar={`pH ${P.toFixed(2)}: حُموضة دم.`} />
        : alk
          ? <T fr={`pH ${P.toFixed(2)} : alcalémie.`} ar={`pH ${P.toFixed(2)}: قلوية دم.`} />
          : <T fr={`pH ${P.toFixed(2)} : normal (mixte possible).`} ar={`pH ${P.toFixed(2)}: طبيعي (خلط ممكن).`} />,
    });
    // 2 — trouble primaire
    const respA = C > 45, respAl = C < 35, metA = H < 22, metAl = H > 26;
    const prim = (acid || alk)
      ? (acid ? [respA && "acidose resp.", metA && "acidose métab."].filter(Boolean) : [respAl && "alcalose resp.", metAl && "alcalose métab."].filter(Boolean))
      : [respA && "acidose resp.", respAl && "alcalose resp.", metA && "acidose métab.", metAl && "alcalose métab."].filter(Boolean);
    steps.push({
      id: "prim", ok: prim.length === 0,
      text: prim.length
        ? <T fr={`Trouble primaire : ${prim.join(" + ")} ${prim.length > 1 ? "(mixte)" : ""}.`} ar={`الاضطراب الأولي: ${prim.join(" + ")} ${prim.length > 1 ? "(مختلط)" : ""}.`} />
        : <T fr="Pas de trouble primaire net." ar="لا اضطراب أولي واضح." />,
    });
    // 3 — compensation
    if (metA) {
      const winter = 1.5 * H + 8;
      const d = C - winter;
      steps.push({
        id: "comp", ok: Math.abs(d) <= 2,
        text: Math.abs(d) <= 2
          ? <T fr={`Winter : PaCO2 attendue ${winter.toFixed(0)} ± 2 ; mesurée ${C} → compensation adaptée.`} ar={`معادلة Winter: PaCO2 المتوقعة ${winter.toFixed(0)} ± ٢؛ المقاسة ${C} → تعويض ملائم.`} />
          : d > 0
            ? <T fr={`Winter : attendue ${winter.toFixed(0)} ; mesurée ${C} → acidose respiratoire surajoutée.`} ar={`Winter: المتوقعة ${winter.toFixed(0)}؛ المقاسة ${C} → حُموضة تنفسية مضافة.`} />
            : <T fr={`Winter : attendue ${winter.toFixed(0)} ; mesurée ${C} → alcalose respiratoire surajoutée.`} ar={`Winter: المتوقعة ${winter.toFixed(0)}؛ المقاسة ${C} → قلوية تنفسية مضافة.`} />,
      });
    } else if (respA || respAl) {
      const exp = respA
        ? (chronic ? 24 + 3.5 * (C - 40) / 10 : 24 + (C - 40) / 10)
        : (chronic ? 24 - 4 * (40 - C) / 10 : 24 - 2 * (40 - C) / 10);
      steps.push({
        id: "comp", ok: Math.abs(H - exp) <= 2,
        text: Math.abs(H - exp) <= 2
          ? <T fr={`HCO3 attendu ${exp.toFixed(0)} (${chronic ? "chronique" : "aigu"}) ; mesuré ${H} → compensation adaptée.`} ar={`HCO3 المتوقع ${exp.toFixed(0)} (${chronic ? "مزمن" : "حاد"})؛ المقاس ${H} → تعويض ملائم.`} />
          : <T fr={`HCO3 attendu ${exp.toFixed(0)} (${chronic ? "chronique" : "aigu"}) ; mesuré ${H} → trouble métabolique surajouté.`} ar={`HCO3 المتوقع ${exp.toFixed(0)} (${chronic ? "مزمن" : "حاد"})؛ المقاس ${H} → اضطراب استقلابي مضاف.`} />,
      });
    }
    // 4 — trou anionique
    if ([N, L].every(Number.isFinite)) {
      const ag = N - (L + H);
      const high = ag > 12;
      steps.push({
        id: "ag", ok: !high,
        text: high
          ? <T fr={`Trou anionique ${ag.toFixed(0)} (> 12) : acidose métabolique à TA élevé — MUDPILES.`} ar={`فجوة أنيونية ${ag.toFixed(0)} (> ١٢): حماض استقلابي بفجوة مرتفعة — تذكّر الأسباب.`} />
          : <T fr={`Trou anionique ${ag.toFixed(0)} : normal.`} ar={`فجوة أنيونية ${ag.toFixed(0)}: طبيعية.`} />,
      });
      if (high && H < 24) {
        const dr = (ag - 12) / (24 - H);
        steps.push({
          id: "delta", ok: dr >= 1 && dr <= 2,
          text: dr < 1
            ? <T fr={`Delta-ratio ${dr.toFixed(1)} < 1 : acidose hyperchlorémique associée.`} ar={`نسبة دلتا ${dr.toFixed(1)} < ١: حماض فرط كلور مرافق.`} />
            : dr > 2
              ? <T fr={`Delta-ratio ${dr.toFixed(1)} > 2 : alcalose métabolique associée.`} ar={`نسبة دلتا ${dr.toFixed(1)} > ٢: قلوية استقلابية مرافقة.`} />
              : <T fr={`Delta-ratio ${dr.toFixed(1)} : TA pur.`} ar={`نسبة دلتا ${dr.toFixed(1)}: فجوة نقية.`} />,
        });
      }
    }
    return { steps, mixed: (acid || alk) && prim.length > 1 };
  }, [ph, pco2, hco3, na, cl, chronic]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "حموضة/قلوية خطوة بخطوة" : "Acido-basique pas à pas"}
        sub={lang === "ar" ? "pH → اضطراب أولي → تعويض → فجوة أنيونية." : "pH → trouble primaire → compensation → trou anionique."}
      />

      <section className="grid grid-cols-3 gap-2">
        <Num label="pH" value={ph} onChange={setPh} step="0.01" />
        <Num label="PaCO2 (mmHg)" value={pco2} onChange={setPco2} step="1" />
        <Num label="HCO3 (mmol/L)" value={hco3} onChange={setHco3} step="1" />
        <Num label={lang === "ar" ? "Na⁺ (optionnel)" : "Na⁺ (optionnel)"} value={na} onChange={setNa} step="1" />
        <Num label="Cl⁻ (optionnel)" value={cl} onChange={setCl} step="1" />
        <button
          onClick={() => setChronic((c) => !c)}
          aria-pressed={chronic}
          className={`touch rounded-xl border p-3 text-xs font-black ${chronic ? "border-transparent text-white" : "border-line bg-surface"}`}
          style={chronic ? { background: "var(--accent)" } : undefined}
        >
          <T fr={chronic ? "Respiratoire : chronique" : "Respiratoire : aigu"} ar={chronic ? "تنفسي: مزمن" : "تنفسي: حاد"} />
        </button>
      </section>

      {r ? (
        <ol className="flex flex-col gap-2">
          {r.steps.map((s, i) => (
            <li key={s.id} className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
              <p className="min-w-0 text-sm font-bold"><span className="tabular-nums opacity-50">{i + 1}.</span> {s.text}</p>
              <Badge tone={s.ok ? "standard" : "urgent"}>{s.ok ? (lang === "ar" ? "سوي" : "Normal") : (lang === "ar" ? "انحراف" : "Anomal")}</Badge>
            </li>
          ))}
          {r.mixed && (
            <li className="rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
              <T fr="Trouble mixte probable — traiter la cause, pas le chiffre." ar="اضطراب مختلط محتمل — عالج السبب لا الرقم." />
            </li>
          )}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez pH, PaCO2 et HCO3." ar="أدخل pH وPaCO2 وHCO3." />
        </p>
      )}
    </div>
  );
}
