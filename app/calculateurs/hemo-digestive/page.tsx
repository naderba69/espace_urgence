"use client";
// v4.8 — مساعد النزف الهضمي العلوي الفردي: Blatchford توجيهي + مثبط مضخة مؤرّخ + نافذة تنظير 24 س + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

export default function HemoDigestivePage() {
  useRegisterRecent("calculateur:hemo-digestive");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [sex, setSex] = useState<"m" | "f">("m");
  const [urea, setUrea] = useState(""); const [hb, setHb] = useState(""); const [pas, setPas] = useState(""); const [pouls, setPouls] = useState("");
  const [melena, setMelena] = useState(false); const [syncope, setSyncope] = useState(false);
  const [foie, setFoie] = useState(false); const [coeur, setCoeur] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const u = parseFloat(urea); const h = parseFloat(hb); const p = parseFloat(pas); const pu = parseFloat(pouls);

  let score = 0;
  if (Number.isFinite(u)) score += u >= 25 ? 6 : u >= 10 ? 4 : u >= 8 ? 3 : u >= 6.5 ? 2 : 0;
  if (Number.isFinite(h)) {
    if (sex === "m") score += h < 10 ? 6 : h < 12 ? 3 : h < 13 ? 1 : 0;
    else score += h < 10 ? 6 : h < 12 ? 1 : 0;
  }
  if (Number.isFinite(p)) score += p < 90 ? 3 : p < 100 ? 2 : p < 110 ? 1 : 0;
  if (Number.isFinite(pu) && pu >= 100) score += 1;
  if (melena) score += 1;
  if (syncope) score += 2;
  if (foie) score += 2;
  if (coeur) score += 2;

  const low = score <= 1;

  const firstEndo = events.find((e) => e.ar.startsWith("تنظير"))?.at ?? null;
  const sinceStart = now;
  const endoLate = firstEndo === null && sinceStart >= 24 * 3600;

  const stamp = (fr: string, ar: string) => setEvents((e) => [{ at: now, fr, ar }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant HDO individuel" ar="مساعد النزف الهضمي العلوي الفردي" /></h1>

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
          <button onClick={() => setSex("m")} aria-pressed={sex === "m"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${sex === "m" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Homme" ar="رجل" />
          </button>
          <button onClick={() => setSex("f")} aria-pressed={sex === "f"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${sex === "f" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Femme" ar="امرأة" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { v: urea, set: setUrea, fr: "Urée mmol/L", ar: "يوريا ممول/ل", ph: "8" },
            { v: hb, set: setHb, fr: "Hb g/dL", ar: "خضاب غ/دل", ph: "11" },
            { v: pas, set: setPas, fr: "PAS", ar: "انقباضي", ph: "105" },
            { v: pouls, set: setPouls, fr: "Pouls", ar: "نبض", ph: "95" },
          ].map((f, i) => (
            <div key={i}>
              <label className="mb-1 block text-xs font-bold opacity-70">{lang === "ar" ? f.ar : f.fr}</label>
              <input value={f.v} onChange={(e) => f.set(e.target.value)} inputMode="decimal" placeholder={f.ph}
                className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["melena", "Méléna", "قساط"], ["syncope", "Syncope", "إغماءة"], ["foie", "Hépatopathie", "مرض كبدي"], ["coeur", "Insuff. cardiaque", "قصور قلبي"]] as const).map(([id, fr, ar]) => {
            const val = { melena, syncope, foie, coeur }[id];
            const set = { melena: setMelena, syncope: setSyncope, foie: setFoie, coeur: setCoeur }[id];
            return (
              <button key={id} onClick={() => set(!val)} aria-pressed={val}
                className={`touch rounded-full border px-3 py-1.5 text-xs font-bold ${val ? "border-red-600 bg-red-600/15 text-red-500" : "border-line"}`}>
                {lang === "ar" ? ar : fr}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-4xl font-black tabular-nums text-blue-500">{score}</p>
        <p className={`mt-1 rounded-xl p-3 text-sm font-black ${low ? "bg-blue-600/15 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
          {low
            ? <T fr="Blatchford 0-1: risque faible, sortie possible avec suivi." ar="بلاشفورد 0-1: خطر منخفض، خروج ممكن مع متابعة." />
            : <T fr="Blatchford ≥ 2: hospitalisation + endoscopie ≤ 24 h." ar="بلاشفورد ≥ 2: إدخال + تنظير خلال 24 س." />}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("IPP IV administré", "أُعطي مثبط المضخة وريدياً")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="IPP IV administré" ar="أُعطي مثبط المضخة وريدياً" />
        </button>
        <button onClick={() => stamp("Endoscopie réalisée", "تم التنظير")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${endoLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Endoscopie réalisée" ar="تم التنظير" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{fmtMMSS(now)}</span>
        </button>
      </div>

      {endoLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 24 h sans endoscopie (score ≥ 2) !" ar="≥ 24 س دون تنظير (نقاط ≥ 2)!" />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل النزف الهضمي" : "Journal HDO", [...events].reverse().map((e) => ({ label: `${lang === "ar" ? e.ar : e.fr} (Blatchford ${score})`, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="2 voies veineuses + groupage; pas de transfusion systématique avant 7 g/dL (sauf hémorragie massive). Source: ESGE 2021." ar="طريقان وريديان + زمرَة؛ لا نقل منهجياً قبل 7 غ/دل (إلا نزفاً هائلاً). المصدر: ESGE 2021." /></p>
    </div>
  );
}
