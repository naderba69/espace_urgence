"use client";
// v15.0 — ثيم Réanimation (بنية A، قرار «إحالات منسّقة»): لوحة تجميع تُحيل إلى
// المحتوى الأصلي في ثيماته دون نسخ — صفر تكرار، روابط موجودة فعلاً (audit-links).
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import { HeartPulse, Wind, Syringe, ArrowUpRight, Activity } from "lucide-react";

type Row = { href: string; fr: string; ar: string; src: "protocoles" | "calculs" | "medicaments" | "procedures" };

const GROUPS: { title: { fr: string; ar: string }; Icon: typeof HeartPulse; rows: Row[] }[] = [
  {
    title: { fr: "Circulation d'arrêt", ar: "إنعاش قلبي" },
    Icon: HeartPulse,
    rows: [
      { href: "/protocoles/acr-adulte", fr: "ACR adulte", ar: "توقف القلب عند البالغ", src: "protocoles" },
      { href: "/protocoles/acr-pediatrique", fr: "ACR pédiatrique", ar: "توقف القلب عند الطفل", src: "protocoles" },
      { href: "/calculateurs/chrono-rcp", fr: "Chrono RCP", ar: "مؤقّت الإنعاش", src: "calculs" },
      { href: "/calculateurs/rcp-equipe", fr: "RCP en équipe", ar: "إنعاش جماعي", src: "calculs" },
      { href: "/calculateurs/rcp-peds", fr: "RCP pédiatrique", ar: "إنعاش الطفل", src: "calculs" },
    ],
  },
  {
    title: { fr: "Voie aérienne", ar: "الطريق الهوائي" },
    Icon: Wind,
    rows: [
      { href: "/calculateurs/rsi", fr: "RSI — induction séquence", ar: "التنبيب المتسلسل", src: "calculs" },
      { href: "/calculateurs/iot-rsi", fr: "IOT / RSI — repères", ar: "معالم التنبيب", src: "calculs" },
      { href: "/calculateurs/vni", fr: "VNI", ar: "التهوية غير الباضعة", src: "calculs" },
      { href: "/calculateurs/ventilateur", fr: "Ventilateur", ar: "المِنفاس", src: "calculs" },
      { href: "/procedures", fr: "Procédures", ar: "الإجراءات", src: "procedures" },
    ],
  },
  {
    title: { fr: "Médicaments & surveillance", ar: "أدوية ومراقبة" },
    Icon: Syringe,
    rows: [
      { href: "/medicaments/adrenaline", fr: "Adrénaline", ar: "أدرينالين", src: "medicaments" },
      { href: "/calculateurs/amines", fr: "Amines vasopressives", ar: "الأمينات المقبضة", src: "calculs" },
      { href: "/calculateurs/dose-check", fr: "Dose check", ar: "تدقيق الجرعة", src: "calculs" },
      { href: "/calculateurs/monitoring", fr: "Monitoring", ar: "المراقبة", src: "calculs" },
    ],
  },
  {
    title: { fr: "Renvois contextuels", ar: "إحالات سياقية" },
    Icon: ArrowUpRight,
    rows: [
      { href: "/protocoles/anaphylaxie", fr: "Anaphylaxie", ar: "الحساسية المفرطة", src: "protocoles" },
      { href: "/calculateurs/dose-anaphylaxie", fr: "Doses anaphylaxie", ar: "جرعات الحساسية", src: "calculs" },
      { href: "/protocoles/avc", fr: "AVC — code", ar: "السكتة الدماغية", src: "protocoles" },
      { href: "/calculateurs/hyperkalemie", fr: "Hyperkaliémie", ar: "فرط البوتاسيوم", src: "calculs" },
    ],
  },
];

const SRC_LABEL: Record<Row["src"], { fr: string; ar: string }> = {
  protocoles: { fr: "Protocoles", ar: "بروتوكولات" },
  calculs: { fr: "Calculs", ar: "حاسبات" },
  medicaments: { fr: "Médicaments", ar: "أدوية" },
  procedures: { fr: "Procédures", ar: "إجراءات" },
};

export default function ReaPage() {
  const { lang } = useApp();
  useRegisterRecent("outil:rea");
  const total = GROUPS.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<Activity className="h-6 w-6" />}
        title={lang === "ar" ? "الإنعاش — ما يُنفَّذ هذه الدقيقة" : "Réanimation — à la minute"}
        sub={lang === "ar" ? "إحالات مباشرة إلى المحتوى الأصلي في ثيماته" : "Renvois directs vers le contenu d'origine"}
        count={total}
      />

      {/* اختصارات النقر الواحد */}
      <nav aria-label={lang === "ar" ? "اختصارات" : "Raccourcis"} className="flex flex-wrap gap-2">
        {[
          { href: "/protocoles/acr-adulte", fr: "ACR adulte", ar: "ACR بالغ" },
          { href: "/calculateurs/rsi", fr: "RSI", ar: "RSI" },
          { href: "/calculateurs/chrono-rcp", fr: "Chrono RCP", ar: "مؤقّت RCP" },
        ].map((s) => (
          <Link key={s.href} href={s.href} className="touch rounded-full px-4 py-2 text-sm font-black transition active:scale-95" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            {lang === "ar" ? s.ar : s.fr}
          </Link>
        ))}
      </nav>

      {GROUPS.map(({ title, Icon, rows }) => (
        <section key={title.fr} aria-label={title.fr}>
          <h2 className="mb-2 flex items-center gap-2 border-s-4 ps-3 text-base font-bold" style={{ borderColor: "var(--accent)" }}>
            <Icon className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden />
            {lang === "ar" ? title.ar : title.fr}
          </h2>
          <ul className="grid gap-2.5">
            {rows.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="card flex min-h-[60px] items-center gap-3 rounded-2xl border border-line bg-surface p-3 font-semibold hover:border-blue-600/50"
                >
                  <span className="min-w-0 flex-1 break-words text-sm leading-snug">{lang === "ar" ? r.ar : r.fr}</span>
                  <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-black opacity-70">
                    {lang === "ar" ? SRC_LABEL[r.src].ar : SRC_LABEL[r.src].fr}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
