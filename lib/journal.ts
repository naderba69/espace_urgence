// v3.8 — تصدير سجلات القيادة نصياً (حفظ/نسخ دون شبكة).
import { fmtMMSS } from "./calc";

export interface JournalLine { label: string; at: number }

/** سجل نصي جاهز للنسخ إلى التقرير السريري. */
export const fmtJournal = (title: string, lines: JournalLine[]): string =>
  `${title}\n` + lines.map((l) => `${fmtMMSS(l.at)}  ${l.label}`).join("\n");
