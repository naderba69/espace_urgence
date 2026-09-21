"use client";
// v7.2 — UX mobile : bandeau « commencer ici » vers la cas interactive, barre de
// sections collante (zéro scroll perdu), troisisse compacte, renvois auto.
import Link from "next/link";
import ScrollOnce from "@/components/ui/ScrollOnce";
import type { ProtocolDetailProps } from "@/lib/protocol-props";
import type { GuidageRef, ProtocolExtras } from "@/lib/protocol-extras";
import { loadProtocolExtras } from "@/lib/protocol-extras";
import RevalPanel from "@/components/details/RevalPanel";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import Badge from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/Chrome";
import { useRegisterRecent } from "@/components/SearchBar";
import { AbbrText } from "@/components/AbbrTooltip";
import BackLink from "@/components/BackLink";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CheckSquare, Pill, Calculator, BookOpen, Info, Zap, Link2 } from "lucide-react";

// v17.2 — la fiche reçoit ses données croisées (médicaments cités, calculateurs liés, libellé
// de catégorie) résolues côté serveur : les bases complètes ne sont plus téléchargées.
export default function ProtocolDetail({ protocol, meds, calcs, categoryLabel }: ProtocolDetailProps) {
  const { lang, t } = useApp();
  const [more, setMore] = useState(false);
  useRegisterRecent(`protocole:${protocol.id}`);
  useEffect(() => trackEvent("protocol_view", { id: protocol.id }), [protocol.id]);
  // v7.9 — arrivée par recherche (#steps) : atterrir directement sur l'action
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h) requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  // v17.1 — guidage + réévaluation arrivent APRÈS le premier rendu.
  // v17.4 — ils viennent de fichiers dédiés (≈ 2 Ko) et non plus des deux bases complètes.
  const [gcase, setGcase] = useState<GuidageRef | undefined>(undefined);
  const [reval, setReval] = useState<ProtocolExtras["reval"]>(undefined);
  useEffect(() => {
    let alive = true;
    loadProtocolExtras(protocol.id)
      .then((x) => {
        if (!alive) return;
        setGcase(x.gcase);
        setReval(x.reval);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [protocol.id]);

  // meds / calcs / categoryLabel viennent du serveur (voir lib/protocol-props.ts)
  // v7.9 — interactions croisées entre les médicaments du protocole (au moment du choix)
  const crossInter = (() => {
    const warns: { a: string; b: string; txt: string; high: boolean }[] = [];
    for (const x of meds) {
      if (!x?.interactions) continue;
      for (const y of meds) {
        if (!y || y.id === x.id) continue;
        const cible = `${y.name.fr} ${y.name.ar} ${y.klass.fr} ${y.klass.ar} ${y.synonyms.join(" ")}`.toLowerCase();
        for (const i of x.interactions) {
          if (cible.includes(i.drug.toLowerCase())) {
            warns.push({ a: x.name[lang], b: y.name[lang], txt: i.description[lang], high: i.severity === "high" });
          }
        }
      }
    }
    return warns;
  })();

  const nav: { id: string; fr: string; ar: string }[] = [
    { id: "steps", fr: "Étapes", ar: "الخطوات" },
    ...(protocol.exams ? [{ id: "exams", fr: "Examens", ar: "الفحوص" }] : []),
    ...(protocol.trajectory?.length ? [{ id: "traj", fr: "Et si… ?", ar: "تعكرات" }] : []),
    // n'apparaît qu'une fois la réévaluation chargée (aucune entrée morte dans la barre)
    ...(reval ? [{ id: "reval", fr: "Réévaluation", ar: "إعادة تقييم" }] : []),
    { id: "key", fr: "Points-clés", ar: "نقاط" },
    ...(meds.length ? [{ id: "meds", fr: "Médicaments", ar: "أدوية" }] : []),
    ...(calcs.length ? [{ id: "calcs", fr: "Calculs", ar: "حاسبات" }] : []),
  ];
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const longSummary = !!protocol.summary && (protocol.summary.fr.length > 110 || protocol.summary.ar.length > 110);

  return (
    <article className="flex flex-col gap-4">
      <BackLink href="/protocoles" />

      {/* Renvoi auto vers la cas interactive : le chemin le plus court vers l'action */}
      {gcase && (
        <Link
          href={`/guidage?c=${gcase.id}`}
          className="touch flex items-center gap-3 rounded-2xl border-2 border-red-600/60 bg-red-600/10 p-3 active:scale-[.99]"
        >
          <Zap className="h-6 w-6 shrink-0 text-red-500" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-black leading-tight text-red-500">
              {lang === "ar" ? "ابدأ هنا — التدخل الموجّه التفاعلي" : "Commencer ici — intervention guidée"}
            </span>
            <ScrollOnce className="text-xs opacity-80">
              {lang === "ar" ? gcase.ar : gcase.fr} · {lang === "ar" ? "حيوية + فحوص ⇒ كوندويت متكيف" : "constantes + examens ⇒ conduite adaptée"}
            </ScrollOnce>
          </span>
          <Link2 className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
        </Link>
      )}

      <header className={`card sev-strip sev-${protocol.severity} rounded-2xl border border-line bg-surface p-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* v9.1 — gravité + catégorie affichées d'emblée (jetons unifiés) */}
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge tone={protocol.severity}>{t(`sev.${protocol.severity}`)}</Badge>
              {(() => {
                const cat = categoryLabel ? { label: categoryLabel } : undefined;
                return cat ? (
                  <span className="text-[11px] font-bold opacity-60">
                    {lang === "ar" ? cat.label.ar : cat.label.fr}
                  </span>
                ) : null;
              })()}
            </div>
            <h1 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
              <T fr={protocol.title.fr} ar={protocol.title.ar} />
            </h1>
            {protocol.summary && (
              <p className={`mt-1 text-sm leading-relaxed opacity-80 ${more || !longSummary ? "" : "line-clamp-2"}`}>
                <T fr={protocol.summary.fr} ar={protocol.summary.ar} />
              </p>
            )}
            {longSummary && (
              <button onClick={() => setMore((x) => !x)} className="touch mt-0.5 text-xs font-black text-blue-500">
                {more ? (lang === "ar" ? "أقل ▲" : "Moins ▲") : (lang === "ar" ? "المزيد ▼" : "Plus ▼")}
              </button>
            )}
          </div>
          <FavoriteButton itemKey={`protocole:${protocol.id}`} />
        </div>
      </header>

      {/* Barre de sections collante : navigation interne sans scroll manuel */}
      <nav aria-label={lang === "ar" ? "أقسام" : "sections"} className="eutn-secnav sticky top-1 z-30 -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        {nav.map((s) => (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className="touch shrink-0 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-black backdrop-blur active:bg-surface2"
          >
            {lang === "ar" ? s.ar : s.fr}
          </button>
        ))}
      </nav>

      {/* Étapes */}
      <section id="steps" aria-label="steps" className="flex scroll-mt-14 flex-col gap-2.5">
        {protocol.steps.map((s, i) => (
          <div key={i} className="card flex gap-3 rounded-2xl border border-line bg-surface p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white tabular-nums">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-snug"><AbbrText>{lang === "ar" ? s.title.ar : s.title.fr}</AbbrText></p>
              {s.detail && <p className="mt-0.5 text-sm leading-relaxed opacity-80"><AbbrText>{lang === "ar" ? s.detail.ar : s.detail.fr}</AbbrText></p>}
            </div>
          </div>
        ))}
      </section>

      {/* Examens complémentaires */}
      {protocol.exams && (
        <section id="exams" aria-label="exams" className="scroll-mt-14 rounded-2xl border-2 border-sky-500/40 bg-sky-500/5 p-3">
          <h2 className="mb-2 font-bold text-sky-500"><T fr="Examens complémentaires" ar="فحوص تكميلية" /></h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["bio", "img", "ecg"] as const).map((k) =>
              protocol.exams![k]?.length ? (
                <div key={k}>
                  <p className="mb-1 text-xs font-black uppercase tracking-wide opacity-70">
                    {k === "bio" ? <T fr="Biologie" ar="بيولوجيا" /> : k === "img" ? <T fr="Imagerie" ar="تصوير" /> : <T fr="ECG / monitorage" ar="تخطيط ومراقبة" />}
                  </p>
                  <ul className="space-y-1 text-sm font-bold">
                    {protocol.exams![k]!.map((e, i) => (
                      <li key={i} className="rounded-lg bg-surface2 px-2 py-1"><T fr={e.fr} ar={e.ar} /></li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Évolution & complications */}
      {protocol.trajectory && protocol.trajectory.length > 0 && (
        <section id="traj" aria-label="trajectory" className="scroll-mt-14 rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 p-3">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-amber-500">
            <Info className="h-5 w-5" aria-hidden />
            {lang === "ar" ? "تطور الحالة وتعقيداتها — ماذا لو..؟" : "Évolution & complications — et si… ?"}
          </h2>
          <div className="flex flex-col gap-2.5">
            {protocol.trajectory.map((tr, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-3">
                <p className="font-semibold text-amber-500"><AbbrText>{lang === "ar" ? tr.when.ar : tr.when.fr}</AbbrText></p>
                <ul className="mt-1 list-disc space-y-1 ps-5 text-sm">
                  {tr.do.map((d, j) => (
                    <li key={j}><AbbrText>{lang === "ar" ? d.ar : d.fr}</AbbrText></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Réévaluation — chef de terrain */}
      {reval && <RevalPanel reval={reval} protocolId={protocol.id} protocolTitle={protocol.title} />}

      {/* Points-clés */}
      <section id="key" aria-label="key" className="card scroll-mt-14 rounded-2xl border border-blue-600/40 bg-blue-600/10 p-3">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-blue-500">
          <CheckSquare className="h-5 w-5" aria-hidden />
          {lang === "ar" ? "نقاط أساسية" : "Points-clés"}
        </h2>
        <ul className="list-disc space-y-1 ps-5">
          {protocol.keyPoints.map((k, i) => (
            <li key={i}><AbbrText>{lang === "ar" ? k.ar : k.fr}</AbbrText></li>
          ))}
        </ul>
      </section>

      {/* Médicaments liés */}
      {meds.length > 0 && (
        <section id="meds" aria-label="meds" className="scroll-mt-14">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Pill className="h-5 w-5 text-blue-500" aria-hidden />
            {t("nav.medications")}
          </h2>
          {crossInter.length > 0 && (
            <div role="alert" className="mb-2 rounded-xl border-2 border-orange-500/60 bg-orange-500/10 p-3">
              <p className="mb-1 text-xs font-black uppercase tracking-wide text-orange-400">
                {lang === "ar" ? "تفاعلات بين أدوية هذا البروتوكول" : "Interactions entre médicaments de ce protocole"}
              </p>
              <ul className="flex flex-col gap-1 text-sm font-bold">
                {crossInter.map((w, i) => (
                  <li key={i} className={w.high ? "text-red-500" : "text-orange-400"}>
                    {w.high ? "⛔ " : "⚠ "}{w.a} + {w.b} — {w.txt}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className="flex flex-wrap gap-2">
            {meds.map((m) =>
              m ? (
                <li key={m.id}>
                  <Link href={`/medicaments/${m.id}`} className="touch rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">
                    {lang === "ar" ? m.name.ar : m.name.fr}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {/* Calculateurs liés */}
      {calcs.length > 0 && (
        <section id="calcs" aria-label="calcs" className="scroll-mt-14">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Calculator className="h-5 w-5 text-blue-500" aria-hidden />
            {t("nav.calculators")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {calcs.map((c) => (
              <li key={c.id}>
                <Link href={c.href} className="touch rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface2">
                  {lang === "ar" ? c.title.ar : c.title.fr}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sources + avertissement */}
      <section className="card rounded-2xl border border-line bg-surface p-3 text-sm">
        <h2 className="mb-1 flex items-center gap-2 font-bold">
          <BookOpen className="h-4 w-4" aria-hidden /> {t("common.sources")}
        </h2>
        <p className="opacity-80">{protocol.meta.sources.join(" · ")}</p>
        <p className="mt-2 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-amber-500">
          <Info className="h-5 w-5 shrink-0" aria-hidden /> {t("common.disclaimer")}
        </p>
      </section>
      <p className="text-center text-[11px] opacity-50">{t("common.lastReviewed")} : {protocol.meta.lastReviewed}</p>
    </article>
  );
}
