"use client";
// ⚡ Flash IA — pas de chat : UNE phrase (dictée ou tapée) → carte d'intervention unique,
// chronométrée et actionnable, avec liens directs vers protocoles/arbres/calculateurs vérifiés du site.
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import AiGate from "@/components/ai/AiGate";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { generateText, speak, stopSpeaking, AiError } from "@/lib/ai";
import { getProtocol } from "@/data/protocols";
import { getTree } from "@/data/trees";
import { calculators } from "@/data/calculators";
import { trackEvent } from "@/lib/analytics";
import { Loader2, Mic, MicOff, Siren, Clock3, Pill, AlertOctagon, ArrowRight, Volume2, Square, GitBranch, ScrollText, Calculator } from "lucide-react";

// identifiants valides côté site — le modèle DOIT puiser dedans (on ne fait confiance à aucun lien inventé)
const PROTOCOL_IDS = ["acr-adulte","acr-pediatrique","anaphylaxie","avc","polytraumatisme","sca-stemi","oap","etat-mal-epileptique","asthme-aigu-grave","choc-septique","acidocetose-diabetique","hyperkaliemie","eclampsie","hemorragie-post-partum","agitation-aigue","intoxication-paracetamol","intoxication-organophosphores","traumatisme-cranien","brulure-grave","deshydratation-enfant"];
const TREE_IDS = ["acr","anaphylaxie","etat-mal","choc-septique","douleur-thoracique","hemorragie-post-partum","hyperkaliemie","polytraumatisme"];
const CALC_IDS = calculators.map((c) => c.id);

interface FlashPlan {
  diagnosticProbable: string;
  gravite: "critique" | "urgent" | "relatif";
  sequence: { fenetre: string; gestes: string[] }[]; // ex. "0-1 min", "1-5 min"
  doses: { molecule: string; posologie: string; voie: string; remarque?: string }[];
  signesAlerte: string[];
  liens: { type: "protocole" | "arbre" | "calculateur"; id: string; pourquoi: string }[];
}

const GRAVITY = {
  critique: { fr: "CRITIQUE — engagement vital immédiat", ar: "حرجة — خطر حيوي فوري", cls: "border-red-600 bg-red-600/10 text-red-500", dot: "bg-red-600" },
  urgent: { fr: "URGENT — délai très court", ar: "عاجلة — مهلة قصيرة جداً", cls: "border-orange-500 bg-orange-500/10 text-orange-500", dot: "bg-orange-500" },
  relatif: { fr: "RELATIF — surveillance rapprochée", ar: "نسبية — مراقبة مشددة", cls: "border-teal-600 bg-teal-600/10 text-teal-500", dot: "bg-teal-600" },
} as const;

// Dictée vocale — Web Speech API (gratuit, hors-ligne navigateur)
function useDictation(onText: (t: string) => void, lang: string) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const toggle = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SR as any)();
    rec.lang = lang === "ar" ? "ar-TN" : "fr-FR";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: { results: { transcript: string }[][] }) => onText(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  return { listening, toggle, supported };
}

function hrefOf(l: { type: string; id: string }): string | null {
  if (l.type === "protocole" && getProtocol(l.id)) return `/protocoles/${l.id}`;
  if (l.type === "arbre" && getTree(l.id)) return `/arbres/${l.id}`;
  if (l.type === "calculateur" && CALC_IDS.includes(l.id)) return `/calculateurs/${l.id}`;
  return null;
}

function titleOf(l: { type: string; id: string }, lang: "fr" | "ar"): string {
  if (l.type === "protocole") { const p = getProtocol(l.id); return p ? (lang === "ar" ? p.title.ar : p.title.fr) : l.id; }
  if (l.type === "arbre") { const t = getTree(l.id); return t ? (lang === "ar" ? t.title.ar : t.title.fr) : l.id; }
  const c = calculators.find((x) => x.id === l.id);
  return c ? (lang === "ar" ? c.title.ar : c.title.fr) : l.id;
}

