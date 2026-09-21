"use client";
// v1.9 — briques UI des outils : champ numérique grand format, plaque résultat, feuille basse.
import type { ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useApp } from "@/components/Providers";

export function NumField({ label, value, onChange, suffix, step }: {
  label: ReactNode; value: string; onChange: (v: string) => void; suffix?: ReactNode; step?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-bold opacity-70">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-600">
        <input
          type="number" inputMode="decimal" step={step ?? "any"} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-center text-xl font-black tabular-nums outline-none"
        />
        {suffix && <span className="shrink-0 text-xs font-bold opacity-60">{suffix}</span>}
      </span>
    </label>
  );
}

export function Hero({ value, unit, tone = "teal", sub }: {
  value: string; unit?: string; tone?: "teal" | "red" | "amber"; sub?: ReactNode;
}) {
  const bg = tone === "teal" ? "bg-blue-600" : tone === "red" ? "bg-red-600" : "bg-amber-500";
  return (
    <div className={`rounded-2xl ${bg} p-4 text-center text-white shadow-lg`}>
      <p className="text-4xl font-black tabular-nums" dir="ltr">{value}{unit && <span className="ms-1 text-lg font-bold opacity-90">{unit}</span>}</p>
      {sub && <div className="mt-1 text-sm font-semibold opacity-90">{sub}</div>}
    </div>
  );
}

/** Feuille basse sur mobile, bloc inline sur desktop. */
export function Sheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode;
}) {
  const { lang } = useApp();
  return (
    <>
      {open && <button aria-label="fermer" className="fixed inset-0 z-[70] bg-black/60 sm:hidden" onClick={onClose} />}
      <div
        className={`fixed inset-x-0 bottom-0 z-[80] max-h-[75vh] overflow-auto rounded-t-3xl border-t border-line bg-[color:var(--surface)] p-4 pb-10 shadow-2xl transition-transform duration-300 sm:hidden ${open ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-black">{title}</h3>
          <button onClick={onClose} aria-label={lang === "ar" ? "إغلاق" : "fermer"}
            className="rounded-full border border-line p-2 hover:bg-[color:var(--surface-2)]">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {children}
      </div>
      <div className="hidden rounded-2xl border border-line bg-[color:var(--surface-2)]/50 p-4 sm:block">{children}</div>
    </>
  );
}

export function WarnNote({ tone, children }: { tone: "red" | "amber"; children: ReactNode }) {
  const cls = tone === "red"
    ? "border-red-500/60 bg-red-500/10 text-red-400"
    : "border-amber-500/60 bg-amber-500/10 text-amber-400";
  return <p className={`rounded-xl border px-3 py-2 text-sm font-bold ${cls}`}>{children}</p>;
}

export function TabBar<T extends string>({ tabs, active, onChange }: {
  tabs: { id: T; label: ReactNode }[]; active: T; onChange: (t: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-2xl border border-line bg-[color:var(--surface-2)] p-1" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)}
          className={`flex-1 rounded-xl px-2 py-2 text-sm font-black transition ${active === t.id ? "bg-blue-600 text-white shadow" : "opacity-70 hover:opacity-100"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ChipLink({ href, children, onClick }: { href?: string; children: ReactNode; onClick?: () => void }) {
  const cls = "inline-flex items-center gap-1 rounded-full border border-blue-600/50 bg-blue-600/10 px-3 py-1.5 text-xs font-bold text-blue-500 hover:bg-blue-600/20";
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}
