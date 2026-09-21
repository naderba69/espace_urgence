"use client";
// v11.3-B — قارئ الغازات المتقدم : PAO2, A-aDO2, P/F (Berlin), ROX.
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

export default function GazAdvancedPage() {
  useRegisterRecent("calculateur:gaz-advanced");
  const { lang } = useApp();
  const [fio2, setFio2] = useState("21");
  const [pao2, setPao2] = useState("");
  const [paco2, setPaco2] = useState("");
  const [age, setAge] = useState("");
  const [spo2, setSpo2] = useState("");
  const [fr, setFr] = useState("");

  const r = useMemo(() => {
    const F = parseFloat(fio2) / 100, PO2 = parseFloat(pao2), PCO2 = parseFloat(paco2), A = parseFloat(age);
    const Sp = parseFloat(spo2), R = parseFloat(fr);
    if (!Number.isFinite(F) || !Number.isFinite(PO2)) return null;
    const PAO2 = F * 713 - (Number.isFinite(PCO2) ? PCO2 / 0.8 : 0);
    const aa = PAO2 - PO2;
    const expected = Number.isFinite(A) ? A / 4 + 4 : null;
    const pf = F > 0 ? PO2 / F : null;
    const berlin = pf === null ? null : pf < 100 ? 3 : pf <= 200 ? 2 : pf <= 300 ? 1 : 0;
    const rox = Number.isFinite(Sp) && Number.isFinite(R) && R > 0 && F > 0 ? (Sp / 100 / F) / R : null;
    return { PAO2, aa, expected, pf, berlin, rox, fio2pct: F * 100 };
  }, [fio2, pao2, paco2, age, spo2, fr]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={lang === "ar" ? "قارئ الغازات المتقدم" : "Lecture avancée des gaz du sang"}
        sub={lang === "ar" ? "PAO2 و A-aDO2 ونسبة P/F و ROX." : "PAO2, gradient A-a, rapport P/F et indice ROX."}
      />

      <section className="grid grid-cols-2 gap-2">
        <Num label="FiO2" unit="%" value={fio2} onChange={setFio2} />
        <Num label="PaO2" unit="mmHg" value={pao2} onChange={setPao2} />
        <Num label="PaCO2" unit="mmHg" value={paco2} onChange={setPaco2} />
        <Num label={lang === "ar" ? "العمر" : "Âge"} unit={lang === "ar" ? "سنة" : "ans"} value={age} onChange={setAge} />
        <Num label={lang === "ar" ? "تشبّع O2 (اختياري)" : "SpO2 (optionnel)"} unit="%" value={spo2} onChange={setSpo2} />
        <Num label={lang === "ar" ? "تواتر التنفس (اختياري)" : "FR (optionnel)"} unit="/min" value={fr} onChange={setFr} />
      </section>

      <p className="rounded-xl border border-dashed border-line p-3 text-xs opacity-70">
        <T fr="PAO2 = FiO2 × (760 − 47) − PaCO2 / 0,8; le gradient A-a n'est interprétable qu'en air ambiant (FiO2 ≈ 21 %)." ar="PAO2 = FiO2 × (٧٦٠ − ٤٧) − PaCO2 ÷ ٠٫٨؛ ولا يُفسَّر فرق A-a إلا بالهواء المحيط (FiO2 ≈ ٢١٪)." />
      </p>

      {r ? (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${r.berlin === 3 ? "sev-critical" : r.berlin === 2 ? "sev-urgent" : r.berlin === 1 ? "sev-standard" : ""}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-lg font-black tabular-nums" dir="ltr">PAO2 {Math.round(r.PAO2)} mmHg</p>
            <Badge tone={r.berlin === 3 ? "critical" : r.berlin === 2 ? "urgent" : r.berlin === 1 ? "standard" : "neutral"}>
              {r.pf !== null ? <span dir="ltr">P/F {Math.round(r.pf)}</span> : "—"}
            </Badge>
          </div>
          <ul className="flex flex-col gap-1 text-sm font-bold">
            <li>
              <span dir="ltr" className="font-black">A-aDO2 = {Math.round(r.aa)} mmHg</span>
              {r.expected !== null && (
                <span className="opacity-70"> · {lang === "ar" ? `المتوقّع ${Math.round(r.expected)}` : `attendu ${Math.round(r.expected)}`}</span>
              )}
              {" — "}
              {r.expected !== null && r.aa > r.expected + 5
                ? <span style={{ color: "var(--sev-urgent)" }}><T fr="gradient augmenté: trouble de diffusion, shunt, ou mismatch V/Q." ar="الفرق مرتفع: خلل انتشار أو تحويل أو عدم توافق تهوية/إرواء." /></span>
                : <T fr="gradient compatible avec l'attendu pour l'âge." ar="الفرق موافق للمتوقّع حسب العمر." />}
            </li>
            {r.berlin !== null && (
              <li>
                {r.berlin === 0
                  ? <T fr="P/F > 300: pas de critère de SDRA (Berlin)." ar="P/F > ٣٠٠: لا معيار لـ SDRA (برلين)." />
                  : r.berlin === 1 ? <span style={{ color: "var(--sev-urgent)" }}><T fr="P/F 200-300: SDRA léger." ar="P/F ٢٠٠-٣٠٠: SDRA خفيف." /></span>
                    : r.berlin === 2 ? <span style={{ color: "var(--sev-urgent)" }}><T fr="P/F 100-200: SDRA modéré — VNI/position, PEEP optimisée." ar="P/F ١٠٠-٢٠٠: SDRA متوسط — تهوية غير باضعة/وضعية." /></span>
                      : <span style={{ color: "var(--sev-critical)" }}><T fr="P/F < 100: SDRA sévère — décubitus ventral, discussion ECMO, avis réanimation." ar="P/F < ١٠٠: SDRA شديد — وضعية البطن، مناقشة ECMO، استشارة." /></span>}
              </li>
            )}
            {r.rox !== null && (
              <li className="font-black" style={{ color: r.rox >= 4.88 ? "var(--accent)" : "var(--sev-urgent)" }}>
                <span dir="ltr">ROX {r.rox.toFixed(2)}</span> — {r.rox >= 4.88
                  ? <T fr="favorable sous lunettes haut débit à 2 h." ar="مؤشر مواتٍ تحت القنية عالية التدفق بعد ساعتين." />
                  : <T fr="risque d'échec: surveiller de près ou discuter l'intubation." ar="خطر فشل: راقب عن قرب أو ناقش التنبيب." />}
              </li>
            )}
            <li className="opacity-70"><T fr="Interpréter toujours avec l'état clinique: un gradient normal n'exclut pas une embolie." ar="فسّر دائماً مع الحالة السريرية: فرق طبيعي لا ينفي الانصمام." /></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/calculateurs/gazometrie" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Gaz du sang (M3)" ar="غازات الدم" /></Link>
            <Link href="/calculateurs/acide-base" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Acide-base" ar="حمضي-قاعدي" /></Link>
            <Link href="/calculateurs/gaz-units" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Conversion kPa/mmHg" ar="تحويل kPa/mmHg" /></Link>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Entrez FiO2 et PaO2 au minimum." ar="أدخل FiO2 و PaO2 على الأقل." />
        </p>
      )}
    </div>
  );
}
