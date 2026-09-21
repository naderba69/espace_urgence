// @vitest-environment jsdom
// v15.0 — بنية A: 6 تبويبات، الرئيسية مركز إطلاق، Réa إحالات منسّقة، Mémo مراجعة،
// التخصصات داخل Protocoles، أدوات الدواء سياقية، تزامن الإصدار 15.0.
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(cleanup);

vi.mock("@/components/Providers", () => ({
  EMPTY_PATIENT: { w: "", age: "", scr: "", sexe: "m" },
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
    patient: { w: "", age: "", scr: "", sexe: "m" },
    setPatient: () => {},
  }),
  usePrefillPatient: () => {},
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: () => {} }),
  useSearchParams: () => new URLSearchParams(),
}));

import BottomTabs from "@/components/BottomTabs";
import NavRail from "@/components/NavRail";
import HomePage from "@/app/page";
import ReaPage from "@/app/rea/page";
import MemoPage from "@/app/memo/page";

const HREFS = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));

describe("v15.0 — التنقّل: 6 تبويبات بالترتيب المعتمد", () => {
  it("BottomTabs: الروابط الست بلا زر «المزيد» (الدرج من الهيدر فقط)", () => {
    const { container } = render(<BottomTabs />);
    const hrefs = HREFS(container);
    expect(hrefs).toEqual(["/", "/rea", "/medicaments", "/protocoles", "/memo", "/checklists"]);
    expect(container.querySelector("button")).toBeNull();
  });

  it("NavRail: نفس الست + بحث، ولا زر درج", () => {
    const { container } = render(<NavRail />);
    const hrefs = HREFS(container);
    expect(hrefs).toEqual(["/", "/rea", "/medicaments", "/protocoles", "/memo", "/checklists"]);
    expect(screen.getByRole("button", { name: "search.placeholder" })).toBeTruthy();
    expect(container.textContent).not.toContain("nav.more");
  });

  it("مجموعات الدرج: الثيمات تضم Réa/Mémo والتخصصات الخمسة والأدوات", async () => {
    const fs = await import("node:fs");
    const nav = fs.readFileSync("components/Nav.tsx", "utf8");
    expect(nav).toContain('href: "/rea"');
    expect(nav).toContain('href: "/memo"');
    expect(nav).toContain('href: "/triage"');
    expect(nav).toContain('key: "nav.group.themes"');
    expect(nav).toContain('key: "nav.group.tools"');
  });

  it("مفاتيح i18n الجديدة موجودة FR+AR", async () => {
    const fs = await import("node:fs");
    const i = fs.readFileSync("lib/i18n.ts", "utf8");
    for (const k of ['"tab.rea"', '"tab.memo"', '"tab.checklists"', '"nav.rea"', '"nav.memo"', '"nav.triage"', '"nav.group.themes"', '"nav.group.tools"']) {
      expect((i.match(new RegExp(k.replace(/[.]/g, "\\."), "g")) || []).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("v15.0 — الرئيسية مركز الإطلاق", () => {
  it("تعمل وتعرض الثيمات الخمسة + الأدوات + SOS + المريض النشط", () => {
    const { container } = render(<HomePage />);
    const hrefs = HREFS(container);
    for (const h of ["/rea", "/medicaments", "/protocoles", "/memo", "/checklists", "/calculateurs", "/calculateurs/dose-check", "/calculateurs/chronologie", "/fiche-samu", "/ecg", "/recherche", "/terrain", "/parametres"]) {
      expect(hrefs, h).toContain(h);
    }
    expect(container.textContent).toContain("emergency.open");
  });
  it("لا بلاطات أقسام ولا QUICK القديمة — خفة البنية A", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/page.tsx", "utf8");
    expect(src).not.toContain("SEC_TILES");
    expect(src).not.toContain("const QUICK");
    expect(src).toContain("v{APP_VERSION}"); // شارة الإصدار محفوظة (حارس v14.3)
  });
});

describe("v15.0 — ثيم Réanimation (إحالات منسّقة)", () => {
  it("يعرض الإحالات مع شارة المصدر", () => {
    const { container } = render(<ReaPage />);
    const hrefs = HREFS(container);
    for (const h of ["/protocoles/acr-adulte", "/protocoles/acr-pediatrique", "/calculateurs/rsi", "/calculateurs/chrono-rcp", "/medicaments/adrenaline", "/protocoles/anaphylaxie", "/protocoles/avc", "/calculateurs/hyperkalemie", "/procedures"]) {
      expect(hrefs, h).toContain(h);
    }
    expect(container.textContent).toContain("بروتوكولات");
    expect(container.textContent).toContain("حاسبات");
  });
  it("كل إحالات Réa (18 صفاً + 3 اختصارات) تقابل مسارات موجودة فعلاً", async () => {
    const fs = await import("node:fs");
    const rea = fs.readFileSync("app/rea/page.tsx", "utf8");
    const links = Array.from(rea.matchAll(/href: "(\/[^"]+)"/g)).map((m) => m[1]);
    expect(links.length).toBe(21); // 18 صفًا + 3 اختصارات (متراكبة عمداً)
    const known = new Set(["/"]);
    for (const d of fs.readdirSync("app")) if (fs.existsSync(`app/${d}/page.tsx`)) known.add("/" + d);
    for (const s of fs.readdirSync("app/calculateurs")) if (fs.existsSync(`app/calculateurs/${s}/page.tsx`)) known.add(`/calculateurs/${s}`);
    for (const h of links) {
      if (h.startsWith("/protocoles/") || h.startsWith("/medicaments/")) continue; // الديناميكية مغطاة بـ audit-links
      expect(known, h).toContain(h);
    }
  });
});

describe("v15.0 — ثيم Mémo", () => {
  it("المراجعة + القراءة + جدول الثوابت المنقول", () => {
    const { container } = render(<MemoPage />);
    const hrefs = HREFS(container);
    for (const h of ["/revisions", "/revision", "/quiz", "/ecg", "/calculateurs/ecg-grid", "/stats"]) {
      expect(hrefs, h).toContain(h);
    }
    const txt = container.textContent ?? "";
    expect(txt).toContain("الثوابت الطبيعية"); // قسم الجدول المنقول حاضر
    expect(txt).toContain("60–100"); // صف النبض البالغ من جدول vitalSigns
  });
});

describe("v15.0 — مجموعات داخل الثيمات القائمة", () => {
  it("Protocoles: التخصصات الخمسة + مساندة (أشجار/توجيه)", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/protocoles/page.tsx", "utf8");
    for (const h of ["/pediatrie", "/obstetrique", "/psychiatrie", "/traumatologie", "/triage"]) {
      expect(src, h).toContain(`href: "${h}"`); // مصفوفة التخصصات
    }
    for (const h of ["/arbres", "/guidage"]) {
      expect(src, h).toContain(`href="${h}"`); // شرائح المساندة JSX مباشرة
    }
  });
  it("Médicaments: 6 أدوات سياقية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/medicaments/page.tsx", "utf8");
    for (const h of ["/calculateurs/dose-check", "/calculateurs/interactions", "/calculateurs/antidotes", "/calculateurs/renal-dose", "/calculateurs/dilutions", "/calculateurs/debit-perfusion"]) {
      expect(src, h).toContain(`href: "${h}"`);
    }
  });
});

describe("v15.0 — تزامن الإصدار", () => {
  it("lib/version = 15.0 و sw.js متزامن", async () => {
    const fs = await import("node:fs");
    const { APP_VERSION } = await import("../lib/version");
    expect(APP_VERSION).toBe("18.1");
    const sw = fs.readFileSync("public/sw.js", "utf8");
    expect(sw).toContain('const VERSION = "eutn-v18.1";');
  });
});

describe("v15.1 — تلميع البنية", () => {
  it("الدرج متاح على كل المقاسات (بلا lg:hidden في الهيدر)", async () => {
    const fs = await import("node:fs");
    const header = fs.readFileSync("components/Header.tsx", "utf8");
    expect(header).not.toContain("lg:hidden");
  });
  it("الإنعاش والمذكّرة بترويسة M3 الموحدة PageHeader", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("app/rea/page.tsx", "utf8")).toContain("PageHeader");
    expect(fs.readFileSync("app/memo/page.tsx", "utf8")).toContain("PageHeader");
  });
});

