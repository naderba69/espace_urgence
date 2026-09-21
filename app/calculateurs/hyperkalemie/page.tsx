"use client";
// v4.4 — مساعد فرط بوتاسيوم الدم الفردي: كالسيوم/أنسولين-غلوكوز/سالبوتامول مؤرّخون + مراقبة حمراء + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Activity } from "lucide-react";

type EvType = "ca" | "insu" | "salb" | "controle";

export default function HyperkalemiePage() {
  useRegisterRecent("calculateur:hyperkalemie");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [ped, setPed] = useState(false);
  const [w, setW] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const okW = Number.isFinite(weight) && weight > 0;

  const caMl = ped && okW ? Math.min(10, +(weight * 1).toFixed(1)) : 10;
  const insuU = ped && okW ? +(weight * 0.1).toFixed(2) : 10;
  const gluG = ped && okW ? +(weight * 0.5).toFixed(1) : 25;

  const stamp = (type: EvType) => {
    const fr = type === "ca"
      ? `Gluconate de Ca 10 % ${caMl} mL IV 5-10 min`
      : type === "insu"
        ? `Insuline ${insuU} U + glucosé ${gluG} g IV`
        : type === "salb"
          ? "Salbutamol néb. 10-20 mg"
          : "Contrôle K + ECG";
    const ar = type === "ca"
      ? `غلوكونات الكالسيوم 10٪ ${caMl} مل وريدياً على 5-10 د`
      : type === "insu"
        ? `أنسولين ${insuU} وحدة + غلوكوز ${gluG} غ وريدياً`
        : type === "salb"
          ? "سالبوتامول رذّاً 10-20 ملغ"
          : "فحص بوتاسيوم + تخطيط";
    setEvents((e) => [{ type, at: now, fr, ar }, ...e]);
  };

  const lastCtrl = events.find((e) => e.type === "controle")?.at ?? null;
  const sinceCtrl = lastCtrl === null ? null : now - lastCtrl;
  const ctrlLate = sinceCtrl !== null && sinceCtrl >= 1800;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={<T fr="Assistant hyperkaliémie individuel" ar="مساعد فرط بوتاسيوم الفردي" />}
        sub={<T fr="Échelle thérapeutique: membrane, shift, élimination." ar="سلّم علاجي: غشاء، نقل داخل الخلايا، إطراح." />}
      />

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
        <div className="mb-2 flex gap-2">
          <button onClick={() => setPed(false)} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${!ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Adulte" ar="كبير" />
          </button>
          <button onClick={() => setPed(true)} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Enfant" ar="طفل" />
          </button>
        </div>
        {ped && (
          <>
            <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
            <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="20"
              className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </>
        )}
        <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
          <li>{`Ca gluconate 10 % ${ped && !okW ? "—" : caMl} mL IV 5-10 min (cardioprotection)`}</li>
          <li>{`Insuline ${ped && !okW ? "—" : insuU} U + glucosé ${ped && !okW ? "—" : gluG} g IV`}</li>
          <li>{`Salbutamol néb. ${ped ? "2,5-5" : "10-20"} mg`}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("ca")} disabled={ped && !okW}
          className={`touch rounded-2xl border p-4 font-black ${ped && !okW ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="Calcium administré" ar="أُعطي الكالسيوم" />
        </button>
        <button onClick={() => stamp("insu")} disabled={ped && !okW}
          className={`touch rounded-2xl border p-4 font-black ${ped && !okW ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="Insuline + glucosé" ar="أنسولين + غلوكوز" />
        </button>
        <button onClick={() => stamp("salb")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Salbutamol nébulisé" ar="سالبوتامول رذّاً" />
        </button>
        <button onClick={() => stamp("controle")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${ctrlLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Contrôle K + ECG" ar="فحص بوتاسيوم + تخطيط" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceCtrl === null ? "—" : fmtMMSS(sinceCtrl)}</span>
        </button>
      </div>

      {ctrlLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: recontrôler K + ECG !" ar="≥ 30 د: أعد فحص البوتاسيوم والتخطيط!" />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل البوتاسيوم" : "Journal hyperkaliémie", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="ECG systématique (troubles de conduction = calcium sans attendre). Sources: ERC 2021, KDIGO 2020." ar="تخطيط منهجي (اضطرابات النقل = كالسيوم دون انتظار). المصادر: ERC 2021 وKDIGO 2020." /></p>
    </div>
  );
}
