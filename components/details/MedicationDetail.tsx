"use client";
// Fiche médicament complète : doses, dilution, interactions, mini-calculateur poids.
import { useEffect, useState } from "react";
import Link from "next/link";
import type { MedicationDetailProps } from "@/lib/medication-props";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import Badge from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { AbbrText } from "@/components/AbbrTooltip";
import BackLink from "@/components/BackLink";
import MedTools from "@/components/MedTools";
import { trackEvent } from "@/lib/analytics";
import { clampDose } from "@/lib/calc";
import { ShieldAlert, Syringe, BookOpen, Info, AlertOctagon, Warehouse } from "lucide-react";

function Section({ title, children, id }: { title: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="card scroll-mt-14 rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-2 font-bold text-blue-500">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}

// v17.2 — la fiche reçoit alternatives / préparations PSE / protocoles liés résolus au build.
export default function MedicationDetail({ medication: m, alternatives, psePreps, linkedProtos }: MedicationDetailProps) {
  const { lang, t } = useApp();
  const [weight, setWeight] = useState<string>("");
  const [ctx, setCtx] = useState<"grossesse" | "enfant" | "age" | "renal" | null>(null);
  useRegisterRecent(`medicament:${m.id}`);
  useEffect(() => trackEvent("medication_view", { id: m.id }), [m.id]);
  // v7.9 — arrivée par recherche (#doses) : atterrir directement sur la dose
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h) requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  // v7.9 — « et si… ? » : contextes qui changent la décision, extraits des textes de la fiche
  const CTX_META = {
    grossesse: { fr: "Grossesse / allaitement", ar: "حمل / إرضاع", re: /grosses|enceinte|f[œo]tus|t[ée]rat|allait|obst[ée]/i, reAr: /حمل|جنين|مرض|إرضاع|حامل/i },
    enfant: { fr: "Enfant / nouveau-né", ar: "طفل / رضيع", re: /enfant|p[ée]diatri|nouveau-n|nourrisson/i, reAr: /طفل|أطفال|رضيع|خديج|وزني/i },
    age: { fr: "Sujet âgé (> 65 ans)", ar: "مسن (> 65)", re: /[âa]g[ée]|g[ée]riatr|personne [âa]g[ée]/i, reAr: /مسن|شيخ|كبير السن|كهول/i },
    renal: { fr: "Insuffisance rénale", ar: "قصور كلوي", re: /r[ée]nal|dialys|clairance|insuffisance r/i, reAr: /كلو|كلية|كلوي|ديلزة/i },
  } as const;
  const ctxLines = (() => {
    if (!ctx) return [];
    const { re, reAr } = CTX_META[ctx];
    const sources: [string, { fr: string; ar: string }][] = [
      [lang === "ar" ? "موانع" : "CI", m.contraindications],
      [lang === "ar" ? "تأثيرات" : "EI", m.sideEffects],
      [lang === "ar" ? "تمريض" : "Soins", m.nursing],
      ...(m.doseAdult ? [[lang === "ar" ? "جرعات" : "Doses", m.doseAdult] as [string, { fr: string; ar: string }]] : []),
    ];
    const out: string[] = [];
    for (const [, txt] of sources) {
      const v = lang === "ar" ? txt.ar : txt.fr;
      for (const seg of v.split(/(?<=[.;:·—])\s+/)) {
        const s2 = seg.trim();
        if (s2.length > 3 && (re.test(s2) || reAr.test(s2))) out.push(s2);
      }
    }
    return out.slice(0, 8);
  })();

  const computed =
    m.weightDose && Number(weight) > 0
      ? clampDose(m.weightDose.mgPerKg, Number(weight), m.weightDose.maxMg)
      : null;


  return (
    <article className="flex flex-col gap-5">
      <BackLink href="/medicaments" />
      {/* v9.2 — header unifié : liseré + badge haut risque (jetons sev-*) */}
      <header className={`card ${m.highRisk ? "sev-strip sev-critical" : ""} rounded-2xl border border-line bg-surface p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {m.highRisk && (
              <div className="mb-1.5">
                <Badge tone="critical">
                  <ShieldAlert className="h-3 w-3" aria-hidden /> {t("common.highRisk")}
                </Badge>
              </div>
            )}
            <h1 className="text-2xl font-extrabold tracking-tight">
              <T fr={m.name.fr} ar={m.name.ar} />
            </h1>
            <p className="mt-1 opacity-70"><T fr={m.klass.fr} ar={m.klass.ar} /></p>
            {m.brands && <p className="text-sm opacity-50">{m.brands}</p>}
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton itemKey={`medicament:${m.id}`} />
          </div>
        </div>
      </header>

      <nav aria-label="sections" className="eutn-secnav sticky top-1 z-30 -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        {[
          { id: "ind", fr: "Indications", ar: "استطبابات" },
          { id: "doses", fr: "Doses", ar: "جرعات" },
          ...(m.weightDose ? [{ id: "weight", fr: "Calcul poids", ar: "حساب وزن" }] : []),
          { id: "dil", fr: "Dilution", ar: "تمديد" },
          { id: "ci", fr: "Contre-ind.", ar: "موانع" },
          { id: "nurs", fr: "Surveillance", ar: "مراقبة" },
          ...(m.interactions && m.interactions.length ? [{ id: "inter", fr: "Interactions", ar: "تداخلات" }] : []),
          { id: "tools", fr: "Outils & liens", ar: "أدوات وروابط" },
        ].map((x) => (
          <button key={x.id} onClick={() => document.getElementById(x.id)?.scrollIntoView({ behavior: "smooth" })} className="touch shrink-0 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-black backdrop-blur">
            {lang === "ar" ? x.ar : x.fr}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide opacity-60"><T fr="Et si…" ar="ماذا لو…" /></span>
        {(Object.keys(CTX_META) as (keyof typeof CTX_META)[]).map((k) => (
          <button key={k} onClick={() => { setCtx(ctx === k ? null : k); trackEvent("med_context", { id: m.id, ctx: k }); }}
            aria-pressed={ctx === k}
            className={`touch rounded-full border px-3 py-1.5 text-xs font-black ${ctx === k ? "border-amber-500 bg-amber-500 text-white" : "border-line bg-surface"}`}>
            {lang === "ar" ? CTX_META[k].ar : CTX_META[k].fr}
          </button>
        ))}
      </div>

      {ctx && (
        <div className="rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 p-3" role="note">
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-amber-500">
            {lang === "ar" ? CTX_META[ctx].ar : CTX_META[ctx].fr} — {lang === "ar" ? "ما تذكره هذه البطاقة" : "ce que dit cette fiche"}
          </p>
          {ctxLines.length > 0 ? (
            <ul className="flex flex-col gap-1 text-sm font-bold">
              {ctxLines.map((l, i) => (<li key={i} className="rounded-lg bg-surface px-2 py-1">{l}</li>))}
            </ul>
          ) : (
            <p className="text-sm font-bold opacity-80">
              <T fr="Aucune mention spécifique dans la fiche — prudence renforcée et avis spécialisé." ar="لا ذكر صريح في البطاقة — حذر مضاعف ورأي مختص." />
            </p>
          )}
        </div>
      )}

      <Section id="ind" title={lang === "ar" ? "الاستطبابات" : "Indications"}>
        <AbbrText>{lang === "ar" ? m.indications.ar : m.indications.fr}</AbbrText>
      </Section>

      <div id="doses" className="grid scroll-mt-14 gap-4 md:grid-cols-2">
        <Section title={`${t("common.adult")} — ${lang === "ar" ? "الجرعة" : "dose"}`}>
          <AbbrText>{lang === "ar" ? m.doseAdult.ar : m.doseAdult.fr}</AbbrText>
        </Section>
        <Section title={`${t("common.pediatric")} — ${lang === "ar" ? "الجرعة" : "dose"}`}>
          <AbbrText>{lang === "ar" ? m.dosePediatric.ar : m.dosePediatric.fr}</AbbrText>
        </Section>
      </div>

      {/* Mini-calculateur selon le poids */}
      {m.weightDose && (
        <section id="weight" className="card scroll-mt-14 rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500">
            <Syringe className="h-5 w-5" aria-hidden /> {lang === "ar" ? "حساب بالوزن" : "Calcul selon le poids"}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 font-semibold">
              {t("common.weight")}
              <input
                type="number"
                min={0}
                step={0.1}
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-24 rounded-xl border border-line bg-surface px-3 py-2 text-center text-lg tabular-nums outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
            {computed !== null && (
              <p className="rounded-xl bg-blue-600 px-4 py-2 text-lg font-black text-white tabular-nums">
                {Math.round(computed * 100) / 100} mg
              </p>
            )}
          </div>
          <p className="mt-2 text-sm opacity-80"><T fr={m.weightDose.note.fr} ar={m.weightDose.note.ar} /></p>
        </section>
      )}

      <Section id="dil" title={lang === "ar" ? "التمديد" : "Dilution / administration"}>
        <AbbrText>{lang === "ar" ? m.dilution.ar : m.dilution.fr}</AbbrText>
        {psePreps.length > 0 && (
          <Link href="/calculateurs/perfusions" className="mt-3 flex items-center gap-2 rounded-xl border border-blue-600/40 bg-blue-600/10 p-3 text-sm font-bold text-blue-600 dark:text-blue-400">
            <Syringe className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              {(lang === "ar" ? "سرعات PSE جاهزة للتحضيرات القياسية: " : "Vitesses PSE prêtes pour : ") +
                psePreps.map((prep) => prep[lang]).join(lang === "ar" ? " ؛ " : " · ")}
            </span>
          </Link>
        )}
      </Section>

      <div id="ci" className="grid scroll-mt-14 gap-4 md:grid-cols-2">
        <Section title={lang === "ar" ? "موانع الاستعمال" : "Contre-indications"}>
          <AbbrText>{lang === "ar" ? m.contraindications.ar : m.contraindications.fr}</AbbrText>
        </Section>
        <Section title={lang === "ar" ? "التأثيرات الجانبية" : "Effets indésirables"}>
          <AbbrText>{lang === "ar" ? m.sideEffects.ar : m.sideEffects.fr}</AbbrText>
        </Section>
      </div>

      <Section id="nurs" title={lang === "ar" ? "ملاحظات تمريضية" : "Surveillance / soins infirmiers"}>
        <AbbrText>{lang === "ar" ? m.nursing.ar : m.nursing.fr}</AbbrText>
      </Section>

      {m.interactions && m.interactions.length > 0 && (
        <section id="inter" className="card scroll-mt-14 rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-orange-400">
            <AlertOctagon className="h-5 w-5" aria-hidden />
            {lang === "ar" ? "تداخلات دوائية" : "Interactions"}
          </h2>
          <ul className="space-y-2">
            {m.interactions.map((ix, i) => (
              <li key={i} className="rounded-xl border border-line bg-surface p-3">
                <span className={`me-2 inline-block rounded px-2 py-0.5 text-xs font-black ${ix.severity === "high" ? "bg-red-600 text-white" : "bg-amber-500 text-black"}`}>
                  {ix.drug}
                </span>
                <AbbrText>{lang === "ar" ? ix.description.ar : ix.description.fr}</AbbrText>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* v1.9 — centre de commande : pompe 3 modes, dose, liens, protocoles liés */}
      <div id="tools" className="scroll-mt-14"><MedTools medId={m.id} hasNativeDose={Boolean(m.weightDose)} linkedProtos={linkedProtos} /></div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title={<span className="inline-flex items-center gap-2"><Warehouse className="h-4 w-4" />{lang === "ar" ? "التخزين" : "Conservation"}</span>}>
          <AbbrText>{lang === "ar" ? m.storage.ar : m.storage.fr}</AbbrText>
        </Section>
        {alternatives.length > 0 && (
          <section className="card rounded-2xl border border-line bg-surface p-4">
            <h2 className="mb-2 font-bold text-blue-500">{lang === "ar" ? "بدائل" : "Alternatives"}</h2>
            <ul className="flex flex-wrap gap-2">
              {alternatives.map((a) =>
                a ? (
                  <li key={a.id}>
                    <Link href={`/medicaments/${a.id}`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-surface2">
                      {lang === "ar" ? a.name.ar : a.name.fr}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </section>
        )}
      </div>

      <section className="card rounded-2xl border border-line bg-surface p-4 text-sm">
        <h2 className="mb-1 flex items-center gap-2 font-bold">
          <BookOpen className="h-4 w-4" aria-hidden /> {t("common.sources")}
        </h2>
        <p className="opacity-80">{m.meta.sources.join(" · ")} · {t("common.lastReviewed")} : {m.meta.lastReviewed}</p>
        <p className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden /> {t("common.disclaimer")}
        </p>
      </section>
    </article>
  );
}
