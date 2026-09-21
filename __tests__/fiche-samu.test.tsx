// @vitest-environment jsdom
// v14.6 — فيشة التدخل: استيراد خط الزمن الدوائي (eutn:timeline) — آليًا عند أول فتح + زر بحارس تأكيد.
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

afterEach(cleanup);

const state: { updateReady: boolean } = { updateReady: false };
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
    updateReady: state.updateReady,
    dismissUpdate: () => { state.updateReady = false; },
    patient: { w: "", age: "", scr: "", sexe: "m" },
    setPatient: () => {},
  }),
  usePrefillPatient: () => {},
}));

import FicheSamuPage from "@/app/fiche-samu/page";

const TL = "eutn:timeline";
const STORE = "eutn:fiche-samu";
// أوقات محلية ثابتة (09:45 ثم 10:30) — الترتيب الزمني تصاعديًا
const T1 = new Date(2026, 8, 20, 9, 45).getTime();
const T2 = new Date(2026, 8, 20, 10, 30).getTime();
const EVENTS = [
  { f: "Adrénaline 1 mg", a: "أدرينالين 1 مغ", t: T2, m: 1 },
  { f: "Amiodarone 300 mg", a: "أميودارون 300 مغ", t: T1, m: 1 },
];
const EXPECT = "09:45 — أميودارون 300 مغ\n10:30 — أدرينالين 1 مغ";

const traitementsBox = () => screen.getByLabelText("العلاجات") as HTMLTextAreaElement;

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "alert").mockImplementation(() => {}).mockClear();
  vi.spyOn(window, "confirm").mockReturnValue(true).mockClear();
});

describe("فيشة SAMU — استيراد خط الزمن v14.6", () => {
  it("الاستيراد الآلي عند أول فتح بحالة فارغة: يملأ العلاجات بأسطر HH:MM — الاسم مرتبة زمنيًا", () => {
    localStorage.setItem(TL, JSON.stringify(EVENTS));
    render(<FicheSamuPage />);
    expect(traitementsBox().value).toBe(EXPECT);
  });

  it("الاستيراد الآلي لا يمسح حقل «العلاجات» محفوظًا غير فارغ", () => {
    localStorage.setItem(TL, JSON.stringify(EVENTS));
    localStorage.setItem(STORE, JSON.stringify({ traitements: "محفوظ يدويًا" }));
    render(<FicheSamuPage />);
    expect(traitementsBox().value).toBe("محفوظ يدويًا");
  });

  it("الزر مع حقل غير فارغ + تأكيد بالقبول: يستبدل وينبّه بعدد الإعطاءات", () => {
    localStorage.setItem(TL, JSON.stringify(EVENTS));
    localStorage.setItem(STORE, JSON.stringify({ traitements: "XXX" }));
    const confirmSpy = window.confirm as ReturnType<typeof vi.spyOn>;
    confirmSpy.mockReturnValue(true);
    render(<FicheSamuPage />);
    fireEvent.click(screen.getByRole("button", { name: /استيراد الخط الزمني/ }));
    expect(confirmSpy).toHaveBeenCalled();
    expect(traitementsBox().value).toBe(EXPECT);
    expect(window.alert).toHaveBeenCalledWith("استُوردت 2 إعطاءات من خط الزمن.");
  });

  it("الزر مع حقل غير فارغ + رفض التأكيد: لا يغيّر شيئًا ولا ينبّه نجاحًا", () => {
    localStorage.setItem(TL, JSON.stringify(EVENTS));
    localStorage.setItem(STORE, JSON.stringify({ traitements: "XXX" }));
    const confirmSpy = window.confirm as ReturnType<typeof vi.spyOn>;
    confirmSpy.mockReturnValue(false);
    render(<FicheSamuPage />);
    fireEvent.click(screen.getByRole("button", { name: /استيراد الخط الزمني/ }));
    expect(confirmSpy).toHaveBeenCalled();
    expect(traitementsBox().value).toBe("XXX");
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("بدون خط زمن: الزر ينبّه بعدم وجود إعطاءات ولا يفسد الحقل", () => {
    localStorage.setItem(STORE, JSON.stringify({ traitements: "دواء موجود" }));
    render(<FicheSamuPage />);
    fireEvent.click(screen.getByRole("button", { name: /استيراد الخط الزمني/ }));
    expect(traitementsBox().value).toBe("دواء موجود");
    expect(window.alert).toHaveBeenCalledWith("لا إعطاءات في خط الزمن.");
  });
});
