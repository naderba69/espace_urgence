// v9.0 — Bouton unifié : variantes sémantiques, cible tactile ≥ 44px.
import type { ReactNode } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "danger" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  danger: "bg-red-600 text-white hover:bg-red-500 active:scale-[.98]",
  outline: "border border-line bg-surface hover:bg-surface2 active:scale-[.98]",
  ghost: "hover:bg-surface2 active:scale-[.98]",
};
const SIZE: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-7 text-lg",
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export default function Button(
  props:
    | (Common & { href: string })
    | (Common & { onClick?: () => void; type?: "button" | "submit"; ariaLabel?: string; disabled?: boolean })
) {
  const { variant = "primary", size = "md", children, className = "" } = props;
  const cls = `touch inline-flex items-center justify-center gap-2 rounded-full font-bold transition ${VARIANT[variant]} ${SIZE[size]} ${className}`;
  if ("href" in props) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} aria-label={props.ariaLabel} disabled={props.disabled} className={cls}>
      {children}
    </button>
  );
}
