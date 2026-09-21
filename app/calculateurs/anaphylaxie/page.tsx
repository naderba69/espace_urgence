"use client";
// v4.2 — مساعد صدمة الحساسية الفردي: أدرنالين IM بالوزن مع إعادة مؤرّخة كل 5-10 د + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

export default function AnaphylaxiePage() {
  useRegisterRecent("calculateur:anaphylaxie");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const ok = Number.isFinite(weight) && weight > 0;
  const cap = ok && weight < 30 ? 0.3 : 0.5;
  const mg = ok ? Math.min(cap, Math.round(weight * 0.01 * 100) / 100) : 0;
  const lastIm = events.length ? events[0].at : null;
  const since = lastIm === null ? null : now - lastIm;
  const redose = since !== null && since >= 300;

  const stamp = () => {
    const fr = `Adrénaline IM ${mg.toFixed(2)} mg (1:1000)`;
    const ar = `أدرنالين عضلياً ${mg.toFixed(2)} ملغ (1:1000)`;
    setEvents((e) => [{ at: now, fr, ar }, ...e]);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant anaphylaxie individuel" ar="مساعد صدمة الحساسية الفردي" /></h1>

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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
        <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="25"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
        {ok && (
          <p className="mt-2 text-sm font-black text-blue-500" dir="ltr">
            {`IM 0,01 mg/kg (1:1000) → ${mg.toFixed(2)} mg = ${mg.toFixed(2)} mL · max ${cap.toFixed(1)}`}
          </p>
        )}
      </div>

      <button onClick={stamp} disabled={!ok}
        className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${!ok ? "border-line opacity-40" : redose ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
        <span><T fr="Adrénaline IM" ar="أدرنالين عضلياً" /> {ok && <span className="text-xs opacity-70 tabular-nums" dir="ltr">({mg.toFixed(2)} mL)</span>}</span>
        <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
      </button>

      {redose && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 5 min: réévaluer et répéter l'adrénaline IM si besoin (fenêtre 5-10 min)." ar="≥ 5 د: أعد التقييم وكرر الأدرنالين عضلياً عند الحاجة (نافذة 5-10 د)." />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{lang === "ar" ? e.ar : e.fr}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الحساسية" : "Journal anaphylaxie", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Adrénaline IM cuisse antéro-latérale = 1ʳᵉ ligne; O2 + remplissage si choc. Antihistaminiques/corticoïdes = 2ᵉ ligne. Sources: ERC/ASCIA 2021." ar="الأدرنالين عضلياً بالفخذ الوحشي الأمامي هو الخط الأول؛ أكسجين وتعبئة عند الصدمة. مضادات الهيستامين/الكورتيزون خط ثانٍ. المصادر: ERC/ASCIA 2021." /></p>
    </div>
  );
}
