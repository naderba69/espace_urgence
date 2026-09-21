"use client";
// v5.3 — محركات النجاعة الميدانية: مترونوم ضغطات، قفل استيقاظ الشاشة (يدان مشغولتان)، بلا أصول خارجية.
import { useEffect, useRef, useState } from "react";

function audioCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext;
}

/** مترونوم نقرات Web Audio + اهتزاز اختياري — يعمل دون اتصال. */
export function useMetronome(bpm: number) {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!on) return;
    const AC = audioCtor();
    if (!AC) return;
    if (!ctxRef.current) ctxRef.current = new AC();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const click = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.1);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(25);
    };
    click();
    const id = setInterval(click, 60000 / bpm);
    return () => clearInterval(id);
  }, [on, bpm]);

  return { on, toggle: () => setOn((x) => (x ? false : !!audioCtor())) };
}

/** يمنع نوم الشاشة — مفيد حين تكون اليدان على المريض. */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined") return;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    if (!nav.wakeLock) return;
    let sentinel: { release: () => Promise<void> } | null = null;
    let alive = true;
    const req = async () => {
      try { sentinel = await nav.wakeLock!.request("screen"); } catch { /* بدون إذن/بطارية */ }
    };
    void req();
    const vis = () => { if (alive && document.visibilityState === "visible") void req(); };
    document.addEventListener("visibilitychange", vis);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", vis);
      void sentinel?.release();
    };
  }, [enabled]);
}
