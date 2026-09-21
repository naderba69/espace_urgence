"use client";
// v14 — ScrollOnce : عنوان طويل يُقرأ كاملاً بتمرير أفقي لمرة واحدة (حسب الاتجاه)، إعادة بالنقر.
import { useEffect, useRef, useState } from "react";

export default function ScrollOnce({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const i = inner.current, b = box.current;
    if (!i || !b) return;
    const over = i.scrollWidth - b.clientWidth;
    if (over > 8) {
      i.style.setProperty("--eutn-slide", `${over}px`);
      setDur(Math.max(2.5, Math.min(9, over / 35)));
    }
  }, []);

  const replay = () => {
    const i = inner.current;
    if (!i || !dur) return;
    i.style.animation = "none";
    void i.offsetHeight; // reflow
    i.style.animation = "";
  };

  return (
    <span ref={box} onClick={replay} className={`eutn-so ${className}`}>
      <span ref={inner} className="eutn-so-i" style={dur ? { animationDuration: `${dur}s` } : undefined}>
        {children}
      </span>
    </span>
  );
}
