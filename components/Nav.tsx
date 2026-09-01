"use client";
// Navigation principale (barre latérale desktop / tiroir mobile).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScrollText, Pill, Calculator, Settings, HeartPulse, ClipboardList, Baby, HandHelping, Brain, Bone, Bot, GitBranch, Zap, Search } from "lucide-react";
import { useApp } from "./Providers";

export const NAV_ITEMS = [
  { href: "/", key: "nav.home", Icon: Home },
  { href: "/recherche", key: "nav.search", Icon: Search },
  { href: "/protocoles", key: "nav.protocols", Icon: ScrollText },
  { href: "/medicaments", key: "nav.medications", Icon: Pill },
  { href: "/calculateurs", key: "nav.calculators", Icon: Calculator },
  { href: "/ecg", key: "nav.ecg", Icon: HeartPulse },
  { href: "/procedures", key: "nav.procedures", Icon: ClipboardList },
  { href: "/arbres", key: "nav.trees", Icon: GitBranch },
  { href: "/pediatrie", key: "nav.pediatrie", Icon: Baby },
  { href: "/obstetrique", key: "nav.obstetrique", Icon: HandHelping },
  { href: "/psychiatrie", key: "nav.psychiatrie", Icon: Brain },
  { href: "/traumatologie", key: "nav.traumatologie", Icon: Bone },
  { href: "/flash-ia", key: "nav.flash", Icon: Zap },
  { href: "/ia", key: "nav.aiHub", Icon: Bot },
  { href: "/parametres", key: "nav.settings", Icon: Settings },
];

export default function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useApp();
  const pathname = usePathname();

  return (
    <nav aria-label={t("nav.navigation")} className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ href, key, Icon }) => {
        const activeItem = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={activeItem ? "page" : undefined}
            className={`touch gap-3 rounded-xl px-4 py-3 font-semibold transition ${
              activeItem ? "bg-teal-600 text-white" : "hover:bg-surface2"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
