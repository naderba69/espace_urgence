"use client";
// v14 — NumStepper : إدخال رقمي بالكتابة اليدوية أو أزرار +/−.
import { Minus, Plus } from "lucide-react";

type Props = {
  value: string;
  onValue: (v: string) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
  placeholder?: string;
};

export default function NumStepper({ value, onValue, step = 1, min = 0, max, className = "", label, placeholder }: Props) {
  const bump = (d: number) => {
    const cur = parseFloat(String(value).replace(",", ".")) || 0;
    let n = Math.round((cur + d * step) * 1000) / 1000;
    if (n < min) n = min;
    if (max !== undefined && n > max) n = max;
    onValue(String(n));
  };
  return (
    <div className={`flex items-center gap-1 ${className}`} dir="ltr">
      <button type="button" onClick={() => bump(-1)} aria-label={label ? `minus ${label}` : "minus"}
        className="touch grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface2 font-black">
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onValue(e.target.value)}
        aria-label={label} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-center text-lg font-black tabular-nums outline-none" />
      <button type="button" onClick={() => bump(1)} aria-label={label ? `plus ${label}` : "plus"}
        className="touch grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface2 font-black">
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
