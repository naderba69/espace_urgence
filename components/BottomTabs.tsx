"use client";
// Barre d'onglets inférieure mobile — navigation native (5 destinations clés).
// « Plus » ouvre le tiroir complet via l'événement eutn:drawer (écouté par Header).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScrollText, Pill, Calculator, LayoutGrid } from "lucide-react";
import { useApp } from "./Providers";

const TABS = [
  { href: "/", key: "tab.home", Icon: Home },
  { href: "/protocoles", key: "tab.protocols", Icon: ScrollText },
  { href: "/medicaments", key: "tab.meds", Icon: Pill },
  { href: "/calculateurs", key: "tab.calc", Icon: Calculator },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav
      aria-label={t("nav.navigation")}
      className="eutn-tabs no-print fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-surface/85 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-xl grid-cols-5">
        {TABS.map(({ href, key, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="eutn-tab touch flex-col gap-0.5 rounded-none py-1.5 text-[9px] font-bold leading-none"
            >
              <span className={`tab-ico flex items-center justify-center rounded-full px-4 py-1 transition-all duration-200 ${active ? "bg-teal-600/15 text-teal-500" : "opacity-70"}`}>
                <Icon className="h-[21px] w-[21px]" aria-hidden />
              </span>
              <span className={active ? "text-teal-500" : "opacity-70"}>{t(key)}</span>
            </Link>
          );
        })}
        {/* Plus → tiroir complet */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("eutn:drawer"))}
          className="eutn-tab touch flex-col gap-0.5 rounded-none py-1.5 text-[9px] font-bold leading-none"
          aria-label={t("nav.more")}
        >
          <span className="tab-ico flex items-center justify-center rounded-full px-4 py-1 opacity-70 transition-all duration-200">
            <LayoutGrid className="h-[21px] w-[21px]" aria-hidden />
          </span>
          <span className="opacity-70">{t("nav.more")}</span>
        </button>
      </div>
    </nav>
  );
}
