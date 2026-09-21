// @vitest-environment jsdom
// v2.2 — اختبارات واجهات للمكونات الحرجة (تعمل داخل مشغّل vitest المشروع).
import { render, screen, fireEvent, cleanup, waitFor, within } from "@testing-library/react";
import { protocolDetailProps } from "@/lib/protocol-props";
import { medicationDetailProps } from "@/lib/medication-props";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

afterEach(cleanup);

const state: { updateReady: boolean; lastPref?: unknown[] } = { updateReady: false };
vi.mock("@/components/Providers", () => ({
  useApp: () => ({
    lang: "ar",
    t: (k: string) => k,
    prefs: { lang: "ar", theme: "dark", fontSize: 16, muted: false, printSize: "a4" },
    setPref: (...a: unknown[]) => (state.lastPref = a),
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
  __setUpdate: (b: boolean) => { state.updateReady = b; },
}));

import PumpTool from "@/components/tools/PumpTool";
import MedTools from "@/components/MedTools";
import AbgVent from "@/components/tools/AbgVent";
import UpdateBanner from "@/components/UpdateBanner";
import { MED_TOOLS } from "@/data/med-tools";

describe("PumpTool", () => {
  it("يحسب السرعة ويعرضها ثم يحدّثها مع الجرعة", () => {
    render(<PumpTool cfg={MED_TOOLS.noradrenaline.pump!} storageKey="eutn:test:pump" />);
    expect(screen.getAllByText(/0\.66/).length).toBeGreaterThan(0);
    const dose = screen.getAllByRole("spinbutton").find((i) => (i as HTMLInputElement).value === "0.05");
    fireEvent.change(dose!, { target: { value: "0.1" } });
    expect(screen.getAllByText(/1\.31/).length).toBeGreaterThan(0);
  });
});

// v17.2 — les pages /revision et /revisions lisent `ref-index.json` (fichier statique).
// Sous jsdom il n'y a pas de serveur : on simule la réponse depuis les données réelles,
// ce qui garde les tests fidèles au contenu tout en vérifiant le chemin de chargement.
// v17.2/17.4 — les pages et fiches lisent des fichiers statiques (`/ref-index.json`,
// `/reval/<id>`). Sous jsdom il n'y a pas de serveur : on branche `fetch` sur les **vraies
// routes** de l'application. Les tests exercent donc exactement la projection livrée, et une
// dérive entre route et données fait échouer la suite (voir aussi data.test.ts).
async function stubStaticFiles() {
  const refRoute = await import("@/app/ref-index.json/route");
  const revalRoute = await import("@/app/reval/[id]/route");
  const refBody = await refRoute.GET().text();

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
      if (url.includes("ref-index.json")) {
        return new Response(refBody, { status: 200, headers: { "Content-Type": "application/json" } });
      }
      const m = url.match(/\/reval\/([^/?#]+)/);
      // new Request() exige une URL absolue : le chemin réel est relatif au site.
      if (m) return revalRoute.GET(new Request(`http://localhost${url}`), { params: Promise.resolve({ id: m[1] }) });
      return new Response("null", { status: 404 });
    })
  );
}

describe("MedTools", () => {
  it("التبويب الافتراضي مضخة عند وجود جرعة وزنية أصلية", () => {
    render(<MedTools medId="noradrenaline" hasNativeDose />);
    const tab = screen.getByRole("tab", { name: /المضخة/ });
    expect(tab.getAttribute("aria-selected")).toBe("true");
  });
});

describe("AbgVent", () => {
  it("يفسر حماضاً تنفسياً", () => {
    render(<AbgVent />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "7.25" } });
    fireEvent.change(inputs[1], { target: { value: "60" } });
    expect(screen.getByText(/حماض تنفسي/)).toBeTruthy();
  });
});

describe("UpdateBanner", () => {
  it("يظهر عند الحدث ويختفي بدونه", () => {
    const { rerender } = render(<UpdateBanner />);
    expect(screen.queryByText(/نُصّب تحديث جديد/)).toBeNull();
    state.updateReady = true;
    rerender(<UpdateBanner />);
    expect(screen.getByText(/نُصّب تحديث جديد/)).toBeTruthy();
  });
});

describe("PumpTool mode entrante", () => {
  it("infère la concentration et propose le relais", () => {
    render(<PumpTool cfg={MED_TOOLS.noradrenaline.pump!} storageKey="eutn:test:inc" />);
    fireEvent.click(screen.getByRole("tab", { name: /محقنة قادمة/ }));
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "2" } });
    expect(screen.getByText(/الترحيل الآمن/)).toBeTruthy();
    expect(screen.getAllByText(/0\.66/).length).toBeGreaterThan(0);
  });
});

describe("MedTools pompe auto", () => {
  it("trinitrine hérite de la pompe RE.NAU", () => {
    render(<MedTools medId="trinitrine" hasNativeDose={false} />);
    expect(screen.getByRole("tab", { name: /تحضيري/ })).toBeTruthy();
  });
});

describe("StartPage", () => {
  it("المشي يعطي الأخضر فوراً", async () => {
    const StartPage = (await import("@/app/calculateurs/start/page")).default;
    render(<StartPage />);
    fireEvent.click(screen.getByRole("button", { name: /نعم/ }));
    expect(screen.getByText(/أخضر — إصابة خفيفة/)).toBeTruthy();
  });
});

describe("AbgVent ajustement", () => {
  it("يقترح رفع التردد عند الاحتباس الحامضي", () => {
    render(<AbgVent />);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "7.25" } });
    fireEvent.change(inputs[1], { target: { value: "60" } });
    expect(screen.getByText(/احتباس حامضي/)).toBeTruthy();
  });
});

describe("Parametres", () => {
  it("رابط سجل المستجدات وتبديل الثيم", async () => {
    const Parametres = (await import("@/app/parametres/page")).default;
    render(<Parametres />);
    const link = screen.getAllByRole("link").find((l) => l.getAttribute("href") === "/changelog");
    expect(link).toBeTruthy();
  });
});

describe("Sevrage ventilateur", () => {
  it("يتدرج من غير جاهز إلى نزع الأنبوب", async () => {
    const VentilateurPage = (await import("@/app/calculateurs/ventilateur/page")).default;
    render(<VentilateurPage />);
    expect(screen.getByText(/غير جاهز للاختبار/)).toBeTruthy();
    for (const cb of screen.getAllByRole("checkbox")) fireEvent.click(cb);
    expect(screen.getByText(/يمكن نزع الأنبوب/)).toBeTruthy();
  });
});

describe("Scores + MgSO4 UI", () => {
  it("qSOFA يتحدث مع التردد", async () => {
    const ScoresPage = (await import("@/app/calculateurs/scores/page")).default;
    render(<ScoresPage />);
    expect(screen.getAllByText(/0 \/ 3/).length).toBeGreaterThan(0);
    const rr = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(rr, { target: { value: "26" } });
    expect(screen.getAllByText(/1 \/ 3/).length).toBeGreaterThan(0);
  });
  it("أداة المغنزيوم تعرض 40 مل لأمبولة 10%", async () => {
    const ObstetriquePage = (await import("@/app/obstetrique/page")).default;
    render(<ObstetriquePage />);
    fireEvent.click(screen.getAllByRole("button").find((b) => b.textContent?.includes("10%"))!);
    expect(screen.getAllByText(/40/).length).toBeGreaterThan(0);
  });
});

describe("Quiz", () => {
  it("إجابة صحيحة تبرز التعليل", async () => {
    const QuizPage = (await import("@/app/quiz/page")).default;
    render(<QuizPage />);
    fireEvent.click(screen.getAllByRole("button").find((b) => b.textContent?.includes("500"))!);
    expect(screen.getByText(/500 مكغ عضلياً/)).toBeTruthy();
  });
});

describe("DKA page", () => {
  it("شريط أحمر عند بوتاسيوم منخفض", async () => {
    const DkaPage = (await import("@/app/calculateurs/dka/page")).default;
    render(<DkaPage />);
    const k = screen.getAllByRole("spinbutton")[1];
    fireEvent.change(k, { target: { value: "2.9" } });
    expect(screen.getByText(/أوقف الإنسولين/)).toBeTruthy();
  });
});

describe("Revue éditoriale", () => {
  it("تعرض كل المحتوى مع شارة الحداثة", async () => {
    await stubStaticFiles();
    const RevisionPage = (await import("@/app/revision/page")).default;
    const { container } = render(<RevisionPage />);
    // v17.2 — les lignes arrivent du fichier de références (chargement asynchrone)
    await waitFor(() => expect(container.querySelectorAll("li").length).toBeGreaterThan(50));
    expect(screen.getByText(/كل المحتوى روجع/)).toBeTruthy();
  });
});

describe("Chrono procédure", () => {
  it("يبدأ ويتحول إلى إيقاف", async () => {
    const ProcedureDetail = (await import("@/components/details/ProcedureDetail")).default;
    const { procedures } = await import("@/data/procedures");
    render(<ProcedureDetail procedure={procedures.find((p) => p.id === "intra-osseuse")!} />);
    expect(screen.getByText(/00:00/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /ابدأ/ }));
    expect(screen.getByRole("button", { name: /إيقاف/ })).toBeTruthy();
  });
});

describe("ReviewAlert", () => {
  it("يظهر عند بيانات قديمة ويغيب عند الحديثة", async () => {
    const ReviewAlert = (await import("@/components/ReviewAlert")).default;
    const { container: c1 } = render(<ReviewAlert rows={["2025-01"]} />);
    expect(c1.querySelector("a")).toBeTruthy();
    const { container: c2 } = render(<ReviewAlert rows={["2026-08"]} />);
    expect(c2.querySelector("a")).toBeNull();
  });
});

describe("stepTimes + stats", () => {
  it("خطوات التنبيب تحمل أهدافاً زمنية", async () => {
    const ProcedureDetail = (await import("@/components/details/ProcedureDetail")).default;
    const { procedures } = await import("@/data/procedures");
    render(<ProcedureDetail procedure={procedures.find((p) => p.id === "iot-rsi")!} />);
    expect(screen.getAllByText(/≤ 03:00/).length).toBeGreaterThan(0);
  });
  it("الإحصاءات تعدّ الاستخدام وتُصفَّر", async () => {
    const { bumpLocal, resetLocalStats } = await import("@/lib/analytics");
    resetLocalStats();
    bumpLocal("procedure_view:iot-rsi");
    bumpLocal("procedure_view:iot-rsi");
    const StatsPage = (await import("@/app/stats/page")).default;
    const { findByText } = render(<StatsPage />);
    expect(await findByText("2")).toBeTruthy();
    resetLocalStats();
  });
});

describe("Quiz défi + rotation", () => {
  it("انتهاء الوقت يعدّ إجابة خاطئة", async () => {
    const QuizInner = (await import("@/components/QuizGame")).default;
    render(<QuizInner seconds={1} />);
    fireEvent.click(screen.getByRole("button", { name: /تحدي/ }));
    await new Promise((r) => setTimeout(r, 1300));
    expect(screen.getByText(/انتهى الوقت/)).toBeTruthy();
  });

it("الخلط يبقي الإجابة الصحيحة صحيحة", async () => {
    const { vi } = await import("vitest");
    const rnd = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const QuizPage = (await import("@/app/quiz/page")).default;
    const { QUIZ } = await import("@/data/quiz");
    const { container } = render(<QuizPage />);
    const btns = Array.from(container.querySelectorAll("button"));
    const correctText = QUIZ[0].options[QUIZ[0].correct].ar;
    const target = btns.find((b) => b.textContent?.trim() === correctText);
    expect(target).toBeTruthy();
    fireEvent.click(target as HTMLButtonElement);
    expect((target as HTMLButtonElement).className).toContain("border-green-600");
    rnd.mockRestore();
  });
});
describe("Quiz catégories + néonat", () => {
  it("مصفاة الأدوية تعرض أسئلة الأدوية فقط", async () => {
    const QuizPage = (await import("@/app/quiz/page")).default;
    render(<QuizPage />);
    fireEvent.click(screen.getByRole("button", { name: "أدوية" }));
    expect(screen.getByText(/صدمة أرجية لدى كبير/)).toBeTruthy();
  });
  it("إجراء إنعاش الولدان يحمل الدقيقة الذهبية", async () => {
    const ProcedureDetail = (await import("@/components/details/ProcedureDetail")).default;
    const { procedures } = await import("@/data/procedures");
    render(<ProcedureDetail procedure={procedures.find((p) => p.id === "neonat-ran")!} />);
    expect(screen.getByText(/الدقيقة الذهبية/)).toBeTruthy();
  });
});

describe("Commandement RCP", () => {
  it("يسجل الأدرنالين في السجل", async () => {
    const RcpEquipePage = (await import("@/app/calculateurs/rcp-equipe/page")).default;
    render(<RcpEquipePage />);
    fireEvent.click(screen.getByRole("button", { name: /ابدأ/ }));
    fireEvent.click(screen.getByRole("button", { name: /أدرنالين/ }));
    expect(screen.getAllByText(/أدرنالين 1 ملغ/).length).toBeGreaterThan(0);
  });
});

describe("Sepsis commandement", () => {
  it("يحسب هدف التوسيع 30 مل/كغ", async () => {
    const SepsisCmdPage = (await import("@/app/calculateurs/sepsis-commandement/page")).default;
    render(<SepsisCmdPage />);
    expect(screen.getAllByText(/2100 mL/).length).toBeGreaterThan(0);
  });
});

describe("Assistant minute d'or néonatale", () => {
  it("تسجيل خطوة يؤرّخها في السجل", async () => {
    const NeonatRanPage = (await import("@/app/calculateurs/neonat-ran/page")).default;
    render(<NeonatRanPage />);
    fireEvent.click(screen.getByRole("button", { name: /تجفيف/ }));
    expect(screen.getAllByText(/تجفيف/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant intubation individuel", () => {
  it("محاولة اللارنجوسكوب تدخل السجل", async () => {
    const IotRsiPage = (await import("@/app/calculateurs/iot-rsi/page")).default;
    render(<IotRsiPage />);
    fireEvent.click(screen.getByRole("button", { name: /محاولة لارنجوسكوب/ }));
    expect(screen.getAllByText(/محاولة لارنجوسكوب/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Mes révisions personnelles", () => {
  it("يعرض المستحق ويختم المراجعة محلياً", async () => {
    const { protocols } = await import("@/data/protocols");
    const { medications } = await import("@/data/medications");
    const { calculators } = await import("@/data/calculators");
    const today = new Date().toISOString().slice(0, 10);
    const old = new Date(Date.now() - 40 * 86400000).toISOString().slice(0, 10);
    const store: Record<string, string> = {};
    protocols.forEach((p) => (store[`protocol:${p.id}`] = today));
    medications.forEach((m) => (store[`med:${m.id}`] = today));
    calculators.forEach((c) => (store[`calc:${c.id}`] = today));
    const id = protocols[0].id;
    store[`protocol:${id}`] = old;
    window.localStorage.setItem("eutn:reviews-v1", JSON.stringify(store));
    await stubStaticFiles();
    const RevisionsPage = (await import("@/app/revisions/page")).default;
    render(<RevisionsPage />);
    await screen.findByText(/روجعت قبل 40/);
    const row = screen.getByText(protocols[0].title.ar).closest("li") as HTMLLIElement;
    expect(row).toBeTruthy();
    fireEvent.click(row.querySelector("button") as HTMLButtonElement);
    const stored = JSON.parse(window.localStorage.getItem("eutn:reviews-v1")!) as Record<string, string>;
    expect(stored[`protocol:${id}`]).toBe(today);
    window.localStorage.removeItem("eutn:reviews-v1");
  });
});

describe("Assistant RCP pédiatrique individuel", () => {
  it("الوزن يفعّل الأدرنالين ويدخل الجرعة في السجل", async () => {
    const RcpPedsPage = (await import("@/app/calculateurs/rcp-peds/page")).default;
    const { container } = render(<RcpPedsPage />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /أدرنالين|Adrénaline/ }));
    expect(screen.getAllByText(/أدرنالين/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/1\.0 مل/)).toBeTruthy();
  });
});

describe("Assistant anaphylaxie individuel", () => {
  it("الوزن يحسب الجرعة والإعطاء يدخل السجل", async () => {
    const AnaphylaxiePage = (await import("@/app/calculateurs/anaphylaxie/page")).default;
    const { container } = render(<AnaphylaxiePage />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "25" } });
    fireEvent.click(screen.getByRole("button", { name: /أدرنالين عضلياً|Adrénaline IM/ }));
    expect(screen.getAllByText(/أدرنالين/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/0\.25/).length).toBeGreaterThan(0);
  });
});

describe("Assistant heure-1 DKA", () => {
  it("بوتاسيوم سليم يأذن بالأنسولين والعنصر يؤرّخ", async () => {
    const DkaH1Page = (await import("@/app/calculateurs/dka-h1/page")).default;
    const { container } = render(<DkaH1Page />);
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: "30" } });
    fireEvent.change(inputs[1] as HTMLInputElement, { target: { value: "4.5" } });
    expect(screen.getByText(/GO insuline/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /بدأ الأنسولين|Insuline IV démarrée/ }));
    expect(screen.getAllByText("00:00").length).toBeGreaterThan(0);
  });
});

