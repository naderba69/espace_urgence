"use client";
// v5.0 — مساعد الحروق الفردي: سوائل ABA 2018 بالوزن والمساحة + تبريد مؤرّخ + تسكين + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";
import PageHeader from "@/components/ui/PageHeader";
import { Flame } from "lucide-react";

type EvType = "cool" | "analgesie";

export default function BruluresPage() {
  useRegisterRecent("calculateur:brulures");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [ped, setPed] = useState(false);
  const [w, setW] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
  });
  const [pct, setPct] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<{ type: EvType; at: number }[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w); const p = parseFloat(pct);
  const ok = Number.isFinite(weight) && weight > 0 && Number.isFinite(p) && p > 0;
  const factor = ped ? 3 : 2;
  const total = ok ? Math.round(factor * weight * p) : 0;
  const rate1 = ok ? Math.round(total / 2 / 8) : 0;
  const rate2 = ok ? Math.round(total / 2 / 16) : 0;

  const lastCool = events.find((e) => e.type === "cool")?.at ?? null;
  const sinceCool = lastCool === null ? null : now - lastCool;
  const coolLate = sinceCool !== null && sinceCool >= 1200;

  const stamp = (type: EvType) => setEvents((e) => [{ type, at: now }, ...e]);

  const LABEL: Record<EvType, { fr: string; ar: string }> = {
    cool: { fr: "Refroidissement (eau courante 20 min)", ar: "تبريد (ماء جارٍ 20 د)" },
    analgesie: { fr: "Antalgie IV titrée (morphine)", ar: "تسكين وريدي معايرةً (مورفين)" },
  };

  const cool = events.find((e) => e.type === "cool")?.at ?? null;
  const guide = cool === null
    ? { fr: "Refroidissement à l'eau courante maintenant", ar: "تبريد بماء جارٍ الآن" }
    : now - cool >= 1200
      ? { fr: "Stoppez le refroidissement maintenant", ar: "أوقف التبريد الآن" }
      : { fr: "Poursuivez le refroidissement", ar: "واصل التبريد" };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <NowBanner fr={guide.fr} ar={guide.ar} />

      <PageHeader
        icon={<Flame className="h-6 w-6" />}
        title={<T fr="Assistant brûlure individuel" ar="مساعد الحروق الفردي" />}
        sub={<T fr="Règle des neuf interactive + Parkland/ABA chronométré." ar="قاعدة التسعات تفاعلية + Parkland/ABA بمؤقّت." />}
      />
      <div className="card rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 text-sm font-black opacity-70"><T fr="Règle des neuf (adulte) — touchez pour additionner la SCQ:" ar="قاعدة التسعات (كبير) — المس لجمع مساحة الحرق:" /></p>
        <div className="flex flex-wrap gap-2">
          {[["Tête 9", 9], ["Membre sup. 9", 9], ["Tronc ant. 18", 18], ["Tronc post. 18", 18], ["Membre inf. 18", 18], ["Périnée 1", 1]].map(([lb, v]) => (
            <button key={String(lb)} onClick={() => setPct(String((parseFloat(pct) || 0) + Number(v)))}
              className="touch rounded-full border border-line px-3 py-1.5 text-xs font-black hover:bg-surface2">
              +{v} · {lb}
            </button>
          ))}
          <button onClick={() => setPct("")} className="touch rounded-full border border-line px-3 py-1.5 text-xs font-black opacity-70">
            <T fr="Effacer" ar="امسح" />
          </button>
        </div>
        <p className="mt-2 text-xs opacity-60"><T fr="Enfant: tête 18 %, membres inf. 13,5 % — utilisez le tableau pédiatrique." ar="الطفل: رأس ١٨٪ وأطراف سفلى ١٣٫٥٪ — استخدم الجدول الطفلي." /></p>
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

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex gap-2">
          <button onClick={() => setPed(false)} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${!ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Adulte (2 mL)" ar="كبير (2 مل)" />
          </button>
          <button onClick={() => setPed(true)} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Enfant (3 mL)" ar="طفل (3 مل)" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
            <NumStepper value={ w } onValue={ setW } placeholder="70" className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" label="w" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold opacity-70"><T fr="SC brûlée % (2ᵉ-3 degré)" ar="المساحة ٪ (درجة 2-3)" /></label>
            <NumStepper value={ pct } onValue={ setPct } placeholder="20" className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" label="pct" />
          </div>
        </div>
        {ok && (
          <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
            <li>{`${factor} mL × ${weight} kg × ${p} % = ${total} mL / 24 h`}</li>
            <li>{`8 premières h : ${total / 2} mL → ${rate1} mL/h`}</li>
            <li>{`16 h suivantes : ${rate2} mL/h`}</li>
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => stamp("cool")}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${coolLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Refroidissement démarré" ar="بدأ التبريد" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceCool === null ? "—" : fmtMMSS(sinceCool)}</span>
        </button>
        <button onClick={() => stamp("analgesie")}
          className="touch rounded-2xl border border-line bg-surface p-4 font-black">
          <T fr="Antalgie IV titrée" ar="تسكين وريدي معايرةً" />
        </button>
      </div>

      {coolLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 20 min: stopper le refroidissement (hypothermie)." ar="≥ 20 د: أوقف التبريد (انخفاض حرارة)." />
        </p>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((e, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الحروق" : "Journal brûlure", [...events].reverse().map((e) => ({ label: lang === "ar" ? LABEL[e.type].ar : LABEL[e.type].fr, at: e.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Pas de glace ni de pâte dentifrice; transfert centre brûlés si ≥ 20 % ou zones spéciales. Source: ABA 2018." ar="لا ثلج ولا معجون؛ حوّل لمركز حروق إن ≥ 20٪ أو مناطق خاصة. المصدر: ABA 2018." /></p>
    </div>
  );
}
