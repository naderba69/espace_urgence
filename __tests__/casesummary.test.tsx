// @vitest-environment jsdom
// v16.2 — ملخص الحالة: البنّاء النقي (أقسام النص بلغتين)، سجل الثوابت (سقف 6، الأحدث أولاً)،
// تدفق إعادة التقييم → حفظ اللقطة → الملخص يعرضها، والحارس البنيوي (شريط/شبكة/درج/فهرس/مسار/إصدار).
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
    patient: { w: "70", age: "54", scr: "80", sexe: "m" },
    setPatient: () => {},
  }),
  usePrefillPatient: () => {},
}));

import { buildCaseSummary, pushVitals, getVitalsLog, clearVitalsLog, VITALS_LOG_KEY } from "@/lib/casesummary";
import ReevaluationPage from "@/app/reevaluation/page";
import ResumePage from "@/app/resume/page";

beforeEach(() => {
  localStorage.clear();
});

const T945 = new Date(2026, 8, 20, 9, 45).getTime();
const T1030 = new Date(2026, 8, 20, 10, 30).getTime();

describe("v16.2 — بنّاء الملخص (نقي)", () => {
  it("يجمع الأقسام الأربعة بالعربية: مريض + ثوابت (الأحدث أولاً) + مضاعفة + خط زمني مرتب", () => {
    const txt = buildCaseSummary({
      lang: "ar",
      patient: { w: "70", age: "54", scr: "80", sexe: "m" },
      problems: [{ id: "x", ruleId: "oap", at: T1030, title: { fr: "OAP", ar: "وذمة رئوية" }, vitals: "SpO₂ 88 %" }],
      timeline: [
        { f: "Adrénaline 1 mg", a: "أدرينالين 1 مغ", t: T1030, m: 1 },
        { f: "Amiodarone 300 mg", a: "أميودارون 300 مغ", t: T945, m: 1 },
      ],
      vitals: [
        { at: T1030, v: { fc: 115, pas: 85, spo2: 88 } },
        { at: T945, v: { fc: 100, pas: 110, spo2: 93 } },
      ],
      now: T1030,
    });
    expect(txt).toContain("ملخص الحالة — تسليم / انتقال");
    expect(txt).toContain("المريض: 54 سنة · ذكر · 70 kg · كريات 80 µmol/L");
    const i1 = txt.indexOf("10:30 · نبض 115 · انقباضي 85 · تشبع 88");
    const i2 = txt.indexOf("09:45 · نبض 100 · انقباضي 110 · تشبع 93");
    expect(i1).toBeGreaterThanOrEqual(0);
    expect(i2).toBeGreaterThan(i1); // الأحدث أولاً
    expect(txt).toContain("10:30 — وذمة رئوية (SpO₂ 88 %)");
    const ia = txt.indexOf("09:45 — أميودارون 300 مغ");
    const ib = txt.indexOf("10:30 — أدرينالين 1 مغ");
    expect(ia).toBeGreaterThanOrEqual(0);
    expect(ib).toBeGreaterThan(ia); // مرتب زمنياً
    expect(txt).toContain("التوقيع: ________");
  });
  it("النسخة الفرنسية وفراغ الأقسام يعطي «—»", () => {
    const txt = buildCaseSummary({ lang: "fr", problems: [], timeline: [], vitals: [], now: T945 });
    expect(txt).toContain("RÉSUMÉ DE CAS — relève / transfert");
    expect(txt).toContain("Patient: —");
    expect((txt.match(/—$/gm) || []).length).toBeGreaterThanOrEqual(2);
  });
});

describe("v16.2 — سجل الثوابت", () => {
  it("سقف 6 لقطات، الأحدث أولاً، والمسح ينظف", () => {
    for (let i = 0; i < 8; i++) pushVitals({ fc: 80 + i });
    const log = getVitalsLog();
    expect(log).toHaveLength(6);
    expect(log[0].v.fc).toBe(87); // الأحدث
    expect(log[5].v.fc).toBe(82);
    clearVitalsLog();
    expect(getVitalsLog()).toEqual([]);
    expect(localStorage.getItem(VITALS_LOG_KEY)).toBeNull();
  });
});

describe("v16.2 — تدفق إعادة التقييم → الملخص", () => {
  it("التقييم يحفظ لقطة، والملخص يعرضها في الاتجاه والنص", () => {
    render(<ReevaluationPage />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "115" } });
    fireEvent.change(inputs[1], { target: { value: "85" } });
    fireEvent.click(screen.getByRole("button", { name: "تقييم" }));
    expect(getVitalsLog()).toHaveLength(1);
    cleanup();
    render(<ResumePage />);
    expect(screen.getAllByText(/نبض 115 · انقباضي 85/).length).toBeGreaterThanOrEqual(1); // الاتجاه + النص
  });
  it("تقييم فارغ لا يحفظ لقطة", () => {
    render(<ReevaluationPage />);
    fireEvent.click(screen.getByRole("button", { name: "تقييم" }));
    expect(getVitalsLog()).toHaveLength(0);
  });
});

describe("v16.2 — حارس بنيوي", () => {
  it("الشريط يضم زرّي إعادة تقييم وملخص — والشبكة والدرج والفهرس والمسار والقاموس", async () => {
    const fs = await import("node:fs");
    const ap = fs.readFileSync("components/ActivePatient.tsx", "utf8");
    expect(ap).toContain('href="/resume"');
    const home = fs.readFileSync("app/page.tsx", "utf8");
    expect(home).toContain('href: "/resume"');
    const nav = fs.readFileSync("components/Nav.tsx", "utf8");
    expect(nav).toContain('href: "/resume"');
    const { resolveRef, loadSearchIndex } = await import("@/lib/search");
    await loadSearchIndex(); // v17.0 — index paresseux
    expect(resolveRef("outil:resume")).not.toBeNull();
    expect(fs.readFileSync("scripts/audit-clips.mjs", "utf8")).toContain('"/resume"');
    const i = fs.readFileSync("lib/i18n.ts", "utf8");
    expect((i.match(/"nav\.resume"/g) || []).length).toBe(2);
  });
  it("الإصدار 16.2 متزامن", async () => {
    const fs = await import("node:fs");
    const { APP_VERSION } = await import("../lib/version");
    expect(APP_VERSION).toBe("18.1");
    expect(fs.readFileSync("public/sw.js", "utf8")).toContain('const VERSION = "eutn-v18.1";');
  });
});