describe("Assistant éclampsie individuel", () => {
  it("التحميل يدخل السجل بجرعة محسوبة", async () => {
    const EclampsiePage = (await import("@/app/calculateurs/eclampsie/page")).default;
    render(<EclampsiePage />);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي التحميل|Charge administrée/ }));
    expect(screen.getAllByText(/تحميل/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant crise d'asthme individuel", () => {
  it("الرذّة تدخل السجل بجرعة الوزن", async () => {
    const AsthmePage = (await import("@/app/calculateurs/asthme/page")).default;
    const { container } = render(<AsthmePage />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "18" } });
    fireEvent.click(screen.getByRole("button", { name: /رذّة|Nébulisation/ }));
    expect(screen.getAllByText(/رذّة|Nébulisation/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/2\.5/).length).toBeGreaterThan(0);
  });
});

describe("Assistant HPP individuel", () => {
  it("الأوكسيتوسين يدخل السجل", async () => {
    const HppPage = (await import("@/app/calculateurs/hpp/page")).default;
    render(<HppPage />);
    fireEvent.click(screen.getByRole("button", { name: /أوكسيتوسين 10 وحدات|Ocytocine 10 UI/ }));
    expect(screen.getAllByText(/أوكسيتوسين|Ocytocine/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant surdosage opioïde individuel", () => {
  it("النالوكسون يدخل السجل", async () => {
    const OpioidesPage = (await import("@/app/calculateurs/opioides/page")).default;
    render(<OpioidesPage />);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي النالوكسون|Naloxone administrée/ }));
    expect(screen.getAllByText(/نالوكسون|Naloxone/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant état de mal individuel", () => {
  it("الخط الأول يدخل السجل بجرعة الوزن", async () => {
    const EtatMalPage = (await import("@/app/calculateurs/etat-mal/page")).default;
    const { container } = render(<EtatMalPage />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "20" } });
    fireEvent.click(screen.getByRole("button", { name: /ميدازولام عضلياً 4|Midazolam IM 4/ }));
    expect(screen.getAllByText(/ميدازولام|Midazolam/).length).toBeGreaterThanOrEqual(1);
  });
});

describe("Assistant hypoglycémie individuel", () => {
  it("المعالجة تدخل السجل", async () => {
    const HypoglycemiePage = (await import("@/app/calculateurs/hypoglycemie/page")).default;
    const { container } = render(<HypoglycemiePage />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "15" } });
    fireEvent.click(screen.getByRole("button", { name: /أُعطيت المعالجة|Traitement administré/ }));
    expect(screen.getAllByText(/غلوكوز 10٪|D10/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant hyperkaliémie individuel", () => {
  it("الكالسيوم يدخل السجل", async () => {
    const HyperkalemiePage = (await import("@/app/calculateurs/hyperkalemie/page")).default;
    render(<HyperkalemiePage />);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي الكالسيوم|Calcium administré/ }));
    expect(screen.getAllByText(/غلوكونات|gluconate/i).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistants personnels (hub)", () => {
  it("يعرض المساعدين ويصفّي فورياً", async () => {
    const Hub = (await import("@/app/calculateurs/assistants/page")).default;
    const { container } = render(<Hub />);
    expect(screen.getByText("مساعد الإنعاش الفردي")).toBeTruthy();
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "ربو" } });
    expect(screen.getByText("مساعد نوبة الربو الفردي")).toBeTruthy();
    expect(screen.queryByText("مساعد الإنعاش الفردي")).toBeNull();
  });
});

describe("Assistant coup de chaleur individuel", () => {
  it("إعادة القياس ≥ 39 تعلن التبريد النشط", async () => {
    const Page = (await import("@/app/calculateurs/coup-chaleur/page")).default;
    const { container } = render(<Page />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "41" } });
    fireEvent.click(screen.getByRole("button", { name: /إعادة قياس الحرارة|Recontrôle T°/ }));
    expect(screen.getAllByText(/تبريد نشط جارٍ|refroidissement actif en cours/i).length).toBeGreaterThan(0);
  });
});

describe("Assistant RAU individuel", () => {
  it("تفريغ ≥ 1 ل يفعّل المراقبة", async () => {
    const Page = (await import("@/app/calculateurs/rau/page")).default;
    const { container } = render(<Page />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "1200" } });
    fireEvent.click(screen.getByRole("button", { name: /تم التفريغ|Vidange effectuée/ }));
    expect(screen.getAllByText(/1000/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /إعادة تقييم|Réévaluation/ })).toBeTruthy();
  });
});

describe("Assistant épistaxis individuel", () => {
  it("الضغط يدخل السجل", async () => {
    const Page = (await import("@/app/calculateurs/raaf/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /بدأ الضغط|Compression démarrée/ }));
    expect(screen.getAllByText(/ضغط جانبيّ الأنف|Compression pincée/).length).toBeGreaterThan(0);
  });
});

describe("Assistant plaies & suture individuel", () => {
  it("الخياطة تحسب تاريخ الفك", async () => {
    const Page = (await import("@/app/calculateurs/plaies/page")).default;
    const { container } = render(<Page />);
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "60" } });
    fireEvent.click(screen.getByRole("button", { name: /تمت الخياطة|Suture effectuée/ }));
    const demain = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10);
    expect(screen.getAllByText(new RegExp(demain)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/270|300/).length).toBeGreaterThan(0);
  });
});

describe("Assistant syncope individuel", () => {
  it("هبوط ≥ 20 يعلن الهبوط الانتصابي", async () => {
    const Page = (await import("@/app/calculateurs/syncope/page")).default;
    const { container } = render(<Page />);
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: "130" } });
    fireEvent.change(inputs[1] as HTMLInputElement, { target: { value: "105" } });
    expect(screen.getAllByText(/hypotension orthostatique OUI|هبوط انتصابي/).length).toBeGreaterThan(0);
  });
});

describe("Assistant tétanos individuel", () => {
  it("جرح خطر + تاريخ مجهول يوصي بالمعزز والمصل", async () => {
    const Page = (await import("@/app/calculateurs/tetanos/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /جرح خطر|Plaie à risque/ }));
    fireEvent.click(screen.getByRole("button", { name: /< 3 جرعات|< 3 doses/ }));
    expect(screen.getAllByText(/غلوبولينات مناعية 250|Ig antitétaniques 250/).length).toBeGreaterThan(0);
  });
});

describe("Assistant transfusion individuel", () => {
  it("بدء الوحدة يدخل السجل", async () => {
    const Page = (await import("@/app/calculateurs/transfusion/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /بدأت الوحدة|Unité démarrée/ }));
    expect(screen.getAllByText(/بدء وحدة|Unité démarrée/).length).toBeGreaterThan(0);
  });
});

describe("Assistant pneumonie (PAC) individuel", () => {
  it("ثلاثة معايير توجّه للإدخال والمضاد يؤرّخ", async () => {
    const Page = (await import("@/app/calculateurs/pac/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /تشوش|Confusion/ }));
    fireEvent.click(screen.getByRole("button", { name: /تنفس ≥ 30/ }));
    fireEvent.click(screen.getByRole("button", { name: /عمر ≥ 65|Âge ≥ 65/ }));
    expect(screen.getByText("3/5")).toBeTruthy();
    expect(screen.getAllByText(/إدخال ± عناية|hospitalisation ± soins/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي المضاد الحيوي|Antibiothérapie administrée/ }));
    expect(screen.getAllByText(/CURB-65/).length).toBeGreaterThan(0);
  });
});

describe("Assistant HDO individuel", () => {
  it("عناصر الخطر ترفع بلاشفورد وتوجّه للإدخال", async () => {
    const Page = (await import("@/app/calculateurs/hemo-digestive/page")).default;
    const { container } = render(<Page />);
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: "12" } });
    fireEvent.change(inputs[1] as HTMLInputElement, { target: { value: "9" } });
    fireEvent.change(inputs[2] as HTMLInputElement, { target: { value: "95" } });
    expect(screen.getAllByText(/إدخال \+ تنظير|hospitalisation \+ endoscopie/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي مثبط المضخة|IPP IV administré/ }));
    expect(screen.getAllByText(/مثبط المضخة|IPP/).length).toBeGreaterThan(0);
  });
});

describe("Assistant hypothermie individuel", () => {
  it("التدفئة وإعادة القياس يدخلان السجل", async () => {
    const Page = (await import("@/app/calculateurs/hypothermie/page")).default;
    const { container } = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /بدأت التدفئة|Réchauffement démarré/ }));
    fireEvent.change(container.querySelector("input") as HTMLInputElement, { target: { value: "30" } });
    fireEvent.click(screen.getByRole("button", { name: /إعادة قياس الحرارة|Recontrôle T°/ }));
    expect(screen.getAllByText(/بدأت التدفئة|Réchauffement démarré/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/إعادة قياس/).length).toBeGreaterThan(0);
  });
});