export default function FlashIaPage() {
  const { t, lang } = useApp();
  const [sentence, setSentence] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [plan, setPlan] = useState<FlashPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const dict = useDictation((txt) => setSentence((s) => (s ? s + " " + txt : txt)), lang);

  const run = async (e?: FormEvent) => {
    e?.preventDefault();
    const s = sentence.trim();
    if (!s || busy) return;
    setBusy(true);
    setErr("");
    setPlan(null);
    trackEvent("ai_query", { kind: "flash" });

    const sys = lang === "ar"
      ? `أنت مسرّع تدخّل طبي ميداني (ولست محادثة). من جملة واحدة تُعطي بطاقة تدخّل قصوى الاختصار والدقة.
أجب فقط بـJSON صالح بهذا الشكل الدقيق:
{"diagnosticProbable":"...","gravite":"critique|urgent|relatif","sequence":[{"fenetre":"0-1 min","gestes":["..."]}],"doses":[{"molecule":"...","posologie":"...","voie":"IV|IM|PO|...","remarque":"..."}],"signesAlerte":["..."],"liens":[{"type":"protocole|arbre|calculateur","id":"...","pourquoi":"..."}]}
قواعد صارمة:
- الروابط من هذه القوائم فقط، بلا استثناء: protocoles=[${PROTOCOL_IDS.join(", ")}], arbres=[${TREE_IDS.join(", ")}], calculateurs=[${CALC_IDS.join(", ")}]
- الجرعات بالوحدات الدقيقة ولكل كغ إن أمكن، مشتقة من الوزن/العمر المعطى.
- التسلسل الزمني نوافذ قصيرة (0-1 min, 1-5 min, 5-15 min...).
- متحفظ: عند الشك اختر الأخطر. الالتزام بالمراجع الدولية (ERC/AHA/SSC/WHO).
- البنود قصيرة جدًا، قابلة للتنفيذ فوراً بيد واحدة. بالعربية الفصحى المبسطة.`
      : `Tu es un ACCÉLÉRATEUR d'intervention médicale de terrain (pas un chat). À partir d'UNE phrase, tu rends une fiche d'action ultra-courte et précise.
Réponds UNIQUEMENT en JSON valide, exactement :
{"diagnosticProbable":"...","gravite":"critique|urgent|relatif","sequence":[{"fenetre":"0-1 min","gestes":["..."]}],"doses":[{"molecule":"...","posologie":"...","voie":"IV|IM|PO|...","remarque":"..."}],"signesAlerte":["..."],"liens":[{"type":"protocole|arbre|calculateur","id":"...","pourquoi":"..."}]}
Règles strictes :
- liens UNIQUEMENT parmi : protocoles=[${PROTOCOL_IDS.join(", ")}], arbres=[${TREE_IDS.join(", ")}], calculateurs=[${CALC_IDS.join(", ")}]
- doses précises en mg/kg quand possible, dérivées du poids/âge fournis.
- séquence en fenêtres courtes (0-1 min, 1-5 min, 5-15 min…).
- prudent : en cas de doute, le pire d'abord. Références : ERC/AHA/SSC/OMS.
- items ultra-courts, exécutables une main. En français.`;

    const ctx = [s, age && `Âge: ${age}`, weight && `Poids: ${weight} kg`].filter(Boolean).join(" — ");
    try {
      const raw = await generateText(`Patient : ${ctx}`, sys);
      const m = raw.match(/\{[\s\S]*\}/);
      const parsed = m ? (JSON.parse(m[0]) as FlashPlan) : null;
      if (!parsed?.sequence?.length) throw new Error("format");
      // filtrer tout lien que le modèle aurait inventé
      parsed.liens = (parsed.liens ?? []).filter((l) => hrefOf(l));
      setPlan(parsed);
    } catch (e2) {
      setErr(e2 instanceof AiError ? t(`ai.error.${e2.code}`) : t("ai.error.parse"));
    } finally {
      setBusy(false);
    }
  };

  const ttsPlan = () => {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    if (!plan) return;
    const pieces = [
      plan.diagnosticProbable,
      ...(plan.sequence.flatMap((w) => [`${w.fenetre} : ${w.gestes.join(". ")}`])),
      ...(lang === "ar" ? ["الجرعات"] : ["Doses"]),
      ...plan.doses.map((d) => `${d.molecule} ${d.posologie} ${d.voie}${d.remarque ? ", " + d.remarque : ""}`),
    ];
    setSpeaking(true);
    speak(pieces.join(". "), lang);
    setSpeaking(false);
  };

  const g = plan ? GRAVITY[plan.gravite] ?? GRAVITY.urgent : null;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="rounded-xl bg-amber-500/15 p-2 text-amber-500"><Siren className="h-6 w-6" aria-hidden /></span>
          <T fr="Flash IA — une phrase, un plan" ar="ومضة AI — جملة واحدة، خطة" />
        </h1>
        <p className="mt-1 text-sm opacity-70">
          <T fr="Pas de discussion : décrivez le patient en une phrase (voix ou texte), obtenez immédiatement la séquence d'actions, les doses et les vérifications de terrain."
             ar="بلا محادثة: صِف المريض بجملة واحدة (صوت أو نص)، فتحصل فوراً على تسلسل الأفعال والجرعات والتحققات الميدانية." />
        </p>
      </header>

      <AiGate title={lang === "ar" ? "ومضة AI" : "Flash IA"}>
        {/* Saisie unique */}
        <form onSubmit={run} className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 print:hidden">
          <div className="flex items-start gap-2">
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              rows={2}
              placeholder={lang === "ar"
                ? "مثال: رجل 62 سنة، ألم صدري ضاغط منذ 40 دقيقة، تعرق، ضغط 90/60…"
                : "Ex : homme 62 ans, douleur thoracique constrictive depuis 40 min, sueurs, TA 90/60…"}
              className="min-h-[60px] flex-1 resize-none rounded-xl border border-line bg-surface2 px-3 py-3 text-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
            {dict.supported && (
              <button type="button" onClick={dict.toggle} aria-pressed={dict.listening}
                title={lang === "ar" ? "إملاء صوتي" : "Dictée vocale"}
                className={`touch shrink-0 rounded-xl border p-3 ${dict.listening ? "animate-pulse border-red-600 bg-red-600 text-white" : "border-line hover:bg-surface2"}`}>
                {dict.listening ? <MicOff className="h-6 w-6" aria-hidden /> : <Mic className="h-6 w-6" aria-hidden />}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)}
              placeholder={lang === "ar" ? "العمر" : "Âge"}
              className="w-24 rounded-xl border border-line bg-surface2 px-3 py-2 text-center outline-none focus:ring-2 focus:ring-amber-500" />
            <input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder={lang === "ar" ? "الوزن كغ" : "Poids kg"}
              className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 text-center outline-none focus:ring-2 focus:ring-amber-500" />
            <button type="submit" disabled={busy || !sentence.trim()}
              className="touch ms-auto gap-2 rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-black transition hover:bg-amber-400 disabled:opacity-40">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Siren className="h-5 w-5" aria-hidden />}
              {lang === "ar" ? "⚡ واجس!" : "⚡ GO"}
            </button>
          </div>
          {err && <p className="rounded-xl border border-red-600 bg-red-600/10 p-3 text-sm font-semibold text-red-500">{err}</p>}
        </form>

        {/* Carte d'intervention */}
        {plan && g && (
          <div className="flex flex-col gap-4">
            <div className={`rounded-2xl border-2 p-4 ${g.cls}`}>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <span className={`h-2.5 w-2.5 rounded-full ${g.dot}`} aria-hidden />
                {lang === "ar" ? g.ar : g.fr}
              </p>
              <h2 className="mt-1 text-2xl font-black leading-tight">{plan.diagnosticProbable}</h2>
              <p className="mt-1 text-xs opacity-70">
                <T fr="Aide indicative — à croiser avec le jugement clinique. Sources : contenus ERC/AHA/OMS du site." ar="مساعدة استرشادية — تقاطع مع الحكم السريري. المراجع من محتوى الموقع." />
              </p>
              <button onClick={ttsPlan} className="touch mt-3 gap-2 rounded-xl bg-black/20 px-4 py-2 text-sm font-bold hover:bg-black/30 print:hidden">
                {speaking ? <Square className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
                {lang === "ar" ? "اقرأ الخطة صوتياً" : "Lire le plan à voix haute"}
              </button>
            </div>

            {/* Séquence chronométrée */}
            <section className="rounded-2xl border border-line bg-surface p-4">
              <h3 className="flex items-center gap-2 font-bold"><Clock3 className="h-5 w-5 text-amber-500" aria-hidden /><T fr="Séquence d'actions" ar="تسلسل الأفعال" /></h3>
              <ol className="mt-3 space-y-3">
                {plan.sequence.map((w, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 rounded-lg bg-amber-500 px-2.5 py-1 font-mono text-sm font-black text-black h-fit">{w.fenetre}</span>
                    <ul className="min-w-0 flex-1 space-y-1">
                      {w.gestes.map((gst, j) => (
                        <li key={j} className="flex gap-2 text-base leading-snug">
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-teal-500 rtl:rotate-180" aria-hidden />
                          <span>{gst}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>

            {/* Doses */}
            {plan.doses?.length > 0 && (
              <section className="rounded-2xl border border-line bg-surface p-4">
                <h3 className="flex items-center gap-2 font-bold"><Pill className="h-5 w-5 text-teal-500" aria-hidden /><T fr="Doses suggérées" ar="الجرعات المقترحة" /></h3>
                <ul className="mt-3 divide-y divide-line">
                  {plan.doses.map((d, i) => (
                    <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                      <span className="font-bold">{d.molecule}</span>
                      <span className="font-mono font-black text-teal-500">{d.posologie} <span className="text-xs font-normal opacity-70">{d.voie}</span></span>
                      {d.remarque && <span className="w-full text-sm opacity-70">{d.remarque}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Red flags */}
            {plan.signesAlerte?.length > 0 && (
              <section className="rounded-2xl border-2 border-red-600/60 bg-red-600/5 p-4">
                <h3 className="flex items-center gap-2 font-bold text-red-500"><AlertOctagon className="h-5 w-5" aria-hidden /><T fr="Signes d'alerte à vérifier" ar="علامات إنذار يجب تفحصها" /></h3>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-base">
                  {plan.signesAlerte.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>
            )}

            {/* Liens vérifiés */}
            {plan.liens?.length > 0 && (
              <section className="grid gap-2 sm:grid-cols-2 print:hidden">
                {plan.liens.map((l, i) => {
                  const href = hrefOf(l);
                  if (!href) return null;
                  const Icon = l.type === "arbre" ? GitBranch : l.type === "calculateur" ? Calculator : ScrollText;
                  return (
                    <Link key={i} href={href} className="card flex items-start gap-2 rounded-xl border border-teal-600/50 bg-surface p-3 hover:border-teal-500">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" aria-hidden />
                      <span>
                        <span className="block text-sm font-bold">{titleOf(l, lang)}</span>
                        <span className="block text-xs opacity-60">{l.pourquoi}</span>
                      </span>
                    </Link>
                  );
                })}
              </section>
            )}
          </div>
        )}
      </AiGate>
      <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
    </div>
  );
}
