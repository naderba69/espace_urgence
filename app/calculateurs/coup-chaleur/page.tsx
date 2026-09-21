"use client";
// v4.5 — مساعد ضربة الحر الفردي: تبريد مؤرّخ + إعادة قياس كل 10 د + وقف التبريد عند 39° + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Flame } from "lucide-react";

type EvType = "refroid" | "recheck";

export default function CoupChaleurPage() {
  useRegisterRecent("calculateur:coup-chaleur");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [t, setT] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number; temp: number | null }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const tempIn = parseFloat(t);
  const okT = Number.isFinite(tempIn) && tempIn >= 30 && tempIn <= 45;

  const lastRecheck = events.find((e) => e.type === "recheck") ?? null;
  const lastTemp = lastRecheck?.temp ?? null;
  const sinceRecheck = lastRecheck === null ? null : now - lastRecheck.at;
  const hot = lastTemp !== null && lastTemp >= 39;
  const recheckLate = hot && sinceRecheck !== null && sinceRecheck >= 600;

  const stamp = (type: EvType) => {
    setEvents((e) => [{ type, at: now, temp: type === "recheck" ? tempIn : null }, ...e]);
    if (type === "recheck") setT("");
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Flame className="h-6 w-6" />}
        title={<T fr="Assistant coup de chaleur individuel" ar="مساعد ضربة الحر الفردي" />}
        sub={<T fr="Refroidissement rapide + depistage des hyperthermies malignes." ar="تبريد سريع + تمييز فرط الحرارة الخبيث." />}
      />
      <div className="card flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-3 text-sm font-bold">
        <span><T fr="Cible: inferieure a 39 C en 30 min; glace sur aisselles/aines, eau froide, jamais de frissons (benzodiazepine si besoin)." ar="الهدف: أقل من ٣٩° خلال ٣٠ د؛ ثلج على الإبط والفخذ، ماء بارد، ولا رجفة (بنزوديازيبين عند اللزوم)." /></span>
        <Link href="/calculateurs/burch-wartofsky" className="rounded-full border px-3 py-1 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Suspicion maligne: Burch-Wartofsky" ar="شكّ خبيث: بيرشوارتوفسكي" />
        </Link>
        <Link href="/calculateurs/hypothermie" className="rounded-full border px-3 py-1 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
          <T fr="Hypothermie" ar="انخفاض الحرارة" />
        </Link>
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
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      {hot && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr={`T° ${lastTemp?.toFixed(1)} ≥ 39 : refroidissement actif en cours — stop à 39 °C.`} ar={`حرارة ${lastTemp?.toFixed(1)} ≥ 39: تبريد نشط جارٍ — أوقف عند 39°.`} />
        </p>
      )}
      {lastTemp !== null && lastTemp < 39 && (
        <p className="rounded-xl bg-blue-600/15 p-3 font-black text-blue-500">
          <T fr={`T° ${lastTemp.toFixed(1)} < 39 : refroidissement actif arrêté, surveillance.`} ar={`حرارة ${lastTemp.toFixed(1)} < 39: أوقف التبريد النشط وراقب.`} />
        </p>
      )}

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Température (°C)" ar="الحرارة (°م)" /></label>
        <input value={t} onChange={(e) => setT(e.target.value)} inputMode="decimal" placeholder="41,0"
          className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("refroid")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Refroidissement démarré (eau + ventilation)" ar="بدأ التبريد (ماء + تهوية)" />
        </button>
        <button onClick={() => stamp("recheck")} disabled={!okT}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${!okT ? "border-line opacity-40" : recheckLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Recontrôle T°" ar="إعادة قياس الحرارة" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceRecheck === null ? "—" : fmtMMSS(sinceRecheck)}</span>
        </button>
      </div>

      {recheckLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 10 min: recontrôler la température !" ar="≥ 10 د: أعد قياس الحرارة!" />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>
                  {e.type === "refroid"
                    ? <T fr="Refroidissement démarré" ar="بدأ التبريد" />
                    : <T fr="Recontrôle T°" ar="إعادة قياس" />}
                  {e.temp !== null && <span className="tabular-nums" dir="ltr"> {e.temp.toFixed(1)} °C</span>}
                </span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل ضربة الحر" : "Journal coup de chaleur", [...events].reverse().map((e) => ({ label: (e.type === "refroid" ? (lang === "ar" ? "بدأ التبريد" : "Refroidissement démarré") : (lang === "ar" ? "إعادة قياس" : "Recontrôle T°")) + (e.temp !== null ? ` ${e.temp.toFixed(1)} °C` : ""), at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Immersion/eau + ventilation > antipyrétiques (inefficaces). Confusion + T° > 40 = urgence. Source: WMS 2019." ar="الغمر/الماء + التهوية أولى من خوافض الحرارة (غير مجدية). تشوش + حرارة > 40 = إسعاف. المصدر: WMS 2019." /></p>
    </div>
  );
}
