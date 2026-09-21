"use client";
// v4.2 — مساعد الارتعاج الفردي: تحميل وصيانة كبريتات المغنيزيوم مؤرّخان + تذكير سمية + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS, mgso4DrawMl, mgso4RateMlH } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";

type EvType = "loading" | "maint";

export default function EclampsiePage() {
  useRegisterRecent("calculateur:eclampsie");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [pct, setPct] = useState(50);
  const [regimen, setRegimen] = useState<"zuspan" | "pritchard">("zuspan");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const loadIvMl = mgso4DrawMl(pct, 4);
  const loadImMl = mgso4DrawMl(pct, 10);
  const maintImMl = mgso4DrawMl(pct, 5);
  const rateMlH = mgso4RateMlH(pct, 1);

  const lastMaint = events.find((e) => e.type === "maint")?.at ?? null;
  const sinceMaint = lastMaint === null ? null : now - lastMaint;
  const maintLate = regimen === "pritchard" && sinceMaint !== null && sinceMaint >= 4 * 3600;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const labelOf = (e: { type: EvType }): { fr: string; ar: string } =>
    e.type === "loading"
      ? regimen === "zuspan"
        ? { fr: `Charge 4 g IV (${loadIvMl} mL de ${pct} % sur 20 min)`, ar: `تحميل 4 غ وريدياً (${loadIvMl} مل من ${pct}٪ على 20 د)` }
        : { fr: `Charge 4 g IV + 10 g IM (${loadIvMl} mL IV, ${loadImMl} mL IM 5/5)`, ar: `تحميل 4 غ وريدياً + 10 غ عضلياً (${loadIvMl} مل وريدي، ${loadImMl} مل عضلياً 5/5)` }
      : regimen === "zuspan"
        ? { fr: `PSE 1 g/h (${rateMlH} mL/h)`, ar: `محقنة آلية 1 غ/س (${rateMlH} مل/س)` }
        : { fr: `Entretien 5 g IM (${maintImMl} mL)`, ar: `صيانة 5 غ عضلياً (${maintImMl} مل)` };

  const lastLoading = events.find((e) => e.type === "loading")?.at ?? null;
  const guide = lastLoading === null
    ? { fr: "MgSO4 4 g IV maintenant", ar: "MgSO4 4 غ وريدياً الآن" }
    : now - lastLoading >= 4 * 3600
      ? { fr: "Dose d'entretien maintenant", ar: "جرعة الصيانة الآن" }
      : { fr: "Surveillez réflexes/respiration", ar: "راقبي المنعكسات/التنفس" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <NowBanner fr={guide.fr} ar={guide.ar} />

      <h1 className="text-2xl font-extrabold"><T fr="Assistant éclampsie individuel" ar="مساعد الارتعاج الفردي" /></h1>

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
        <div className="mb-2 flex flex-wrap gap-2">
          {([10, 20, 50] as const).map((p) => (
            <button key={p} onClick={() => setPct(p)} aria-pressed={pct === p}
              className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${pct === p ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
              {p} %
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRegimen("zuspan")} aria-pressed={regimen === "zuspan"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${regimen === "zuspan" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Zuspan (IV)" ar="زوسبان (وريدي)" />
          </button>
          <button onClick={() => setRegimen("pritchard")} aria-pressed={regimen === "pritchard"}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${regimen === "pritchard" ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Pritchard (IM)" ar="بريتشارد (عضلي)" />
          </button>
        </div>
        <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
          {regimen === "zuspan" ? (
            <>
              <li>{`Charge 4 g IV → ${loadIvMl} mL de ${pct} % sur 20 min`}</li>
              <li>{`Entretien 1 g/h → ${rateMlH} mL/h (PSE)`}</li>
            </>
          ) : (
            <>
              <li>{`Charge 4 g IV (${loadIvMl} mL) + 10 g IM (${loadImMl} mL : 5 g par fesse)`}</li>
              <li>{`Entretien 5 g IM toutes les 4 h → ${maintImMl} mL`}</li>
            </>
          )}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => stamp("loading")}
          className="touch flex flex-col items-center gap-1 rounded-2xl border border-line bg-surface p-4 font-black">
          <span><T fr="Charge administrée" ar="أُعطي التحميل" /></span>
        </button>
        <button onClick={() => stamp("maint")}
          className={`touch flex flex-col items-center gap-1 rounded-2xl border p-4 font-black ${maintLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span>{regimen === "zuspan" ? <T fr="PSE / contrôle" ar="آلية / فحص" /> : <T fr="Entretien IM" ar="صيانة عضلية" />}</span>
          <span className="text-xs font-bold opacity-70 tabular-nums" dir="ltr">{sinceMaint === null ? "—" : fmtMMSS(sinceMaint)}</span>
        </button>
      </div>

      {maintLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 4 h: dose d'entretien IM due !" ar="≥ 4 س: جرعة الصيانة العضلية مستحقة!" />
        </p>
      )}

      <p className="rounded-xl bg-amber-500/10 p-3 text-sm font-bold text-amber-500">
        <T fr="Toxicité: rotules abolies, FR < 12/min, diurèse < 30 mL/h → stop + gluconate de calcium 1 g IV. Sources: OMS 2011, CNGOF 2021." ar="السمية: غياب منعكس الرضفة، تنفس < 12/د، بول < 30 مل/س → أوقف + غلوكونات الكالسيوم 1 غ وريدياً. المصادر: OMS 2011 وCNGOF 2021." />
      </p>

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => {
              const l = labelOf(e);
              return (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span>{lang === "ar" ? l.ar : l.fr}</span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الارتعاج" : "Journal éclampsie", [...events].reverse().map((e) => { const l = labelOf(e); return { label: lang === "ar" ? l.ar : l.fr, at: e.at }; })));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}
    </div>
  );
}
