"use client";
import Link from "next/link";
import { Siren, ShieldAlert } from "lucide-react";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { resolveRefLinks, useRefIndexMap } from "@/lib/ref-index";

// Liste statique de raccourcis éditorialisés. Aucun diagnostic ni dosage n'est généré ici.
const PROTOCOL_IDS = ["acr-adulte", "anaphylaxie", "avc", "choc-septique", "polytraumatisme"];

export default function FlashIaPage() {
  const { lang } = useApp();
  const refs = useRefIndexMap();
  const protocols = resolveRefLinks(refs, "protocole", PROTOCOL_IDS);

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="rounded-xl bg-amber-500/15 p-2 text-amber-500"><Siren className="h-6 w-6" aria-hidden /></span>
          <T fr="Flash IA — suspendu" ar="ومضة الذكاء الاصطناعي — معلّقة" />
        </h1>
        <p className="mt-2 text-sm opacity-70"><T fr="La génération automatique de plans de soins est désactivée." ar="تم إيقاف إنشاء خطط العلاج تلقائياً." /></p>
      </header>

      <section role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5">
        <h2 className="flex items-center gap-2 font-black text-red-500"><ShieldAlert className="h-5 w-5" aria-hidden /><T fr="Aucune dose ne doit être proposée par un modèle génératif" ar="يُمنع اعتماد جرعات يقترحها نموذج توليدي" /></h2>
        <p className="mt-2 leading-relaxed">
          <T fr="Cet outil ne classe plus les patients et ne produit plus de diagnostic, de geste, de voie d'administration ou de posologie. Une reprise nécessitera des règles déterministes, des sources à jour et une validation clinique locale." ar="لم تعد هذه الأداة تصنّف المرضى أو تقترح تشخيصاً أو إجراءً أو طريق إعطاء أو جرعة. لن تُعاد إلا بعد إضافة قواعد حتمية ومراجع حديثة ومراجعة سريرية محلية." />
        </p>
        <p className="mt-3 text-sm font-bold"><T fr="En situation urgente, appliquez les procédures locales et sollicitez immédiatement l'équipe médicale responsable." ar="في الحالة الاستعجالية، اتبع الإجراءات المحلية واتصل فوراً بالفريق الطبي المسؤول." /></p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-bold"><T fr="Accès direct aux protocoles (à consulter et appliquer selon le contexte)" ar="روابط مباشرة للبروتوكولات (تُراجع وتُطبّق حسب الحالة)" /></h2>
        <ul className="flex flex-wrap gap-2">
          {protocols.map((p) => <li key={p.key}><Link className="inline-flex min-h-11 items-center rounded-xl border border-line bg-surface2 px-4 py-2 font-semibold hover:border-blue-500" href={p.href}>{p.title[lang]}</Link></li>)}
        </ul>
        {protocols.length === 0 && <p className="text-sm opacity-70"><T fr="Chargement des références…" ar="جارٍ تحميل المراجع…" /></p>}
      </section>
    </div>
  );
}