describe("v15.2 — قابلية الاكتشاف", () => {
  it("كل مفاتيح الصفحات المسجلة تُحل في الفهرس (لا «أخيرة» تسقط بصمت)", async () => {
    const { resolveRef, loadSearchIndex } = await import("@/lib/search");
    await loadSearchIndex(); // v17.0 — index paresseux
    for (const k of ["outil:rea", "outil:memo", "outil:recherche", "outil:triage", "outil:fiche-samu", "outil:checklists"]) {
      expect(resolveRef(k), k).not.toBeNull();
    }
  });
  it("الصفحات الست تسجّل مفاتيح الفهرس الصحيحة", async () => {
    const fs = await import("node:fs");
    for (const [f, k] of [["app/rea/page.tsx", 'useRegisterRecent("outil:rea");'], ["app/memo/page.tsx", 'useRegisterRecent("outil:memo");'], ["app/fiche-samu/page.tsx", 'useRegisterRecent("outil:fiche-samu");'], ["app/checklists/page.tsx", 'useRegisterRecent("outil:checklists");'], ["app/recherche/page.tsx", 'useRegisterRecent("outil:recherche");'], ["app/triage/page.tsx", 'useRegisterRecent("outil:triage");']]) {
      expect(fs.readFileSync(f, "utf8"), f).toContain(k);
    }
    // لا مفاتيح page:* قديمة تبقى في أي صفحة
    for (const f of ["app/rea/page.tsx", "app/memo/page.tsx", "app/fiche-samu/page.tsx", "app/checklists/page.tsx", "app/recherche/page.tsx", "app/triage/page.tsx"]) {
      expect(fs.readFileSync(f, "utf8"), f).not.toContain('useRegisterRecent("page:');
    }
  });
  it("اختصار PWA للإنعاش في مقدمة القائمة", async () => {
    const fs = await import("node:fs");
    const m = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8"));
    expect(m.shortcuts[0].url).toBe("./rea");
    // اختصار الميدان المثبت تاريخياً يبقى
    expect(m.shortcuts.some((x: { url: string }) => x.url === "./terrain")).toBe(true);
  });
});
describe("v15.3 — المخزون المسبق (100% دون اتصال)", () => {
  it("sw.js يعلن PRECACHE ويحقنه في التثبيت", async () => {
    const fs = await import("node:fs");
    const sw = fs.readFileSync("public/sw.js", "utf8");
    expect(sw).toContain("const PRECACHE = /*__PRECACHE__*/[]");
    expect(sw).toContain("...PRECACHE.map((p) => `${BASE}${p}`)");
    expect(sw).toContain("Promise.allSettled"); // تثبيت متسامح: رابط فاشل لا يقتل المخزون
  });
  it("المولّد موجود، مُسلَّك في سلسلة البناء، ويغطي كل صفحات المستوى الأول بسقف حجم", async () => {
    const fs = await import("node:fs");
    const gen = fs.readFileSync("scripts/gen-precache.mjs", "utf8");
    // v17.0 — لم تعد القائمة المفروضة يدويًا (6 مسارات) موجودة: المولّد يعدّد كل مجلد
    // من المستوى الأول يحوي index.html. الحارس يتحقق من آلية التعداد نفسها.
    expect(gen).toContain("index.html");
    expect(gen).toContain("readdirSync(\"out\"");
    expect(gen).toContain("MAX_FILE");
    expect(gen).not.toMatch(/TAB_DIRS\s*=\s*\[/); // لا عودة إلى القائمة الجامدة
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    expect(pkg.scripts.build).toBe("next build && node scripts/gen-precache.mjs");
  });

  // v17.4 — «القائمة تُفتح دون اتصال» لم تكن كافية: النقر على أي بطاقة كان ينهار إلى تنقّل
  // كامل ثم إلى صفحة «دون اتصال»، لأن حمولة RSC لكل صفحة تفاصيل لم تكن مخزَّنة.
  it("v17.4 — المولّد يخزّن حمولات RSC لصفحات التفاصيل الثلاث", async () => {
    const fs = await import("node:fs");
    const gen = fs.readFileSync("scripts/gen-precache.mjs", "utf8");
    expect(gen).toContain("collectRoutePayloads");
    expect(gen).toContain('["protocoles", "medicaments", "calculateurs"]');
    expect(gen).toContain("index.txt"); // الحمولة التي يطلبها Router عند النقر فعلًا
    expect(gen).toContain("__next._tree.txt");
  });

  it("v17.4 — عامل الخدمة يخزّن حمولات RSC ويطبّع مسار التنقّل", async () => {
    const fs = await import("node:fs");
    const sw = fs.readFileSync("public/sw.js", "utf8");
    // فرع حمولات RSC (تنقّل داخلي) — مطابقة تتجاهل `?_rsc=`
    expect(sw).toContain('req.headers.get("RSC") === "1"');
    expect(sw).toContain("ignoreSearch: true");
    expect(sw).toContain("Response.error()");
    // تطبيع المسار: تنقّل كامل بعنوان ينتهي بشرطة مائلة يجب أن يجد النسخة المخزَّنة بدونه
    expect(sw).toContain("const clean = url.pathname.replace(/"); // v17.4 — تطبيع المسار
    for (const c of ["`${BASE}${clean}`", "`${BASE}${clean}/`", "`${BASE}${clean}.html`", "`${BASE}${clean}/index.html`"]) {
      expect(sw, c).toContain(c);
    }
  });
});
