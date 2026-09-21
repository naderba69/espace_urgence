// @vitest-environment jsdom
// v16.0 — محرّك رصد التدهور: القواعد (نوافذ الاشتباه)، التخزين، تدفق الصفحة
// (إدخال → إنذار → تأكيد/استبعاد → مشيخة المريض)، والحارس البنيوي.
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

afterEach(cleanup);

vi.mock("@/components/Providers", () => ({
  useApp: () => ({
    lang: "ar",
    t: (k: string) => k,
    prefs: { lang: "ar", theme: "dark", fontSize: 16, muted: false, printSize: "a4" },
    setPref: () => {},
    hydrated: true,
    favorites: [], isFav: () => false, toggleFav: () => {}, reorderFavs: () => {},
    recent: [], pushRecent: () => {},
    emergencyOpen: false, setEmergencyOpen: () => {},
    updateReady: false, dismissUpdate: () => {},
    patient: { w: "70", age: "54", scr: "", sexe: "m" },
    setPatient: () => {},
  }),
  usePrefillPatient: () => {},
}));

import { evaluateVitals, addProblem, getProblems, removeProblem, PROBLEMS_KEY } from "@/lib/deterioration";
import ReevaluationPage from "@/app/reevaluation/page";

beforeEach(() => {
  localStorage.clear();
});

describe("v16.0 — محرّك القواعد", () => {
  it("OAP: يشتعل على SpO₂<90 أو FR≥25، ولا يشتعل على ثوابت سوية", () => {
    expect(evaluateVitals({ spo2: 85 }).map((a) => a.rule.id)).toContain("oap");
    expect(evaluateVitals({ spo2: 96, fr: 28 }).map((a) => a.rule.id)).toContain("oap");
    expect(evaluateVitals({ spo2: 96, fr: 18, pas: 120 }).map((a) => a.rule.id)).not.toContain("oap");
  });
  it("سيناريو المالك: SCA تدهورت — SpO₂ 88 + PAS 85 + FC 115 ⇒ OAP + صدمة معًا", () => {
    const ids = evaluateVitals({ spo2: 88, pas: 85, fc: 115 }).map((a) => a.rule.id);
    expect(ids).toContain("oap");
    expect(ids).toContain("choc");
  });
  it("qSOFA: مؤشران يكفيان، ومؤشر واحد لا يكفي", () => {
    expect(evaluateVitals({ fr: 24, pas: 95, gcs: 15 }).map((a) => a.rule.id)).toContain("sepsis");
    expect(evaluateVitals({ fr: 16, pas: 130, gcs: 15 }).map((a) => a.rule.id)).not.toContain("sepsis");
  });
  it("نقص السكر / غلاسكو ≤8 / بطء القلب: نوافذها مضبوطة", () => {
    expect(evaluateVitals({ gly: 55 }).map((a) => a.rule.id)).toContain("hypoglycemie");
    expect(evaluateVitals({ gly: 110 }).map((a) => a.rule.id)).not.toContain("hypoglycemie");
    expect(evaluateVitals({ gcs: 7 }).map((a) => a.rule.id)).toContain("gcs8");
    expect(evaluateVitals({ gcs: 12 }).map((a) => a.rule.id)).not.toContain("gcs8");
    expect(evaluateVitals({ fc: 35 }).map((a) => a.rule.id)).toContain("bradycardie");
    expect(evaluateVitals({ fc: 70 }).map((a) => a.rule.id)).not.toContain("bradycardie");
  });
  it("ثوابت فارغة ⇒ لا إنذارات إطلاقًا", () => {
    expect(evaluateVitals({})).toEqual([]);
  });
});

describe("v16.0 — مشيخة المضاعفات (تخزين)", () => {
  it("إضافة ثم إزالة — مع تجاهل معرفات مجهولة", () => {
    expect(getProblems()).toEqual([]);
    const list = addProblem("oap", "SpO₂ 85 %");
    expect(list).toHaveLength(1);
    expect(list[0].title.ar).toContain("وذمة رئوية");
    expect(list[0].vitals).toContain("85");
    const unknown = addProblem("nope", "x");
    expect(unknown).toHaveLength(1);
    expect(removeProblem(list[0].id)).toHaveLength(0);
    expect(localStorage.getItem(PROBLEMS_KEY)).toBe("[]");
  });
});

describe("v16.0 — تدفق الصفحة", () => {
  it("تفريغ التقييم ⇒ رسالة لا مؤشر", () => {
    render(<ReevaluationPage />);
    fireEvent.click(screen.getByRole("button", { name: "تقييم" }));
    expect(screen.getByText(/لا مؤشر تدهور/)).toBeTruthy();
  });
  it("SpO₂ 85 + PAS 85 + FC 115 ⇒ إنذارا OAP وصدمة؛ التأكيد يضيف للمشيخة مع الـconduite والمرجع؛ الاستبعاد يُخفي", () => {
    render(<ReevaluationPage />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "115" } }); // FC
    fireEvent.change(inputs[1], { target: { value: "85" } });  // PAS
    fireEvent.change(inputs[3], { target: { value: "88" } });  // SpO₂
    fireEvent.click(screen.getByRole("button", { name: "تقييم" }));
    expect(screen.getByText(/وذمة رئوية حادة/)).toBeTruthy();
    expect(screen.getByText(/صدمة — نقص ترويج أنسجة/)).toBeTruthy();
    // معايير التأكيد ظاهرة قبل التأكيد
    expect(screen.getByText("خخاخات في قاعدتي الرئة")).toBeTruthy();
    // تأكيد OAP ⇒ conduite + مشيخة
    fireEvent.click(screen.getAllByRole("button", { name: "تأكيد وإضافة" })[0]);
    expect(screen.getByText(/طريقة التدخل/)).toBeTruthy();
    expect(screen.getByText("جلوس قائم تام مع إرخاء الساقين")).toBeTruthy();
    expect(screen.getByText(/المرجع: ESC 2021 — Acute Heart Failure/)).toBeTruthy();
    expect(screen.getByText(/المضاعفات النشطة للمريض/)).toBeTruthy();
    expect(getProblems().some((p) => p.ruleId === "oap")).toBe(true);
    // استبعاد صدمة ⇒ تختفي بطاقتها وتبقى OAP
    const before = screen.getAllByRole("button", { name: "مستبعد" });
    fireEvent.click(before[0]);
    expect(screen.queryByText(/صدمة — نقص ترويج أنسجة/)).not.toBeTruthy();
    expect(screen.getAllByText(/وذمة رئوية حادة/).length).toBeGreaterThanOrEqual(2); // البطاقة + سطر المشيخة
  });
});

