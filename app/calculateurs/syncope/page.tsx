"use client";
// v4.6 — مساعد الإغماء الفردي: هبوط انتصابي محسوب + أعلام حمراء + قياسات مؤرّخة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Activity } from "lucide-react";

const SF: { id: string; fr: string; ar: string }[] = [
  { id: "chf", fr: "Insuffisance cardiaque connue", ar: "قصور قلب معروف" },
  { id: "hct", fr: "Hématocrite < 30 %", ar: "هيماتوكريت < ٣٠٪" },
  { id: "ecgA", fr: "ECG anormal", ar: "تخطيط غير طبيعي" },
  { id: "pas", fr: "PAS < 90 mmHg", ar: "ضغط انقباضي < ٩٠" },
  { id: "glu", fr: "Glycémie anormale aux urgences", ar: "سكر غير طبيعي عند الوصول" },
];

const FLAGS: { id: string; fr: string; ar: string }[] = [
  { id: "douleur", fr: "Douleur thoracique", ar: "ألم صدري" },
  { id: "palp", fr: "Palpitations / effort", ar: "خفقان / أثناء الجهد" },
  { id: "atcd", fr: "ATCD mort subite familiale", ar: "وفاة مفاجئة عائلية" },
  { id: "ecg", fr: "ECG anormal", ar: "تخطيط غير طبيعي" },
  { id: "trauma", fr: "Traumatisme lors de la chute", ar: "رضح عند السقوط" },
];

export default function SyncopePage() {
  useRegisterRecent("calculateur:syncope");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [decub, setDecub] = useState("");
  const [orth1, setOrth1] = useState("");
  const [orth3, setOrth3] = useState("");
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [sf, setSf] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; drop: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const d = parseFloat(decub); const o1 = parseFloat(orth1); const o3 = parseFloat(orth3);
  const okOrth = Number.isFinite(d) && (Number.isFinite(o1) || Number.isFinite(o3));
  const stand = Math.min(Number.isFinite(o1) ? o1 : Infinity, Number.isFinite(o3) ? o3 : Infinity);
  const drop = okOrth ? Math.round(d - stand) : 0;
  const orthPos = okOrth && drop >= 20;

  const nFlags = FLAGS.filter((f) => flags[f.id]).length;

  const stamp = () => setEvents((e) => [{ at: now, drop }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={<T fr="Assistant syncope individuel" ar="مساعد الإغماء الفردي" />}
        sub={<T fr="San Francisco Syncope Rule + orthostatisme + drapeaux." ar="قاعدة سان فرانسيسكو + انتصابي + أعلام." />}
      />
      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 text-sm font-black opacity-70"><T fr="San Francisco Syncope Rule — ≥ 1 critère = risque élevé (admission)." ar="قاعدة سان فرانسيسكو — معيار واحد أو أكثر = خطورة عالية (إدخال)." /></p>
        <div className="flex flex-col gap-2">
          {SF.map((c) => {
            const on = !!sf[c.id];
            return (
              <button key={c.id} role="checkbox" aria-checked={on}
                onClick={() => setSf((prev) => ({ ...prev, [c.id]: !on }))}
                className={`touch rounded-xl border px-3 py-2 text-start text-sm font-bold ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
                style={on ? { background: "var(--sev-urgent)" } : undefined}>
                {lang === "ar" ? c.ar : c.fr}
              </button>
            );
          })}
        </div>
        {Object.values(sf).some(Boolean) && (
          <p className="mt-2 rounded-xl p-2 text-sm font-black" style={{ background: "var(--sev-critical-bg)", color: "var(--sev-critical)" }}>
            <T fr="Règle SF positive → surveillance monitorée / admission." ar="قاعدة سان فرانسيسكو إيجابية → مراقبة مستمرة/إدخال." />
          </p>
        )}
      </div>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); setFlags({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="PAS décubitus" ar="انقباضي اضطجاعاً" /></label>
            <input value={decub} onChange={(e) => setDecub(e.target.value)} inputMode="numeric" placeholder="130"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="PAS debout 1 min" ar="وقوفاً 1 د" /></label>
            <input value={orth1} onChange={(e) => setOrth1(e.target.value)} inputMode="numeric" placeholder="110"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="PAS debout 3 min" ar="وقوفاً 3 د" /></label>
            <input value={orth3} onChange={(e) => setOrth3(e.target.value)} inputMode="numeric" placeholder="105"
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </div>
        </div>
        {okOrth && (
          <p className={`mt-2 text-sm font-black ${orthPos ? "text-red-500" : "text-blue-500"}`} dir="ltr">
            {`Chute PAS = ${drop} mmHg → ${orthPos ? "hypotension orthostatique OUI (≥ 20)" : "non significative (< 20)"}`}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FLAGS.map((f) => (
          <button key={f.id} onClick={() => setFlags((x) => ({ ...x, [f.id]: !x[f.id] }))} aria-pressed={!!flags[f.id]}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${flags[f.id] ? "border-red-600 bg-red-600/15 text-red-500" : "border-line"}`}>
            {lang === "ar" ? f.ar : f.fr}
          </button>
        ))}
      </div>

      {nFlags > 0 && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr={`${nFlags} drapeau(x) rouge(s) : bilan cardiaque + hospitalisation à discuter.`} ar={`${nFlags} علم أحمر: فحص قلبي + نقاش الإدخال.`} />
        </p>
      )}

      <button onClick={stamp} disabled={!okOrth}
        className={`touch rounded-2xl border p-4 font-black ${!okOrth ? "border-line opacity-40" : "border-line bg-surface"}`}>
        <T fr="Mesure orthostatique horodatée" ar="قياس انتصابي مؤرّخ" />
      </button>

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span><T fr="Chute PAS" ar="هبوط الانقباضي" /> <span className="tabular-nums" dir="ltr">{e.drop} mmHg</span></span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الإغماء" : "Journal syncope", [...events].reverse().map((e) => ({ label: `${lang === "ar" ? "هبوط الانقباضي" : "Chute PAS"} ${e.drop} mmHg`, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="ECG systématique; EEG inutile sans crise convulsive. Source: ESC syncope 2018." ar="تخطيط منهجي؛ لا حاجة لتخطيط الدماغ دون نوبة. المصدر: ESC 2018." /></p>
    </div>
  );
}