describe("Assistant noyade individuel", () => {
  it("علامة إنذار توجب الإدخال", async () => {
    const Page = (await import("@/app/calculateurs/noyade/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/مراقبة 4-6|observation 4-6/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /تشبع < 94|SpO2 < 94/ }));
    expect(screen.getAllByText(/علامة إنذار|signe\(s\) d'alarme/).length).toBeGreaterThan(0);
  });
});

describe("Assistant colique néphrétique individuel", () => {
  it("المضاد يدخل السجل وعلم يستدعي المسالك", async () => {
    const Page = (await import("@/app/calculateurs/colique/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /أُعطي مضاد الالتهاب|AINS administré/ }));
    expect(screen.getAllByText(/كيتوبروفين|Kétoprofène/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /حمى \/ إنتان|Fièvre \/ sepsis/ }));
    expect(screen.getAllByText(/رأي مسالك|avis urologie/).length).toBeGreaterThan(0);
  });
});

describe("Assistant sevrage alcool individuel", () => {
  it("علامات كثيرة توصي بالمعايرة الوريدية", async () => {
    const Page = (await import("@/app/calculateurs/sevrage-alcool/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /رجفان|Tremblements/ }));
    fireEvent.click(screen.getByRole("button", { name: /تعرق|Sueurs/ }));
    fireEvent.click(screen.getByRole("button", { name: /هياج\/قلق|Agitation\/anxiété/ }));
    fireEvent.click(screen.getByRole("button", { name: /نبض > 100|Pouls > 100/ }));
    expect(screen.getAllByText(/ديازيبام وريدياً معايرةً|diazépam IV titré/).length).toBeGreaterThan(0);
  });
});

describe("Assistant agitation aiguë individuel", () => {
  it("الهالوبيريدول يدخل السجل", async () => {
    const Page = (await import("@/app/calculateurs/agitation/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /هالوبيريدول 5 ملغ عضلياً|Halopéridol 5 mg IM/ }));
    expect(screen.getAllByText(/هالوبيريدول|Halopéridol/).length).toBeGreaterThanOrEqual(2);
  });
});

describe("Assistant brûlure individuel", () => {
  it("السوائل تحسب والتبريد يدخل السجل", async () => {
    const Page = (await import("@/app/calculateurs/brulures/page")).default;
    const { container } = render(<Page />);
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: "70" } });
    fireEvent.change(inputs[1] as HTMLInputElement, { target: { value: "20" } });
    expect(screen.getAllByText(/2800/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /بدأ التبريد|Refroidissement démarré/ }));
    expect(screen.getAllByText(/تبريد \(ماء جارٍ|Refroidissement \(eau/).length).toBeGreaterThan(0);
  });
});

describe("Assistant migraine aiguë individuel", () => {
  it("الميتوكلوبراميد يدخل السجل وعلم يستدعي التصوير", async () => {
    const Page = (await import("@/app/calculateurs/migraine/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /ميتوكلوبراميد 10 ملغ|Métoclopramide 10 mg/ }));
    expect(screen.getAllByText(/ميتوكلوبراميد|Métoclopramide/).length).toBeGreaterThanOrEqual(2);
    fireEvent.click(screen.getByRole("button", { name: /صداع رعدي|Céphalée tonnerre/ }));
    expect(screen.getAllByText(/تصوير ± بزل|imagerie ± PL/).length).toBeGreaterThan(0);
  });
});

describe("Assistant trauma de membre individuel", () => {
  it("التثبيت يدخل السجل وعلم وعائي يستعجل الجراحة", async () => {
    const Page = (await import("@/app/calculateurs/trauma-membres/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /تم التثبيت|Immobilisation effectuée/ }));
    expect(screen.getAllByText(/تثبيت \(مفاصل|Immobilisation \(articulations/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /غياب نبض بعيد|Pouls distal aboli/ }));
    expect(screen.getAllByText(/رأي جراحي عاجل|avis chirurgical urgent/).length).toBeGreaterThan(0);
  });
});

describe("Mode terrain", () => {
  it("جرعات فورية بالوزن الافتراضي وتتبدل مع الطفل", async () => {
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/0,50 mL|0.50/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /طفل|Enfant/ }));
    expect(screen.getAllByText(/75 mL/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2\.5 mg/).length).toBeGreaterThan(0);
  });
  it("ست حالات ميدانية إضافية بجرعات فورية", async () => {
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/ésoméprazole 80 mg/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Halopéridol 5 mg IM/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diazépam 10 mg PO/).length).toBeGreaterThan(0);
  });
  it("سطر التحضير يظهر للبطاقات الممددة", async () => {
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/تحضير: 1 mL ampoule|Prépa : 1 mL ampoule/).length).toBeGreaterThan(0);
  });
  it("محركات النجاعة: مترونوم وتنبيهات صوتية ونسخ بلمسة", async () => {
    const Rcp = (await import("@/app/calculateurs/rcp-equipe/page")).default;
    const { unmount } = render(<Rcp />);
    fireEvent.click(screen.getByRole("button", { name: /مترونوم|Métronome/ }));
    expect(screen.getByRole("button", { name: /إيقاف|Pause/ })).toBeTruthy();
    expect(screen.getAllByText(/الآن: ابدأ التدليك|Maintenant :/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /مترونوم|Métronome/ }));
    expect(screen.queryByRole("button", { name: /تنبيهات صوتية|Alertes vocales/ })).toBeNull();
    unmount();
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    fireEvent.click(screen.getAllByRole("button", { name: /نسخ|copier/ })[0]);
    expect(screen.getAllByText("✓").length).toBeGreaterThan(0);
  });
  it("شارة «الآن» القيادية في المساعدين الزمنيين", async () => {
    const Sep = (await import("@/app/calculateurs/sepsis-commandement/page")).default;
    const r1 = render(<Sep />);
    expect(screen.getAllByText(/مضاد واسع الآن|Antibiotique large maintenant/).length).toBeGreaterThan(0);
    r1.unmount();
    const Bru = (await import("@/app/calculateurs/brulures/page")).default;
    render(<Bru />);
    expect(screen.getAllByText(/تبريد بماء جارٍ الآن|Refroidissement à l'eau courante maintenant/).length).toBeGreaterThan(0);
  });
  it("الميدان مفروز بالخطورة مع وسوم", async () => {
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/حيوي|Vital/).length).toBeGreaterThan(5);
    const cards = screen.getAllByRole("listitem");
    expect(cards[0].textContent).toMatch(/توقف قلب الكبير|Arrêt cardiaque adulte/);
    expect(cards[cards.length - 1].textContent).toMatch(/احتباس بولي|Rétention urinaire|إغماء|Syncope/);
  });
  it("المانيفست يحمل اختصار الميدان", async () => {
    const fs = await import("fs");
    const m = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8")) as { shortcuts: { url: string }[] };
    expect(m.shortcuts.some((x) => x.url === "./terrain")).toBe(true);
  });
});

describe("التدخل الموجّه", () => {
  it("يكشف التعكر ويكيف الخطوات والجرعات", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    // الافتراضي: صدمة/إنتان بقيم سليمة → لا توسيع
    expect(screen.queryByText(/هبط|Hypotension/)).toBeNull();
    // خفض الضغط إلى 80
    const moins = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 8; i++) fireEvent.click(moins);
    expect(screen.getAllByText(/هبوط ضغط|Hypotension/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2100 mL/).length).toBeGreaterThan(0);
    //切换到呼吸 case
    fireEvent.click(screen.getByRole("button", { name: /ضيق تنفس|Détresse respiratoire/ }));
    const moinsSpo2 = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 7; i++) fireEvent.click(moinsSpo2);
    expect(screen.getAllByText(/نقص أكسجة شديد|Hypoxémie sévère/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/أكسجين معاير|O2 titré/).length).toBeGreaterThan(0);
  });
  it("حالات جديدة: ارتعاج وحماض كيتوني بتكيف الجرعات", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /ارتعاج|Éclampsie/ }));
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/ارتعاج \(اختلاجات\)|Éclampsie \(convulsions\)/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MgSO4 4 g IV en 20 min|4 غ وريدياً خلال 20 د/).length).toBeGreaterThan(0);
  });
  it("حماض كيتوني: بوتاسيوم منخفض يوقف الأنسولين", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /حُماض|حماض|Acidocétose/ }));
    const moinsK = screen.getAllByRole("button", { name: "moins" })[1];
    for (let i = 0; i < 12; i++) fireEvent.click(moinsK);
    expect(screen.getAllByText(/أوقف الأنسولين|insuline HOLD/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/صحح البوتاسيوم قبل الأنسولين|Corriger K\+/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/أنسولين سريع 0,1|Insuline rapide 0,1/)).toBeNull();
  });
  it("وسوم خطورة وفرز + نزف هضمي ونقص سكر يتكيفان", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/حيوي|Vital/).length).toBeGreaterThan(5);
    fireEvent.click(screen.getByRole("button", { name: /نزف هضمي|Hémorragie digestive/ }));
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[1]);
    const moins = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 8; i++) fireEvent.click(moins);
    expect(screen.getAllByText(/صدمة نقص حجم|Choc hypovolémique/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/نقل دم|transfusion/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /نقص سكر|Hypoglycémie/ }));
    const moinsG = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 6; i++) fireEvent.click(moinsG);
    const moinsGcs = screen.getAllByRole("button", { name: "moins" })[1];
    for (let i = 0; i < 4; i++) fireEvent.click(moinsGcs);
    expect(screen.getAllByText(/D50 50 mL|D50 50 مل/).length).toBeGreaterThan(0);
  });
  it("فحوص تكميلية تفاعلية: سكانر ينهي الإذابة وسلسلة نحو الأداة", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /سكتة دماغية|AVC/ }));
    fireEvent.click(screen.getByRole("button", { name: /^مستشفى$|^Hospitalier$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^نزف$|^Hémorragie$/ }));
    expect(screen.getAllByText(/الإذابة ممنوعة|CONTRE-INDIQUÉE/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/إذابة خلال 4 س 30|Thrombolyse < 4 h 30/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /ألم صدري|Douleur thoracique/ }));
    fireEvent.click(screen.getByRole("button", { name: /ارتفاع ST|Sus-décalage ST/ }));
    expect(screen.getAllByText(/توطين ارتفاع ST|Localisation ST\+/).length).toBeGreaterThan(0);
  });
  it("بيئة الميدان: لا سكانر ونقل مباشر بدل الإذابة", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /سكتة دماغية|AVC/ }));
    expect(screen.queryByRole("button", { name: /لم يُعمل|Non fait/ })).toBeNull();
    expect(screen.getAllByText(/نقل مباشر|transport direct/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/عند الوصول|À l'arrivée/).length).toBeGreaterThan(0);
  });
  it("نزف الولادة والوليدان في المحرك", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /نزف ما بعد الولادة|post-partum/ }));
    expect(screen.getAllByText(/تمسيد رحمي|massage utérin/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /وليد|Nouveau-né/ }));
    const moinsFc = screen.getAllByRole("button", { name: "moins" })[1];
    for (let i = 0; i < 9; i++) fireEvent.click(moinsFc);
    expect(screen.getAllByText(/تهوية خلال 60|VPP dans les 60/).length).toBeGreaterThan(0);
  });
  it("سحايا بفرفرية: مضاد فوري ميدانياً؛ وانصمام بصدمة: نقل لا إذابة ميدانياً", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /سحايا|Méningite/ }));
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/سيفترياكسون 2 غ|Ceftriaxone 2 g/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /انصمام|Embolie/ }));
    const moins = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 7; i++) fireEvent.click(moins);
    expect(screen.getAllByText(/نقل مباشر|transport direct/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/إذابة \(ألتيبلاز\)|Thrombolyse \(altéplase\)/)).toBeNull();
  });
  it("CO: أكسجين 100% ونقل؛ وتسرع بطيني بلا نبض ⇒ إنعاش", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /أول أكسيد|CO/ }));
    expect(screen.getAllByText(/أكسجين 100%|O2 100 %/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /تسرعات بطينية|Tachycardies/ }));
    fireEvent.click(screen.getByRole("button", { name: /بلا نبض|sans pouls/ }));
    expect(screen.getAllByText(/مساعد الإنعاش|Assistant RCP/).length).toBeGreaterThan(0);
  });
  it("البروتوكولات الثابتة تحمل فحوصاً تكميلية منظمة", async () => {
    const { protocols } = await import("@/data/protocols");
    const avc = protocols.find((p) => p.id === "avc")!;
    expect(avc.exams?.img?.length).toBeGreaterThan(0);
    const stemi = protocols.find((p) => p.id === "sca-stemi")!;
    expect(stemi.exams?.ecg?.length).toBeGreaterThan(0);
    const par = protocols.find((p) => p.id === "intoxication-paracetamol")!;
    expect(par.exams?.bio?.length).toBeGreaterThan(0);
  });
  it("بطء قلب شديد: أتروبين ونازم حسب العلامات", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /بطء قلب|Bradycardie/ }));
    const moins = screen.getAllByRole("button", { name: "moins" })[0];
    for (let i = 0; i < 5; i++) fireEvent.click(moins);
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/أتروبين|Atropine/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ناظم عبر الجلد|transcutanée/).length).toBeGreaterThan(0);
  });
  it("عقرب: درجة II ⇒ نقل/إعلان مسبق ميدانياً ومصل مضاد بالمستشفى", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /لسعة عقرب|Envenimation/ }));
    expect(screen.getAllByText(/ممنوع|Interdits/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/إعلان مسبق|pré-alerte/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/مصل مضاد|Antivenin/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^مستشفى$|^Hospitalier$/ }));
    expect(screen.getAllByText(/مصل مضاد|Antivenin/).length).toBeGreaterThan(0);
  });
  it("صعق كهربائي: أمان المشهد أولاً؛ توتر عالٍ ⇒ نقل ميدانياً وإرواء بالمستشفى", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /صعق كهربائي|Électrisation/ }));
    expect(screen.getAllByText(/قطع التيار|couper le courant/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/إعلان مسبق|pré-alerte/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/إرواء كثيف|hydratation agressive/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^مستشفى$|^Hospitalier$/ }));
    expect(screen.getAllByText(/إرواء كثيف|hydratation agressive/).length).toBeGreaterThan(0);
  });
  it("ACR بالغ: نظم صاعق ⇒ صدم 150-200 ج + أميودارون بعد الثالثة", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /توقف قلب — بالغ|ACR adulte/ }));
    expect(screen.getAllByText(/تدليك 100-120|MCE 100-120/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/150-200/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /قابل للصدم|choquable/ }));
    expect(screen.getAllByText(/150-200/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/300 mg|300 ملغ/).length).toBeGreaterThan(0);
  });
  it("ACR طفل: جرعات محسوبة بالوزن (10 كغ)", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /توقف قلب — طفل|ACR pédiatrique/ }));
    expect(screen.getAllByText(/0\.10 mg/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/20 J/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /قابل للصدم|choquable/ }));
    expect(screen.getAllByText(/20 J/).length).toBeGreaterThan(0);
  });
  it("تسمم دوائي: مركّب واسع ⇒ بيكربونات بالمستشفى وإعلان مسبق ميدانياً", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /تسمم دوائي|Intoxication médicamenteuse/ }));
    fireEvent.click(screen.getByRole("button", { name: /مركّب واسع|QRS larges/ }));
    expect(screen.getAllByText(/إعلان مسبق|pré-alerte/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/بيكربونات|Bicarbonates/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^مستشفى$|^Hospitalier$/ }));
    expect(screen.getAllByText(/بيكربونات|Bicarbonates/).length).toBeGreaterThan(0);
  });
  it("إغماء: تخطيط مضطرب ⇒ نقل ومراقبة؛ سليم ⇒ مراجعة مؤجلة", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /إغماء|Syncope/ }));
    expect(screen.getAllByText(/مراجعة مؤجلة|consultation différée/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /مضطرب|Anormal/ }));
    expect(screen.getAllByText(/نقل طبي|transport médicalisé/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/مراجعة مؤجلة|consultation différée/)).toBeNull();
  });
  it("ميدان: البطاقات الحيوية الأربع الجديدة بجرعات فورية", async () => {
    const Page = (await import("@/app/terrain/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/Furosémide 40 mg/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2100 mL/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4ᵉ EIC/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Parkland/).length).toBeGreaterThan(0);
  });
  it("نوبة قان: حماض ⇒ تهوية غير باضعة بالمستشفى وإعلان مسبق ميدانياً", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /نوبة قان|Exacerbation BPCO/ }));
    const plus = screen.getAllByRole("button", { name: "plus" });
    for (let i = 0; i < 15; i++) fireEvent.click(plus[1]); // FR 16 → 31
    expect(screen.getAllByText(/إعلان مسبق|pré-alerte/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/VNI si pH|غير باضعة إن/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^مستشفى$|^Hospitalier$/ }));
    expect(screen.getAllByText(/VNI si pH|غير باضعة إن/).length).toBeGreaterThan(0);
  });
  it("فوسفور عضوية: حماية المسعفين + أتروبين بمضاعفة حتى الجفاف", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /فوسفور عضوية|Organophosphorés/ }));
    expect(screen.getAllByText(/حماية المسعفين|Protection des secouristes/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: /^لا$|^Non$/ })[0]);
    expect(screen.getAllByText(/بلا سقف|sans plafond/).length).toBeGreaterThan(0);
  });
  it("جفاف طفل شديد: دفقة 20 مل/كغ محسوبة", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /جفاف طفل|Déshydratation enfant/ }));
    fireEvent.click(screen.getByRole("button", { name: /≥ 10/ }));
    expect(screen.getAllByText(/200 mL/).length).toBeGreaterThan(0);
  });
  it("فرط ضغط طارئ: سلخ ⇒ حاصر بيتا أولاً؛ بلا أعراض ⇒ فموي لا وريدي", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /فرط ضغط طارئ|HTA urgence/ }));
    const plus = screen.getAllByRole("button", { name: "plus" })[0];
    for (let i = 0; i < 16; i++) fireEvent.click(plus); // 120 → 200
    expect(screen.getAllByText(/فموي \+ متابعة|traitement PO/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /سلخ أبهري|Dissection/ }));
    expect(screen.getAllByText(/حاصر بيتا أولاً|bêta-bloquant d'abord/).length).toBeGreaterThan(0);
  });
  it("quiz: إجابة صحيحة ⇒ تعليل فوري", async () => {
    const Page = (await import("@/app/quiz/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /500 مكغ|500 µg/ }));
    expect(screen.getAllByText(/فخذ|cuisse/).length).toBeGreaterThan(0);
  });
  it("v7.2 بروتوكول: بانر الحالة التفاعلية + شريط أقسام", async () => {
    const { protocols } = await import("@/data/protocols");
    const Detail = (await import("@/components/details/ProtocolDetail")).default;
    const avc = protocols.find((p) => p.id === "avc")!;
    await stubStaticFiles();
    render(<Detail {...protocolDetailProps(avc)} />);
    // v17.1/17.4 — guidage et réévaluation arrivent APRÈS le premier rendu, sous forme de
    // fichiers statiques (~2 Ko) : le test doit donc attendre leur résolution.
    expect(await screen.findByText(/التدخل الموجّه التفاعلي|intervention guidée/, undefined, { timeout: 3000 })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /الفحوص|Examens/ }).length).toBeGreaterThan(0);
  });
  it("v7.4 حاسبات: فلتر العائلات يقلّص القائمة", async () => {
    const Page = (await import("@/app/calculateurs/page")).default;
    render(<Page />);
    expect(screen.getAllByText(/Broselow/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /سموم|Toxico/ }));
    expect(screen.queryByText(/Broselow/)).toBeNull();
    expect(screen.getAllByText(/Naloxone|نالوكسون|opioides|Apin/).length).toBeGreaterThan(0);
  });
  it("v7.4 دواء: شريط أقسام لاصق", async () => {
    const { getMedication } = await import("@/data/medications");
    const Detail = (await import("@/components/details/MedicationDetail")).default;
    const adr = getMedication("adrenaline")!;
    render(<Detail {...medicationDetailProps(adr)} />);
    expect(screen.getAllByRole("button", { name: /جرعات|Doses/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /أدوات وروابط|Outils/ }).length).toBeGreaterThan(0);
  });
  it("v17.4 : la réévaluation et le guidage arrivent par fichiers dédiés", async () => {
    await stubStaticFiles();
    const { protocols } = await import("@/data/protocols");
    const Detail = (await import("@/components/details/ProtocolDetail")).default;
    const avc = protocols.find((p) => p.id === "avc")!;
    const { container } = render(<Detail {...protocolDetailProps(avc)} />);
    // le premier rendu ne contient PAS le panneau : il arrive ensuite, et il coûte ~2 Ko
    // (fichier dédié + fichier de références) au lieu des 320 Ko des deux bases complètes.
    expect(container.querySelector("#reval")).toBeNull();
    await waitFor(() => expect(container.querySelector("#reval")).toBeTruthy(), { timeout: 3000 });
    expect(await screen.findByText(/التدخل الموجّه التفاعلي|intervention guidée/, undefined, { timeout: 3000 })).toBeTruthy();
    // رابط «البدء هنا» يفتح السيناريو الموجَّه — selector مرن لأن Next يضيف شرطة مائلة
    expect(container.querySelector('a[href*="/guidage"][href*="c="]')).toBeTruthy();
    // les fetchs portent sur les fichiers statiques, pas sur des modules JS de données
    const urls = (fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.map((c) => String(c[0]));
    // le fichier de réévaluation est bien demandé par la fiche…
    expect(urls, `urls=${JSON.stringify(urls)}`).toContainEqual(expect.stringContaining("/reval/avc"));
    // …et rien ne recharge un morceau JS de données (l'index peut être déjà en mémoire)
    expect(urls.every((u) => !u.includes("/_next/static/chunks")), `urls=${JSON.stringify(urls)}`).toBe(true);
  });

  it("v17.4 : une fiche sans situation de guidage garde sa réévaluation sans bannière", async () => {
    await stubStaticFiles();
    const { protocols } = await import("@/data/protocols");
    const Detail = (await import("@/components/details/ProtocolDetail")).default;
    // protocole volontairement absent des situations de guidage
    const sterile = protocols.find((p) => p.id === "colique-nephretique")!;
    const { container } = render(<Detail {...protocolDetailProps(sterile)} />);
    await waitFor(() => expect(container.querySelector("#reval")).toBeTruthy(), { timeout: 3000 });
    expect(container.querySelector('a[href*="/guidage"][href*="c="]')).toBeNull();
  });

  it("v7.5 بروتوكولات: فلتر الفئة + بحث", async () => {
    await stubStaticFiles();
    const Page = (await import("@/app/protocoles/page")).default;
    render(<Page />);
    // v17.3 — la liste s'appuie sur le fichier de références (chargement asynchrone)
    await screen.findByText(/الحرق الشديد/);
    fireEvent.click(screen.getByRole("button", { name: /استعجالات طبية|Urgences médicales/ }));
    expect(screen.getAllByText(/الجلطة/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/الحرق الشديد/)).toBeNull();
  });
  it("v7.5 توجيه: فلتر الخطورة حيوي فقط", async () => {
    const Page = (await import("@/app/guidage/page")).default;
    const { container } = render(<Page />);
    const btns = () => [...container.querySelectorAll("button")];
    fireEvent.click(btns().find((b) => b.textContent === "حيوي")!);
    const caseChips = btns().filter((b) => b.querySelector("span") !== null && (b.textContent ?? "").length > 4);
    expect(caseChips.length).toBeGreaterThan(0);
    expect(caseChips.every((b) => (b.textContent ?? "").startsWith("حيوي"))).toBe(true);
  });  it("v7.6 توجيه: اختيار حالة يستدعي الانزلاق الآلي", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const spy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    const Page = (await import("@/app/guidage/page")).default;
    const { container } = render(<Page />);
    const chip = [...container.querySelectorAll("button")].find(
      (b) => b.querySelector("span") !== null && (b.textContent ?? "").length > 4
    )!;
    fireEvent.click(chip);
    await waitFor(() => expect(spy).toHaveBeenCalled());
    spy.mockRestore();
  });
  it("v7.6 تخطيط: تبديل الإيقاع يستدعي الانزلاق الآلي", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const spy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    const Page = (await import("@/app/ecg/page")).default;
    render(<Page />);
    fireEvent.click(screen.getAllByRole("tab")[1]);
    await waitFor(() => expect(spy).toHaveBeenCalled());
    spy.mockRestore();
  });
  it("v7.6 فرز: فتح حالة يستدعي الانزلاق الآلي", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const spy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    const Page = (await import("@/app/triage/page")).default;
    render(<Page />);
    fireEvent.click(screen.getAllByRole("button", { expanded: false })[0]);
    await waitFor(() => expect(spy).toHaveBeenCalled());
    spy.mockRestore();
  });
});
describe("v7.7 réévaluation", () => {
  it("كل البروتوكولات الـ39 لها حلقة إعادة تقييم كاملة", async () => {
    const { revals } = await import("@/data/reval");
    const { protocols } = await import("@/data/protocols");
    expect(protocols.length).toBe(98);
    for (const p of protocols) {
      const r = revals[p.id];
      expect(r, `reval manquant: ${p.id}`).toBeDefined();
      expect(r.intervalMin).toBeGreaterThan(0);
      expect(r.criteria.length).toBeGreaterThan(0);
      for (const k of ["improve", "stall", "worsen"] as const) {
        expect(r[k].signs.length, `${p.id}.${k}.signs`).toBeGreaterThan(0);
        expect(r[k].actions.length, `${p.id}.${k}.actions`).toBeGreaterThan(0);
      }
      expect(r.pivots.length).toBeGreaterThan(0);
      for (const pv of r.pivots) expect(pv.href.startsWith("/")).toBe(true);
    }
  });
  it("لوحة قائد الميدان: حكم التعكّر يعرض التصرف وينزلق", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const spy = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
    const Panel = (await import("@/components/details/RevalPanel")).default;
    const { revals } = await import("@/data/reval");
    render(<Panel reval={revals["anaphylaxie"]} protocolId="anaphylaxie" />);
    fireEvent.click(screen.getByRole("button", { name: /تعكّر/ }));
    expect(await screen.findByText(/أدرينالين وريدي بمعايرة/)).toBeTruthy();
    await waitFor(() => expect(spy).toHaveBeenCalled());
    spy.mockRestore();
  });
});

