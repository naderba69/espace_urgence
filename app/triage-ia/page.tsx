"use client";
import Link from "next/link";
import { ListFilter, ShieldAlert } from "lucide-react";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import { resolveRefLinks, useRefIndexMap } from "@/lib/ref-index";

// Aucun niveau de triage ni délai n'est décidé par un modèle de langage.
const PROTOCOL_IDS = ["acr-adulte", "anaphylaxie", "avc", "choc-septique", "polytraumatisme"];

export default function TriagePage() {
  const { lang } = useApp();
  const refs = useRefIndexMap();
  const protocols = resolveRefLinks(refs, "protocole", PROTOCOL_IDS);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold"><ListFilter className="h-7 w-7 text-blue-500" aria-hidden /><T fr="Triage IA — suspendu" ar="الفرز بالذكاء الاصطناعي — معلّق" /></h1>
      <section role="alert" className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5">
        <h2 className="flex items-center gap-2 font-black text-red-500"><ShieldAlert className="h-5 w-5" aria-hidden /><T fr="Aucune orientation ou couleur de triage n'est calculée" ar="لا يتم حساب أي توجيه أو لون للفرز" /></h2>
        <p className="mt-2 leading-relaxed"><T fr="L'attribution automatique d'une catégorie (rouge, orange ou vert), d'un délai ou de gestes par un modèle génératif est désactivée. Cette page ne remplace pas le triage réalisé par un professionnel selon le protocole local." ar="تم إيقاف إسناد فئة (أحمر أو برتقالي أو أخضر) أو مهلة أو إجراءات بواسطة نموذج توليدي. لا تعوّض هذه الصفحة الفرز الذي يجريه مهني وفق البروتوكول المحلي." /></p>
        <p className="mt-3 font-bold"><T fr="En cas de signe de gravité ou de doute, alertez immédiatement l'équipe responsable et utilisez la procédure locale." ar="عند وجود علامة خطورة أو شك، نبّه الفريق المسؤول فوراً واتبع الإجراء المحلي." /></p>
      </section>
      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-bold"><T fr="Protocoles consultables" ar="البروتوكولات المتاحة" /></h2>
        <ul className="flex flex-wrap gap-2">
          {protocols.map((p) => <li key={p.key}><Link className="inline-flex min-h-11 items-center rounded-xl border border-line bg-surface2 px-4 py-2 font-semibold hover:border-blue-500" href={p.href}>{p.title[lang]}</Link></li>)}
        </ul>
        {protocols.length === 0 && <p className="text-sm opacity-70"><T fr="Chargement des références…" ar="جارٍ تحميل المراجع…" /></p>}
      </section>
      <p className="text-xs opacity-60"><T fr="Outil d'information uniquement, sans décision médicale automatisée." ar="للاطلاع فقط، دون قرار طبي آلي." /></p>
    </div>
  );
}
