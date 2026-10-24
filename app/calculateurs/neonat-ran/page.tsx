"use client";
// Aide-mémoire chronométré : le seuil de 60 s ne s'applique que si la VPP est indiquée.
import { useEffect, useState } from "react";
import { fmtMMSS, parseDecimalInput } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { getProcedure } from "@/data/procedures";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const PROC = getProcedure("neonat-ran")!;

export default function NeonatRanPage() {
  useRegisterRecent("calculateur:neonat-ran");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Record<number, number>>({});
  const [ppvIndicated, setPpvIndicated] = useState(false);
  const [w, setW] = useState("");

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const current = PROC.steps.findIndex((_, i) => done[i] === undefined);
  const ppvStarted = done[2] !== undefined;
  const goldenLate = ppvIndicated && now >= 60 && !ppvStarted;
  const parsedWeight = parseDecimalInput(w);
  const weight = parsedWeight ?? 0;
  const hasW = Number.isFinite(weight) && weight > 0;
  const nDone = Object.keys(done).length;

  const copy = () => {
    const lines = PROC.steps
      .map((s, i) => ({ i, at: done[i] as number | undefined }))
      .filter((x): x is { i: number; at: number } => x.at !== undefined)
      .map((x) => ({ label: lang === "ar" ? PROC.steps[x.i].ar : PROC.steps[x.i].fr, at: x.at }));
    navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل إنعاش الولدان" : "Journal réanimation néonatale", lines));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant de réanimation du nouveau-né" ar="مساعد إنعاش الوليد" /></h1>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <div>
          <p className="text-4xl font-black tabular-nums" dir="ltr" role="timer">{fmtMMSS(now)}</p>
          <p className="mt-1 max-w-sm text-xs opacity-70"><T fr="Démarrer à la naissance. La cible de 60 s concerne uniquement un nouveau-né qui a besoin de VPP." ar="ابدأ التوقيت عند الولادة. هدف 60 ثانية يخص فقط الوليد الذي يحتاج إلى تهوية بالضغط الإيجابي." /></p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setDone({}); setPpvIndicated(false); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <label className="card flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-4">
        <input type="checkbox" checked={ppvIndicated} onChange={(e) => setPpvIndicated(e.target.checked)} className="mt-1 h-5 w-5 accent-blue-600" />
        <span className="text-sm font-bold"><T fr="VPP indiquée après les étapes initiales (apnée/gasping ou FC < 100/min persistante)." ar="التهوية بالضغط الإيجابي مستطبة بعد الخطوات الأولية (انقطاع النفس/اللهاث أو استمرار النبض دون 100/دقيقة)." /></span>
      </label>

      {goldenLate && (
        <p role="alert" className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="Le début de VPP n'est pas enregistré dans les 60 s : vérifiez immédiatement l'état clinique et l'algorithme. Le minuteur ne confirme pas l'efficacité de la ventilation." ar="لم يُسجل بدء التهوية خلال 60 ثانية: تحقق فوراً من الحالة السريرية والخوارزمية. لا يؤكد المؤقت فعالية التهوية." />
        </p>
      )}

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label htmlFor="neonatal-weight" className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg) pour le calcul indicatif de l'adrénaline" ar="الوزن (كغ) لحساب الأدرينالين الإرشادي" /></label>
        <input id="neonatal-weight" value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="3,2"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        {hasW && (
          <div>
            <p className="mt-2 text-sm font-black text-blue-500" dir="ltr">
              {`0,01–0,03 mg/kg → ${(weight * 0.01).toFixed(2)}–${(weight * 0.03).toFixed(2)} mg · 1:10 000 (0,1 mg/mL) → ${(weight * 0.1).toFixed(2)}–${(weight * 0.3).toFixed(2)} mL`}
            </p>
            <p className="mt-2 text-xs text-amber-500"><T fr="Calcul indicatif uniquement : vérifier l'indication, la voie, la concentration et la dose selon l'algorithme néonatal." ar="حساب إرشادي فقط: تحقق من الاستطباب والطريق والتركيز والجرعة وفق خوارزمية إنعاش الوليد." /></p>
          </div>
        )}
      </div>

      <ol className="flex flex-col gap-2">
        {PROC.steps.map((s, i) => {
          const at = done[i];
          const isCurrent = i === current;
          const cls = at !== undefined
            ? "border-green-600 bg-green-600/10"
            : isCurrent
              ? "border-blue-600 bg-blue-600/10"
              : "border-line bg-surface opacity-60";
          return (
            <li key={i}>
              <button onClick={() => setDone((d) => (d[i] === undefined ? { ...d, [i]: now } : d))}
                className={`touch flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-start ${cls}`}>
                <span className="min-w-0"><span className="block text-sm font-bold">{i + 1}. {lang === "ar" ? s.ar : s.fr}</span></span>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-black tabular-nums ${at !== undefined ? "bg-green-600/15 text-green-500" : "bg-surface2 opacity-70"}`} dir="ltr">
                  {at !== undefined ? fmtMMSS(at) : isCurrent ? (lang === "ar" ? "الآن" : "À faire") : "—"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {nDone > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({nDone})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {PROC.steps.map((s, i) => ({ s, i, at: done[i] as number | undefined }))
              .filter((x): x is { s: (typeof PROC.steps)[number]; i: number; at: number } => x.at !== undefined)
              .map((x) => (
                <li key={x.i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span className="min-w-0 break-words">{lang === "ar" ? x.s.ar : x.s.fr}</span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(x.at)}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {nDone > 0 && (
        <button onClick={copy}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Sources : AHA/AAP Neonatal Resuscitation 2025 et ERC Newborn Resuscitation 2025. Aide-mémoire ; suivre le protocole néonatal adopté par le service." ar="المصادر: إرشادات AHA/AAP لإنعاش الوليد 2025 وERC لإنعاش حديثي الولادة 2025. مذكرة مساعدة؛ اتبع بروتوكول الوليد المعتمد في المرفق." /></p>
    </div>
  );
}