describe("v7.8 réévaluation complète", () => {
  beforeEach(() => { window.localStorage.clear(); });
  it("MEWS/qSOFA : حسابات صحيحة", async () => {
    const { mews, qsofa } = await import("@/lib/ews");
    expect(mews({ rr: 12, hr: 80, sbp: 120, temp: 37, avpu: 0 })).toEqual({ score: 0, risk: "low" });
    expect(mews({ rr: 16, hr: 80, sbp: 120, temp: 37, avpu: 0 }).score).toBe(1);
    expect(mews({ rr: 32, hr: 135, sbp: 70, temp: 39, avpu: 3 }).score).toBe(14);
    expect(mews({ rr: 32, hr: 135, sbp: 70, temp: 39, avpu: 3 }).risk).toBe("high");
    expect(qsofa({ rr: 24, sbp: 95, altered: true })).toEqual({ score: 3, risk: "high" });
    expect(qsofa({ rr: 16, sbp: 120, altered: false })).toEqual({ score: 0, risk: "low" });
  });
  it("سجل الدورات: تعكّران متتاليان ⇒ إنذار التحويل", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const Panel = (await import("@/components/details/RevalPanel")).default;
    const { revals } = await import("@/data/reval");
    render(<Panel reval={revals["oap"]} protocolId="oap" />);
    fireEvent.click(screen.getByRole("button", { name: /تعكّر/ }));
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /دورة إعادة تقييم جديدة/ }));
    fireEvent.click(screen.getByRole("button", { name: /تعكّر/ }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    // السجل محفوظ فعلاً
    expect(JSON.parse(window.localStorage.getItem("reval:log:oap") ?? "[]").length).toBe(2);
  });
  it("SBAR يولَّد دون إنترنت ويحتوي الأقسام الأربعة", async () => {
    const Panel = (await import("@/components/details/RevalPanel")).default;
    const { revals } = await import("@/data/reval");
    render(<Panel reval={revals["oap"]} protocolId="oap" protocolTitle={{ fr: "OAP", ar: "وذمة رئة" }} />);
    fireEvent.click(screen.getByRole("button", { name: /ولّد SBAR/ }));
    const pre = await screen.findByText((_, el) => el?.tagName === "PRE");
    expect(pre.textContent).toContain("S —");
    expect(pre.textContent).toContain("R —");
    expect(pre.textContent).toContain("وذمة رئة");
  });
  it("ROSC: قائمة التحقق تظهر عند التحسّن في بروتوكول التوقف", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const Panel = (await import("@/components/details/RevalPanel")).default;
    const { revals } = await import("@/data/reval");
    render(<Panel reval={revals["acr-adulte"]} protocolId="acr-adulte" />);
    fireEvent.click(screen.getByRole("button", { name: /تحسّن/ }));
    expect(await screen.findByText(/SpO₂ ‏94-98%/)).toBeTruthy();
    expect(screen.getAllByText(/تخطيط 12 مشتقاً/).length).toBeGreaterThan(0);
  });
  it("v7.9 PERC : صفر يستبعد، و≥1 يطلب D-dimères", async () => {
    const Page = (await import("@/app/calculateurs/perc/page")).default;
    render(<Page />);
    expect(screen.getByText(/دون D-dimer|SANS D-dimères/)).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: /العمر ≥ 50|Âge ≥ 50/ }));
    expect(screen.getByText(/D-dimères indiqués|D-dimer مطلوب/)).toBeTruthy();
  });
  it("v7.9 أقرب تشخيصين: ألم صدري + زلة ⇒ إكليلي/انصمام", async () => {
    const Page = (await import("@/app/calculateurs/ddx/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("checkbox", { name: /ألم صدري|Douleur thoracique/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /زلة تنفسية|Dyspnée/ }));
    expect(await screen.findByText(/SCA|متلازمة تاجية/)).toBeTruthy();
    expect(screen.getByText(/Embolie pulmonaire|انصمام رئوي/)).toBeTruthy();
  });
  it("v7.9 ماسح الرأس الكندي: ≥65 ⇒ تصوير", async () => {
    const Page = (await import("@/app/calculateurs/canadian-ct-head/page")).default;
    render(<Page />);
    expect(screen.getByText(/لا ماسح|PAS de scanner/)).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: /العمر ≥ 65|Âge ≥ 65/ }));
    expect(screen.getByText(/ماسح دماغي مطلوب|SCANNER CÉRÉBRAL INDIQUÉ/)).toBeTruthy();
  });
  it("v7.9 بحث: البروتوكولات تحمل الخطورة ورابط الإجراءات", async () => {
    const { getSearchIndex, loadSearchIndex } = await import("@/lib/search");
    await loadSearchIndex(); // v17.0 — index paresseux
    const searchIndex = getSearchIndex();
    const acr = searchIndex.find((i) => i.key === "protocole:acr-adulte");
    expect(acr?.sev).toBe("critical");
    expect(acr?.href).toBe("/protocoles/acr-adulte#steps");
    const med = searchIndex.find((i) => i.key === "medicament:adrenaline");
    expect(med?.href).toBe("/medicaments/adrenaline#doses");
  });
  it("v7.9 سجل الحاسبات: الخمس الجديدة موجودة", async () => {
    const { calculators } = await import("@/data/calculators");
    for (const id of ["perc", "geneva", "canadian-cspine", "canadian-ct-head", "ddx"]) {
      expect(calculators.some((c) => c.id === id), `calc manquant: ${id}`).toBe(true);
    }
  });
  it("v8.0 méthanol : antidote éthanol et clé tunisienne qaraymi", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("intoxication-methanol");
    expect(p).toBeTruthy();
    expect(JSON.stringify(p?.steps)).toContain("éthanol");
    expect(JSON.stringify(p?.keyPoints)).toContain("qaraymi");
  });
  it("v8.0 torsade testiculaire : la fenêtre de 6 h est écrite", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("torsade-testiculaire");
    expect(JSON.stringify(p?.steps)).toContain("6 h");
    expect(p?.severity).toBe("critical");
  });
  it("v8.0 Burch-Wartofsky : ≥ 45 = tempête", async () => {
    const Page = (await import("@/app/calculateurs/burch-wartofsky/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /≥ 40 °C|≥ 40/ }));
    fireEvent.click(screen.getByRole("button", { name: /Sévère : convulsions, coma|شديد: اختلاجات/ }));
    fireEvent.click(screen.getByRole("button", { name: /≥ 140/ }));
    expect(screen.getByText(/TEMPÊTE THYROÏDIENNE|عاصفة درقية/)).toBeTruthy();
  });
  it("v8.0 TIMI NSTEMI : 3 items = risque intermédiaire", async () => {
    const Page = (await import("@/app/calculateurs/timi-nstem/page")).default;
    render(<Page />);
    expect(screen.getByText(/Risque faible|خطر منخفض/)).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: /Âge ≥ 65 ans|العمر ≥ 65/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /≥ 3 facteurs|≥ 3 عوامل/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Marqueurs cardiaques|واسمات قلبية/ }));
    expect(screen.getByText(/Risque intermédiaire|خطر متوسط/)).toBeTruthy();
  });
  it("v8.0 gap métabolique : trou anionique calculé", async () => {
    const Page = (await import("@/app/calculateurs/gap-metabolique/page")).default;
    render(<Page />);
    const inputs = document.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "140" } });
    fireEvent.change(inputs[1], { target: { value: "100" } });
    fireEvent.change(inputs[2], { target: { value: "12" } });
    expect(screen.getByText("28")).toBeTruthy();
    expect(screen.getByText(/MUDPILES/)).toBeTruthy();
  });
  it("v8.0 médicaments : émulsion lipidique et NaCl 3 % enregistrés", async () => {
    const { getMedication } = await import("@/data/medications");
    expect(getMedication("emulsion-lipidique")?.highRisk).toBe(true);
    expect(getMedication("nacl-hypertonique")).toBeTruthy();
    expect(getMedication("propylthiouracil")).toBeTruthy();
  });
  it("v8.1 dissection aortique : bêta-bloquant d'abord, pas de vasodilatateur seul", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("dissection-aortique");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("D'ABORD");
    expect(txt).toContain("esmolol");
    expect(p?.severity).toBe("critical");
  });
  it("v8.1 méningite : l'ATB passe avant tout en cas de purpura", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("meningite-bacterienne");
    expect(JSON.stringify(p?.steps)).toContain("IMMÉDIATEMENT");
    expect(p?.medications).toContain("dexamethasone");
  });
  it("v8.1 Westley : stridor au repos + tirage modéré = croup modéré", async () => {
    const Page = (await import("@/app/calculateurs/westley/page")).default;
    render(<Page />);
    expect(screen.getByText(/CROUP LÉGER|خناق خفيف/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Au repos \(\+2\)|بالراحة \(\+2\)/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Modéré \(\+2\)|^متوسط \(\+2\)/ }));
    expect(screen.getByText(/CROUP MODÉRÉ|خناق متوسط/)).toBeTruthy();
  });
  it("v8.1 corps étranger : toux efficace = ne rien faire d'autre", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("corps-etranger-aerien");
    expect(JSON.stringify(p?.steps)).toContain("ENCOURAGER À TOUSSER");
  });
  it("v8.1 drépanocytose : contexte tunisien et syndrome thoracique aigu", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("drepanocytose-crise");
    expect(JSON.stringify(p?.keyPoints)).toContain("Tunisie");
    expect(JSON.stringify(p?.steps)).toContain("SYNDROME THORACIQUE AIGU");
  });
  it("v8.1 antibiotiques : amoxicilline et azithromycine enregistrées", async () => {
    const { getMedication } = await import("@/data/medications");
    expect(getMedication("amoxicilline")).toBeTruthy();
    expect(getMedication("azithromycine")?.interactions?.length).toBeGreaterThan(0);
  });
  it("v8.2 caustiques : jamais de vomissement provoqué ni neutralisation", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("ingestion-caustique");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("INTERDITS");
    expect(txt).toContain("JAMAIS");
    expect(p?.severity).toBe("critical");
  });
  it("v8.2 pile bouton : fenêtre de 2 h et miel pré-endoscopie", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("pile-bouton");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("MIEL");
    expect(JSON.stringify(p?.keyPoints)).toContain("2 h");
  });
  it("v8.2 GEU : β-hCG systématique devant toute douleur pelvienne", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("geu");
    expect(JSON.stringify(p?.steps)).toContain("SYSTÉMATIQUE");
    expect(p?.calculators).toContain("transfusion");
  });
  it("v8.2 dystocie épaules : McRoberts + pression sus-pubienne, jamais traction céphalique", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("dystocie-epaules");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("McROBERTS");
    expect(txt).toContain("INTERDITS");
  });
  it("v8.2 LRINEC : bandes de risque (intermédiaire 6-7, élevé ≥ 8)", async () => {
    const Page = (await import("@/app/calculateurs/lrinec/page")).default;
    render(<Page />);
    expect(screen.getByText(/RISQUE FAIBLE|خطر منخفض/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /≥ 150/ }));
    fireEvent.click(screen.getByRole("button", { name: /< 135/ }));
    expect(screen.getByText(/RISQUE INTERMÉDIAIRE|خطر متوسط/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /> 25 000|> 25 ألف/ }));
    fireEvent.click(screen.getByRole("button", { name: /^< 11/ }));
    expect(screen.getByText(/RISQUE ÉLEVÉ|خطر مرتفع/)).toBeTruthy();
  });
  it("v8.2 HSA : TDM sans injection puis nimodipine 21 jours", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("hemorragie-sous-arachnoidienne");
    expect(JSON.stringify(p?.steps)).toContain("NIMODIPINE");
    expect(p?.medications).toContain("nimodipine");
  });
  it("v8.2 fièvre neutropénique : antibiothérapie antipseudomonas dans l'heure", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("fievre-neutropenique");
    expect(JSON.stringify(p?.steps)).toContain("DANS L'HEURE");
    expect(p?.medications).toContain("piperacilline-tazobactam");
  });
  it("v8.2 glaucome aigu : acétazolamide + iridotomie", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("glaucome-aigu");
    expect(p?.medications).toContain("acetazolamide");
    expect(JSON.stringify(p?.steps)).toContain("iridotomie");
  });
  it("v8.2 médicaments réa : pipé-tazo, vancomycine, clindamycine, nimodipine, mannitol", async () => {
    const { getMedication } = await import("@/data/medications");
    for (const id of ["piperacilline-tazobactam", "vancomycine", "clindamycine", "nimodipine", "acetazolamide", "mannitol"]) {
      expect(getMedication(id)).toBeTruthy();
    }
  });
  it("v8.3 opioïdes : ventiler d'abord, naloxone titrée vers FR ≥ 12", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("intoxication-opioides");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("VENTILATION");
    expect(txt).toContain("TITRÉE");
    expect(p?.calculators).toContain("opioides");
  });
  it("v8.3 sevrage alcoolique : thiamine avant glucose, phénytoïne inefficace", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("sevrage-alcoolique");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("THIAMINE");
    expect(txt).toContain("INEFFICACE");
    expect(p?.medications).toContain("thiamine");
  });
  it("v8.3 CIWA-Ar : score modéré déclenche les benzos", async () => {
    const Page = (await import("@/app/calculateurs/ciwa-ar/page")).default;
    render(<Page />);
    expect(screen.getByText(/SEVRAGE LÉGER|انسحاب خفيف/)).toBeTruthy();
    for (const name of [/Tremblement|رعاش/, /Sueurs|تعرق/, /Agitation|هياج/, /Anxiété|قلق/]) {
      const fs = screen.getByText(name).closest("fieldset")!;
      fireEvent.click(within(fs).getByRole("button", { name: /Légère|خفيف/ }));
    }
    expect(screen.getByText(/SEVRAGE MODÉRÉ|انسحاب متوسط/)).toBeTruthy();
  });
  it("v8.3 BISAP : 3 critères = mortalité élevée", async () => {
    const Page = (await import("@/app/calculateurs/bisap/page")).default;
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Âge > 60|العمر > 60/ }));
    fireEvent.click(screen.getByRole("button", { name: /BUN|يوريا/ }));
    fireEvent.click(screen.getByRole("button", { name: /SIRS/ }));
    expect(screen.getByText(/BISAP 3/)).toBeTruthy();
  });
  it("v8.3 digoxine : hyperkaliémie = antidote, dialyse inefficace", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("intoxication-digoxine");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("antidote");
    expect(txt).toContain("n'épure PAS");
  });
  it("v8.3 salicylés : alcalinisation urinaire, jamais d'acétazolamide", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("intoxication-salicyles");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("ALCALINISATION URINAIRE");
    expect(txt).toContain("JAMAIS d'acétazolamide");
    expect(p?.medications).toContain("bicarbonate");
  });
  it("v8.3 pancréatite : alimentation précoce, pas d'ATB prophylactique", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("pancreatite-aigue");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("OBSOLÈTE");
    expect(txt).toContain("PAS d'antibiotique");
    expect(p?.calculators).toContain("bisap");
  });
  it("v8.3 angiocholite : drainage < 24 h, l'antibiotique seul ne suffit pas", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("angiocholite");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("DRAINAGE BILIAIRE < 24 h");
    expect(txt).toContain("CHARCOT");
  });
  it("v8.3 traumatisme médullaire : PAM 85-90, pas de corticoïdes, priapisme", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("traumatisme-medullaire");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("PAM 85-90");
    expect(txt).toContain("PAS de corticoïdes");
    expect(txt).toContain("PRIAPISME");
  });
  it("v8.3 appendicite : β-hCG systématique et Alvarado", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("appendicite");
    expect(JSON.stringify(p?.steps)).toContain("β-hCG chez TOUTE femme");
    expect(p?.calculators).toContain("alvarado");
  });
});

