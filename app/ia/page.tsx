"use client";
// Hub des fonctions IA (toutes optionnelles, dégradation gracieuse).
import Link from "next/link";
import { Bot, BrainCircuit, Camera, ListFilter, FileText, GraduationCap, Zap } from "lucide-react";
import { useApp } from "@/components/Providers";
import T from "@/components/T";

const TOOLS = [
  { href: "/flash-ia", Icon: Zap, fr: "⚡ Flash IA — une phrase, un plan", ar: "⚡ ومضة AI — جملة واحدة، خطة", dFr: "Décrivez le patient → séquence chronométrée, doses et liens vérifiés", dAr: "صِف المريض ← تسلسل موقوت وجرعات وروابط موثقة" },
  { href: "/ecg-analyzer", Icon: Camera, fr: "Analyseur ECG par photo", ar: "محلّل تخطيط القلب بالصورة", dFr: "Capture caméra + lecture structurée + historique local", dAr: "التقاط بالكاميرا + قراءة منظمة + سجل محلي" },
  { href: "/triage-ia", Icon: ListFilter, fr: "Aide au triage", ar: "مساعد الفرز", dFr: "Plainte + constantes →priorité suggérée + 1ers gestes", dAr: "الشكوى + علامات ← أولوية مقترحة + إجراءات أولى" },
  { href: "/rapport-ia", Icon: FileText, fr: "Transmission / compte rendu", ar: "تبليغ / تقرير", dFr: "Note de passation structurée, copiable et imprimable", dAr: "مذكرة تسليم منظمة قابلة للنسخ والطباعة" },
  { href: "/quiz-ia", Icon: GraduationCap, fr: "Quiz de révision", ar: "اختبار مراجعة", dFr: "QCM générés depuis le contenu du site", dAr: "أسئلة مولّدة من محتوى الموقع" },
  { href: "/calculateurs/renal-dose", Icon: BrainCircuit, fr: "Expliquer un résultat rénal", ar: "شرح نتيجة كلوية", dFr: "Dans le calculateur : expliquer la sélection de plage, sans choisir une dose", dAr: "داخل الحاسبة: شرح اختيار المجال دون تحديد جرعة" },
  { href: "/calculateurs/antibio-renal", Icon: BrainCircuit, fr: "Expliquer un calcul pondéral", ar: "شرح حساب الجرعة بالوزن", dFr: "Dans le tableau rénal : expliquer le calcul source déjà affiché, sans le refaire", dAr: "داخل الجدول الكلوي: شرح الحساب المعروض من المصدر دون إعادته" },
];

export default function IaHubPage() {
  const { t, lang } = useApp();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="rounded-2xl bg-blue-600/15 p-3 text-blue-500"><Bot className="h-7 w-7" aria-hidden /></span>
        <div>
          <h1 className="text-2xl font-extrabold">{t("ai.hub.title")}</h1>
          <p className="text-sm opacity-70">{t("ai.hub.desc")}</p>
        </div>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map(({ href, Icon, fr, ar, dFr, dAr }) => (
          <li key={href}>
            <Link href={href} className="card flex h-full items-start gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-blue-600 transition">
              <span className="rounded-xl bg-blue-600/15 p-2.5 text-blue-500"><Icon className="h-6 w-6" aria-hidden /></span>
              <span>
                <span className="block font-bold">{lang === "ar" ? ar : fr}</span>
                <span className="mt-1 block text-sm opacity-70">{lang === "ar" ? dAr : <T fr={dFr} ar={dAr} />}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-xs opacity-60"><T fr="Les explications intégrées aux deux calculateurs rénaux sont facultatives : elles ne recalculent pas et ne recommandent pas de dose. Pour ces explications, chaque envoi de contexte médical au fournisseur demande une confirmation explicite." ar="الشرح المدمج في الحاسبتين الكلويتين اختياري: لا يعيد الحساب ولا يوصي بجرعة. ويتطلب إرسال السياق الطبي في هذين الشرحين تأكيداً صريحاً." /></p>
    </div>
  );
}
