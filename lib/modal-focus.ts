"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Confine le focus clavier à un dialogue et restaure le focus à sa fermeture. */
export function useModalFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inerted: HTMLElement[] = [];
    let branch: HTMLElement = root;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const child of Array.from(parent.children)) {
        if (child === branch || !(child instanceof HTMLElement) || child.hasAttribute("inert")) continue;
        inerted.push(child);
        child.setAttribute("inert", "");
      }
      if (parent === document.body) break;
      branch = parent;
    }

    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables()[0] ?? root;
    first.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const current = document.activeElement;
      const atFirst = current === items[0];
      const atLast = current === items[items.length - 1];
      if (event.shiftKey && (atFirst || !root.contains(current))) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && (atLast || !root.contains(current))) {
        event.preventDefault();
        items[0].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const element of inerted) element.removeAttribute("inert");
      if (previous?.isConnected) previous.focus();
    };
  }, [active, ref]);
}