describe("v8.4 uro / cardio / métabolique / pédiatrie / digestif / toxico", () => {
  it("v8.4 colique néphrétique : kétoprofène 1re ligne, pas d'hyperhydratation", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("colique-nephretique");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("kétoprofène 100 mg IV lente");
    expect(txt).toContain("PAS d'hyperhydratation pendant la crise");
    expect(p?.medications).toContain("ketoprofene");
    expect(p?.medications).toContain("tamsulosine");
    expect(p?.calculators).toContain("colique");
  });
  it("v8.4 pyélonéphrite : ECBU avant ATB, BLSE tunisienne → carbapénème", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("pyelonephrite-aigue");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("ECBU puis ANTIBIOTHÉRAPIE PROBABILISTE immédiate");
    expect(txt).toContain("BLSE");
    expect(p?.medications).toContain("ciprofloxacine");
  });
  it("v8.4 RAU : décompression progressive, queue de cheval = IRM", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("retention-aigue-urine");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("DÉCOMPRESSION PROGRESSIVE si volume > 1000 mL");
    expect(txt).toContain("500 mL toutes les 5-10 min");
    expect(txt).toContain("queue de cheval : RAU + anesthésie en selle");
    expect(p?.calculators).toContain("raaf");
  });
  it("v8.4 péricardite : aspirine + colchicine 3 mois, pas de corticoïdes 1re ligne", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("pericardite-aigue");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("ASPIRINE 750 mg-1 g/8 h");
    expect(txt).toContain("COLCHICINE 0,5 mg × 2/j pendant 3 mois");
    expect(txt).toContain("corticoïdes en 1re intention");
    expect(p?.medications).toContain("colchicine");
    expect(p?.calculators).toContain("qtc");
  });
  it("v8.4 endocardite : 3 hémocultures AVANT l'antibiotique", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("endocardite-infectieuse");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("HÉMOCULTURES ×3");
    expect(p?.medications).toContain("gentamicine");
    expect(p?.calculators).toContain("qsofa");
  });
  it("v8.4 HHS : réhydratation lente, insuline après, K⁺ ≥ 3,3", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("hhs-hyperosmolaire");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("moitié du déficit sur 12 h");
    expect(txt).toContain("K⁺ ≥ 3,3 mmol/L");
    expect(p?.medications).toContain("chlorure-potassium");
    expect(p?.medications).toContain("enoxaparine");
  });
  it("v8.4 invagination : cocarde écho + lavement, point d'appel > 3 ans", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("invagination-intestinale");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("cocarde > 3 cm de diamètre");
    expect(txt).toContain("pression < 120 mmHg");
    expect(txt).toContain("POINT D'APPEL");
    expect(p?.calculators).toContain("broselow");
  });
  it("v8.4 HDB : 15 % d'origine haute, coloscopie à 24 h", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("hemorragie-digestive-basse");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("15 % des « HDB » massives");
    expect(p?.calculators).toContain("transfusion");
  });
  it("v8.4 péritonite : coup de poignard, ATB < 1 h, chirurgie = traitement", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("perforation-peritonite");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("coup de poignard");
    expect(txt).toContain("ventre de bois");
    expect(p?.medications).toContain("piperacilline-tazobactam");
  });
  it("v8.4 alcool aigu : thiamine avant glucose, jamais cuver seul", async () => {
    const { getProtocol } = await import("@/data/protocols");
    const p = getProtocol("intoxication-alcool-aigue");
    const txt = JSON.stringify(p?.steps);
    expect(txt).toContain("THIAMINE 250-500 mg IV avant tout apport glucosé");
    expect(txt).toContain("DIAGNOSTIC D'ÉLIMINATION");
    expect(txt).toContain("POSITION LATÉRALE DE SÉCURITÉ");
    expect(p?.medications).toContain("glucose30");
    expect(p?.medications).toContain("naloxone");
  });
  it("v8.4 médicaments phase 11 : kétoprofène, tamsulosine, cipro, colchicine, genta, KCl", async () => {
    const { getMedication } = await import("@/data/medications");
    for (const id of ["ketoprofene", "tamsulosine", "ciprofloxacine", "colchicine", "gentamicine", "chlorure-potassium"]) {
      expect(getMedication(id)).toBeTruthy();
    }
  });
});

describe("v9.0 redesign — نظام التصميم", () => {
  it("v9.0 : jetons gravité sémantiques présents dans globals.css", async () => {
    const fs = await import("node:fs");
    const css = fs.readFileSync("app/globals.css", "utf8");
    for (const tok of ["--sev-critical", "--sev-urgent", "--sev-standard", "--accent", ".sev-badge", ".btn-primary", ".hover-surface2"]) {
      expect(css, tok).toContain(tok);
    }
    // la règle parasite « ombre sur tout bg- » doit être neutralisée
    expect(css).not.toMatch(/button\[class\*="bg-"\]\s*,\s*a\[class\*="bg-"\]\s*\{\s*box-shadow/);
  });
  it("v9.0 : thème auto par défaut + anti-FOUC système", async () => {
    const fs = await import("node:fs");
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain('p.theme||"auto"');
    expect(layout).toContain("prefers-color-scheme: dark");
    expect(layout).toContain("IBM_Plex_Sans_Arabic");
  });
  it("v9.0 : Badge sémantique rend les tons de gravité", async () => {
    const Badge = (await import("@/components/ui/Badge")).default;
    const { container } = render(<Badge tone="critical">CRITIQUE</Badge>);
    expect(container.querySelector(".sev-critical")).toBeTruthy();
    const { container: c2 } = render(<Badge tone="standard">OK</Badge>);
    expect(c2.querySelector(".sev-standard")).toBeTruthy();
  });
  it("v9.0 : isEffectiveDark — auto suit le système, light/dark forcés", async () => {
    // Providers est mocké globalement dans ce fichier : on veut la vraie implémentation.
    const { isEffectiveDark } = await vi.importActual<typeof import("@/components/Providers")>("@/components/Providers");
    expect(isEffectiveDark("light")).toBe(false);
    expect(isEffectiveDark("dark")).toBe(true);
    expect(isEffectiveDark("amoled")).toBe(true);
    expect(isEffectiveDark("auto")).toBe(false); // jsdom : matchMedia → matches false
  });
  it("v9.0 : accueil redesign — pas de dégradés arc-en-ciel sur les tuiles rapides", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("app/page.tsx", "utf8");
    expect(page).not.toContain("bg-gradient-to-br from-rose-700");
    expect(page).toContain("SectionTitle");
  });
});

describe("v9.1 — قالب البروتوكول وبطاقات الخطورة", () => {
  it("v9.1 : بطاقة القائمة = ليزري جانبية + شارة خطورة موحّدة", async () => {
    const { default: Card, toCardData } = await import("@/components/cards/ProtocolCard");
    const { getProtocol } = await import("@/data/protocols");
    const ana = getProtocol("anaphylaxie")!;
    expect(ana.severity).toBe("critical");
    const { container } = render(<Card data={toCardData(ana)} />);
    expect(container.querySelector(".sev-strip.sev-critical")).toBeTruthy();
    expect(container.querySelector(".sev-badge.sev-critical")).toBeTruthy();
    const std = getProtocol("colique-nephretique")!;
    const { container: c2 } = render(<Card data={toCardData(std)} />);
    expect(c2.querySelector(".sev-strip")).toBeTruthy();
  });
  it("v9.1 : ترويسة التفاصيل تعرض الخطورة + الفئة", async () => {
    const { protocols } = await import("@/data/protocols");
    const Detail = (await import("@/components/details/ProtocolDetail")).default;
    const avc = protocols.find((p) => p.id === "avc")!;
    const { container } = render(<Detail {...protocolDetailProps(avc)} />);
    expect(container.querySelector("header.sev-strip")).toBeTruthy();
    expect(container.querySelector("header .sev-badge")).toBeTruthy();
  });
  it("v9.1 : مفاتيح الخطورة ثنائية اللغة في i18n", async () => {
    const fs = await import("node:fs");
    const i = fs.readFileSync("lib/i18n.ts", "utf8");
    for (const k of ['"sev.critical": "Critique"', '"sev.urgent": "Urgent"', '"sev.standard": "Standard"', '"sev.critical": "حرج"', '"sev.urgent": "عاجل"', '"sev.standard": "قياسي"']) {
      expect(i, k).toContain(k);
    }
  });
  it("v9.1 : لوحة إعادة التقييم تعرض وتيرة الدورة", async () => {
    if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
    const Panel = (await import("@/components/details/RevalPanel")).default;
    const { revals } = await import("@/data/reval");
    const { container } = render(<Panel reval={revals["anaphylaxie"]} protocolId="anaphylaxie" />);
    const badge = container.querySelector(".sev-accent");
    expect(badge?.textContent).toContain("min");
  });
});

describe("v9.2 — قالب الأدوية الموحّد", () => {
  it("v9.2 : بطاقة دواء عالي الخطورة = ليزري + شارة", async () => {
    const Card = (await import("@/components/cards/MedicationCard")).default;
    const { getMedication } = await import("@/data/medications");
    const adr = getMedication("adrenaline")!;
    expect(adr.highRisk).toBe(true);
    const { container } = render(<Card medication={adr} />);
    expect(container.querySelector(".sev-strip.sev-critical")).toBeTruthy();
    expect(container.querySelector(".sev-badge.sev-critical")).toBeTruthy();
    const para = getMedication("paracetamol")!;
    const { container: c2 } = render(<Card medication={para} />);
    expect(c2.querySelector(".sev-critical")).toBeNull();
  });
  it("v9.2 : ترويسة بطاقة الدواء تعرض شارة الخطورة", async () => {
    const Detail = (await import("@/components/details/MedicationDetail")).default;
    const { getMedication } = await import("@/data/medications");
    const kcl = getMedication("chlorure-potassium")!;
    expect(kcl.highRisk).toBe(true);
    const { container } = render(<Detail {...medicationDetailProps(kcl)} />);
    expect(container.querySelector("header.sev-strip.sev-critical")).toBeTruthy();
  });
  it("v9.2 : فهرس الأدوية يستخدم البطاقة الموحّدة", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("app/medicaments/page.tsx", "utf8");
    expect(page).toContain("MedicationCard");
    expect(page).not.toContain("ShieldAlert");
  });
});

describe("v9.3 — إغلاق التوحيد", () => {
  it("v9.3 : الميدان يستخدم شارات الخطورة الموحّدة + ليزري", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("app/terrain/page.tsx", "utf8");
    expect(page).toContain('Badge tone={s.sev === 1 ? "critical"');
    expect(page).toContain("sev-strip sev-critical");
    expect(page).not.toContain("SEV_TAG[s.sev].cls");
  });
  it("v9.3 : الفرز يحمل ليزري حسب الأولوية", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("app/triage/page.tsx", "utf8");
    expect(page).toContain("sev-strip sev-critical");
    expect(page).toContain("sev-strip sev-urgent");
  });
  it("v9.3 : بانر التدخل الموجّه مسطّح (بلا تدرج)", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("components/details/ProtocolDetail.tsx", "utf8");
    expect(page).not.toContain("bg-gradient-to-l from-red-600/25");
    expect(page).toContain("bg-red-600/10");
  });
});

