"use client";
// Générateur d'ondes ECG stylisées (pédagogique, non mesurable) + animation de défilement.
import type { EcgKind } from "@/data/ecg";
import { useId, useMemo } from "react";

const W = 640;
const H = 140;
const BASE = 90; // ligne isoélectrique

function pathSinus(opts: { beats: number; beatW: number; pWave: boolean; tAmp: number; stElev: number; flutter: boolean }): string {
  const { beats, beatW, pWave, tAmp, stElev, flutter } = opts;
  let d = `M 0 ${BASE}`;
  for (let i = 0; i < beats; i++) {
    const x0 = i * beatW;
    if (flutter) {
      // dents de scie F typiques (≈ 3 par cycle)
      for (let f = 0; f < 3; f++) {
        const fx = x0 + f * (beatW / 3);
        d += ` L ${fx + 8} ${BASE - 6} L ${fx + 16} ${BASE}`;
      }
    } else if (pWave) {
      d += ` q 6 ${-8} 12 0`;
    }
    // QRS
    const qx = x0 + beatW * 0.45;
    d += ` M ${i * beatW + beatW * 0.35} ${BASE}`; // repositionne proprement
    d += ` L ${qx - 6} ${BASE} L ${qx} ${BASE - 52} L ${qx + 8} ${BASE + 14} L ${qx + 14} ${BASE}`;
    // ST + T
    const st = x0 + beatW * 0.62;
    d += ` L ${st} ${BASE - stElev} q ${beatW * 0.1} ${-tAmp} ${beatW * 0.22} ${stElev ? 0 : 0}`;
    d += ` L ${(i + 1) * beatW} ${BASE}`;
  }
  return d;
}

function pathIrregular(beats: number, wobble: number): string {
  // FA : RR irréguliers + baseline ondulante
  let d = `M 0 ${BASE}`;
  let x = 0;
  const rrs = [90, 70, 110, 60, 95, 80, 100, 65, 90, 75];
  for (let i = 0; i < beats; i++) {
    const rr = rrs[i % rrs.length];
    for (let w = 0; w < rr; w += 10) d += ` l 5 ${Math.sin((x + w) / 9) * wobble} l 5 ${Math.cos((x + w) / 7) * wobble}`;
    const qx = x + rr - 20;
    d += ` M ${qx} ${BASE} L ${qx + 4} ${BASE - 52} L ${qx + 9} ${BASE + 10} L ${qx + 14} ${BASE}`;
    x += rr;
  }
  return d;
}

function pathVF(): string {
  let d = `M 0 ${BASE}`;
  for (let x = 0; x < W; x += 8) {
    const a = 30 - (x / W) * 10; // coarse -> fine
    d += ` l 4 ${Math.sin(x / 3) * a / 2} l 4 ${-Math.abs(Math.sin(x / 5)) * a / 2}`;
  }
  return d;
}

function pathTorsades(): string {
  let d = `M 0 ${BASE}`;
  for (let x = 0; x < W; x += 4) {
    const envelope = Math.sin(x / 55) * 55;
    d += ` l 4 ${envelope - (x > 0 ? Math.sin((x - 4) / 55) * 55 : 0)}`;
  }
  return d;
}

function pathBAV3(): string {
  // QRS d'échappement lents + ondes P indépendantes qui dérivent
  let d = `M 0 ${BASE}`;
  for (let i = 0; i < 4; i++) {
    const qx = i * 160 + 40;
    d += ` M ${i * 160} ${BASE} L ${qx} ${BASE} L ${qx + 4} ${BASE - 50} L ${qx + 12} ${BASE + 12} L ${qx + 18} ${BASE} L ${(i + 1) * 160} ${BASE}`;
  }
  // P superposées, période différente
  let pd = "";
  for (let i = 0; i < 7; i++) {
    const px = i * 95 + 20;
    pd += ` M ${px} ${BASE} q 5 -9 10 0`;
  }
  return d + pd;
}

const GENERATORS: Record<EcgKind, () => string> = {
  sinus: () => pathSinus({ beats: 6, beatW: 106, pWave: true, tAmp: 14, stElev: 0, flutter: false }),
  tachysinus: () => pathSinus({ beats: 9, beatW: 71, pWave: true, tAmp: 14, stElev: 0, flutter: false }),
  bradysinus: () => pathSinus({ beats: 4, beatW: 160, pWave: true, tAmp: 14, stElev: 0, flutter: false }),
  fa: () => pathIrregular(9, 3),
  flutter: () => pathSinus({ beats: 7, beatW: 91, pWave: false, tAmp: 0, stElev: 0, flutter: true }),
  tv: () => {
    let d = `M 0 ${BASE}`;
    for (let i = 0; i < 7; i++) {
      const x = i * 91;
      d += ` M ${x} ${BASE} l 10 -40 l 14 75 l 12 -30 L ${x + 91} ${BASE}`;
    }
    return d;
  },
  torsades: pathTorsades,
  fv: pathVF,
  bav3: pathBAV3,
  stemi: () => pathSinus({ beats: 5, beatW: 128, pWave: true, tAmp: 30, stElev: 18, flutter: false }),
  asystolie: () => {
    let d = `M 0 ${BASE}`;
    for (let x = 0; x < W; x += 24) d += ` l 12 ${Math.sin(x / 10) * 1.5} l 12 ${-Math.sin(x / 10) * 1.5}`;
    return d;
  },
};

export default function ECGTrace({ kind, animated = true }: { kind: EcgKind; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  const d = useMemo(() => GENERATORS[kind](), [kind]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`ECG ${kind}`}
      className="h-full w-full rounded-lg bg-[#06281f]"
      preserveAspectRatio="none"
    >
      {/* grille */}
      <defs>
        <pattern id={`grid-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0f4a3a" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      <path
        d={d}
        fill="none"
        stroke="#4ade80"
        strokeWidth="2.4"
        strokeLinejoin="round"
        className={animated ? "ecg-draw" : ""}
        strokeDasharray="2000"
        strokeDashoffset={animated ? 2000 : 0}
      />
    </svg>
  );
}
