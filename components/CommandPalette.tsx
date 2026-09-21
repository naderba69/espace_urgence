"use client";
// v17.0 — غلاف خفيف للوحة الأوامر.
//
// كان هذا الملف يُركَّب في التخطيط الجذري على كل صفحة **ويستورد فهرس البحث الكامل**
// (كل ملفات data/*) → ‏~1,4 ميغابايت من JS تُحمَّل على كل صفحة بلا داعٍ.
// الآن: الغلاف يستمع للاختصارات فقط (تبعياته أيقونات وReact)، وجسم اللوحة الثقيل
// يُحمَّل عبر import() ديناميكي عند أول فتح فعلي (Ctrl+K أو FAB أو زر القائمة).
//
// Enveloppe légère montée sur TOUTES les pages : elle n'écoute que les raccourcis ;
// le corps lourd (index de recherche) est chargé en import() dynamique au 1er usage.
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PaletteBody = dynamic(() => import("./CommandPaletteBody"), { ssr: false });

export default function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const openPalette = () => {
    setMounted(true);
    setOpen(true);
  };

  // v10.0 — ouverture depuis le FAB mobile / le rail bureau
  useEffect(() => {
    const onOpen = () => openPalette();
    window.addEventListener("eutn:palette", onOpen);
    return () => window.removeEventListener("eutn:palette", onOpen);
  }, []);

  // Ouverture globale Ctrl/Cmd+K + fermeture Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else openPalette();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;
  return <PaletteBody open={open} onClose={() => setOpen(false)} />;
}