/* ───────────────────────── v10.0 — M3 fondations ───────────────────────── */
describe("v10.0 — fondations M3 (bleu médical, pilule, rail, FAB)", () => {
  it("v10.0 : jetons accent = bleu médical + rayons M3 (carte 20px, bouton pilule)", async () => {
    const fs = await import("node:fs");
    const css = fs.readFileSync("app/globals.css", "utf8");
    expect(css).toContain("--accent: #1565c0");            // clair
    expect(css).toContain("--accent: #8ab4f8");            // sombre (tonal)
    expect(css).toContain("--r-card: 20px");
    expect(css).toContain("--r-pill: 999px");
    expect(css).toContain("border-radius: var(--r-pill)"); // .btn-primary en pilule
    expect(css).toContain(".card { border-radius: var(--r-card); }");
    // aucun teal codé en dur ne survit dans le CSS
    for (const t of ["#0d9488", "#14b8a6", "13,148,136", "13, 148, 136", "20,184,166", "20, 184, 166"]) {
      expect(css).not.toContain(t);
    }
  });
  it("v10.0 : sev-standard repasse teal (distinguable du primaire bleu)", async () => {
    const fs = await import("node:fs");
    const css = fs.readFileSync("app/globals.css", "utf8");
    expect(css).toContain("--sev-standard: #0f766e");
    expect(css).toContain("--sev-standard: #4db6ac");
  });
  it("v10.0 : plus aucune classe utilitaire teal-* dans app/ et components/", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".tsx") && fs.readFileSync(p, "utf8").includes("teal-")) hits.push(p);
      }
    };
    walk("app");
    walk("components");
    expect(hits).toEqual([]);
  });
  it("v10.0 : BottomTabs — pastille active sur jetons accent (pas de couleur codée en dur)", async () => {
    const fs = await import("node:fs");
    const tabs = fs.readFileSync("components/BottomTabs.tsx", "utf8");
    expect(tabs).toContain("var(--accent-soft)");
    expect(tabs).toContain("var(--accent)");
    expect(tabs).not.toContain("bg-blue-600/15");
  });
  it("v10.0 : Button unifié en pilule", async () => {
    const fs = await import("node:fs");
    const btn = fs.readFileSync("components/ui/Button.tsx", "utf8");
    expect(btn).toContain("rounded-full");
    expect(btn).not.toContain("rounded-xl");
  });
  it("v15.0 : NavRail bureau — 6 thèmes + recherche (أدوات بلا تبويب)", async () => {
    const fs = await import("node:fs");
    const rail = fs.readFileSync("components/NavRail.tsx", "utf8");
    for (const href of ['href: "/"', 'href: "/rea"', 'href: "/medicaments"', 'href: "/protocoles"', 'href: "/memo"', 'href: "/checklists"']) {
      expect(rail).toContain(href);
    }
    expect(rail).toContain("eutn:palette");
    expect(rail).not.toContain("eutn:drawer"); // الدرج بلا زر في الشريط المكتبية (v15.0)
  });
  it("v10.0 : SearchFab mobile ouvre la palette et se cache en lg", async () => {
    const fs = await import("node:fs");
    const fab = fs.readFileSync("components/SearchFab.tsx", "utf8");
    expect(fab).toContain("eutn:palette");
    expect(fab).toContain("lg:hidden");
  });
  it("v10.0 : CommandPalette écoute l'événement eutn:palette", async () => {
    const fs = await import("node:fs");
    const cp = fs.readFileSync("components/CommandPalette.tsx", "utf8");
    expect(cp).toContain('window.addEventListener("eutn:palette"');
  });
  it("v10.0 : en-tête mini — la recherche quitte le Header", async () => {
    const fs = await import("node:fs");
    const header = fs.readFileSync("components/Header.tsx", "utf8");
    expect(header).not.toContain("SearchBar");
  });
  it("v10.0 : layout monte le rail + le FAB (fin de l'aside w-72)", async () => {
    const fs = await import("node:fs");
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("<NavRail />");
    expect(layout).toContain("<SearchFab />");
    expect(layout).not.toContain("w-72");
  });
});

/* ───────────────────────── v10.0-b — gabarits M3 + بلاطات الوضع ───────────────────────── */
describe("v10.0-b — قوالب M3 للصفحات الرئيسية + بلاطات الوضع", () => {
  it("v10.0-b : PageHeader M3 موجود ومستخدم في القوائم الثلاث", async () => {
    const fs = await import("node:fs");
    const hdr = fs.readFileSync("components/ui/PageHeader.tsx", "utf8");
    expect(hdr).toContain("var(--accent-soft)");
    expect(hdr).toContain("Badge tone=\"accent\"");
    for (const pg of ["app/protocoles/page.tsx", "app/medicaments/page.tsx", "app/calculateurs/page.tsx"]) {
      const src = fs.readFileSync(pg, "utf8");
      expect(src, pg).toContain("PageHeader");
    }
  });
  it("v15.0 : الرئيسية مركز إطلاق — ثيمات×5 + شبكة أدوات + SOS الأحمر الوحيد", async () => {
    const fs = await import("node:fs");
    const home = fs.readFileSync("app/page.tsx", "utf8");
    for (const href of ['href: "/rea"', 'href: "/medicaments"', 'href: "/protocoles"', 'href: "/memo"', 'href: "/checklists"']) {
      expect(home).toContain(href);
    }
    expect(home).toContain('href: "/calculateurs/dose-check"');
    expect(home).toContain('href: "/fiche-samu"');
    expect(home).toContain("setEmergencyOpen(true)");
    expect(home).toContain("<ActivePatient />");
  });
  it("v10.0-b : مفاتيح i18n للوضع موجودة FR+AR", async () => {
    const fs = await import("node:fs");
    const i = fs.readFileSync("lib/i18n.ts", "utf8");
    for (const k of ['"mode.title"', '"mode.emergency"', '"mode.learn"', '"mode.review"', '"page.protocols.sub"', '"page.meds.sub"', '"page.calc.sub"']) {
      expect((i.match(new RegExp(k.replace(/[.]/g, "\\."), "g")) || []).length).toBeGreaterThanOrEqual(2);
    }
  });
  it("v10.0-b : تنفّس 16px في قوائم النتائج (gap-4)", async () => {
    const fs = await import("node:fs");
    for (const pg of ["app/protocoles/page.tsx", "app/medicaments/page.tsx", "app/calculateurs/page.tsx"]) {
      const src = fs.readFileSync(pg, "utf8");
      expect(src, pg).toContain("grid gap-4");
      expect(src, pg).not.toContain("grid gap-3");
    }
  });
});

/* ───────────────────────── v10.0-c — ميثاق الاتساق الآلي ───────────────────────── */
describe("v10.0-c — صبّ الصفحات في القوالب + حارس الاتساق", () => {
  const INDEX = [
    "app/protocoles/page.tsx", "app/medicaments/page.tsx", "app/calculateurs/page.tsx",
    "app/arbres/page.tsx", "app/checklists/page.tsx", "app/revisions/page.tsx",
    "app/stats/page.tsx", "app/fiche-samu/page.tsx", "app/ecg/page.tsx",
    "app/parametres/page.tsx", "app/changelog/page.tsx",
  ];
  it("v10.0-c : كل صفحات الفهرس تستخدم PageHeader M3", async () => {
    const fs = await import("node:fs");
    for (const pg of INDEX) {
      expect(fs.readFileSync(pg, "utf8"), pg).toContain('from "@/components/ui/PageHeader"');
    }
  });
  it("v10.0-c : HubPage (6 تخصصات) يرث الرأس M3", async () => {
    const fs = await import("node:fs");
    const hub = fs.readFileSync("components/HubPage.tsx", "utf8");
    expect(hub).toContain('<PageHeader');
    expect(hub).toContain("grid gap-4");
  });
  it("v10.0-c : لا hex teal قديم في أي tsx", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const bad: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".tsx")) {
          const src = fs.readFileSync(p, "utf8");
          if (src.includes("#0d9488") || src.includes("#14b8a6")) bad.push(p);
        }
      }
    };
    walk("app"); walk("components");
    expect(bad).toEqual([]);
  });
  it("v10.0-c : التدرجات محصورة في قائمة السماح (هوية/كاميرا ECG)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const ALLOW = new Set([
      "components/CommandPalette.tsx", "components/CommandPaletteBody.tsx", "components/Header.tsx", "components/InstallPwa.tsx",
      "components/Nav.tsx", "components/ecg/CameraCapture.tsx",
    ]);
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".tsx") && fs.readFileSync(p, "utf8").includes("bg-gradient-to-") && !ALLOW.has(p)) hits.push(p);
      }
    };
    walk("app"); walk("components");
    expect(hits).toEqual([]);
  });
});

/* ───────────────────────── القسم أ-١ — محركات القرار ١–٥ ───────────────────────── */
describe("القسم أ-١ — محركات: الشكوى الرئيسية، DDx gravité، الغيبوبة، الغازات، حموضة", () => {
  it("أ-١ : المحركات الثلاثة مسجلة في الفهارس ببيانات مراجعة", async () => {
    const { calculators } = await import("../data/calculators");
    for (const id of ["motif", "coma", "acide-base"]) {
      const c = calculators.find((x) => x.id === id);
      expect(c, id).toBeTruthy();
      expect(c!.meta?.lastReviewed).toBe("2026-09");
      expect(c!.title.ar.length).toBeGreaterThan(0);
    }
  });
  it("أ-١ : بيانات MOTIFS سليمة (خطورة 1-3 + روابط داخلية)", async () => {
    const { MOTIFS } = await import("../data/motifs");
    expect(MOTIFS.length).toBeGreaterThanOrEqual(6);
    for (const m of MOTIFS) {
      expect(m.questions.length).toBeGreaterThanOrEqual(3);
      for (const o of m.outcomes) {
        expect([1, 2, 3]).toContain(o.sev);
        expect(o.href.startsWith("/")).toBe(true);
        expect(Object.keys(o.cond).length).toBeGreaterThanOrEqual(1);
      }
    }
  });
  it("أ-١ : صفحة الشكوى الرئيسية ترتب بالخطورة ثم النقاط", async () => {
    const fs = await import("node:fs");
    const pg = fs.readFileSync("app/calculateurs/motif/page.tsx", "utf8");
    expect(pg).toContain("a.sev - b.sev || b.score - a.score");
    expect(pg).toContain("sev-strip");
  });
  it("أ-١ : DDx مُرقّى — فرز بالخطورة + شارات", async () => {
    const fs = await import("node:fs");
    const pg = fs.readFileSync("app/calculateurs/ddx/page.tsx", "utf8");
    expect(pg).toContain("b.score - a.score || a.sev - b.sev");
    expect(pg).toContain("Badge tone={d.sev === 1 ? \"critical\"");
  });
  it("أ-١ : الغيبوبة — سكر/نالوكسون/غلاسكو موصولة", async () => {
    const fs = await import("node:fs");
    const pg = fs.readFileSync("app/calculateurs/coma/page.tsx", "utf8");
    expect(pg).toContain("/protocoles/hypoglycemie");
    expect(pg).toContain("/calculateurs/gcs");
    expect(pg).toContain("/calculateurs/opioides");
    expect(pg).toContain("AVPU");
  });
  it("أ-١ : حموضة — Winter + فجوة أنيونية + delta-ratio", async () => {
    const fs = await import("node:fs");
    const pg = fs.readFileSync("app/calculateurs/acide-base/page.tsx", "utf8");
    expect(pg).toContain("1.5 * H + 8");
    expect(pg).toContain("N - (L + H)");
    expect(pg).toContain("(ag - 12) / (24 - H)");
  });
  it("أ-١ : gazometrie برأس M3", async () => {
    const fs = await import("node:fs");
    const pg = fs.readFileSync("app/calculateurs/gazometrie/page.tsx", "utf8");
    expect(pg).toContain("<PageHeader");
  });
});

/* ───────────────────────── القسم أ-٢ — محركات ٦–١٠ ──────────────────────── */
describe("القسم أ-٢ — صوديوم/بوتاسيوم/DKA/صرع/ربو", () => {
  it("أ-٢ : المحركات الخمسة برؤوس M3", async () => {
    const fs = await import("node:fs");
    for (const pg of ["sodium", "hyperkalemie", "dka", "etat-mal", "asthme"]) {
      const src = fs.readFileSync(`app/calculateurs/${pg}/page.tsx`, "utf8");
      expect(src, pg).toContain("<PageHeader");
    }
  });
  it("أ-٢ : الصوديوم يفرض سقف التصحيح الآمن", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/sodium/page.tsx", "utf8");
    expect(src).toContain("maxCorrectionRate");
  });
  it("أ-٢ : DKA موصول بمساعد HHS", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/dka/page.tsx", "utf8");
    expect(src).toContain("/calculateurs/dka-h1");
  });
  it("أ-٢ : فرط البوتاسيوم = سلّم (غشاء/نقل/إطراح)", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/hyperkalemie/page.tsx", "utf8");
    for (const k of ['"ca"', '"insu"', '"salb"']) expect(src).toContain(k);
  });
  it("أ-٢ : الصرع المستمر بخطّين علاجيين", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/etat-mal/page.tsx", "utf8");
    expect(src).toContain('"mida"');
    expect(src).toContain('"leve"');
  });
});

/* ───────────────────────── القسم أ-٣ — محركات ١١–١٥ ──────────────────────── */
describe("القسم أ-٣ — إنتان/تأق/سموم/ترياقات/عكس تخثر", () => {
  it("أ-٣ : sepsis يحمل qSOFA + SIRS ورأس M3", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/sepsis-commandement/page.tsx", "utf8");
    expect(src).toContain("<PageHeader");
    expect(src).toContain("qSOFA");
    expect(src).toContain("SIRS");
  });
  it("أ-٣ : التأق بدرجاته وتوقيت التكرار ٥ د", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/dose-anaphylaxie/page.tsx", "utf8");
    expect(src).toContain("<PageHeader");
    expect(src).toContain("Grade 1");
    expect(src).toContain("5 min");
  });
  it("أ-٣ : المحركات الثلاثة الجديدة مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["toxidromes", "antidotes", "anticoag"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
  it("أ-٣ : الترياقات تغطي النالوكسون حتى أضداد الديجوكسين", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/antidotes/page.tsx", "utf8");
    for (const k of ["Naloxone", "Atropine", "Protamine", "Bleu de méthylène", "Fab digoxine"]) expect(src).toContain(k);
  });
  it("أ-٣ : عكس التخثر لكل عائلة دواء", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/anticoag/page.tsx", "utf8");
    for (const k of ["Protamine", "Idarucizumab", "Andexanet", "PPSB"]) expect(src).toContain(k);
  });
  it("أ-٣ : كاشف السموم يربط بالملاح", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/toxidromes/page.tsx", "utf8");
    expect(src).toContain("/calculateurs/antidotes");
    expect(src).toContain("organophosphorés");
  });
});

/* ───────────────────────── القسم أ-٤ — محركات ١٦–٢٠ ──────────────────────── */
describe("القسم أ-٤ — حروق/سوائل/نقل/KDIGO/إغماء", () => {
  it("أ-٤ : الحروق بقاعدة التسعات التفاعلية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/brulures/page.tsx", "utf8");
    expect(src).toContain("Tronc ant. 18");
    expect(src).toContain("Périnée 1");
    expect(src).toContain("<PageHeader");
  });
  it("أ-٤ : النقل بتفاعلاته الخمسة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/transfusion/page.tsx", "utf8");
    expect(src).toContain("TRALI");
    expect(src).toContain("TACO");
    expect(src).toContain("hémolytique");
  });
  it("أ-٤ : الإغماء بقاعدة سان فرانسيسكو", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/syncope/page.tsx", "utf8");
    expect(src).toContain("San Francisco");
    expect(src).toContain("Hématocrite < 30");
  });
  it("أ-٤ : AKI مسجل وعتبات KDIGO صحيحة", async () => {
    const { calculators } = await import("../data/calculators");
    expect(calculators.find((c) => c.id === "aki")).toBeTruthy();
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/aki/page.tsx", "utf8");
    expect(src).toContain("26.5");   // +0,3 mg/dL en µmol/L
    expect(src).toContain("ratio >= 3");
    expect(src).toContain("Metformine");
  });
  it("أ-٤ : سوائل الطفل بدفعات الإنعاش", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/fluids-enfant/page.tsx", "utf8");
    expect(src).toContain("20 mL/kg");
    expect(src).toContain("30 mL/kg");
  });
});

