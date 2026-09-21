"use client";
// v11.1-B — قياس التنفس وذروة الجريان : PEF متوقّع + مناطق + أنماط VEMS/CVF.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Wind } from "lucide-react";

function Num({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}{unit ? ` (${unit})` : ""}</span>
      <input type="number" inputMode="decimal" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
    </label>
  );
}

export default function SpirometriePage() {
  useRegisterRecent("calculateur:spirometrie");
  const { lang } = useApp();
  const [h, setH] = useState("");
  const [age, setAge] = useState("");
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [pef, setPef] = useState("");
  const [fev1, setFev1] = useState("");
  const [fvc, setFvc] = useState("");
  const [fev1p, setFev1p] = useState("");

  const height = parseFloat(h), a = parseFloat(age), p = parseFloat(pef);
  const okPef = Number.isFinite(height) && height > 100 && Number.isFinite(a) && a > 5 && Number.isFinite(p) && p > 0;
  const pred = useMemo(() => (Number.isFinite(height) && Number.isFinite(a) && height > 100 && a > 5
    ? Math.round(sexe === "m" ? 5.48 * height - 1.07 * a - 292 : 4.35 * height - 0.27 * a - 264)
    : 0), [height, a, sexe]);
  const pctPred = okPef && pred > 0 ? Math.round((p / pred) * 100) : null;
  const zone = pctPred === null ? null : pctPred >= 80 ? "green" : pctPred >= 50 ? "yellow" : "red";

  const F1 = parseFloat(fev1), FVC = parseFloat(fvc), F1P = parseFloat(fev1p);
  const ratio = F1 > 0 && FVC > 0 ? F1 / FVC : null;
  const gold = F1P > 0 ? (F1P >= 80 ? 1 : F1P >= 50 ? 2 : F1P >= 30 ? 3 : 4) : null;
  const pattern = ratio === null ? null : ratio < 0.7 ? "obstructif" : FVC > 0 && F1 > 0 ? "restrictif possible" : null;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={lang === "ar" ? "قياس التنفس وذروة الجريان" : "Spirométrie et débit de pointe"}
        sub={lang === "ar" ? "PEF متوقّع ومناطقه + نمط VEMS/CVF ودرجات GOLD." : "PEF prédit et zones + VEMS/CVF et grades GOLD."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Num label={lang === "ar" ? "الطول" : "Taille"} unit="cm" value={h} onChange={setH} />
        <Num label={lang === "ar" ? "العمر" : "Âge"} unit={lang === "ar" ? "سنة" : "ans"} value={age} onChange={setAge} />
        <div className="col-span-2 flex gap-2">
          <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={sexe === "m" ? { background: "var(--accent)" } : undefined}>
            <T fr="Homme" ar="رجل" />
          </button>
          <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={sexe === "f" ? { background: "var(--accent)" } : undefined}>
            <T fr="Femme" ar="امرأة" />
          </button>
        </div>
        <div className="col-span-2">
          <Num label={lang === "ar" ? "ذروة الجريان المقيسة" : "PEF mesuré"} unit="L/min" value={pef} onChange={setPef} />
        </div>
      </section>

      {pred > 0 && (
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm font-black opacity-70"><T fr="PEF prédit (Cherniack)" ar="PEF المتوقّع (تشيرنياك)" /></p>
          <p className="text-2xl font-black tabular-nums" dir="ltr">{pred} <span className="text-sm opacity-60">L/min</span></p>
          {pctPred !== null && (
            <div className="mt-2">
              <div className={`flex items-center justify-between rounded-xl p-3 text-sm font-black ${zone === "green" ? "sev-standard" : zone === "yellow" ? "sev-urgent" : "sev-critical"}`}>
                <span className="tabular-nums" dir="ltr">{pctPred}%</span>
                <span>
                  {zone === "green" ? <T fr="Zone verte: contrôle stable" ar="المنطقة الخضراء: تحكم مستقر" />
                    : zone === "yellow" ? <T fr="Zone jaune: augmenter le traitement, plan d'action" ar="المنطقة الصفراء: زد العلاج وطبّق خطة العمل" />
                      : <T fr="Zone rouge: détresse — corticoïdes + avis, appeler secours si épuisement" ar="المنطقة الحمراء: ضيق — كورتيزون + استشارة، اطلب المساعدة عند الإنهاك" />}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="grid grid-cols-3 gap-2">
        <Num label="VEMS" unit="L" value={fev1} onChange={setFev1} />
        <Num label="CVF" unit="L" value={fvc} onChange={setFvc} />
        <Num label={lang === "ar" ? "VEMS ٪ متوقّع" : "VEMS % préd"} value={fev1p} onChange={setFev1p} />
      </section>

      {(ratio !== null || gold !== null) && (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${pattern === "obstructif" && gold && gold >= 3 ? "sev-critical" : pattern === "obstructif" ? "sev-urgent" : "sev-standard"}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-black">
              {ratio !== null ? <span dir="ltr">VEMS/CVF {ratio.toFixed(2)}</span> : <T fr="Grade GOLD" ar="درجة GOLD" />}
            </p>
            <Badge tone={pattern === "obstructif" ? "urgent" : "standard"}>
              {pattern === "obstructif" ? <T fr="Obstructif" ar="انسدادي" /> : <T fr="Non obstructif" ar="غير انسدادي" />}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-bold opacity-80">
            {ratio !== null && ratio < 0.7
              ? <T fr="Rapport < 0,70 après bronchodilatateur = trouble ventilatoire obstructif (asthme/BPCO)." ar="النسبة < ٠٫٧٠ بعد الموسّع = اضطراب انسدادي (ربو/انسداد رئوي مزمن)." />
              : ratio !== null
                ? <T fr="Rapport conservé: si CVF basse → évoquer un profil restrictif (pléthysmographie)." ar="النسبة محفوظة: إن كانت CVF منخفضة → فكّر بنمط تقييدي (قياس حجمي)." />
                : null}
          </p>
          {gold !== null && (
            <p className="mt-2 text-sm font-black">
              <span style={{ color: gold >= 3 ? "var(--sev-critical)" : "var(--accent)" }}>
                GOLD {gold} · {gold === 1 ? <T fr="VEMS ≥ 80 %" ar="VEMS ≥ ٨٠٪" /> : gold === 2 ? <T fr="VEMS 50-79 %" ar="VEMS ٥٠-٧٩٪" /> : gold === 3 ? <T fr="VEMS 30-49 %" ar="VEMS ٣٠-٤٩٪" /> : <T fr="VEMS < 30 %" ar="VEMS < ٣٠٪" />}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/asthme" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Assistant asthme" ar="مساعد الربو" /></Link>
        <Link href="/calculateurs/curb65" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="CURB-65" ar="CURB-65" /></Link>
        <Link href="/calculateurs/gazometrie" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Gaz du sang" ar="غازات الدم" /></Link>
      </div>
    </div>
  );
}
