"use client";
// v11.2-B — أنماط وظائف الكبد : معامل R ونمط التسرب مقابل الانسداد.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Activity } from "lucide-react";

function Num({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}{unit ? ` (${unit})` : ""}</span>
      <input type="number" inputMode="decimal" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
    </label>
  );
}

const ULN_ALT = 40, ULN_PAL = 120;

export default function BilanHepatiquePage() {
  useRegisterRecent("calculateur:bilan-hepatique");
  const { lang } = useApp();
  const [asat, setAsat] = useState("");
  const [alat, setAlat] = useState("");
  const [pal, setPal] = useState("");
  const [ggt, setGgt] = useState("");
  const [bili, setBili] = useState("");
  const [inr, setInr] = useState("");

  const r = useMemo(() => {
    const A = parseFloat(asat), L = parseFloat(alat), P = parseFloat(pal), G = parseFloat(ggt), B = parseFloat(bili), I = parseFloat(inr);
    const hasCyt = Number.isFinite(A) || Number.isFinite(L);
    const hasCho = Number.isFinite(P) || Number.isFinite(G);
    const R = Number.isFinite(L) && Number.isFinite(P) && P > 0 ? (L / ULN_ALT) / (P / ULN_PAL) : null;
    const pattern = R === null ? (hasCyt && !hasCho ? "cyto" : hasCho && !hasCyt ? "cho" : null)
      : R >= 5 ? "cyto" : R <= 2 ? "cho" : "mixte";
    const high = Math.max(Number.isFinite(L) ? L : 0, Number.isFinite(A) ? A : 0);
    const necrosis = high >= 1000;
    const failure = (Number.isFinite(I) && I >= 1.5) || (Number.isFinite(B) && B >= 100);
    const sev = necrosis || failure ? 3 : pattern ? (high > 3 * ULN_ALT || (Number.isFinite(P) && P > 3 * ULN_PAL) ? 2 : 1) : 0;
    return { R, pattern, necrosis, failure, high, sev, any: hasCyt || hasCho || Number.isFinite(B) };
  }, [asat, alat, pal, ggt, bili, inr]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={lang === "ar" ? "أنماط وظائف الكبد" : "Patterns du bilan hépatique"}
        sub={lang === "ar" ? "معامل R: تسرّب خلوي مقابل انسداد، وتنبيهات الفشل الحاد." : "Facteur R : cytolyse vs cholestase, et signaux d'insuffisance aiguë."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Num label="ASAT" unit="UI/L" value={asat} onChange={setAsat} />
        <Num label="ALAT" unit="UI/L" value={alat} onChange={setAlat} />
        <Num label={lang === "ar" ? "الفوسفاتاز القلوية" : "PAL"} unit="UI/L" value={pal} onChange={setPal} />
        <Num label="GGT" unit="UI/L" value={ggt} onChange={setGgt} />
        <Num label={lang === "ar" ? "البيليروبين الكلي" : "Bilirubine totale"} unit="µmol/L" value={bili} onChange={setBili} />
        <Num label="INR" value={inr} onChange={setInr} />
      </section>

      {r.any ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.sev === 3 ? "sev-critical" : r.sev === 2 ? "sev-urgent" : r.sev === 1 ? "sev-standard" : ""}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-base font-black">
              {r.pattern === "cyto" ? <T fr="Cytolyse (hépatocellulaire)" ar="تسرّب خلوي (كبدي المنشأ)" />
                : r.pattern === "cho" ? <T fr="Cholestase" ar="انسداد صفراوي" />
                  : r.pattern === "mixte" ? <T fr="Atteinte mixte" ar="إصابة مختلطة" />
                    : <T fr="Données partielles" ar="معطيات جزئية" />}
            </p>
            <Badge tone={r.sev === 3 ? "critical" : r.sev === 2 ? "urgent" : "standard"}>
              {r.R !== null ? <span dir="ltr">R {r.R.toFixed(1)}</span> : <T fr="—" ar="—" />}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li>
              {r.pattern === "cyto"
                ? <T fr="R ≥ 5: lésion hépatocytaire — viral (hépatites), toxique (paracétamol), ischémique." ar="R ≥ ٥: إصابة خلايا الكبد — فيروسي، سُمّي (باراسيتامول)، إقفاري." />
                : r.pattern === "cho"
                  ? <T fr="R ≤ 2: cholestase — lithiase, médicaments, tumeur, obstacle." ar="R ≤ ٢: انسداد — حصاة، أدوية، ورم، عائق." />
                  : r.pattern === "mixte" ? <T fr="R 2-5: profil mixte à documenter par échographie." ar="R ٢-٥: نمط مختلط يوثّق بالإيكو." />
                    : <T fr="Complétez ALAT et PAL pour le facteur R." ar="أكمل ALAT و PAL لحساب R." />}
            </li>
            {r.necrosis && (
              <li className="font-black" style={{ color: "var(--sev-critical)" }}>
                <T fr="Transaminases ≥ 1000: nécrose — priorité paracétamol (NAC), hépatite virale, ischémie, auto-immune." ar="ناقلات ≥ ١٠٠٠: نخر — أولوية باراسيتامول (NAC)، التهاب كبدي، إقفار، مناعي." />
              </li>
            )}
            {r.failure && (
              <li className="font-black" style={{ color: "var(--sev-critical)" }}>
                <T fr="INR ≥ 1,5 ou bilirubine ≥ 100: insuffisance hépatique à risque — avis spécialisé, éviter sédatifs, surveiller glycémie/encéphalopathie." ar="INR ≥ ١٫٥ أو بيليروبين ≥ ١٠٠: قصور كبدي مع خطر — استشارة، تجنّب المهدئات، راقب السكر والاعتلال الدماغي." />
              </li>
            )}
            <li className="opacity-70">
              <T fr="GGT élevée isolement: alcool, médicaments inducteurs, cholestase débutante." ar="ارتفاع GGT وحده: كحول، أدوية محفّزة، انسداد بدئي." />
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/nac" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Paracétamol → NAC" ar="باراسيتامول → NAC" /></Link>
            <Link href="/calculateurs/acide-base" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Équilibre acide-base" ar="التوازن الحمضي-القاعدي" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez au moins ASAT/ALAT ou PAL/GGT." ar="أدخل ASAT/ALAT أو PAL/GGT." />
        </p>
      )}
    </div>
  );
}