/* ───────────────────────── القسم أ-٥ — محركات ٢١–٢٥ ──────────────────────── */
describe("القسم أ-٥ — آليات/أكسيد الكربون/كوكايين/طفل الجرعات/حرارة", () => {
  it("أ-٥ : محلّل الآليات يعطي إصابات وأولويات", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/mecanisme/page.tsx", "utf8");
    expect(src).toContain("rhabdomyolyse");
    expect(src).toContain("trigramme");
    expect(src).toContain("<PageHeader");
  });
  it("أ-٥ : أكسيد الكربون بمعايير الغرفة عالية الضغط", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/co/page.tsx", "utf8");
    expect(src).toContain("COHb");
    expect(src).toContain("80 min");
    expect(src).toContain("Fumeur");
  });
  it("أ-٥ : الكوكايين بترتيب بنزوديازيبين وتجنّب بيتا وحده", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/cocaine/page.tsx", "utf8");
    expect(src).toContain("diazépam 5-10 mg IV");
    expect(src).toContain("SEUL à éviter");
    expect(src).toContain("bicarbonates");
  });
  it("أ-٥ : لوحة جرعات الطفل بسقوفها (١٠ مغ ميدازولام، ٢ غ سيفترياكسون)", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/doses-ped/page.tsx", "utf8");
    expect(src).toContain("Midazolam");
    expect(src).toContain("Ceftriaxone");
    expect(src).toContain("Math.min(val, r.cap)");
  });
  it("أ-٥ : الحرارة مترابطة (انخفاض ↔ ضربة حر ↔ خبيث)", async () => {
    const fs = await import("node:fs");
    const h = fs.readFileSync("app/calculateurs/hypothermie/page.tsx", "utf8");
    const c = fs.readFileSync("app/calculateurs/coup-chaleur/page.tsx", "utf8");
    expect(h).toContain("/calculateurs/coup-chaleur");
    expect(c).toContain("/calculateurs/hypothermie");
    expect(c).toContain("burch-wartofsky");
  });
  it("أ-٥ : المحركات الأربعة الجديدة مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["mecanisme", "co", "cocaine", "doses-ped"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

/* ───────────────────────── القسم ب — الحزمة ٢٦–٣٠ ───────────────────────── */
describe("القسم ب ٢٦–٣٠ — قراءات شبكية", () => {
  it("٢٦ : شبكة ECG بعشر خطوات وتنبيه STEMI", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/ecg-grid/page.tsx", "utf8");
    expect(src).toContain("10. Comparer à l'ECG antérieur");
    expect(src).toContain("STEMI");
    expect(src).toContain("Sokolow");
  });
  it("٢٧ : شبكة الصدر بسبع مناطق و RIPE", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/rx-thorax/page.tsx", "utf8");
    expect(src).toContain("Qualité (RIPE)");
    expect(src).toContain("Index cardio-thoracique");
    expect(src).toContain("SDRA");
  });
  it("٢٨ : POCUS بخمسة بروتوكولات و eFAST", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/pocus/page.tsx", "utf8");
    expect(src).toContain("FAST / eFAST");
    expect(src).toContain("RUSH");
    expect(src).toContain("nerf optique");
  });
  it("٢٩ : التنفس بصيغتي Cherniack وحدود GOLD", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/spirometrie/page.tsx", "utf8");
    expect(src).toContain("5.48");
    expect(src).toContain("4.35");
    expect(src).toContain("GOLD");
    expect(src).toContain("ratio < 0.7");
  });
  it("٣٠ : المحوّل فيه تحويلات مخبرية وقيم حرجة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/convertisseur/page.tsx", "utf8");
    for (const k of ["glucose", "creat", "bili", "lactate", "ethanol"]) expect(src).toContain(k);
    expect(src).toContain("<PageHeader");
    expect(src).toContain("Valeurs critiques");
  });
  it("٢٦–٣٠ : الخمس مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["ecg-grid", "rx-thorax", "pocus", "spirometrie"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

/* ───────────────────────── القسم ب — الحزمة ٣١–٣٥ ───────────────────────── */
describe("القسم ب ٣١–٣٥ — قراءات مخبرية", () => {
  it("٣١ : تعداد الدم بأنماط VGM وتنبيه انعدام العدلات", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/hemogramme/page.tsx", "utf8");
    expect(src).toContain("Microcytaire");
    expect(src).toContain("Macrocytaire");
    expect(src).toContain("Agranulocytose");
    expect(src).toContain("neutro < 0.5");
  });
  it("٣٢ : وظائف الكبد بمعامل R وصيغته", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/bilan-hepatique/page.tsx", "utf8");
    expect(src).toContain("ULN_ALT = 40");
    expect(src).toContain("(L / ULN_ALT) / (P / ULN_PAL)");
    expect(src).toContain("1000");
  });
  it("٣٣ : تحليل البول يميّز الكبيبي عن الكلائي عن الإنتاني", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/urines/page.tsx", "utf8");
    expect(src).toContain("Syndrome néphrotique");
    expect(src).toContain("Néphrite glomérulaire");
    expect(src).toContain("acanthocytes");
  });
  it("٣٤ : اللاكتات بعتباته ومعدل التصفية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/lactate/page.tsx", "utf8");
    expect(src).toContain("30 mL/kg");
    expect(src).toContain("clairance");
    expect(src).toContain("((init - B) / init) * 100");
  });
  it("٣٥ : DIC بمعايير ISTH الأربعة وعتبة ٥", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/dic/page.tsx", "utf8");
    expect(src).toContain("total >= 5");
    expect(src).toContain("Fibrinogène ≤ 1 g/L");
    expect(src).toContain("Augmentation forte");
  });
  it("٣١–٣٥ : الخمس مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["hemogramme", "bilan-hepatique", "urines", "lactate", "dic"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

/* ───────────────────────── القسم ب — الحزمة ٣٦–٤٠ ───────────────────────── */
describe("القسم ب ٣٦–٤٠ — ختام القسم", () => {
  it("٣٦ : الغازات المتقدمة بصيغة PAO2 وحدود برلين", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/gaz-advanced/page.tsx", "utf8");
    expect(src).toContain("F * 713");
    expect(src).toContain("A / 4 + 4");
    expect(src).toContain("P/F");
    expect(src).toContain("ROX");
  });
  it("٣٧ : تحويل الوحدات ثنائي الاتجاه بعتباته", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/gaz-units/page.tsx", "utf8");
    expect(src).toContain("0.1333");
    expect(src).toContain("PaCO2 narcose");
    expect(src).toContain("setFromKpa");
  });
  it("٣٨ : النمو بعتبات MUAC الصحيحة والوذمة كمعيار", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/croissance/page.tsx", "utf8");
    expect(src).toContain("M < 115");
    expect(src).toContain("125");
    expect(src).toContain("oedeme ||");
    expect(src).toContain("F-75");
  });
  it("٣٩ : الدرقية بخمسة أنماط وحماية الكورتيزول قبل العلاج", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/thyroide/page.tsx", "utf8");
    expect(src).toContain("Hypothyroïdie centrale");
    expect(src).toContain("cortisol AVANT");
    expect(src).toContain("1,6 µg/kg/j");
    expect(src).toContain("Grossesse");
  });
  it("٤٠ : التحقق قبل الإعطاء بـ 6B وكشف خطأ المعامل عشرة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/dose-check/page.tsx", "utf8");
    expect(src).toContain("dixFois");
    expect(src).toContain("Bon patient");
    expect(src).toContain("Traçabilité");
    expect(src).toContain("W * D");
  });
  it("٣٦–٤٠ : الخمس مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["gaz-advanced", "gaz-units", "croissance", "thyroide", "dose-check"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

/* ───────────────────────── القسم ج — الحزمة ٤١–٤٥ ───────────────────────── */
describe("القسم ج ٤١–٤٥ — أمان الدواء", () => {
  it("٤١ : محرّك الجرعة الآمنة بسقوف الجرعة واليوم", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/safe-dose/page.tsx", "utf8");
    expect(src).toContain("clampDose");
    expect(src).toContain("maxDay");
    expect(src).toContain("dixFois");
    expect(src).toContain("Paracétamol IV");
  });
  it("٤٢ : جسر الصيدلة بـ Cockcroft-Gault و١٦ دواءً", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/renal-dose/page.tsx", "utf8");
    expect(src).toContain("ibwKg");
    expect(src).toContain("72 * mg");
    expect(src).toContain("Nitrofurantoïne");
    expect(src).toContain("Contre-indiquée");
  });
  it("٤٣ : التفاعلات ب١٦ زوج والبحث والفلترة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/interactions/page.tsx", "utf8");
    expect(src).toContain("Allopurinol");
    expect(src).toContain("Syndrome sérotoninergique");
    expect(src).toContain("selA");
    expect(src).toContain("Filtrer la liste");
  });
  it("٤٤ : المضادات الحيوية بجرعة الوزن وتواتر التصفية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/antibiotiques/page.tsx", "utf8");
    expect(src).toContain("Ceftriaxone");
    expect(src).toContain("Colistine");
    expect(src).toContain("ab.bands[band]");
  });
  it("٤٥ : التخفيف بـ C1V1=C2V2 وسرعة التسريب والتعارضات", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/dilutions/page.tsx", "utf8");
    expect(src).toContain("(C2 * V2) / C1");
    expect(src).toContain("vitesse pompe");
    expect(src).toContain("Précipitation");
    expect(src).toContain("Ne pas mélanger");
  });
  it("٤١–٤٥ : الخمس مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["safe-dose", "renal-dose", "interactions", "antibiotiques", "dilutions"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

describe("حارس وحدة الكرياتينين (جسر كلوي)", () => {
  it("يكشف mg/dL > 20 ويحوّل تلقائياً", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/renal-dose/page.tsx", "utf8");
    expect(src).toContain("suspectUnit");
    expect(src).toContain("S > 20");
    expect(src).toContain("الوحدة على الأرجح");
  });
});

/* ───────────────────────── القسم ج — الحزمة ٤٦–٥٠ ───────────────────────── */
describe("القسم ج ٤٦–٥٠ — أمان الدواء", () => {
  it("٤٦ : NOAC بجرعة التصفية وحدود الجزيء والتراجع", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/noac/page.tsx", "utf8");
    expect(src).toContain("Apixaban");
    expect(src).toContain("idarucizumab 5 g IV");
    expect(src).toContain("PCC 50 UI/kg");
    expect(src).toContain("Prothèse mécanique");
  });
  it("٤٧ : مضادات الصرع بجرعات التحميل والفخاخ", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/antiepileptiques/page.tsx", "utf8");
    expect(src).toContain("perKg: 60");
    expect(src).toContain("NaCl 0,9 % (cristaux dans le glucose)");
    expect(src).toContain("gant violet");
  });
  it("٤٨ : مكافئات الكورتيزون وجرعة الإجهاد", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/corticoids/page.tsx", "utf8");
    expect(src).toContain("Dexaméthasone");
    expect(src).toContain("Hydrocortisone 100 mg IV puis 200 mg/24 h");
    expect(src).toContain("minéralo");
  });
  it("٤٩ : الصرع والحمل — الفالبروات ممنوع والفولات", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/epilepsie-grossesse/page.tsx", "utf8");
    expect(src).toContain("EMA 2018");
    expect(src).toContain("Acide folique 5 mg/j");
    expect(src).toContain("MgSO4 4 g IV");
  });
  it("٥٠ : السوائل — الصيانة والمحتوى الأيوني والاستراتيجية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/fluides-sodium/page.tsx", "utf8");
    expect(src).toContain("30 mL/kg");
    expect(src).toContain("NaCl 3 %");
    expect(src).toContain("mmol/j");
  });
  it("٤٦–٥٠ : الخمس مسجلة ولها صفحات", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["noac", "antiepileptiques", "corticoids", "epilepsie-grossesse", "fluides-sodium"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
  });
});

/* ───────────────────────── القسم ج — الحزمة ٥١–٥٥ ───────────────────────── */
describe("القسم ج ٥١–٥٥ — أمان الدواء", () => {
  it("٥١ : مضادات الذهان بجرعات البالغ/المسنّ والمتلازمة الخبيثة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/antipsychotiques/page.tsx", "utf8");
    expect(src).toContain("Halopéridol");
    expect(src).toContain("Bipéridène 5 mg IM/IV");
    expect(src).toContain("Dantrolène 2,5 mg/kg IV");
  });
  it("٥٢ : التسلسل السريع بالوزن مع الوضع غير المستقر", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/rsi/page.tsx", "utf8");
    expect(src).toContain("PageHeader");
    expect(src).toContain("Succinylcholine");
    expect(src).toContain("capnographie obligatoire");
    expect(src).toContain("Midazolam 2-5 mg/h");
  });
  it("٥٣ : التسكين النهائي بالمعايرة والمراقبة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/sedation-palliative/page.tsx", "utf8");
    expect(src).toContain("Morphine IV/SC 2,5-5 mg");
    expect(src).toContain("Midazolam 2,5-5 mg");
    expect(src).toContain("ne hâte pas la mort");
  });
  it("٥٤ : مضادات الفيروسات بالوزن والتصفية", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/antiviraux/page.tsx", "utf8");
    expect(src).toContain("Aciclovir (encéphalite");
    expect(src).toContain("Oseltamivir");
    expect(src).toContain("150 mg ×2/j si grave");
  });
  it("٥٥ : المراقبة الدوائية بالأهداف والسمية والغسيل", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/monitoring/page.tsx", "utf8");
    expect(src).toContain("digoxin-Fab");
    expect(src).toContain("Charbon multi-dose");
    expect(src).toContain("dialyse");
  });
  it("٥١–٥٥ : الأربعة الجديدة مسجلة والـrsi المُرقّى موجود", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["antipsychotiques", "sedation-palliative", "antiviraux", "monitoring"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
    expect(calculators.find((c) => c.id === "rsi")).toBeTruthy();
    expect(fs.existsSync("app/calculateurs/rsi/page.tsx")).toBe(true);
  });
});

/* ───────────────────────── البند ٦٠ — بلاطات الأقسام ───────────────────────── */
describe("البند ٦٠ — بلاطات الأقسام", () => {
  it("العضوية: ٢٥/١٥/١٥ بلا تداخل وكل قسم له صفحة ومدخل سجل", async () => {
    const { SECTIONS } = await import("../data/sections");
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    expect(SECTIONS.map((s) => s.ids.length)).toEqual([25, 15, 15]);
    const all = SECTIONS.flatMap((s) => s.ids);
    expect(new Set(all).size).toBe(55);
    const hrefs = new Set(calculators.map((c) => c.href.replace("/calculateurs/", "")));
    for (const id of all) {
      expect(hrefs.has(id), `registry:${id}`).toBe(true);
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), `page:${id}`).toBe(true);
    }
  });
  it("فهرس الحاسبات: بلاطات أ/ب/ج مع فلترة و؟sec ورابط الرجوع", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/page.tsx", "utf8");
    expect(src).toContain('setSec(sec === x.id ? "all" : x.id)');
    expect(src).toContain('secSet.has(c.href.replace("/calculateurs/", ""))');
    expect(src).toContain('window.location.search');
    expect(src).toContain('Revoir tous les calculs');
  });
  it("v15.0 : الرئيسية بلا بلاطات أقسام — الأدوات شبكة واحدة والحاسبات من مدخلها", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/page.tsx", "utf8");
    expect(src).not.toContain("SEC_TILES");
    expect(src).toContain('href: "/calculateurs"');
    // صف الأقسام ?sec= يبقى في صفحة الحاسبات نفسها (تثبيت مستقل فوقه)
  });
  it("v15.0 : مسارات التعلّم والمراجعة حيّة في ثيم Mémo (نُقلت لا حُذفت)", async () => {
    const fs = await import("node:fs");
    const memo = fs.readFileSync("app/memo/page.tsx", "utf8");
    for (const h of ["/quiz", "/revisions", "/revision"]) {
      expect(memo, h).toContain(`href: "${h}"`);
    }
    expect(memo).toContain("vitalSigns"); // جدول الثوابت انتقل من الرئيسية إلى Mémo
  });
});

