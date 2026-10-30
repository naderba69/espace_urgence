"use client";
// Assistant de suivi d'une prise en charge aiguë : schéma GINA 2026, âges ≥6 ans.
import { useEffect, useMemo, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Wind } from "lucide-react";

type EventType = "salbutamol" | "ipratropium" | "corticoide" | "magnesium";
type Event = { type: EventType; at: number; ipratropiumDoseMcg?: number };

export default function AsthmePage() {
  useRegisterRecent("calculateur:asthme");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const age = Number.parseFloat(ageInput);
  const weight = Number.parseFloat(weightInput);
  const validAge = Number.isFinite(age) && age > 0;
  const validWeight = Number.isFinite(weight) && weight > 0;
  const supported = validAge && age >= 6;
  const child = supported && age < 12;
  const adult = supported && age >= 18;
  // SCHN distingue 6 ans révolus (250 µg) des âges strictement supérieurs à 6 ans (500 µg).
  const ipratropiumDoseMcg = age <= 6 ? 250 : 500;
  const salbutamolCount = events.filter((event) => event.type === "salbutamol").length;
  const ipratropiumCount = events.filter((event) => event.type === "ipratropium").length;
  const lastSalbutamol = events.find((event) => event.type === "salbutamol")?.at ?? null;
  const lastIpratropium = events.find((event) => event.type === "ipratropium")?.at ?? null;
  const salbutamolTooSoon = lastSalbutamol !== null && now - lastSalbutamol < 1200;
  const salbutamolDue = lastSalbutamol !== null && !salbutamolTooSoon && salbutamolCount < 3;
  const salbutamolLimitReached = salbutamolCount >= 3;
  const ipratropiumTooSoon = child && lastIpratropium !== null && now - lastIpratropium < 1200;
  const ipratropiumLimitReached = child ? ipratropiumCount >= 3 || ipratropiumTooSoon : ipratropiumCount >= 1;

  const doseText = useMemo(() => {
    if (!supported) return null;
    const predLow = child && validWeight ? Math.min(weight, 40) : null;
    const predHigh = child && validWeight ? Math.min(2 * weight, 40) : null;
    return {
      salbutamol: "5 mg nébulisés par dose si cette voie est indiquée ; réévaluer avant toute répétition (maximum 3 doses dans la première heure selon le schéma GINA).",
      ipratropium: child
        ? `${ipratropiumDoseMcg} µg nébulisés par dose selon l'âge (SCHN 2026 : 250 µg de 6 mois à 6 ans inclus ; 500 µg au-delà de 6 ans) ; en forme sévère, jusqu'à 3 doses espacées de 20 min selon le protocole pédiatrique.`
        : adult
          ? "0,5 mg nébulisé en dose initiale (NHS GGC, revue 2022) ; répétition non automatisée, selon réponse et protocole hospitalier."
          : "500 µg nébulisés par dose selon le protocole pédiatrique SCHN 2026 (>6 ans) ; répétition à décider selon réponse et protocole hospitalier.",
      prednisolone: child
        ? validWeight
          ? `1–2 mg/kg/j PO pendant 3–5 jours (maximum 40 mg/j) ; calcul pour ${weight} kg : ${predLow}–${predHigh} mg/j. Le prescripteur choisit la dose dans la fourchette selon le contexte.`
          : "Saisir le poids pour afficher la fourchette : 1–2 mg/kg/j PO, maximum 40 mg/j, pendant 3–5 jours."
        : "40–50 mg PO le matin pendant 5–7 jours.",
      magnesium: adult
        ? "2 g IV sur 20 min, à considérer sélectivement si forme sévère avec réponse insuffisante après traitement initial ; avis spécialisé et surveillance."
        : "Dose non calculée par cet assistant chez les moins de 18 ans : suivre un protocole pédiatrique validé et demander un avis spécialisé.",
    };
  }, [supported, child, adult, validWeight, weight, ipratropiumDoseMcg]);

  const stamp = (type: EventType) => setEvents((current) => [{
    type,
    at: now,
    ...(type === "ipratropium" ? { ipratropiumDoseMcg } : {}),
  }, ...current]);
  const eventLabels: Record<EventType, { fr: string; ar: string }> = {
    salbutamol: { fr: "Salbutamol nébulisé — 5 mg", ar: "سالبوتامول بالرذاذ — 5 ملغ" },
    ipratropium: { fr: "Ipratropium nébulisé", ar: "إبراتروبيوم بالرذاذ" },
    corticoide: { fr: "Corticostéroïde oral administré — dose prescrite à tracer", ar: "أُعطي الكورتيكوستيرويد الفموي — سجّل الجرعة الموصوفة" },
    magnesium: { fr: "MgSO₄ IV 2 g sur 20 min — adulte, si indiqué", ar: "كبريتات المغنيسيوم وريدياً 2 غ خلال 20 دقيقة — بالغ، عند الاستطباب" },
  };
  const eventLabel = (event: Event) => {
    if (event.type === "ipratropium" && event.ipratropiumDoseMcg !== undefined) {
      return lang === "ar"
        ? `${eventLabels.ipratropium.ar} — ${event.ipratropiumDoseMcg} مكغ`
        : `${eventLabels.ipratropium.fr} — ${event.ipratropiumDoseMcg} µg`;
    }
    return lang === "ar" ? eventLabels[event.type].ar : eventLabels[event.type].fr;
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={<T fr="Assistant crise d'asthme individuel" ar="مساعد نوبة الربو الفردي" />}
        sub={<T fr="Crise sévère, âge ≥6 ans : aide de suivi, pas un outil de triage. Elle ne remplace pas l'évaluation clinique ni le protocole local." ar="نوبة شديدة، العمر ≥6 سنوات: مساعد للمتابعة وليس أداة فرز. لا يعوض التقييم السريري أو البروتوكول المحلي." />}
      />

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((current) => {
            if (current.start !== null) {
              const acc = current.acc + (Date.now() - current.start) / 1000;
              setNow(acc);
              return { start: null, acc };
            }
            return { start: Date.now(), acc: current.acc };
          })} className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start !== null ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setEvents([]); }} className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouvelle prise en charge" ar="حالة جديدة" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-bold">
            <span className="mb-1 block opacity-70"><T fr="Âge (années)" ar="العمر (سنوات)" /></span>
            <input value={ageInput} onChange={(event) => setAgeInput(event.target.value)} type="number" min="0" step="0.1" inputMode="decimal" placeholder="8" className="w-full rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1 block opacity-70"><T fr="Poids (kg), requis chez l'enfant" ar="الوزن (كغ)، مطلوب للطفل" /></span>
            <input value={weightInput} onChange={(event) => setWeightInput(event.target.value)} type="number" min="0" step="0.1" inputMode="decimal" placeholder="25" className="w-full rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </label>
        </div>
        {validAge && age < 6 && (
          <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
            <T fr="Moins de 6 ans : assistant non applicable. Utiliser un parcours spécifique petite enfance / wheezing, avec une évaluation pédiatrique ; aucune dose n'est calculée ici." ar="دون 6 سنوات: هذا المساعد غير مناسب. استخدم مساراً خاصاً بالطفولة المبكرة/الأزيز مع تقييم أطفال؛ لا تُحسب أي جرعة هنا." />
          </p>
        )}
        {supported && doseText && (
          <div className="mt-3 space-y-2 text-sm font-bold">
            <p className="rounded-lg bg-surface2 p-2"><strong>Salbutamol :</strong> {doseText.salbutamol}</p>
            <p className="rounded-lg bg-surface2 p-2"><strong>Ipratropium :</strong> {doseText.ipratropium}</p>
            <p className="rounded-lg bg-surface2 p-2"><strong>Prednisolone :</strong> {doseText.prednisolone}</p>
            <p className="rounded-lg bg-surface2 p-2"><strong>MgSO₄ :</strong> {doseText.magnesium}</p>
          </div>
        )}
      </div>

      {supported && doseText && (
        <>
          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => stamp("salbutamol")} disabled={salbutamolLimitReached || salbutamolTooSoon}
              className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${salbutamolLimitReached ? "border-line opacity-40" : salbutamolDue ? "border-amber-500 bg-amber-500/10" : "border-line bg-surface"}`}>
              <span><T fr="Salbutamol nébulisé administré" ar="أُعطي السالبوتامول بالرذاذ" /> <span className="text-xs opacity-70">({salbutamolCount}/3)</span></span>
              <span className="tabular-nums text-sm" dir="ltr">{lastSalbutamol === null ? "—" : fmtMMSS(now - lastSalbutamol)}</span>
            </button>
            <button onClick={() => stamp("ipratropium")} disabled={ipratropiumLimitReached}
              className={`touch rounded-2xl border p-4 text-start font-black ${ipratropiumLimitReached ? "border-line opacity-40" : "border-line bg-surface"}`}>
              <T fr={child ? `Ipratropium nébulisé administré (${ipratropiumCount}/3)` : ipratropiumCount ? "Dose initiale d'ipratropium déjà tracée" : "Ipratropium nébulisé — dose initiale"} ar={child ? `أُعطي الإبراتروبيوم بالرذاذ (${ipratropiumCount}/3)` : ipratropiumCount ? "سُجلت الجرعة الأولية من الإبراتروبيوم" : "الإبراتروبيوم بالرذاذ — الجرعة الأولية"} />
            </button>
            <button onClick={() => stamp("corticoide")} className="touch rounded-2xl border border-line bg-surface p-4 text-start font-black">
              <T fr="Corticostéroïde oral administré" ar="أُعطي الكورتيكوستيرويد الفموي" />
            </button>
            {adult && (
              <button onClick={() => stamp("magnesium")} className="touch rounded-2xl border border-line bg-surface p-4 text-start font-black">
                <T fr="MgSO₄ IV administré (adulte, si indiqué)" ar="أُعطيت كبريتات المغنيسيوم وريدياً (بالغ، عند الاستطباب)" />
              </button>
            )}
          </div>
          {(salbutamolTooSoon || ipratropiumTooSoon) && (
            <p className="rounded-xl bg-amber-500/10 p-3 font-bold">
              <T fr="Respecter l'intervalle minimal de 20 min pour une dose répétée ; si aggravation ou signe de danger, ne pas attendre : transfert/avis urgent." ar="احترم فاصلاً أدناه 20 دقيقة قبل الجرعة التالية؛ عند التدهور أو علامة خطر لا تنتظر: نقل أو استشارة عاجلة." />
            </p>
          )}
          {salbutamolDue && (
            <p className="rounded-xl bg-amber-500/10 p-3 font-bold">
              <T fr="20 min écoulées : réévaluer (symptômes, SpO₂, PEF/FEV₁ si possible) ; ne répéter le salbutamol que si nécessaire et approprié." ar="مرّت 20 دقيقة: أعد التقييم (الأعراض والتشبع وPEF/FEV₁ إن أمكن)؛ لا تكرر السالبوتامول إلا عند الحاجة والاستطباب." />
            </p>
          )}
          {salbutamolLimitReached && (
            <p className="rounded-xl border border-red-600/50 bg-red-600/10 p-3 font-black text-red-600">
              <T fr="Trois doses enregistrées : réévaluation et escalade/avis urgent requis ; cet assistant ne propose pas de dose supplémentaire automatique." ar="سُجلت ثلاث جرعات: يلزم إعادة التقييم والتصعيد/طلب استشارة عاجلة؛ لا يقترح هذا المساعد جرعة إضافية تلقائياً." />
            </p>
          )}
        </>
      )}

      {events.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({events.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {events.map((event, index) => (
              <li key={`${event.at}-${event.type}-${index}`} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                <span>{eventLabel(event)}</span>
                <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(event.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {events.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل الربو" : "Journal asthme", [...events].reverse().map((event) => ({ label: eventLabel(event), at: event.at }))));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }} className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-70">
        <T fr="Repères GINA 2026 : O₂ seulement si SpO₂ <92 %, cible 92–95 % si oxygène requis ; vérifier l'anaphylaxie (adrénaline IM en premier). pMDI + chambre privilégié lorsque possible. Les doses et voies doivent être vérifiées sur le protocole et la présentation disponibles." ar="مرجع GINA 2026: الأكسجين فقط إذا كان التشبع <92%، والهدف 92–95% عند الحاجة؛ تحقق من التأق (الأدرينالين العضلي أولاً). يُفضّل البخاخ مع غرفة عند الإمكان. يجب التحقق من الجرعات والطرق حسب البروتوكول والمستحضر المتاح." />
      </p>
    </div>
  );
}
