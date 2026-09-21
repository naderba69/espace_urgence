"use client";
// v7.4 — index des calculateurs : familles collantes + recherche instantanée,
// zéro scroll perdu dans 66 cartes.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculators } from "@/data/calculators";
import { SECTIONS } from "@/data/sections";
import CalculatorCard, { type LucideName } from "@/components/cards/CalculatorCard";
import { useApp } from "@/components/Providers";
import { Search, Calculator, Gauge, Activity, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const SEC_ICONS = { a: Gauge, b: Activity, c: ShieldCheck } as const;

const GROUPS: { id: string; fr: string; ar: string; ids: string[] }[] = [
  { id: "resp", fr: "Respiration", ar: "تنفس", ids: ["asthme", "vni", "ventilateur", "gazometrie", "noyade"] },
  { id: "cardio", fr: "Cardio", ar: "قلب", ids: ["amines", "stemi", "thrombolyse", "enoxaparine", "heparine", "qtc", "transfusion", "hemo-digestive"] },
  { id: "peds", fr: "Pédiatrie", ar: "أطفال", ids: ["broselow", "poids-pediatrique", "dose-poids", "fluids-enfant", "rcp-peds", "neonat-ran", "westley"] },
  { id: "tox", fr: "Toxico", ar: "سموم", ids: ["nac", "opioides", "sevrage-alcool", "sodium", "gap-metabolique"] },
  { id: "scores", fr: "Scores", ar: "سكورات", ids: ["gcs", "scores", "curb65", "wells-ep", "wells-tvp", "perc", "geneva", "timi-nstem", "burch-wartofsky", "canadian-cspine", "canadian-ct-head", "has-bled", "abcd2", "alvarado", "raaf", "nihss", "lrinec", "bisap"] },
  { id: "perf", fr: "Perfusions", ar: "حقن", ids: ["debit-perfusion", "perfusions", "electrolytes", "dka", "dka-h1", "insuline"] },
  { id: "urg", fr: "Urgences", ar: "استعجالي", ids: ["ddx", "rcp-equipe", "chrono-rcp", "iot-rsi", "rsi", "trauma-membres", "plaies", "tetanos", "coup-chaleur", "hypothermie", "eclampsie", "hpp", "anaphylaxie", "etat-mal", "hyperkalemie", "hypoglycemie", "migraine", "colique", "rau", "syncope", "ciwa-ar"] },
  { id: "obst", fr: "Obstétrique", ar: "توليد", ids: ["eclampsie", "hpp", "neonat-ran"] },
];

export default function CalculatorsPage() {
  const { lang, t } = useApp();
  const [g, setG] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sec, setSec] = useState<"all" | "a" | "b" | "c">("all");

  // بلاطات الأقسام : /calculateurs?sec=a|b|c من الرئيسية
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("sec");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s === "a" || s === "b" || s === "c") setSec(s);
  }, []);

  const list = useMemo(() => {
    const ids = g === "all" ? null : new Set(GROUPS.find((x) => x.id === g)?.ids ?? []);
    const secSet = sec === "all" ? null : new Set(SECTIONS.find((x) => x.id === sec)?.ids ?? []);
    const needle = q.trim().toLowerCase();
    return calculators.filter(
      (c) =>
        (!ids || ids.has(c.id)) &&
        (!secSet || secSet.has(c.href.replace("/calculateurs/", ""))) &&
        (!needle || c.title.fr.toLowerCase().includes(needle) || c.title.ar.includes(q.trim()) || c.description.fr.toLowerCase().includes(needle))
    );
  }, [g, q, sec]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader icon={<Calculator className="h-6 w-6" />} title={t("nav.calculators")} sub={t("page.calc.sub")} count={calculators.length} />
      <Link href="/calculateurs/assistants" className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 text-center font-black text-blue-500">
        Assistants personnels · المساعدون الشخصيون
      </Link>

      {/* ── v12.4 — بلاطات الأقسام (البند ٦٠) : أ/ب/ج بلمسة واحدة ── */}
      <div className="grid grid-cols-3 gap-2" role="group" aria-label={lang === "ar" ? "أقسام النطاق" : "sections du périmètre"}>
        {SECTIONS.map((x) => {
          const Icon = SEC_ICONS[x.id];
          return (
            <button key={x.id} onClick={() => setSec(sec === x.id ? "all" : x.id)} aria-pressed={sec === x.id}
              className={`touch flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center font-black ${sec === x.id ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={sec === x.id ? { background: "var(--accent)" } : undefined}>
              <Icon className="h-5 w-5" aria-hidden />
              <span className="text-xs leading-tight">{lang === "ar" ? x.ar : x.fr}</span>
              <span className="text-lg tabular-nums" dir="ltr">{x.ids.length}</span>
            </button>
          );
        })}
      </div>
      {sec !== "all" && (
        <button onClick={() => setSec("all")} className="touch w-full rounded-xl border border-dashed border-line px-4 py-2 text-xs font-black">
          {lang === "ar" ? `إظهار كل الحاسبات (${calculators.length})` : `Revoir tous les calculs (${calculators.length})`}
        </button>
      )}

      <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
        <Search className="h-4 w-4 opacity-60" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "ar" ? "ابحث في الحاسبات…" : "Chercher un calcul…"}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label={lang === "ar" ? "بحث في الحاسبات" : "Recherche calculateurs"}
        />
      </label>

      <nav aria-label={lang === "ar" ? "عائلات" : "familles"} className="eutn-secnav sticky top-1 z-30 -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        <button onClick={() => setG("all")} className={`touch shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${g === "all" ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface/90 backdrop-blur"}`}>
          {lang === "ar" ? "الكل" : "Tout"} · {calculators.length}
        </button>
        {GROUPS.map((x) => (
          <button key={x.id} onClick={() => setG(x.id)} className={`touch shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${g === x.id ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface/90 backdrop-blur"}`}>
            {lang === "ar" ? x.ar : x.fr}
          </button>
        ))}
      </nav>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <li key={c.id}>
            <CalculatorCard id={c.id} href={c.href} title={c.title} description={c.description} icon={c.icon as LucideName} meta={c.meta} />
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          {lang === "ar" ? "لا نتيجة — جرّب عائلة أخرى." : "Aucun résultat — essayez une autre famille."}
        </p>
      )}
    </div>
  );
}
