"use client";
// v13.2 — خط الزمن الدوائي : توثيق ذاتي (استعمال شخصي) — كل إعطاء بضغطة،
// عدّادات استحقاق «بقي/استحقاق الآن/متأخر»، ملخص منسوخ، وإغلاق حالة بأرشيف محلي.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Timer, Copy, X } from "lucide-react";

type Ev = { id: string; f: string; a: string; t: number; m: number }; // f/a = étiquette FR/AR, m = intervalle min
type Closed = { at: number; n: number; text: string };

const KEY = "eutn:timeline";
const LOGKEY = "eutn:timeline-log";
const MAX_LOG = 5;

const PRESETS: { id: string; fr: string; ar: string; m: number }[] = [
  { id: "adrenaline", fr: "Adrénaline (anaphylaxie)", ar: "أدرينالين (حساسية)", m: 5 },
  { id: "morphine", fr: "Morphine IV (titration)", ar: "مورفين وريدي (معايرة)", m: 5 },
  { id: "midazolam", fr: "Midazolam", ar: "ميدازولام", m: 5 },
  { id: "fentanyl", fr: "Fentanyl", ar: "فنتانيل", m: 30 },
  { id: "paracetamol", fr: "Paracétamol", ar: "باراسيتامول", m: 360 },
  { id: "mgso4", fr: "MgSO4 (éclampsie)", ar: "MgSO4 (تسمم حمل)", m: 240 },
  { id: "ab24", fr: "Antibiotique 1×/j", ar: "مضاد حيوي ١×/يوم", m: 1440 },
  { id: "enox12", fr: "Énoxaparine 2×/j", ar: "إينوكسابارين ٢×/يوم", m: 720 },
  { id: "enox24", fr: "Énoxaparine 1×/j", ar: "إينوكسابارين ١×/يوم", m: 1440 },
  { id: "custom", fr: "Autre (libre)", ar: "آخر (حرّ)", m: 60 },
];

const INTERVALS = [5, 10, 15, 20, 30, 60, 120, 240, 360, 720, 1440];
const TOP5 = ["adrenaline", "morphine", "ab24", "enox12", "midazolam"];

const hhmm = (t: number) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const fmtMin = (min: number) => {
  if (min < 60) return `${Math.max(0, Math.ceil(min))} د`;
  return `${Math.floor(min / 60)} س ${Math.round(min % 60)} د`;
};
const fmtEvery = (m: number) => (m < 60 ? `كل ${m} د` : m === 60 ? "كل ساعة" : `كل ${m / 60} س`);

