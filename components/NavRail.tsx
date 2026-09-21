"use client";
// v15.0 — Navigation Rail M3 (bureau lg+) : 6 thèmes + recherche.
// Les outils n'ont pas d'onglet : grille d'outils dans l'Accueil + tiroir (mobile) + palette.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartPulse, Pill, ScrollText, BookOpen, ListChecks, Search } from "lucide-react";
import { useApp } from "./Providers";

const ITEMS = [
  { href: "/", key: "tab.home", Icon: Home },
  { href: "/rea", key: "tab.rea", Icon: HeartPulse },
  { href: "/medicaments", key: "tab.meds", Icon: Pill },
  { href: "/protocoles", key: "tab.protocols", Icon: ScrollText },
  { href: "/memo", key: "tab.memo", Icon: BookOpen },
  { href: "/checklists", key: "tab.checklists", Icon: ListChecks },
];

export default function NavRail() {
  const pathname = usePathname();
  const { t } = useApp();
  return (
    <aside
      aria-label={t("nav.navigation")}
      className="m3-rail hidden shrink-0 border-e border-line bg-surface/60 py-3 lg:flex lg:flex-col lg:items-center lg:gap-1"
    >
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("eutn:palette"))}
        className="m3-rail-item touch w-[72px]"
        aria-label={t("search.placeholder")}
        title={t("search.placeholder")}
      >
        <span className="m3-rail-ico"><Search className="h-5 w-5" aria-hidden /></span>
      </button>
      {ITEMS.map(({ href, key, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="m3-rail-item touch w-[72px]"
          >
            <span className="m3-rail-ico"><Icon className="h-5 w-5" aria-hidden /></span>
            <span>{t(key)}</span>
          </Link>
        );
      })}
    </aside>
  );
}
