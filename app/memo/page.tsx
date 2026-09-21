"use client";
// v15.0 — ثيم Fiches mémo (بنية A): قراءة صامتة ومراجعة — quiz/revision/ECG/إحصاء
// + جدول الثوابت الطبيعية (انتقل من الرئيسية: المحتوى محفوظ حرفياً، الموضع العقلاني).
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, GraduationCap, ArrowUpRight, Table2 } from "lucide-react";
import { vitalSigns } from "@/data/quickref";

const LINK_GROUPS: { title: { fr: string; ar: string }; Icon: typeof BookOpen; rows: { href: string; fr: string; ar: string }[] }[] = [
  {
    title: { fr: "Révision", ar: "المراجعة" },
    Icon: GraduationCap,
    rows: [
      { href: "/revisions", fr: "Suivi des révisions", ar: "تتبّع المراجعة", },
      { href: "/revision", fr: "Fiches de révision", ar: "بطاقات المراجعة" },
      { href: "/quiz", fr: "Quiz — tester ses acquis", ar: "اختبر معارفك" },
    ],
  },
  {
    title: { fr: "Lecture calme", ar: "قراءة هادئة" },
    Icon: BookOpen,
    rows: [
      { href: "/ecg", fr: "Fiches ECG", ar: "بطاقات ECG" },
      { href: "/calculateurs/ecg-grid", fr: "Grille ECG", ar: "شبكة ECG" },
      { href: "/stats", fr: "Statistiques du contenu", ar: "إحصاء المحتوى" },
    ],
  },
];

export default function MemoPage() {
  const { lang } = useApp();
  useRegisterRecent("outil:memo");
  const total = LINK_GROUPS.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<BookOpen className="h-6 w-6" />}
        title={lang === "ar" ? "مذكّرة — قراءة ومراجعة" : "Mémo — lecture & révision"}
        sub={lang === "ar" ? "ما تقرأه بهدوء: بطاقات، اختبارات، ثوابت" : "À lire posément : fiches, quiz, constantes"}
        count={total}
      />

      {LINK_GROUPS.map(({ title, Icon, rows }) => (
        <section key={title.fr} aria-label={title.fr}>
          <h2 className="mb-2 flex items-center gap-2 border-s-4 ps-3 text-base font-bold" style={{ borderColor: "var(--accent)" }}>
            <Icon className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden />
            {lang === "ar" ? title.ar : title.fr}
          </h2>
          <ul className="grid gap-2.5">
            {rows.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="card flex min-h-[60px] items-center gap-3 rounded-2xl border border-line bg-surface p-3 font-semibold hover:border-blue-600/50">
                  <span className="min-w-0 flex-1 break-words text-sm leading-snug">{lang === "ar" ? r.ar : r.fr}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* ── الثوابت الطبيعية (منقولة من الرئيسية في v15.0 — محتوى واحد لا يتكرر) ── */}
      <section aria-label={lang === "ar" ? "الثوابت الطبيعية" : "Constantes normales"} className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
          <Table2 className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden />
          {lang === "ar" ? "الثوابت الطبيعية" : "Constantes normales"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-start opacity-70">
                <th className="p-2 text-start"></th>
                <th className="p-2 text-start">{lang === "ar" ? "بالغ" : "Adulte"}</th>
                <th className="p-2 text-start">{lang === "ar" ? "طفل" : "Enfant"}</th>
                <th className="p-2 text-start">{lang === "ar" ? "رضيع" : "Nourrisson"}</th>
                <th className="p-2 text-start">{lang === "ar" ? "حديث الولادة" : "Nouveau-né"}</th>
              </tr>
            </thead>
            <tbody>
              {vitalSigns.map((v) => (
                <tr key={v.label.fr} className="border-b border-line/50 last:border-0">
                  <td className="p-2 font-medium">{lang === "ar" ? v.label.ar : v.label.fr}</td>
                  <td className="p-2 tabular-nums">{v.adult}</td>
                  <td className="p-2 tabular-nums">{v.child}</td>
                  <td className="p-2 tabular-nums">{v.infant}</td>
                  <td className="p-2 tabular-nums">{v.newborn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