export default function ChronologiePage() {
  useRegisterRecent("calculateur:chronologie");
  const { lang } = useApp();
  const [now, setNow] = useState<number | null>(null);
  const [evs, setEvs] = useState<Ev[]>([]);
  const [log, setLog] = useState<Closed[]>([]);
  const [sel, setSel] = useState("adrenaline");
  const [customName, setCustomName] = useState("");
  const [customMin, setCustomMin] = useState(60);
  const [copied, setCopied] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEvs(JSON.parse(raw));
      const rawLog = localStorage.getItem(LOGKEY);
      if (rawLog) setLog(JSON.parse(rawLog));
    } catch { /* ignore */ }
    const i = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(i);
  }, []);

  const persist = (next: Ev[]) => { setEvs(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } };
  const persistLog = (next: Closed[]) => { setLog(next); try { localStorage.setItem(LOGKEY, JSON.stringify(next)); } catch { /* ignore */ } };

  const addEvent = (p: { fr: string; ar: string; m: number }) => {
    // eslint-disable-next-line react-hooks/purity -- معالج نقرة فقط، يُستدعى خارج الـrender
    const e: Ev = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, f: p.fr, a: p.ar, t: Date.now(), m: p.m };
    persist([...evs, e]);
  };

  const groups = useMemo(() => {
    if (now === null) return [];
    const map = new Map<string, { f: string; a: string; m: number; last: number }>();
    for (const e of evs) {
      const k = `${e.f}|${e.a}|${e.m}`;
      const g = map.get(k);
      if (!g || e.t > g.last) map.set(k, { f: e.f, a: e.a, m: e.m, last: e.t });
    }
    return [...map.values()]
      .map((g) => {
        const rem = g.m - (now - g.last) / 60000;
        const st: "late" | "due" | "soon" | "ok" = rem <= 0 ? "late" : rem <= g.m * 0.2 ? "due" : rem <= g.m * 0.35 ? "soon" : "ok";
        return { ...g, rem, st };
      })
      .sort((x, y) => x.rem - y.rem);
  }, [evs, now]);

  const summary = useMemo(() => {
    if (evs.length === 0) return "";
    const day = new Date(Math.min(...evs.map((e) => e.t)));
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const lines = [...evs].sort((a, b) => a.t - b.t).map((e) => `${hhmm(e.t)} — ${lang === "ar" ? e.a : e.f} (${fmtEvery(e.m)})`);
    return `${date} — ❰${lang === "ar" ? "خط الزمن الدوائي" : "Chronologie médicamenteuse"}❱\n${lines.join("\n")}\n— ${evs.length} ${lang === "ar" ? "إعطاءات · توثيق ذاتي شخصي" : "administrations · auto-documentation personnelle"} —`;
  }, [evs, lang]);

  const copySummary = async () => {
    try { await navigator.clipboard.writeText(summary); } catch {
      const ta = document.createElement("textarea");
      ta.value = summary; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const closeCase = () => {
    if (!confirmClose) { setConfirmClose(true); setTimeout(() => setConfirmClose(false), 4000); return; }
    if (evs.length > 0) {
      persistLog([{ at: Date.now(), n: evs.length, text: summary }, ...log].slice(0, MAX_LOG));
    }
    persist([]);
    setConfirmClose(false);
  };

  const stTxt = (st: string, rem: number) => {
    if (st === "late") return lang === "ar" ? `متأخر ${fmtMin(-rem)}` : `En retard de ${fmtMin(-rem)}`;
    if (st === "due") return lang === "ar" ? "استحقاق الآن" : "Dû maintenant";
    return lang === "ar" ? `بقي ${fmtMin(rem)}` : `Dans ${fmtMin(rem)}`;
  };
  const sevCls = (st: string) => (st === "late" ? "sev-critical" : st === "due" || st === "soon" ? "sev-urgent" : "sev-standard");
  const stBadge = (st: string) => (st === "late" ? "critical" : st === "due" || st === "soon" ? "urgent" : "standard");
  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Timer className="h-6 w-6" />}
        title={lang === "ar" ? "خط الزمن الدوائي" : "Chronologie médicamenteuse"}
        sub={lang === "ar" ? "توثيق ذاتي شخصي: كل إعطاء بضغطة، والعدّادات تذكّرك بالاستحقاق." : "Auto-documentation personnelle : chaque dose en un clic, compteurs de réinjection."}
      />

      <p className="card rounded-2xl border border-line bg-surface p-3 text-xs font-bold opacity-80">
        <T fr="Usage strictement personnel: aucune donnée ne sort de l'appareil; le résumé est pour VOS notes, pas une transmission d'équipe." ar="استعمال شخصي صرف: لا شيء يخرج من الجهاز؛ الملخص لسجلك أنت، وليس تسليماً لفريق." />
      </p>

      {now !== null && (
        <section className="flex flex-col gap-2">
          <p className="text-sm font-black opacity-70"><T fr="Enregistrement express" ar="تسجيل سريع" /></p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TOP5.map((id) => {
              const p = PRESETS.find((x) => x.id === id);
              if (!p) return null;
              return (
                <button key={id} onClick={() => addEvent(p)}
                  className="touch rounded-2xl border p-3 text-center text-sm font-black hover:bg-surface2"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {lang === "ar" ? p.ar : p.fr}
                  <span className="block text-[10px] opacity-70">{fmtEvery(p.m)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <p className="text-sm font-black opacity-70"><T fr="Enregistrement détaillé" ar="تسجيل مفصّل" /></p>
        <div className="grid grid-cols-2 gap-2">
          <label className={cell}>
            <span className="text-xs font-black opacity-70"><T fr="Médicament" ar="الدواء" /></span>
            <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-sm font-black outline-none">
              {PRESETS.map((p) => <option key={p.id} value={p.id} className="bg-surface">{lang === "ar" ? p.ar : p.fr}</option>)}
            </select>
          </label>
          <label className={cell}>
            <span className="text-xs font-black opacity-70"><T fr="Intervalle" ar="الفاصل" /></span>
            <select value={sel === "custom" ? customMin : (PRESETS.find((p) => p.id === sel)?.m ?? 60)}
              onChange={(e) => setCustomMin(parseInt(e.target.value, 10))}
              disabled={sel !== "custom"}
              className="w-full bg-transparent text-sm font-black outline-none disabled:opacity-50">
              {INTERVALS.map((m) => <option key={m} value={m} className="bg-surface">{fmtEvery(m)}</option>)}
            </select>
          </label>
        </div>
        {sel === "custom" && (
          <label className={cell}>
            <span className="text-xs font-black opacity-70"><T fr="Nom du médicament" ar="اسم الدواء" /></span>
            <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-transparent text-base font-black outline-none"
              placeholder={lang === "ar" ? "مثال: ديكلوفيناك" : "ex. Diclofénac"} />
          </label>
        )}
        <button
          onClick={() => {
            if (sel === "custom") {
              if (!customName.trim()) return;
              addEvent({ fr: customName.trim(), ar: customName.trim(), m: customMin });
              setCustomName("");
            } else {
              const p = PRESETS.find((x) => x.id === sel);
              if (p) addEvent(p);
            }
          }}
          className="touch rounded-2xl px-4 py-4 text-base font-black text-white"
          style={{ background: "var(--accent)" }}>
          {lang === "ar" ? "تسجيل إعطاء الآن" : "Enregistrer une administration"}
        </button>
      </section>

      {groups.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="text-sm font-black opacity-70"><T fr="Réinjections (dernière dose par médicament)" ar="الاستحقاقات (آخر إعطاء لكل دواء)" /></p>
          <ul className="flex flex-col gap-2">
            {groups.map((g) => (
              <li key={`${g.f}|${g.m}`} className={`card sev-strip rounded-2xl border border-line bg-surface p-3 ${sevCls(g.st)}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black">{lang === "ar" ? g.a : g.f}</p>
                  <Badge tone={stBadge(g.st)}>{stTxt(g.st, g.rem)}</Badge>
                </div>
                <p className="mt-1 text-xs font-bold opacity-70">{lang === "ar" ? "آخر إعطاء" : "Dernière"} <span dir="ltr">{hhmm(g.last)}</span> · {fmtEvery(g.m)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evs.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-black"><T fr="Historique" ar="السجل" /></p>
            <span className="text-xs font-black opacity-60" dir="ltr">{evs.length}</span>
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {[...evs].sort((a, b) => b.t - a.t).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2 rounded-lg p-1 text-sm font-bold">
                <span dir="ltr">{hhmm(e.t)}</span>
                <span className="flex-1 break-words">{lang === "ar" ? e.a : e.f}</span>
                <button onClick={() => persist(evs.filter((x) => x.id !== e.id))}
                  className="touch rounded-full p-1 opacity-60 hover:opacity-100" aria-label={lang === "ar" ? "حذف الإدخال" : "Supprimer"}>
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evs.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Aucune dose enregistrée — commencez par une touche rapide." ar="لا إعطاءات مسجّلة — ابدأ بأحد الأزرار السريعة." />
        </p>
      )}

      {summary && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-base font-black"><T fr="Résumé copiable" ar="ملخص منسوخ" /></p>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-surface2 p-3 text-xs font-bold" dir="auto">{summary}</pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={copySummary} className="touch flex items-center gap-1 rounded-full px-4 py-2 text-xs font-black text-white" style={{ background: "var(--accent)" }}>
              <Copy className="h-3.5 w-3.5" />{copied ? (lang === "ar" ? "نُسخ ✓" : "Copié ✓") : (lang === "ar" ? "نسخ الملخص" : "Copier le résumé")}
            </button>
            <button onClick={closeCase}
              className={`touch rounded-full border px-4 py-2 text-xs font-black ${confirmClose ? "text-white" : ""}`}
              style={confirmClose ? { background: "var(--sev-critical)", borderColor: "var(--sev-critical)" } : { borderColor: "var(--sev-urgent)", color: "var(--sev-urgent)" }}>
              {confirmClose ? (lang === "ar" ? "اضغط مجدداً للتأكيد" : "Confirmer (2e clic)") : (lang === "ar" ? "إغلاق الحالة" : "Clore le cas")}
            </button>
          </div>
        </section>
      )}

      {log.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <button onClick={() => setShowLog(!showLog)} className="flex w-full items-center justify-between">
            <p className="text-base font-black">{lang === "ar" ? `حالات مغلقة (${log.length})` : `Cas clos (${log.length})`}</p>
            <span className="text-xs font-black opacity-60">{showLog ? "▲" : "▼"}</span>
          </button>
          {showLog && (
            <ul className="mt-2 flex flex-col gap-2">
              {log.map((c, i) => {
                const d = new Date(c.at);
                const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${hhmm(c.at)}`;
                return (
                  <li key={c.at} className="flex items-center justify-between gap-2 rounded-xl border border-line p-2 text-sm font-bold">
                    <span dir="ltr">{stamp}</span>
                    <span className="opacity-70" dir="ltr">{c.n}</span>
                    <button onClick={() => { navigator.clipboard?.writeText(c.text).catch(() => {}); }}
                      className="touch rounded-full border border-line px-2 py-1 text-[10px] font-black opacity-80" aria-label={lang === "ar" ? "نسخ" : "Copier"}>
                      <Copy className="h-3 w-3" />
                    </button>
                    <button onClick={() => persistLog(log.filter((_, j) => j !== i))}
                      className="touch rounded-full p-1 opacity-60" aria-label={lang === "ar" ? "حذف" : "Supprimer"}>
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/garde-fous" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Ne pas oublier avant…" ar="لا تنسَ قبل أن…" /></Link>
        <Link href="/calculateurs/jumeaux" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Frères jumeaux" ar="مُفرّق التوائم" /></Link>
        <Link href="/fiche-samu" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Fiche d'intervention" ar="فيشة التدخل" /></Link>
      </div>
    </div>
  );
}
