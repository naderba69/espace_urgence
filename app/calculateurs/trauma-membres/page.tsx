"use client";
// v5.0 — مساعد رضح الأطراف الفردي: تثبيت مؤرّخ + فحص وعائي/عصبي كل 30 د + تسكين + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const FLAGS: { id: string; fr: string; ar: string }[] = [
  { id: "pouls", fr: "Pouls distal aboli", ar: "غياب نبض بعيد" },
  { id: "hema", fr: "Hématome expansif", ar: "ورم دموي متوسع" },
  { id: "parest", fr: "Paresthésies / paralysie", ar: "نمل / شلل" },
];

export default function TraumaMembresPage() {
  useRegisterRecent("calculateur:trauma-membres");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ at: number; fr: string; ar: string }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const nFlags = FLAGS.filter((f) => flags[f.id]).length;

  const lastCheck = events.find((e) => e.ar.startsWith("فحص بعيد"))?.at ?? null;
  const since = lastCheck === null ? null : now - lastCheck;
  const checkLate = since !== null && since >= 1800;

  const stamp = (fr: string, ar: string) => setEvents((e) => [{ at: now, fr, ar }, ...e]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold"><T fr="Assistant trauma de membre individuel" ar="مساعد رضح الأطراف الفردي" /></h1>

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
          <T fr={`${nFlags} signe(s) vasculaire/nerveux : avis chirurgical urgent (ischémie ?).`} ar={`${nFlags} علامة وعائية/عصبية: رأي جراحي عاجل (إقفار؟).`} />
        </p>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("Immobilisation (articulations sus/sous-jacentes)", "تثبيت (مفاصل فوق/تحت الكسر)")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Immobilisation effectuée" ar="تم التثبيت" />
        </button>
        <button onClick={() => stamp("Antalgie administrée", "أُعطي التسكين")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Antalgie administrée" ar="أُعطي التسكين" />
        </button>
        <button onClick={() => stamp("Examen distal : pouls/sensitif/moteur", "فحص بعيد: نبض/حس/حركة")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${checkLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Examen distal (pouls/sensitif/moteur)" ar="فحص بعيد (نبض/حس/حركة)" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{since === null ? "—" : fmtMMSS(since)}</span>
        </button>
      </div>

      {checkLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 30 min: réexaminer pouls/sensitif/moteur (syndrome de loge ?)." ar="≥ 30 د: أعد فحص النبض/الحس/الحركة (متلازمة حيز؟)." />
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
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الرضح" : "Journal trauma membre", [...events].reverse().map((e) => ({ label: lang === "ar" ? e.ar : e.fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Glace enveloppée (pas directe) + surélévation; radio face/profil ± comparatif. Source: Tintinalli 9e éd." ar="ثلج مغلف (لا مباشر) + رفع؛ شعاع بوجهين ± مقارنة. المصدر: Tintinalli 9." /></p>
    </div>
  );
}
