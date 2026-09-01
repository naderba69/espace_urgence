"use client";
// Aide au triage IA : plainte + constantes → catégorie couleur + gestes + protocoles liés.
import { useState } from "react";
import Link from "next/link";
import AiGate from "@/components/ai/AiGate";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { generateText, AiError } from "@/lib/ai";
import { getProtocol } from "@/data/protocols";
import { trackEvent } from "@/lib/analytics";
import { Loader2, ListFilter } from "lucide-react";

interface TriageResult {
  category: "rouge" | "orange" | "vert";
  justification: string;
  actions: string[];
  protocolIds: string[];
}

const CAT = {
  rouge: { cls: "bg-red-600", fr: "ROUGE — vital engagé, prise en charge immédiate", ar: "أحمر — خطر حيوي، تدخل فوري" },
  orange: { cls: "bg-orange-500", fr: "ORANGE — urgences relatives, délai court", ar: "برتقالي — عاجل نسبي، مهلة قصيرة" },
  vert: { cls: "bg-teal-600", fr: "VERT — peut attendre (réévaluation programmée)", ar: "أخضر — يمكنه الانتظار (إعادة تقييم)" },
} as const;

export default function TriagePage() {
  const { t, lang } = useApp();
  const [motif, setMotif] = useState("");
  const [vitals, setVitals] = useState({ fc: "", fr: "", ta: "", spo2: "", gcs: "" });
  const [res, setRes] = useState<TriageResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const run = async () => {
    if (!motif.trim() || busy) return;
    setBusy(true);
    setErr("");
    setRes(null);
    trackEvent("ai_query", { kind: "triage" });
    const sys =
      lang === "ar"
        ? `أنت خبير فرز استعجالي (تصنيف الفرز الفرنسي 3 مستويات). من الشكوى والعلامات، قرر الفئة (روج/أورانج/فير). أجب فقط بـJSON: {"category":"rouge|orange|vert","justification":"...","actions":["..."],"protocolIds":[من: acr-adulte, acr-pediatrique, anaphylaxie, sca-stemi, avc, hyperkaliemie, oap, etat-mal-epileptique, asthme-aigu-grave, choc-septique, acidocetose-diabetique, deshydratation-enfant, polytraumatisme, traumatisme-cranien, brulure-grave, eclampsie, hemorragie-post-partum, agitation-aigue, intoxication-paracetamol, intoxication-organophosphores]}. كن محافظاً: عند الشك، الفئة الأشد. بالعربية.`
        : `Tu es un expert du triage aux urgences (triage français à 3 niveaux de couleur). À partir du motif et des constantes (éventuellement vides), décide la catégorie. Réponds UNIQUEMENT en JSON : {"category":"rouge|orange|vert","justification":"...","actions":["..."],"protocolIds":[parmi: acr-adulte, acr-pediatrique, anaphylaxie, sca-stemi, avc, hyperkaliemie, oap, etat-mal-epileptique, asthme-aigu-grave, choc-septique, acidocetose-diabetique, deshydratation-enfant, polytraumatisme, traumatisme-cranien, brulure-grave, eclampsie, hemorragie-post-partum, agitation-aigue, intoxication-paracetamol, intoxication-organophosphores]}. Sois prudent : en cas de doute, la catégorie la plus grave emporte. En français.`;
    const vit = `FC ${vitals.fc || "?"} /min, FR ${vitals.fr || "?"} /min, TA ${vitals.ta || "?"} mmHg, SpO2 ${vitals.spo2 || "?"} %, GCS ${vitals.gcs || "?"}`;
    try {
      const raw = await generateText(`Motif : ${motif}\nConstantes : ${vit}`, sys);
      const m = raw.match(/\{[\s\S]*\}/);
      const parsed = m ? (JSON.parse(m[0]) as TriageResult) : null;
      if (!parsed || !CAT[parsed.category]) throw new Error("format");
      setRes(parsed);
    } catch (e) {
      setErr(e instanceof AiError ? t(`ai.error.${e.code}`) : t("ai.error.provider"));
    } finally {
      setBusy(false);
    }
  };

  const protocols = res?.protocolIds.map(getProtocol).filter(Boolean) ?? [];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold"><ListFilter className="h-7 w-7 text-teal-500" /> {t("ai.triage.title")}</h1>
      <AiGate title={t("ai.triage.title")}>
        <div className="card flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
          <label className="flex flex-col gap-1 font-semibold">
            <T fr="Motif / plainte principale" ar="الشكوى الرئيسية" />
            <textarea value={motif} onChange={(e) => setMotif(e.target.value)} rows={3}
              placeholder={lang === "ar" ? "مثال: رجل 67س، ألم صدري ضاغط منذ ساعتين مع تعرق…" : "Ex. : homme 67 ans, douleur thoracique constrictive depuis 2 h, sueurs…"}
              className="rounded-xl border border-line bg-surface2 px-3 py-3 outline-none focus:ring-2 focus:ring-teal-600" />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(["fc", "fr", "ta", "spo2", "gcs"] as const).map((k) => (
              <label key={k} className="flex flex-col gap-1 text-xs font-bold">
                {k.toUpperCase()}
                <input value={vitals[k]} onChange={(e) => setVitals((v) => ({ ...v, [k]: e.target.value }))} inputMode="decimal"
                  className="rounded-xl border border-line bg-surface2 px-2 py-2 text-center tabular-nums outline-none focus:ring-2 focus:ring-teal-600" />
              </label>
            ))}
          </div>
          <button onClick={() => void run()} disabled={busy || !motif.trim()}
            className="touch gap-2 self-start rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-500 disabled:opacity-40">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
            {t("common.calculate")}
          </button>
          {err && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-400">{err}</p>}
        </div>

        {res && (
          <div className={`rounded-2xl p-5 text-white ${CAT[res.category].cls}`}>
            <p className="text-xl font-black">{lang === "ar" ? CAT[res.category].ar : CAT[res.category].fr}</p>
            <p className="mt-1 text-sm opacity-90">{res.justification}</p>
            {res.actions.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 ps-5 text-sm font-semibold">
                {res.actions.slice(0, 5).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )}
            {protocols.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {protocols.map((p) => p && (
                  <Link key={p.id} href={`/protocoles/${p.id}`} className="rounded-full bg-black/25 px-4 py-2 text-sm font-bold">
                    {lang === "ar" ? p.title.ar : p.title.fr}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="text-xs opacity-60">{t("common.disclaimer")}</p>
      </AiGate>
    </div>
  );
}
