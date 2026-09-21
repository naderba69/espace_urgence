"use client";
// Navigation principale : groupes modernes — barre latérale desktop / tiroir mobile.
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ScrollText, Pill, Calculator, Settings, HeartPulse, ClipboardList,
  Baby, HandHelping, Brain, Bone, Bot, GitBranch, Zap, Search, ListChecks, FileText, BookOpen, RefreshCcw,
} from "lucide-react";
import { useApp } from "./Providers";
import InstallPwa from "./InstallPwa";

export const NAV_GROUPS: {
  key: string;
  items: { href: string; key: string; Icon: typeof Home; badge?: boolean }[];
}[] = [
  {
    key: "nav.group.main",
    items: [
      { href: "/", key: "nav.home", Icon: Home },
      { href: "/recherche", key: "nav.search", Icon: Search },
    ],
  },
  {
    key: "nav.group.themes",
    items: [
      { href: "/rea", key: "nav.rea", Icon: HeartPulse },
      { href: "/protocoles", key: "nav.protocols", Icon: ScrollText },
      { href: "/medicaments", key: "nav.medications", Icon: Pill },
      { href: "/memo", key: "nav.memo", Icon: BookOpen },
      { href: "/checklists", key: "nav.checklists", Icon: ListChecks, badge: true },
    ],
  },
  {
    key: "nav.group.spec",
    items: [
      { href: "/pediatrie", key: "nav.pediatrie", Icon: Baby },
      { href: "/obstetrique", key: "nav.obstetrique", Icon: HandHelping },
      { href: "/psychiatrie", key: "nav.psychiatrie", Icon: Brain },
      { href: "/traumatologie", key: "nav.traumatologie", Icon: Bone },
      { href: "/triage", key: "nav.triage", Icon: Bot },
    ],
  },
  {
    key: "nav.group.tools",
    items: [
      { href: "/calculateurs", key: "nav.calculators", Icon: Calculator },
      { href: "/fiche-samu", key: "nav.fiche", Icon: FileText, badge: true },
      { href: "/reevaluation", key: "nav.reevaluation", Icon: RefreshCcw },
      { href: "/resume", key: "nav.resume", Icon: ClipboardList },
      { href: "/guidage", key: "nav.guidage", Icon: Zap },
      { href: "/ecg", key: "nav.ecg", Icon: HeartPulse },
      { href: "/procedures", key: "nav.procedures", Icon: ClipboardList },
      { href: "/arbres", key: "nav.trees", Icon: GitBranch },
      { href: "/flash-ia", key: "nav.flash", Icon: Zap },
      { href: "/ia", key: "nav.aiHub", Icon: Bot },
      { href: "/parametres", key: "nav.settings", Icon: Settings },
    ],
  },
];

export default function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav aria-label={t("nav.navigation")} className="flex flex-col gap-4 p-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.key}>
          <p className="mb-1.5 px-3 text-[11px] font-black uppercase tracking-[0.14em] opacity-40">
            {t(group.key)}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, key, Icon, badge }) => {
              const activeItem = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={activeItem ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-200 ${
                      activeItem
                        ? "bg-gradient-to-r from-blue-600/15 to-sky-500/5 text-blue-600 dark:text-blue-400"
                        : "opacity-75 hover:bg-surface2 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        activeItem
                          ? "bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-surface2 text-current group-hover:text-blue-500"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 break-words text-[11px] leading-tight">{t(key)}</span>
                    {badge && (
                      <span className="rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-sm">
                        new
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="px-2 pb-2 pt-1">
        <InstallPwa variant="drawer" />
      </div>
    </nav>
  );
}
