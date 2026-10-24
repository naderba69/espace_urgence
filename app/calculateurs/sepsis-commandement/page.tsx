"use client";
// SSC 2026 (adultes) : priorités conditionnelles, volume seulement si indication vérifiée.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { HeartPulse } from "lucide-react";
import NowBanner from "@/components/NowBanner";

type AntibioticContext = "unassessed" | "shock-or-high" | "possible-no-shock" | "low-no-shock";

const ABX_GUIDANCE: Record<AntibioticContext, { fr: string; ar: string; limitSec: number | null }> = {
  unassessed: {
    fr: "Évaluez rapidement la probabilité d'infection et la présence d'un choc avant de fixer le délai antibiotique.",
    ar: "قيّم سريعاً احتمال العدوى ووجود الصدمة قبل تحديد توقيت المضاد الحيوي.",
    limitSec: null,
  },
  "shock-or-high": {
    fr: "Choc septique possible, ou sepsis probable/confirmé : antibiothérapie immédiate, idéalement dans l'heure.",
    ar: "صدمة إنتانية محتملة أو إنتان مرجح/مؤكد: المضاد فوراً، ويفضل خلال ساعة.",
    limitSec: 3600,
  },
  "possible-no-shock": {
    fr: "Sepsis possible sans choc : évaluation rapide et limitée dans le temps ; si le soupçon persiste, antibiothérapie dans les 3 heures.",
    ar: "إنتان محتمل بلا صدمة: تقييم سريع ومحدد الزمن؛ إذا استمر الاشتباه، أعطِ المضاد خلال 3 ساعات.",
    limitSec: 10800,
  },
  "low-no-shock": {
    fr: "Faible probabilité d'infection sans choc : différer les antibiotiques peut se discuter, avec surveillance rapprochée.",
    ar: "احتمال العدوى منخفض دون صدمة: يمكن تأجيل المضاد مع مراقبة لصيقة.",
    limitSec: null,
  },
};