/* ───────────────────────── v13.1 — مُفرّق التوائم + لا تنسَ قبل أن ───────────────────────── */
describe("v13.1 — حزمة الأمان", () => {
  it("مُفرّق التوائم: ١٢ زوجاً بقاعدة التوقف والبحث الفوري", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/jumeaux/page.tsx", "utf8");
    expect(src).toContain("Règle STOP");
    expect(src).toContain("À DILUER");
    expect(src).toContain("mg ÉP");
    expect(src).toContain("erreur ×10");
    expect(src).toContain("1 g ≈ 0,1 mg");
  });
  it("لا تنسَ قبل أن: ١٠ لحظات بقوائم تفاعلية وروابط", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/garde-fous/page.tsx", "utf8");
    expect(src).toContain("Avant de transfuser");
    expect(src).toContain("Avant l'insuline");
    expect(src).toContain("si < 3,3 mmol/L");
    expect(src).toContain("Avant la succinylcholine");
    expect(src).toContain("≤ 50 mg/min");
    expect(src).toContain("resetList");
  });
  it("الصفحتان مسجلتان ولهما صفحات وأيقونات القائمة البيضاء", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    for (const id of ["jumeaux", "garde-fous"]) {
      expect(calculators.find((c) => c.id === id), id).toBeTruthy();
      expect(fs.existsSync(`app/calculateurs/${id}/page.tsx`), id).toBe(true);
    }
    const registry = fs.readFileSync("data/calculators.ts", "utf8");
    expect(registry).toContain('icon: "Scale"');
    expect(registry).toContain('icon: "AlertTriangle"');
  });
  it("ارتباط متبادل بين الصفحتين ومحرك التحقق", async () => {
    const fs = await import("node:fs");
    const j = fs.readFileSync("app/calculateurs/jumeaux/page.tsx", "utf8");
    const g = fs.readFileSync("app/calculateurs/garde-fous/page.tsx", "utf8");
    expect(j).toContain("/calculateurs/garde-fous");
    expect(g).toContain("/calculateurs/jumeaux");
    expect(j).toContain("/calculateurs/dose-check");
  });
});

/* ───────────────────────── v13.2 — خط الزمن الدوائي ───────────────────────── */
describe("v13.2 — خط الزمن", () => {
  it("العدّادات: فوريات، استحقاق الآن، متأخر، وتجميع بآخر إعطاء", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/chronologie/page.tsx", "utf8");
    expect(src).toContain("m: 5 }");
    expect(src).toContain("m: 1440 }");
    expect(src).toContain('"استحقاق الآن"');
    expect(src).toContain('`متأخر ${fmtMin(-rem)}`');
    expect(src).toContain("x.rem - y.rem");
  });
  it("التخزين المحلي: مفتاحان + إغلاق بتأكيد + أرشيف محدود", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/chronologie/page.tsx", "utf8");
    expect(src).toContain('KEY = "eutn:timeline"');
    expect(src).toContain('LOGKEY = "eutn:timeline-log"');
    expect(src).toContain("MAX_LOG = 5");
    expect(src).toContain("Confirmer (2e clic)");
    expect(src).toContain("clearInterval(i)");
  });
  it("التساحتياطي", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/chronologie/page.tsx", "utf8");
    expect(src).toContain("TOP5");
    expect(src).toContain("تسجيل إعطاء الآن");
    expect(src).toContain("document.execCommand(\"copy\")");
    expect(src).toContain("توثيق ذاتي شخصي");
  });
  it("مدخل السجل + الربط من «لا تنسَ» ووجود الصفحة", async () => {
    const { calculators } = await import("../data/calculators");
    const fs = await import("node:fs");
    expect(calculators.find((c) => c.id === "chronologie")).toBeTruthy();
    expect(fs.existsSync("app/calculateurs/chronologie/page.tsx")).toBe(true);
    const g = fs.readFileSync("app/calculateurs/garde-fous/page.tsx", "utf8");
    expect(g).toContain("/calculateurs/chronologie");
    const registry = fs.readFileSync("data/calculators.ts", "utf8");
    expect(registry).toContain('id: "chronologie"');
  });
});

/* ───────────────────────── v13.3 — المريض النشط ───────────────────────── */
describe("v13.3 — المريض النشط", () => {
  it("التخزين: مفتاح eutn:patient في KEYS", async () => {
    const { KEYS } = await import("../lib/storage");
    expect(KEYS.patient).toBe("eutn:patient");
  });
  it("الـProvider: الحالة والقيم وخطّاف التعبئة", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("components/Providers.tsx", "utf8");
    expect(src).toContain("export interface ActivePatient");
    expect(src).toContain("export const EMPTY_PATIENT");
    expect(src).toContain("export function usePrefillPatient");
    expect(src).toContain("writeJSON(KEYS.patient, np)");
  });
  it("الشريط: لوحة التعديل + إغلاق بتأكيد + أرشيف ٥ مع الاسترجاع", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("components/ActivePatient.tsx", "utf8");
    expect(src).toContain('"eutn:patient-log"');
    expect(src).toContain("MAX_LOG = 5");
    expect(src).toContain("تأكيد الإغلاق");
    expect(src).toContain("restore");
  });
  it("الـlayout يركّب الشريط فوق كل صفحات الحاسبات", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("app/calculateurs/layout.tsx", "utf8");
    expect(src).toContain("<ActivePatient />");
  });
  it("الـ12 محركاً الهدف تتعبّأ (وزن/عمر/كرياتينين/جنس)", async () => {
    const fs = await import("node:fs");
    const ids = ["safe-dose", "renal-dose", "antibiotiques", "noac", "antiviraux", "antiepileptiques", "rsi", "fluides-sodium", "dose-check", "doses-ped", "brulures", "perfusions"];
    for (const id of ids) {
      const src = fs.readFileSync(`app/calculateurs/${id}/page.tsx`, "utf8");
      expect(src.includes("usePrefillPatient((p)"), id).toBe(true);
    }
    const renal = fs.readFileSync("app/calculateurs/renal-dose/page.tsx", "utf8");
    expect(renal).toContain('if (!wt && p.w) setWt(p.w)');
    expect(renal).toContain('if (p.sexe === "f") setSexe("f")');
  });
});

/* ───────────────────────── v14 — النقاء اللغوي + اللمسات ───────────────────────── */
describe("v14 — نقاء اللغات وأدوات الإدخال", () => {
  it("النقاء: لا حرف عربي في حقول fr بكل ملفات البيانات", async () => {
    const fs = await import("node:fs");
    const AR = /[\u0600-\u06FF]/;
    for (const f of fs.readdirSync("data").filter((x) => x.endsWith(".ts"))) {
      const s = fs.readFileSync(`data/${f}`, "utf8");
      for (const m of s.matchAll(/\bfr(?:=|:\s*)"([^"]+)"/g)) {
        expect(AR.test(m[1]), `${f}:${m[1].slice(0, 50)}`).toBe(false);
      }
    }
  });
  it("النقاء: حقل ar لا يبقى فيه «diurèse»", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("data/guidage.ts", "utf8");
    for (const m of s.matchAll(/\bar:\s*"([^"]+)"/g)) expect(m[1]).not.toContain("diurèse");
  });
  it("NumStepper: المكوّن موجود ومستبدل في المحركات الـ12", async () => {
    const fs = await import("node:fs");
    const comp = fs.readFileSync("components/ui/NumStepper.tsx", "utf8");
    expect(comp).toContain('type="number"');
    expect(comp).toContain("bump(-1)");
    for (const id of ["safe-dose", "renal-dose", "antibiotiques", "noac", "antiviraux", "antiepileptiques", "rsi", "fluides-sodium", "dose-check", "doses-ped", "brulures", "perfusions"]) {
      const src = fs.readFileSync(`app/calculateurs/${id}/page.tsx`, "utf8");
      expect(src.includes("<NumStepper"), id).toBe(true);
    }
  });
  it("Legend: قاموس الاختصارات مركّب أسفل كل صفحات الحاسبات", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("components/ui/Legend.tsx", "utf8")).toContain("توضيح الاختصارات");
    const lay = fs.readFileSync("app/calculateurs/layout.tsx", "utf8");
    expect(lay).toContain("<Legend />");
  });
  it("ScrollOnce: تمرير لمرة واحدة في المراجعات وتفاصيل البروتوكول", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("components/ui/ScrollOnce.tsx", "utf8")).toContain("--eutn-slide");
    expect(fs.readFileSync("app/revisions/page.tsx", "utf8")).toContain("<ScrollOnce");
    expect(fs.readFileSync("app/revision/page.tsx", "utf8")).toContain("<ScrollOnce");
    expect(fs.readFileSync("components/details/ProtocolDetail.tsx", "utf8")).toContain("<ScrollOnce");
    expect(fs.readFileSync("app/globals.css", "utf8")).toContain("@keyframes eutn-slide-once");
  });
  it("النشر: Node 22 وصلاحيات Pages في الـworkflow", async () => {
    const fs = await import("node:fs");
    const y = fs.readFileSync(".github/workflows/deploy.yml", "utf8");
    expect(y).toContain("node-version: 22");
    expect(y).toContain("pages: write");
    expect(y).not.toContain("administration:");
    expect(y).toContain("enablement: true");
  });
  it("المراجعات: نصوص مترجمة عربياً كاملة", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("app/revisions/page.tsx", "utf8");
    expect(s).toContain("عُد غداً");
    expect(s).toContain("العتبة");
    expect(s).toContain("لم تُراجع قط");
  });
});

/* ───────────────────────── v14.1 — القاموس الشامل و AVPU ───────────────────────── */
describe("v14.1 — توضيح الاختصارات في كل الأقسام", () => {
  it("Legend: AVPU وSpO2 وMEWS وqSOFA مشروحة فيه", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("components/ui/Legend.tsx", "utf8");
    expect(s).toContain('"AVPU"');
    expect(s).toContain('"SpO2"');
    expect(s).toContain('"MEWS"');
    expect(s).toContain('"qSOFA"');
    expect(s).toContain("eutn-legend");
  });
  it("القاموس مركّب أسفل 17 قسماً عبر layouts", async () => {
    const fs = await import("node:fs");
    let count = 0;
    for (const d of fs.readdirSync("app")) {
      const f = `app/${d}/layout.tsx`;
      if (fs.existsSync(f) && fs.readFileSync(f, "utf8").includes("<Legend />")) count++;
    }
    // +1 : layout الحاسبات
    expect(count).toBeGreaterThanOrEqual(18);
  });
  it("AVPU: تفسير الحرف المختار ظاهر أسفل الأزرار", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("components/details/RevalPanel.tsx", "utf8");
    expect(s).toContain("يستجيب للصوت");
    expect(s).toContain("Répond à la douleur");
    expect(s).toContain("لا يستجيب إطلاقاً");
    expect(s).toContain("break-words");
  });
  it("حارس الالتفاف في CSS والمدقق يمسح كل صفحات الحاسبات", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("app/globals.css", "utf8")).toContain("eutn-legend dd");
    const a = fs.readFileSync("scripts/audit-responsive.mjs", "utf8");
    expect(a).toContain("readdirSync");
    expect(a).toContain("DYN SWEEP");
  });
});

/* ───────────────────────── v14.2 — تدقيق QA شامل (روابط/قواميس/زحف) ───────────────────────── */
describe("v14.2 — تدقيق QA الشامل", () => {
  it("reval: الروابط الأربع المُصلَحة تشير إلى وجهات موجودة", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("data/reval.ts", "utf8");
    expect(s).not.toContain("/medicaments/omeprazole");
    expect(s).not.toContain("/calculateurs/heart");
    expect(s).not.toContain("/protocoles/ventilateur");
    expect(s).not.toContain("/protocoles/choc-hemorragique");
    expect(s).toContain('href: "/medicaments"');
    expect(s).toContain('href: "/calculateurs/scores"');
    expect(s).toContain('href: "/calculateurs/ventilateur"');
    expect(s).toContain('href: "/calculateurs/transfusion"');
  });
  it("i18n: settings.amoled في اللغتين", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("lib/i18n.ts", "utf8");
    expect(s.match(/"settings.amoled"/g)?.length).toBe(2);
  });
  it("أدوات التدقيق الثلاث دائمة في scripts/", async () => {
    const fs = await import("node:fs");
    for (const f of ["audit-links.mjs", "audit-dict.mjs", "crawl-audit.mjs"]) {
      expect(fs.existsSync(`scripts/${f}`), f).toBe(true);
    }
  });
  it("lib/calc: صيغ مرجعية مختارة تبقى صحيحة", async () => {
    const c = await import("../lib/calc");
    expect(c.parkland(70, 30).total24).toBe(8400);
    expect(c.ibwKg(170, "m")).toBeCloseTo(66.0, 0);
    expect(c.adrogueMadias(120, 154, 0, 42)).toBeCloseTo(34 / 43, 3);
    expect(c.startTriage({ ped: false, walks: false, breath: false, rr: 0, pulse: false, obeys: false })).toBe("black");
    expect(c.startTriage({ ped: true, walks: false, breath: true, rr: 50, pulse: true, obeys: true })).toBe("red");
    expect(c.qsofa(24, 90, true)).toBe(3);
    const z = c.broselowZone(110);
    expect(typeof z === "object" && z !== null && "mid" in z ? z.mid : -1).toBe(20);
  });
});

/* ───────────────────────── v14.3 — مصدر واحد للإصدار ───────────────────────── */
describe("v14.3 — رقم الإصدار بلا انجراف", () => {
  it("الشارة تقرأ من lib/version والـsw مُزامن — لا v9.0 صلباً", async () => {
    const fs = await import("node:fs");
    const { APP_VERSION } = await import("../lib/version");
    expect(APP_VERSION).toMatch(/^\d+\.\d+$/);
    const home = fs.readFileSync("app/page.tsx", "utf8");
    expect(home).toContain("v{APP_VERSION}");
    expect(home).not.toContain('v9.0 ·');
    const sw = fs.readFileSync("public/sw.js", "utf8");
    expect(sw).toContain(`const VERSION = "eutn-v${APP_VERSION}";`);
  });
});

/* ───────────────────────── v14.4 — حرب القطع + إثبات الإدخال ───────────────────────── */
describe("v14.4 — لا نص مقصوص في أي مكان", () => {
  it("لا صنف truncate على نصوص مستعمل في app/components (استثناء: لا شيء)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const bad: string[] = [];
    const walk = (d: string) => {
      for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, f.name);
        if (f.isDirectory()) { if (!/node_modules|\.next|out|shots/.test(p)) walk(p); }
        else if (/\.tsx$/.test(f.name)) {
          const s = fs.readFileSync(p, "utf8");
          if (/className="[^"]*\btruncate\b/.test(s)) bad.push(p);
        }
      }
    };
    walk("app"); walk("components");
    expect(bad, bad.join(",")).toEqual([]);
  });
  it("مدقق القطع والأدلة الحية موجودة في scripts/", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("scripts/audit-clips.mjs", "utf8")).toContain("AUDIT-CLIPS");
  });
  it("MedicationCard و Nav وSearchBar بلا قطع", async () => {
    const fs = await import("node:fs");
    expect(fs.readFileSync("components/cards/MedicationCard.tsx", "utf8")).toContain("line-clamp-2");
    expect(fs.readFileSync("components/Nav.tsx", "utf8")).toContain("break-words");
    expect(fs.readFileSync("components/SearchBar.tsx", "utf8")).toContain("line-clamp-2");
  });
});

/* ───────────────────────── v14.5 — Bottom Sheet بدل الفقاعة القاصِة ───────────────────────── */
describe("v14.5 — شرح الاختصارات دائماً داخل الشاشة", () => {
  it("الورقة السفلية: ثابتة على الشاشة (fixed) بلا فقاعة مطلقة قديمة", async () => {
    const fs = await import("node:fs");
    const s = fs.readFileSync("components/AbbrTooltip.tsx", "utf8");
    expect(s).toContain('fixed inset-0');
    expect(s).toContain("eutn-sheet");
    expect(s).toContain("env(safe-area-inset-bottom)");
    expect(s).not.toContain("bottom-full");          // الفقاعة القديمة القابلة للقصّ
    expect(s).not.toContain("pointerdown");           // الإغلاق صار بالخلفية
    expect(s).toContain('aria-haspopup="dialog"');
  });
  it("حركة الصعود + prefers-reduced-motion في CSS", async () => {
    const fs = await import("node:fs");
    const css = fs.readFileSync("app/globals.css", "utf8");
    expect(css).toContain("@keyframes eutn-sheet-up");
    expect(css).toContain("prefers-reduced-motion");
  });
});