describe("v16.0 — حارس بنيوي", () => {
  it("ActivePatient: زر إعادة تقييم + قراءة المشيخة + شارة المضاعفات", async () => {
    const fs = await import("node:fs");
    const ap = fs.readFileSync("components/ActivePatient.tsx", "utf8");
    expect(ap).toContain('href="/reevaluation"');
    expect(ap).toContain("getProblems");
    expect(ap).toContain("مضاعفات نشطة");
  });
  it("الرئيسية: بلاطتا إعادة التقييم + التوجيه (شبكة 10 أدوات) — والدرج والفهرس والمسار والقاموس", async () => {
    const fs = await import("node:fs");
    const home = fs.readFileSync("app/page.tsx", "utf8");
    expect(home).toContain('href: "/reevaluation"');
    expect(home).toContain('href: "/guidage"');
    const nav = fs.readFileSync("components/Nav.tsx", "utf8");
    expect(nav).toContain('href: "/reevaluation"');
    const { resolveRef, loadSearchIndex } = await import("@/lib/search");
    await loadSearchIndex(); // v17.0 — index paresseux
    expect(resolveRef("outil:reevaluation")).not.toBeNull();
    const routes = fs.readFileSync("scripts/audit-clips.mjs", "utf8");
    expect(routes).toContain('"/reevaluation"');
    const i = fs.readFileSync("lib/i18n.ts", "utf8");
    expect((i.match(/"nav\.reevaluation"/g) || []).length).toBe(2);
  });
  it("الإصدار 16.2 متزامن (lib ↔ sw)", async () => {
    const fs = await import("node:fs");
    const { APP_VERSION } = await import("../lib/version");
    expect(APP_VERSION).toBe("18.1");
    expect(fs.readFileSync("public/sw.js", "utf8")).toContain('const VERSION = "eutn-v18.1";');
  });
});

describe("v16.1 — القواعد الثلاث الجديدة", () => {
  it("فرط البوتاسيوم: K⁺ ≥6 يشتبه، و<6 لا", () => {
    expect(evaluateVitals({ k: 6.8 }).map((a) => a.rule.id)).toContain("hyperk");
    expect(evaluateVitals({ k: 5.2 }).map((a) => a.rule.id)).not.toContain("hyperk");
  });
  it("انصمام رئوي: تسرّع + نقص أكسجة متوسط يشتبه — والإصلاح يحسمه", () => {
    const ids = evaluateVitals({ fc: 105, spo2: 91 }).map((a) => a.rule.id);
    expect(ids).toContain("ep");
    expect(ids).not.toContain("oap"); // SpO₂ 91 فوق نافذة OAP — اشتباه معزول نظيف
    expect(evaluateVitals({ fc: 105, spo2: 95 }).map((a) => a.rule.id)).not.toContain("ep");
  });
  it("أزمة ربعية: انقباضي <90 + سكر <80 — تتقاطع بصدق مع نقص السكر", () => {
    const ids = evaluateVitals({ pas: 82, gly: 60 }).map((a) => a.rule.id);
    expect(ids).toContain("addison");
    expect(ids).toContain("hypoglycemie");
  });
  it("سلامة الروابط: كل روابط القواعد التسع تقابل مسارات موجودة فعلاً", async () => {
    const fs = await import("node:fs");
    const { DETER_RULES } = await import("@/lib/deterioration");
    const known = new Set<string>(["/"]);
    for (const d of fs.readdirSync("app")) if (fs.existsSync(`app/${d}/page.tsx`)) known.add("/" + d);
    for (const sub of fs.readdirSync("app/calculateurs")) if (fs.existsSync(`app/calculateurs/${sub}/page.tsx`)) known.add(`/calculateurs/${sub}`);
    const meds = fs.readFileSync("data/medications.ts", "utf8");
    for (const r of DETER_RULES) for (const l of r.links) {
      if (l.href.startsWith("/medicaments/")) expect(meds, l.href).toContain(`id: "${l.href.split("/")[2]}"`);
      else expect(known, l.href).toContain(l.href);
    }
    expect(DETER_RULES).toHaveLength(9);
  });
  it("حقل K⁺ الاختياري ظاهر في النموذج (7 حقولاً)", () => {
    render(<ReevaluationPage />);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(7);
    expect(screen.getByLabelText("البوتاسيوم (إن توفر)")).toBeTruthy();
  });
});
