"use client";
// Abréviation cliquable : affiche une fiche (développé + détail) au tap.
// Usage : <Abbr k="PAM" /> — ou auto-détection via <AbbrText>texte</AbbrText>.
import { useEffect, useRef, useState, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import { useApp } from "@/components/Providers";
import { ABBREVIATIONS, getAbbr, type AbbrEntry } from "@/data/abbr";
import { X } from "lucide-react";

export function Abbr({ k, children }: { k: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { lang } = useApp();
  const ref = useRef<HTMLSpanElement>(null);
  const entry = getAbbr(k);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!entry) return <>{children ?? k}</>;

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="cursor-help font-semibold text-teal-600 underline decoration-dotted decoration-teal-600/60 underline-offset-2 dark:text-teal-400"
      >
        {children ?? k}
      </button>
      {open && (
        <span
          role="dialog"
          aria-label={entry.abbr}
          className="abbr-tip absolute bottom-full left-0 right-auto z-50 mb-2 block w-[min(260px,80vw)] rounded-xl border border-line bg-surface p-3 text-start text-sm shadow-xl rtl:left-auto rtl:right-0"
        >
          <span className="mb-1 flex items-center justify-between gap-2">
            <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">{entry.abbr}</span>
            <button onClick={() => setOpen(false)} aria-label={lang === "ar" ? "إغلاق" : "Fermer"} className="rounded-lg p-1 hover:bg-surface2">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </span>
          <span className="block font-bold">{lang === "ar" ? entry.full.ar : entry.full.fr}</span>
          <span className="mt-1 block leading-relaxed opacity-80">{lang === "ar" ? entry.detail.ar : entry.detail.fr}</span>
        </span>
      )}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// <AbbrText> : parcourt le texte et rend cliquable toute abréviation connue.
// ────────────────────────────────────────────────────────────────────────────
const SORTED = [...ABBREVIATIONS].sort((a, b) => b.abbr.length - a.abbr.length).map((a) => a.abbr);
const REGEX = new RegExp(`\\b(${SORTED.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");

function annotate(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  REGEX.lastIndex = 0;
  while ((m = REGEX.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<Abbr key={`${m.index}-${m[1]}`} k={m[1]} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function AbbrText({ children }: { children: ReactNode }): ReactNode {
  if (typeof children === "string") return <>{annotate(children)}</>;
  if (isValidElement(children)) {
    const el = children as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, undefined, <AbbrText>{el.props.children}</AbbrText>);
  }
  if (Array.isArray(children)) {
    return (
      <>
        {children.map((c, i) => (
          <AbbrText key={i}>{c}</AbbrText>
        ))}
      </>
    );
  }
  return children as ReactNode;
}
