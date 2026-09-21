"use client";
// v11.2-B — قارئ تعداد الدم وصورته : أنماط الأنيميا والكريات والصفيحات.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Droplets } from "lucide-react";

function Num({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className="text-xs font-black opacity-70">{label}{unit ? ` (${unit})` : ""}</span>
      <input type="number" inputMode="decimal" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
    </label>
  );
}

export default function HemogrammePage() {
  useRegisterRecent("calculateur:hemogramme");
  const { lang } = useApp();
  const [sexe, setSexe] = useState<"m" | "f">("m");
  const [hb, setHb] = useState("");
  const [mcv, setMcv] = useState("");
  const [wbc, setWbc] = useState("");
  const [pnn, setPnn] = useState("");
  const [plt, setPlt] = useState("");

  const r = useMemo(() => {
    const H = parseFloat(hb), V = parseFloat(mcv), W = parseFloat(wbc), P = parseFloat(pnn), PLT = parseFloat(plt);
    const sevH = sexe === "m" ? 13 : 12;
    const anemia = Number.isFinite(H) && H < sevH ? (H < 8 ? 3 : H < 10 ? 2 : 1) : 0;
    const mcvBand = !Number.isFinite(V) ? null : V < 80 ? "micro" : V <= 100 ? "normo" : "macro";
    const wbcBand = !Number.isFinite(W) ? null : W > 10 ? "haut" : W < 4 ? "bas" : "normal";
    const neutro = Number.isFinite(W) && Number.isFinite(P) ? (W * P) / 100 : null;
    const agranulo = neutro !== null && neutro < 0.5;
    const pltBand = !Number.isFinite(PLT) ? null : PLT < 20 ? 3 : PLT < 50 ? 2 : PLT < 150 ? 1 : PLT > 450 ? 1 : 0;
    const maxSev = Math.max(anemia, agranulo ? 3 : 0, pltBand ?? 0);
    return { H, V, W, P, PLT, anemia, mcvBand, wbcBand, neutro, agranulo, pltBand, maxSev, any: Number.isFinite(H) || Number.isFinite(W) || Number.isFinite(PLT) || Number.isFinite(V) };
  }, [hb, mcv, wbc, pnn, plt, sexe]);

  const MICRO = { fr: "Microcytaire (< 80 fL): carence martiale, thalassémie, inflammation chronique.", ar: "صغيرة (< ٨٠): عوز الحديد، ثلاسيميا، التهاب مزمن." };
  const NORMO = { fr: "Normocytaire (80-100): hémolyse, IRC, inflammation, saignement aigu.", ar: "طبيعية (٨٠-١٠٠): انحلال، قصور كلوي مزمن، التهاب، نزف حاد." };
  const MACRO = { fr: "Macrocytaire (> 100): B12/folates, alcool, hypothyroïdie, myélodysplasie.", ar: "كبيرة (> ١٠٠): B12/الفولات، كحول، قصور درقي، خلل نقي." };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={lang === "ar" ? "قارئ تعداد الدم" : "Lecture de l'hémogramme"}
        sub={lang === "ar" ? "أنماط الأنيميا والكريات والصفيحات في قراءة واحدة." : "Anémie, leucocytes et plaquettes en une lecture."}
      />

      <section className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex gap-2">
          <button onClick={() => setSexe("m")} aria-pressed={sexe === "m"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "m" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={sexe === "m" ? { background: "var(--accent)" } : undefined}><T fr="Homme" ar="رجل" /></button>
          <button onClick={() => setSexe("f")} aria-pressed={sexe === "f"}
            className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${sexe === "f" ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={sexe === "f" ? { background: "var(--accent)" } : undefined}><T fr="Femme" ar="امرأة" /></button>
        </div>
        <Num label="Hb" unit="g/dL" value={hb} onChange={setHb} />
        <Num label="VGM" unit="fL" value={mcv} onChange={setMcv} />
        <Num label={lang === "ar" ? "الكريات البيضاء" : "GB"} unit="×10⁹/L" value={wbc} onChange={setWbc} />
        <Num label="PNN" unit="%" value={pnn} onChange={setPnn} />
        <div className="col-span-2"><Num label={lang === "ar" ? "الصفيحات" : "Plaquettes"} unit="×10⁹/L" value={plt} onChange={setPlt} /></div>
      </section>

      {r.any ? (
        <div className="flex flex-col gap-3">
          <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.maxSev === 3 ? "sev-critical" : r.maxSev === 2 ? "sev-urgent" : r.maxSev === 1 ? "sev-standard" : ""}`}>
            <p className="mb-2 text-base font-black"><T fr="Synthèse" ar="الخلاصة" /></p>
            <ul className="flex flex-col gap-1 text-sm font-bold">
              {Number.isFinite(r.H) && (
                <li>
                  {r.anemia > 0
                    ? <span style={{ color: r.anemia >= 2 ? "var(--sev-critical)" : "var(--sev-urgent)" }}>
                        {lang === "ar" ? `أنيميا (Hb ${r.H} < ${sexe === "m" ? 13 : 12})` : `Anémie (Hb ${r.H} < ${sexe === "m" ? 13 : 12})`}
                      </span>
                    : <T fr="Hémoglobine normale." ar="هيموغلوبين طبيعي." />}
                  {r.mcvBand && r.anemia > 0 && <> — {lang === "ar" ? (r.mcvBand === "micro" ? MICRO.ar : r.mcvBand === "normo" ? NORMO.ar : MACRO.ar) : (r.mcvBand === "micro" ? MICRO.fr : r.mcvBand === "normo" ? NORMO.fr : MACRO.fr)}</>}
                </li>
              )}
              {r.wbcBand && (
                <li>
                  {r.wbcBand === "haut" && Number.isFinite(r.P) && r.P >= 75
                    ? <T fr="Leucocytose à PNN: profil bactérien." ar="كريات بيضاء مع كثرة العدلات: سياق بكتيري." />
                    : r.wbcBand === "haut" ? <T fr="Leucocytose: virale, stress, corticoïdes possibles." ar="كثرة كريات: فيروسي، إجهاد، كورتيزون." />
                      : r.wbcBand === "bas" ? <T fr="Leucopénie: virale ou médicamentuse." ar="نقص كريات: فيروسي أو دوائي." />
                        : <T fr="Globules blancs normaux." ar="كريات بيضاء طبيعية." />}
                </li>
              )}
              {r.agranulo && (
                <li className="font-black" style={{ color: "var(--sev-critical)" }}>
                  <T fr="Agranulocytose (PNN < 0,5): urgence — fièvre = antibiotique immédiat + isolement." ar="انعدام العدلات (< ٠٫٥): طارئة — حمى = مضاد حيوي فوري + عزل." />
                </li>
              )}
              {r.pltBand !== null && (
                <li>
                  {r.pltBand === 3 ? <span style={{ color: "var(--sev-critical)" }}><T fr="Plaquettes < 20: risque hémorragique majeur, transfusion à discuter." ar="صفيحات < ٢٠: خطر نزف كبير، مناقشة النقل." /></span>
                    : r.pltBand === 2 ? <span style={{ color: "var(--sev-urgent)" }}><T fr="Plaquettes < 50: éviter IM/ponctions, chercher la cause." ar="صفيحات < ٥٠: تجنّب العضلي والبزل، ابحث عن السبب." /></span>
                      : r.pltBand === 1 && Number.isFinite(r.PLT) && r.PLT < 150 ? <T fr="Thrombopénie modérée: surveiller, rechercher DIC/médicaments." ar="نقص صفيحات معتدل: راقب وابحث عن DIC والأدوية." />
                        : r.pltBand === 1 ? <T fr="Thrombocytose: inflammation, carence martiale, myéloprolifératif." ar="كثرة صفيحات: التهاب، عوز حديد، تكاثري نقوي." />
                          : <T fr="Plaquettes normales." ar="صفيحات طبيعية." />}
                </li>
              )}
            </ul>
            <div className="mt-2"><Badge tone={r.maxSev === 3 ? "critical" : r.maxSev === 2 ? "urgent" : r.maxSev === 1 ? "standard" : "neutral"}>
              {r.maxSev === 3 ? <T fr="Critique" ar="حرج" /> : r.maxSev === 2 ? <T fr="Marqué" ar="ملحوظ" /> : r.maxSev === 1 ? <T fr="Léger" ar="خفيف" /> : <T fr="Sans anomalie" ar="بلا شذوذ" />}
            </Badge></div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez au moins Hb, GB ou plaquettes." ar="أدخل Hb أو الكريات أو الصفيحات." />
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/heparine" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Héparine / TIH" ar="هيبارين / TIH" /></Link>
        <Link href="/calculateurs/transfusion" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Transfusion" ar="نقل الدم" /></Link>
        <Link href="/calculateurs/dic" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="DIC (ISTH)" ar="DIC (ISTH)" /></Link>
      </div>
    </div>
  );
}