export default function SepsisCmdPage() {
  useRegisterRecent("calculateur:sepsis-cde");
  const { lang } = useApp();
  const [weight, setWeight] = useState("");
  const [weightBasis, setWeightBasis] = useState("actual");
  const [isAdult, setIsAdult] = useState(false);
  const [hasSepsisHypoperfusion, setHasSepsisHypoperfusion] = useState(false);
  const [age65Plus, setAge65Plus] = useState(false);
  const [abxContext, setAbxContext] = useState<AntibioticContext>("unassessed");
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const selectedWeight = Number(weight);
  const hasValidWeight = Number.isFinite(selectedWeight) && selectedWeight > 0;
  const fluidEligible = isAdult && hasSepsisHypoperfusion;
  const fluidMl = fluidEligible && hasValidWeight ? Math.round(selectedWeight * 30) : null;
  const abxAt = done["abx"];
  const deadline = ABX_GUIDANCE[abxContext].limitSec;
  const abxLate = deadline !== null && abxAt === undefined && now >= deadline;

  const toggle = (id: string) =>
    setDone((d) => {
      const n = { ...d };
      if (n[id] !== undefined) delete n[id];
      else n[id] = now;
      return n;
    });

  const guide = abxAt !== undefined
    ? { fr: "Réévaluez la réponse clinique et adaptez/désescaladez selon les résultats.", ar: "أعد تقييم الاستجابة السريرية وكيّف العلاج أو ضيّق طيفه حسب النتائج." }
    : ABX_GUIDANCE[abxContext];
  const mapTarget = age65Plus
    ? { fr: "PAM initiale : plage 60–65 mmHg (adulte ≥65 ans).", ar: "هدف PAM الابتدائي: نطاق 60–65 مم زئبق للبالغ بعمر 65 سنة فأكثر." }
    : { fr: "PAM initiale : environ 65 mmHg chez l'adulte.", ar: "هدف PAM الابتدائي: نحو 65 مم زئبق للبالغ." };

  const items = [
    { id: "lact", fr: "Mesurer le lactate si indiqué ; prélever les hémocultures avant l'antibiotique si cela ne le retarde pas.", ar: "قِس اللاكتات عند الاستطباب؛ وخذ زراعات الدم قبل المضاد إن لم يؤخر ذلك إعطاءه." },
    { id: "abx", fr: "Antibiothérapie administrée — horodater", ar: "إعطاء المضاد الحيوي — سجّل الوقت" },
    ...(fluidEligible ? [{ id: "fill", fr: "Réévaluer l'administration initiale de cristalloïdes", ar: "أعد تقييم إعطاء البلّوريات الأولي" }] : []),
    { id: "nor", fr: "Si l'hypotension persiste : vasopresseur (noradrénaline en 1re ligne) ; début périphérique sans attendre un abord central.", ar: "إذا استمر هبوط الضغط: مقبض وعائي (النورأدرينالين أولاً)؛ ابدأ طرفياً دون انتظار خط مركزي." },
    { id: "src", fr: "Rechercher et contrôler rapidement le foyer infectieux", ar: "ابحث عن بؤرة العدوى واضبطها سريعاً" },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <NowBanner fr={guide.fr} ar={guide.ar} />

      <PageHeader
        icon={<HeartPulse className="h-6 w-6" />}
        title={<T fr="Assistant sepsis — décision et suivi" ar="مساعد الإنتان — القرار والمتابعة" />}
        sub={<T fr="Repères SSC 2026 pour adultes ; le choix du traitement dépend du contexte clinique." ar="مرتكزات SSC 2026 للبالغين؛ اختيار العلاج يعتمد على السياق السريري." />}
      />

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-black"><T fr="Contexte antibiotique (adulte)" ar="سياق توقيت المضاد (للبالغ)" /></span>
          <select aria-label="Contexte antibiotique" value={abxContext} onChange={(e) => setAbxContext(e.target.value as AntibioticContext)}
            className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-3 text-sm font-bold">
            <option value="unassessed">{lang === "ar" ? "يحتاج إلى تقييم" : "À évaluer"}</option>
            <option value="shock-or-high">{lang === "ar" ? "صدمة محتملة أو إنتان مرجح/مؤكد" : "Choc possible ou sepsis probable/confirmé"}</option>
            <option value="possible-no-shock">{lang === "ar" ? "إنتان محتمل دون صدمة" : "Sepsis possible sans choc"}</option>
            <option value="low-no-shock">{lang === "ar" ? "احتمال منخفض دون صدمة" : "Faible probabilité, sans choc"}</option>
          </select>
        </label>
        <p className="mt-2 text-xs font-bold opacity-70">
          <T fr="Le chronomètre part de l'heure où le sepsis est suspecté/reconnu ; ce choix ne remplace pas le jugement clinique." ar="يبدأ المؤقت من وقت الاشتباه بالإنتان أو التعرف عليه؛ ولا يحل هذا الاختيار محل التقييم السريري." />
        </p>
      </section>

      <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold">
        <T fr="Dépistage : SSC 2026 recommande NEWS/NEWS2, MEWS ou SIRS plutôt que qSOFA seul. Le sepsis reste un diagnostic clinique." ar="التحري: توصي SSC 2026 بـ NEWS/NEWS2 أو MEWS أو SIRS بدلاً من qSOFA وحده. يبقى الإنتان تشخيصاً سريرياً." />
      </p>

      <section className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="text-sm font-black"><T fr="Calcul initial des fluides — adultes uniquement" ar="حساب السوائل الأولي — للبالغين فقط" /></h2>
        <label className="flex items-start gap-2 rounded-xl border border-line bg-surface2 p-3 text-sm font-bold">
          <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} className="mt-1 h-5 w-5 accent-blue-600" />
          <span><T fr="Patient adulte" ar="المريض بالغ" /></span>
        </label>
        <label className="flex items-start gap-2 rounded-xl border border-line bg-surface2 p-3 text-sm font-bold">
          <input type="checkbox" checked={hasSepsisHypoperfusion} onChange={(e) => setHasSepsisHypoperfusion(e.target.checked)} className="mt-1 h-5 w-5 accent-blue-600" />
          <span><T fr="Hypoperfusion induite par le sepsis ou choc septique évalué cliniquement" ar="نقص تروية ناجم عن الإنتان أو صدمة إنتانية قُيّمت سريرياً" /></span>
        </label>
        {fluidEligible ? (
          <>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold opacity-70"><T fr="Poids à utiliser pour le calcul (kg)" ar="الوزن المستخدم في الحساب (كغ)" /></span>
                <input type="number" min="0" step="0.1" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
                  className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold opacity-70"><T fr="Base du poids" ar="نوع الوزن" /></span>
                <select value={weightBasis} onChange={(e) => setWeightBasis(e.target.value)}
                  className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-3 text-sm font-bold">
                  <option value="actual">Poids réel / الوزن الفعلي</option>
                  <option value="adjusted">Poids ajusté / الوزن المعدل</option>
                  <option value="ideal">Poids idéal / الوزن المثالي</option>
                </select>
              </label>
            </div>
            <p className="text-xs font-bold opacity-70">
              <T fr="SSC 2026 : au moins 30 mL/kg de cristalloïdes IV dans les 3 premières heures. Si IMC >30, poids réel ou ajusté/idéal selon le contexte ; réévaluer fréquemment. Le chiffre n'est pas une prescription automatique." ar="SSC 2026: ما لا يقل عن 30 مل/كغ من البلّوريات وريدياً خلال أول 3 ساعات. إذا كان IMC >30، فالوزن الفعلي أو المعدل/المثالي حسب السياق؛ أعد التقييم مراراً. الرقم ليس وصفة آلية." />
            </p>
            {fluidMl !== null && (
              <p className="rounded-xl bg-blue-600/10 p-3 text-center text-lg font-black text-blue-500" dir="ltr">
                ≥ {fluidMl} mL / 3 h · {weight} kg
              </p>
            )}
          </>
        ) : (
          <p className="text-xs font-bold opacity-70">
            <T fr="Le repère SSC de 30 mL/kg ne s'affiche qu'après confirmation des deux critères : adulte et hypoperfusion liée au sepsis/choc." ar="لا يظهر مرتكز SSC البالغ 30 مل/كغ إلا بعد تأكيد الشرطين: بالغ ونقص تروية مرتبط بالإنتان/الصدمة." />
          </p>
        )}
        <label className="flex items-start gap-2 rounded-xl border border-line bg-surface2 p-3 text-sm font-bold">
          <input type="checkbox" checked={age65Plus} onChange={(e) => setAge65Plus(e.target.checked)} className="mt-1 h-5 w-5 accent-blue-600" />
          <span><T fr="Âge ≥ 65 ans (cible initiale de PAM adaptée)" ar="العمر 65 سنة فأكثر (يُعدّل هدف PAM الابتدائي)" /></span>
        </label>
        <p className="text-xs font-bold opacity-70"><T fr={mapTarget.fr} ar={mapTarget.ar} /></p>
      </section>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <div>
          <p className="text-xs font-bold opacity-70"><T fr="Temps depuis la reconnaissance du sepsis" ar="الوقت منذ التعرف على الإنتان" /></p>
          <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start !== null) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start !== null ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer H0" ar="ابدأ H0" />}
          </button>
          <button onClick={() => {
            setChrono({ start: null, acc: 0 }); setNow(0); setDone({}); setAbxContext("unassessed");
            setWeight(""); setWeightBasis("actual"); setIsAdult(false); setHasSepsisHypoperfusion(false); setAge65Plus(false);
          }} className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      {abxLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          {deadline === 3600
            ? <T fr="Plus d'une heure depuis la reconnaissance sans antibiotique : réévaluer et agir selon le contexte." ar="مرّت أكثر من ساعة منذ التعرف على الحالة دون مضاد: أعد التقييم وتصرف حسب السياق." />
            : <T fr="Trois heures écoulées sans antibiotique : réévaluer immédiatement si le soupçon d'infection persiste." ar="مرّت ثلاث ساعات دون مضاد: أعد التقييم فوراً إذا استمر الاشتباه بالعدوى." />}
        </p>
      )}

      <div className="space-y-1">
        {items.map((it) => (
          <button key={it.id} onClick={() => toggle(it.id)} aria-pressed={done[it.id] !== undefined}
            className={`touch flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-start font-bold ${done[it.id] !== undefined ? "border-blue-600 bg-blue-600/15" : "border-line bg-surface"}`}>
            <span>{lang === "ar" ? it.ar : it.fr}</span>
            <span className="shrink-0 text-xs tabular-nums opacity-70" dir="ltr">
              {done[it.id] !== undefined ? fmtMMSS(done[it.id]) : "—"}
            </span>
          </button>
        ))}
      </div>

      {fluidEligible && hasValidWeight && (
        <p className="rounded-xl border border-blue-600/30 bg-blue-600/5 p-3 text-xs font-bold">
          <T fr="Privilégier les cristalloïdes équilibrés en première intention (exception à considérer : traumatisme crânien). Individualiser la suite selon les mesures dynamiques et les réévaluations ; ne pas poursuivre les liquides uniquement pour normaliser le lactate." ar="يُفضّل البدء بالبلّوريات المتوازنة (مع مراعاة استثناء إصابة الدماغ الرضّية). فصّل ما بعد ذلك وفق المقاييس الديناميكية وإعادة التقييم؛ ولا تواصل السوائل لمجرد تطبيع اللاكتات." />
        </p>
      )}

      {Object.keys(done).length > 0 && (
        <button onClick={() => {
          const txt = fmtJournal(lang === "ar" ? "سجل متابعة الإنتان" : "Suivi sepsis",
            items.filter((i) => done[i.id] !== undefined).map((i) => ({ label: lang === "ar" ? i.ar : i.fr, at: done[i.id] })));
          navigator.clipboard?.writeText(txt);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60">
        <T fr="Source : Surviving Sepsis Campaign 2026, recommandations adultes (SCCM). Ce résumé n'est pas une validation d'un protocole tunisien local." ar="المصدر: Surviving Sepsis Campaign 2026، توصيات البالغين (SCCM). هذا الملخص لا يعني اعتماد بروتوكول تونسي محلي." />
      </p>
    </div>
  );
}
