// v18.1 — خطّة العلاج المضادّ الحيوي (حلقة a → b): قرار لكل تركيبة، إعادة تقييم، وتصدير.
// Plan antibiotique (boucle a → b) : décision par molécule (retenue / abandonnée), réévaluation
// itérative et export texte. Logique pure (testée) ; la persistance est faite par la page.
import type { Localized } from "@/data/types";

export type PlanDecision = "retenue" | "abandonnee";

/** سبب التخلّي — مفاتيح تُترجم في الواجهة. */
export type PlanReason = "fonction-renale" | "resistance" | "allergie" | "interaction" | "autre";

export interface PlanEntry {
  /** معرّف التركيبة (data/atb-renal.ts). */
  id: string;
  /** رقم الجولة: 1 = القرار الأول، 2 = بعد إعادة التقييم… */
  round: number;
  decision: PlanDecision;
  reason?: PlanReason;
  /** ملاحظة حرّة قصيرة (≤ 120 حرفًا). */
  note?: string;
  /** لقطة السياق وقت القرار (اختيارية). */
  snapshot?: { weightKg?: number; stage?: string; stageLabel?: string; dose?: string };
  at: string; // ISO
}

export interface PlanState {
  version: 1;
  entries: PlanEntry[];
}

export const PLAN_KEY = "eutn:atb-plan-v1";

export const planReasonLabel: Record<PlanReason, Localized> = {
  "fonction-renale": { fr: "Fonction rénale / stade", ar: "الوظيفة الكلوية / المرحلة" },
  resistance: { fr: "Résistance / spectre", ar: "المقاومة / الطّيف" },
  allergie: { fr: "Allergie", ar: "الحساسية" },
  interaction: { fr: "Interaction / tolérance", ar: "التفاعل / التحمل" },
  autre: { fr: "Autre", ar: "سبب آخر" },
};

export function emptyPlan(): PlanState {
  return { version: 1, entries: [] };
}

/** آخر قرار لكل تركيبة (الجولة الأعلى) — الحالة الحالية للخطّة. */
export function currentDecisions(plan: PlanState): Map<string, PlanEntry> {
  const out = new Map<string, PlanEntry>();
  for (const e of plan.entries) {
    const prev = out.get(e.id);
    if (!prev || e.round >= prev.round) out.set(e.id, e);
  }
  return out;
}

/** الجولة الموالية لتركيبة (a → b → c…) — تبدأ من 1. */
export function nextRound(plan: PlanState, id: string): number {
  const rounds = plan.entries.filter((e) => e.id === id).map((e) => e.round);
  return rounds.length ? Math.max(...rounds) + 1 : 1;
}

/** إضافة قرار (قرار أول أو إعادة تقييم): لا حذف أبدًا — الحلقة تُحفظ كاملة. */
export function addDecision(plan: PlanState, entry: Omit<PlanEntry, "round" | "at"> & { at?: string }): PlanState {
  const round = nextRound(plan, entry.id);
  const at = entry.at ?? new Date().toISOString();
  return { version: 1, entries: [...plan.entries, { ...entry, round, at }] };
}

/** حذف كل أثر تركيبة (رجوع عن الإدراج في الخطّة). */
export function removeMolecule(plan: PlanState, id: string): PlanState {
  return { version: 1, entries: plan.entries.filter((e) => e.id !== id) };
}

export function resetPlan(): PlanState {
  return emptyPlan();
}

/** جرّب أي JSON قادم من localStorage: يُهمَل إن لم يطابق الشكل. */
export function parsePlan(raw: unknown): PlanState {
  if (!raw || typeof raw !== "object") return emptyPlan();
  const o = raw as { version?: unknown; entries?: unknown };
  if (o.version !== 1 || !Array.isArray(o.entries)) return emptyPlan();
  const entries = o.entries.filter((e): e is PlanEntry => {
    const x = e as Partial<PlanEntry>;
    return typeof x.id === "string" && typeof x.round === "number" && (x.decision === "retenue" || x.decision === "abandonnee");
  });
  return { version: 1, entries };
}

/** تصدير الخطّة نصًّا (يُلصق في الملاحظات أو الملف الطبي). */
export function planToText(plan: PlanState, opts: { lang: "fr" | "ar"; name: (id: string) => string; stageLabel?: string }): string {
  const { lang, name } = opts;
  const ar = lang === "ar";
  const cur = currentDecisions(plan);
  const keep = [...cur.values()].filter((e) => e.decision === "retenue");
  const drop = [...cur.values()].filter((e) => e.decision === "abandonnee");
  const L: string[] = [];
  L.push(ar ? "خطّة العلاج المضادّ الحيوي — تكييف كلوي" : "PLAN ANTIBIOTIQUE — adaptation rénale");
  if (opts.stageLabel) L.push(`${ar ? "المرحلة المعتمدة" : "Stade retenu"} : ${opts.stageLabel}`);
  L.push("");
  L.push(ar ? `✓ مُعتمدة (${keep.length})` : `✓ RETENUES (${keep.length})`);
  for (const e of keep) {
    const bits = [
      `- ${name(e.id)}`,
      e.snapshot?.dose ? `  ${ar ? "الجرعة" : "dose"} : ${e.snapshot.dose}` : "",
      e.snapshot?.weightKg ? `  ${ar ? "الوزن" : "poids"} : ${e.snapshot.weightKg} kg` : "",
      e.note ? `  ${ar ? "ملاحظة" : "note"} : ${e.note}` : "",
      `  ${ar ? "الجولة" : "tour"} ${e.round} · ${e.at.slice(0, 16).replace("T", " ")}`,
    ];
    L.push(...bits.filter(Boolean));
  }
  L.push("");
  L.push(ar ? `✗ متخلّى عنها (${drop.length})` : `✗ ABANDONNÉES (${drop.length})`);
  for (const e of drop) {
    L.push(
      `- ${name(e.id)} — ${e.reason ? planReasonLabel[e.reason][lang] : ar ? "بدون سبب" : "sans motif"}${
        e.note ? ` · ${e.note}` : ""
      } (${ar ? "الجولة" : "tour"} ${e.round})`,
    );
  }
  L.push("");
  L.push(
    ar
      ? "تنبيه: الجرعات منقولة من جدول OMEDIT V2.3 (بالغون غير خاضعين للغسيل) وتُراجَع طبيًا."
      : "Rappel : posologies issues du tableau OMEDIT V2.3 (adultes non dialysés) — à valider par un médecin.",
  );
  return L.join("\n");
}
