"use client";
// v17.0 — Corps de la palette de commandes (Ctrl/Cmd+K) : saut rapide — navigation
// + références + actions. Clavier : ↑ ↓ naviguer, Entrée choisir, Échap fermer.
// Bilingue + RTL + a11y.
//
// ⚠️ Ce composant est chargé en import() dynamique depuis components/CommandPalette.tsx :
// ne l'importer statiquement nulle part (sinon l'index de recherche revient dans le
// bundle partagé et l'optimisation est perdue).
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, CornerDownLeft, Siren, Moon, Sun, Volume2, VolumeX, Languages,
  ScrollText, Pill, Calculator, ClipboardList, HeartPulse, GitBranch, Sparkles, Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "./Providers";
import { NAV_GROUPS } from "./Nav";
import { loadSearchIndex, normalize, searchItems, type SearchItem } from "@/lib/search";
import { trackEvent } from "@/lib/analytics";
import { uiClick } from "@/lib/audio";

interface Entry {
  id: string;
  group: "content" | "nav" | "actions";
  label: string;
  sub?: string;
  Icon: LucideIcon;
  run: () => void;
}

const TYPE_ICON: Record<SearchItem["type"], LucideIcon> = {
  protocole: ScrollText,
  medicament: Pill,
  calculateur: Calculator,
  procedure: ClipboardList,
  ecg: HeartPulse,
  arbre: GitBranch,
  outil: Sparkles,
  guidage: Stethoscope,
};

export default function CommandPaletteBody({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, prefs, setPref, setEmergencyOpen } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [indexReady, setIndexReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // v17.0 — l'index de recherche arrive en import() dynamique : on l'attend une fois.
  useEffect(() => {
    let alive = true;
    loadSearchIndex()
      .then(() => alive && setIndexReady(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  // Reset à chaque ouverture (fait côté effet de bord, pas dans le rendu)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setQ("");
      setActive(0);
    }
    wasOpen.current = open;
  }, [open]);

  // Focus + suivi à l'ouverture
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    trackEvent("palette_open");
  }, [open]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const entries = useMemo<Entry[]>(() => {
    const nq = normalize(q);
    const nav: Entry[] = NAV_GROUPS.flatMap((g) => g.items).map(({ href, key, Icon }) => ({
      id: `nav:${href}`,
      group: "nav",
      label: t(key),
      Icon,
      run: () => go(href),
    }));
    const actions: Entry[] = [
      { id: "act:sos", group: "actions", label: t("emergency.open"), Icon: Siren, run: () => { onClose(); setEmergencyOpen(true); } },
      {
        id: "act:theme", group: "actions", label: t("settings.theme"), Icon: prefs.theme === "light" ? Moon : Sun,
        run: () => { setPref("theme", prefs.theme === "light" ? "dark" : "light"); onClose(); },
      },
      {
        id: "act:lang", group: "actions", label: t("settings.language"), Icon: Languages,
        run: () => { setPref("lang", prefs.lang === "fr" ? "ar" : "fr"); onClose(); },
      },
      {
        id: "act:mute", group: "actions", label: prefs.muted ? t("common.mute.on") : t("common.mute.off"), Icon: prefs.muted ? Volume2 : VolumeX,
        run: () => { setPref("muted", !prefs.muted); onClose(); },
      },
    ];

    if (!nq) return [...nav, ...actions];

    const content: Entry[] = (indexReady ? searchItems(q, 10) : []).map((it) => ({
      id: it.key,
      group: "content",
      label: (lang === "ar" ? it.title.ar : it.title.fr) + (it.sev === "critical" ? " · ⚠" : ""),
      sub: it.type === "protocole" ? t("nav.protocols") : it.type === "medicament" ? t("nav.medications") : it.type === "procedure" ? t("nav.procedures") : it.type === "arbre" ? t("nav.trees") : it.type === "ecg" ? "ECG" : t("nav.calculators"),
      Icon: TYPE_ICON[it.type],
      run: () => go(it.href),
    }));
    const navF = nav.filter((e) => normalize(e.label).includes(nq));
    const actF = actions.filter((e) => normalize(e.label).includes(nq));
    return [...content, ...navF, ...actF];
  }, [q, lang, prefs, t, indexReady]); // eslint-disable-line react-hooks/exhaustive-deps -- les closures `go`/`onClose` sont stables par construction

  // Garde l'item actif visible
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, entries.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && entries[active]) { e.preventDefault(); uiClick(); entries[active].run(); }
  };

  const GROUP_LABEL = { content: t("palette.content"), nav: t("palette.nav"), actions: t("palette.actions") } as const;
  const groups: Entry["group"][] = ["content", "nav", "actions"];
  let idx = -1;

  return (
    <div className="fixed inset-0 z-[65] lg:flex lg:items-start lg:justify-center lg:pt-[12vh]" role="dialog" aria-modal="true" aria-label={t("palette.open")}>
      {/* backdrop */}
      <button aria-label="fermer" onClick={onClose} className="eutn-backdrop absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      {/* panneau */}
      <div className="eutn-drawer relative m-auto flex max-h-[80vh] w-[min(92vw,42rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKey}
            placeholder={t("palette.placeholder")}
            aria-label={t("palette.open")}
            className="w-full bg-transparent py-4 outline-none"
          />
          <kbd className="pointer-events-none hidden shrink-0 rounded-md border border-line bg-surface2 px-1.5 py-0.5 text-[10px] font-black opacity-60 sm:block">ESC</kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {entries.length === 0 && <p className="p-4 text-sm opacity-60">{t("palette.empty")}</p>}
          {groups.map((g) => {
            const items = entries.filter((e) => e.group === g);
            if (items.length === 0) return null;
            return (
              <div key={g} className="mb-1">
                <p className="px-2 pb-1 pt-2 text-[11px] font-black uppercase tracking-[0.14em] opacity-40">{GROUP_LABEL[g]}</p>
                {items.map((e) => {
                  idx += 1;
                  const i = idx;
                  return (
                    <button
                      key={e.id}
                      data-idx={i}
                      onClick={() => { uiClick(); e.run(); }}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start ${i === active ? "bg-blue-600/15 text-blue-600 dark:text-blue-400" : "hover:bg-surface2"}`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${i === active ? "bg-gradient-to-br from-blue-500 to-sky-600 text-white" : "bg-surface2"}`}>
                        <e.Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 line-clamp-2 font-semibold">{e.label}</span>
                      {e.sub && <span className="shrink-0 text-xs opacity-50">{e.sub}</span>}
                      {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 opacity-60" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
