"use client";
// v3.8 — قيادة الصدمة الإنتانية: حزمة الساعة الأولى مشتقة من بروتوكول choc-septique.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { HeartPulse } from "lucide-react";
import NowBanner from "@/components/NowBanner";

const ITEMS: { id: string; fr: string; ar: string }[] = [
  { id: "lact", fr: "Lactate + cultures avant antibiotiques", ar: "لاكتات + مزارع قبل المضادات" },
  { id: "abx", fr: "Antibiothérapie large < 1 h", ar: "مضاد واسع خلال أقل من ساعة" },
  { id: "fill", fr: "Remplissage 30 mL/kg cristalloïdes", ar: "توسيع 30 مل/كغ بلّوريات" },
  { id: "nor", fr: "Noradrénaline si PAM < 65 persistante", ar: "نورأدرينالين إن بقي المتوسط < 65" },
  { id: "src", fr: "Contrôle de la source", ar: "ضبط المصدر" },
];

export default function SepsisCmdPage() {
  useRegisterRecent("calculateur:sepsis-cde");
  const { lang } = useApp();
  const [w, setW] = useState("70");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const vol = Math.round((Number(w) || 0) * 30);
  const abxAt = done["abx"];
  const abxLate = now >= 3600 && abxAt === undefined;

  const toggle = (id: string) =>
    setDone((d) => {
      const n = { ...d };
      if (n[id] !== undefined) delete n[id];
      else n[id] = now;
      return n;
    });

  const guide = !done["abx"]
    ? { fr: "Antibiotique large maintenant (< 1 h)", ar: "مضاد واسع الآن (أقل من ساعة)" }
    : now - done["abx"] >= 3600
      ? { fr: "Réévaluation maintenant (lactates/perfusion)", ar: "إعادة تقييم الآن (لاكتات/تروية)" }
      : { fr: "Poursuivez le bundle", ar: "واصل الحزمة" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <NowBanner fr={guide.fr} ar={guide.ar} />

      <PageHeader
        icon={<HeartPulse className="h-6 w-6" />}
        title={<T fr="Assistant heure-1 sepsis" ar="مساعد الساعة الأولى للإنتان" />}
        sub={<T fr="qSOFA/SIRS + bundle heure-1 chronométré." ar="qSOFA/SIRS + حزمة الساعة الأولى بمؤقّت." />}
      />
      <div className="card grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p><T fr="qSOFA: FR ≥ 22 · PAS ≤ 100 · confusion." ar="qSOFA: تنفس ≥ ٢٢ · ضغط ≤ ١٠ · تشوش." /></p>
        <p><T fr="SIRS: T° > 38 ou < 36 · FC > 90 · FR > 20 · GB > 12 ou < 4." ar="SIRS: حرارة > ٣٨ أو < ٣٦ · نبض > ٩٠ · تنفس > ٢٠ · كريات > ١٢ أو < ٤." /></p>
      </div>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Heure H" ar="الساعة صفر" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setDone({}); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      {abxLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="Plus d'une heure sans antibiotique !" ar="مرّت ساعة دون مضاد حيوي!" />
        </p>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold opacity-70"><T fr="Poids (kg) — objectif remplissage" ar="الوزن (كغ) — هدف التوسيع" /></span>
        <input type="number" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)}
          className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
        <span className="rounded-xl bg-blue-600/10 p-2 text-center font-black text-blue-500 tabular-nums">{vol} mL</span>
      </label>

      <div className="space-y-1">
        {ITEMS.map((it) => (
          <button key={it.id} onClick={() => toggle(it.id)} aria-pressed={done[it.id] !== undefined}
            className={`touch flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-start font-bold ${done[it.id] !== undefined ? "border-blue-600 bg-blue-600/15" : "border-line bg-surface"}`}>
            <span>{lang === "ar" ? it.ar : it.fr}</span>
            <span className="shrink-0 text-xs tabular-nums opacity-70" dir="ltr">
              {done[it.id] !== undefined ? fmtMMSS(done[it.id]) : "—"}
            </span>
          </button>
        ))}
      </div>

      {Object.keys(done).length > 0 && (
        <button onClick={() => {
          const txt = fmtJournal(lang === "ar" ? "سجل الساعة الأولى — إنتان" : "Bundle H1 — sepsis",
            ITEMS.filter((i) => done[i.id] !== undefined).map((i) => ({ label: lang === "ar" ? i.ar : i.fr, at: done[i.id] })));
          navigator.clipboard?.writeText(txt);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Dérivé du protocole choc septique (SSC 2021) — lactate ≥ 2 + hypotension = alerte rouge." ar="مشتق من بروتوكول الصدمة الإنتانية — لاكتات ≥ 2 + هبوط ضغط = إنذار أحمر." /></p>
    </div>
  );
}
