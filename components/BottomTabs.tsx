"use client";
// v15.0 — بنية A : 6 تبويبات مباشرة (Accueil · Réa · Médicaments · Protocoles · Mémo · Checklist).
// الأدوات بلا تبويب: شبكة الأدوات في الرئيسية + الدرج (hamburger) + الاستدعاء السياقي.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HeartPulse, Pill, ScrollText, BookOpen, ListChecks } from "lucide-react";
import { useApp } from "./Providers";

const TABS = [
  { href: "/", key: "tab.home", Icon: Home },
  { href: "/rea", key: "tab.rea", Icon: HeartPulse },
  { href: "/medicaments", key: "tab.meds", shortKey: "tab.meds.short", Icon: Pill },
  { href: "/protocoles", key: "tab.protocols", shortKey: "tab.protocols.short", Icon: ScrollText },
  { href: "/memo", key: "tab.memo", Icon: BookOpen },
  { href: "/checklists", key: "tab.checklists", shortKey: "tab.checklists.short", Icon: ListChecks },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav
      aria-label={t("nav.navigation")}
      className="eutn-tabs fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-surface/85 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-xl grid-cols-6">
        {TABS.map(({ href, key, shortKey, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={t(key)}
              title={t(key)}
              className="eutn-tab touch min-w-0 flex-col gap-0.5 rounded-none py-1.5 text-[11px] font-bold leading-tight"
            >
              <span style={active ? { background: "var(--accent-soft)", color: "var(--accent)" } : undefined}
              className={`tab-ico flex items-center justify-center rounded-full px-2.5 py-1 transition-all duration-200 sm:px-3.5 ${active ? "" : "opacity-70"}`}>
                <Icon className="h-[21px] w-[21px]" aria-hidden />
              </span>
              {/* w-full + truncate : aucun libellé ne peut déborder la barre (garanti 320 px) */}
              <span style={active ? { color: "var(--accent)" } : undefined}
                className={`w-full max-w-full truncate text-center ${active ? "" : "opacity-70"}`}>{t(shortKey ?? key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
