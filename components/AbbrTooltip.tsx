"use client";
// v14.5 — اختصار قابل للنقر : Bottom Sheet مثبّتة أسفل الشاشة (لا فقاعة مطلقة تُقص).
// Usage : <Abbr k="PAM" /> — أو كشف تلقائي عبر <AbbrText>نص</AbbrText>.
import { useEffect, useState, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import { useApp } from "@/components/Providers";
import { ABBREVIATIONS, getAbbr } from "@/data/abbr";
import { X } from "lucide-react";

export function Abbr({ k, children }: { k: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { lang } = useApp();
  const entry = getAbbr(k);

  // Esc يغلق + قفل تمرير الخلفية أثناء فتح الورقة
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!entry) return <>{children ?? k}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="cursor-help font-semibold text-blue-600 underline decoration-dotted decoration-blue-600/60 underline-offset-2 dark:text-blue-400"
      >
        {children ?? k}
      </button>
      {open && (
        <span className="fixed inset-0 z-[60] block" role="dialog" aria-modal="true" aria-label={entry.abbr}>
          <span className="absolute inset-0 block bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <span className="eutn-sheet absolute inset-x-0 bottom-0 block max-h-[72dvh] overflow-y-auto rounded-t-2xl border border-b-0 border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl">
            <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-line" aria-hidden />
            <span className="mb-1 flex items-center justify-between gap-2">
              <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400" dir="ltr">{entry.abbr}</span>
              <button onClick={() => setOpen(false)} aria-label={lang === "ar" ? "إغلاق" : "Fermer"} className="touch rounded-lg p-2 hover:bg-surface2">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </span>
            <span className="block break-words text-base font-bold leading-relaxed">{lang === "ar" ? entry.full.ar : entry.full.fr}</span>
            <span className="mt-1 block break-words leading-relaxed opacity-80">{lang === "ar" ? entry.detail.ar : entry.detail.fr}</span>
          </span>
        </span>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// <AbbrText> : يجول النص ويجعل كل اختصار معروف قابلاً للنقر.
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
