"use client";
// NIHSS — échelle de sévérité de l'AVC (15 items, 0–42). Référence standard de triage thrombolyse.
import { useState } from "react";
import { useApp } from "@/components/Providers";
import { PrintButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { nihssBand } from "@/lib/calc";
import { trackEvent } from "@/lib/analytics";
import type { Localized } from "@/data/types";

interface Item { id: string; title: Localized; options: { v: number; label: Localized }[] }

const ITEMS: Item[] = [
  { id: "1a", title: { fr: "Niveau de conscience", ar: "مستوى الوعي" }, options: [
    { v: 0, label: { fr: "Vigilant", ar: "يقظ" } },
    { v: 1, label: { fr: "Assoupi (réveille à la voix)", ar: "نَعِس (يستيقظ للنداء)" } },
    { v: 2, label: { fr: "Obtundé (à la douleur)", ar: "مُطرَّب (للألم)" } },
    { v: 3, label: { fr: "Coma / aréactif", ar: "غيبوبة/لا يستجيب" } },
  ]},
  { id: "1b", title: { fr: "Questions (mois, âge)", ar: "أسئلة (الشهر، العمر)" }, options: [
    { v: 0, label: { fr: "2 justes", ar: "إجابتان صحيحتان" } },
    { v: 1, label: { fr: "1 juste", ar: "واحدة صحيحة" } },
    { v: 2, label: { fr: "Aucune", ar: "لا شيء" } },
  ]},
  { id: "1c", title: { fr: "Ordres simples (yeux, main)", ar: "أوامر بسيطة (العينان، اليد)" }, options: [
    { v: 0, label: { fr: "2 exécutés", ar: "أدّى الاثنين" } },
    { v: 1, label: { fr: "1 exécuté", ar: "أدّى واحداً" } },
    { v: 2, label: { fr: "Aucun", ar: "لا شيء" } },
  ]},
  { id: "2", title: { fr: "Regard horizontal", ar: "النظرة الأفقية" }, options: [
    { v: 0, label: { fr: "Normal", ar: "طبيعية" } },
    { v: 1, label: { fr: "Parésie partielle", ar: "شلل جزئي" } },
    { v: 2, label: { fr: "Déviation forcée", ar: "انحراف قسري" } },
  ]},
  { id: "3", title: { fr: "Champs visuels", ar: "الميادين البصرية" }, options: [
    { v: 0, label: { fr: "Intacts", ar: "سليمة" } },
    { v: 1, label: { fr: "Hémianopsie partielle", ar: "عمى نصفي جزئي" } },
    { v: 2, label: { fr: "Hémianopsie complète", ar: "عمى نصفي كامل" } },
    { v: 3, label: { fr: "Bilatérale totale", ar: "ثنائية كلية" } },
  ]},
  { id: "4", title: { fr: "Paralysie faciale", ar: "شلل وجهي" }, options: [
    { v: 0, label: { fr: "Absente", ar: "غائب" } },
    { v: 1, label: { fr: "Mineure", ar: "خفيف" } },
    { v: 2, label: { fr: "Partielle", ar: "جزئي" } },
    { v: 3, label: { fr: "Complète", ar: "كامل" } },
  ]},
  { id: "5g", title: { fr: "Motricité bras gauche", ar: "حركة الذراع اليسرى" }, options: [
    { v: 0, label: { fr: "Tient 10 s", ar: "يثبت 10 ث" } },
    { v: 1, label: { fr: "Dérive", ar: "انجراف" } },
    { v: 2, label: { fr: "Effort antigravitaire", ar: "ضد الجاذبية ضعيف" } },
    { v: 3, label: { fr: "Pas d'antigravitation", ar: "لا يقوى على الجاذبية" } },
    { v: 4, label: { fr: "Aucun mouvement", ar: "لا حركة" } },
  ]},
  { id: "5d", title: { fr: "Motricité bras droit", ar: "حركة الذراع اليمنى" }, options: [
    { v: 0, label: { fr: "Tient 10 s", ar: "يثبت 10 ث" } },
    { v: 1, label: { fr: "Dérive", ar: "انجراف" } },
    { v: 2, label: { fr: "Effort antigravitaire", ar: "ضد الجاذبية ضعيف" } },
    { v: 3, label: { fr: "Pas d'antigravitation", ar: "لا يقوى على الجاذبية" } },
    { v: 4, label: { fr: "Aucun mouvement", ar: "لا حركة" } },
  ]},
  { id: "6g", title: { fr: "Motricité jambe gauche", ar: "حركة الساق اليسرى" }, options: [
    { v: 0, label: { fr: "Tient 5 s", ar: "يثبت 5 ث" } },
    { v: 1, label: { fr: "Dérive", ar: "انجراف" } },
    { v: 2, label: { fr: "Effort antigravitaire", ar: "ضد الجاذبية ضعيف" } },
    { v: 3, label: { fr: "Pas d'antigravitation", ar: "لا يقوى على الجاذبية" } },
    { v: 4, label: { fr: "Aucun mouvement", ar: "لا حركة" } },
  ]},
  { id: "6d", title: { fr: "Motricité jambe droite", ar: "حركة الساق اليمنى" }, options: [
    { v: 0, label: { fr: "Tient 5 s", ar: "يثبت 5 ث" } },
    { v: 1, label: { fr: "Dérive", ar: "انجراف" } },
    { v: 2, label: { fr: "Effort antigravitaire", ar: "ضد الجاذبية ضعيف" } },
    { v: 3, label: { fr: "Pas d'antigravitation", ar: "لا يقوى على الجاذبية" } },
    { v: 4, label: { fr: "Aucun mouvement", ar: "لا حركة" } },
  ]},
  { id: "7", title: { fr: "Ataxie des membres", ar: "ترنّح الأطراف" }, options: [
    { v: 0, label: { fr: "Absente", ar: "غائب" } },
    { v: 1, label: { fr: "1 membre", ar: "طرف واحد" } },
    { v: 2, label: { fr: "2 membres", ar: "طرفان" } },
  ]},
  { id: "8", title: { fr: "Sensibilité", ar: "الحس العميق/السطحي" }, options: [
    { v: 0, label: { fr: "Normale", ar: "طبيعي" } },
    { v: 1, label: { fr: "Diminuée modérée", ar: "نقص متوسط" } },
    { v: 2, label: { fr: "Sévère/totale", ar: "شديد/كامل" } },
  ]},
  { id: "9", title: { fr: "Langage (aphasie)", ar: "اللغة (حبسة)" }, options: [
    { v: 0, label: { fr: "Normal", ar: "طبيعي" } },
    { v: 1, label: { fr: "Aphasie légère", ar: "حبسة خفيفة" } },
    { v: 2, label: { fr: "Aphasie sévère", ar: "حبسة شديدة" } },
    { v: 3, label: { fr: "Mutique/globale", ar: "صامت/كلية" } },
  ]},
  { id: "10", title: { fr: "Dysarthrie", ar: "عسر التلفظ" }, options: [
    { v: 0, label: { fr: "Absente", ar: "غائب" } },
    { v: 1, label: { fr: "Légère", ar: "خفيف" } },
    { v: 2, label: { fr: "Inintelligible", ar: "غير مفهوم" } },
  ]},
  { id: "11", title: { fr: "Extinction / négligence", ar: "إطفاء/إهمال" }, options: [
    { v: 0, label: { fr: "Absente", ar: "غائب" } },
    { v: 1, label: { fr: "Une modalité", ar: "نمط واحد" } },
    { v: 2, label: { fr: "Deux modalités / profonde", ar: "نمطان / عميق" } },
  ]},
];

const BANDS = [
  { fr: "Pas de déficit mesuré", ar: "لا عجز مقاس", cls: "bg-teal-600" },
  { fr: "Mineur (1–4)", ar: "خفيف (1–4)", cls: "bg-teal-700" },
  { fr: "Modéré (5–15)", ar: "متوسط (5–15)", cls: "bg-amber-500 text-black" },
  { fr: "Modéré à sévère (16–20)", ar: "متوسط-شديد (16–20)", cls: "bg-orange-600" },
  { fr: "Sévère (21–42)", ar: "شديد (21–42)", cls: "bg-red-600" },
] as const;

export default function NihssPage() {
  const { t, lang } = useApp();
  const [vals, setVals] = useState<Record<string, number>>({});
  useRegisterRecent("calculateur:nihss");

  const total = Object.values(vals).reduce((s, v) => s + v, 0);
  const band = BANDS[nihssBand(total)];
  const missing = ITEMS.filter((it) => vals[it.id] === undefined).length;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">NIHSS</h1>
        <PrintButton />
      </header>

      <div className="grid gap-3">
        {ITEMS.map((it) => (
          <fieldset key={it.id} className="card rounded-2xl border border-line bg-surface p-3">
            <legend className="px-1 text-sm font-bold text-teal-500">{it.id}. <T fr={it.title.fr} ar={it.title.ar} /></legend>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {it.options.map((o) => {
                const on = vals[it.id] === o.v;
                return (
                  <button key={o.v} role="radio" aria-checked={on}
                    onClick={() => { setVals((p) => ({ ...p, [it.id]: o.v })); trackEvent("calculator_use", { id: "nihss" }); }}
                    className={`touch justify-between rounded-lg border px-2.5 py-2 text-start text-sm ${on ? "border-teal-600 bg-teal-600/15 text-teal-400 font-bold" : "border-line hover:bg-surface2"}`}>
                    <span><T fr={o.label.fr} ar={o.label.ar} /></span>
                    <span className="tabular-nums font-bold opacity-60">{o.v}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className={`rounded-2xl p-5 text-center text-white ${band.cls}`}>
        <p className="text-sm font-semibold opacity-90">{t("common.result")}{missing > 0 ? ` (${lang === "ar" ? "يتبقى" : "reste"} ${missing})` : ""}</p>
        <p className="text-5xl font-black tabular-nums">{total}<span className="text-2xl opacity-70">/42</span></p>
        <p className="mt-2 font-bold">{lang === "ar" ? band.ar : band.fr}</p>
        <p className="mt-1 text-xs opacity-80">
          <T fr="Un NIHSS élevé + fenêtre <4,5 h : avis neurologie/thrombolyse immédiat." ar="NIHSS مرتفع + نافذة <4.5س: رأي أعصاب/حلّ خثرة فوري." />
        </p>
      </div>

      <button onClick={() => setVals({})} className="touch self-start rounded-xl border border-line px-5 py-2 font-semibold hover:bg-surface2">
        {t("common.reset")}
      </button>
    </div>
  );
}
