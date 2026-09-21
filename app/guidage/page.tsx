"use client";
// v6.1 — بروتوكول تفاعلي ثنائي البيئة: ميدان (فحوص محمولة فقط + نقل/إعلان مسبق) / مستشفى (الكل).
import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GCASES, type GVal } from "@/data/guidage";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import NowBanner from "@/components/NowBanner";
import { reveal } from "@/lib/reveal";

const SEV_TAG: Record<1 | 2 | 3, { fr: string; ar: string; cls: string }> = {
  1: { fr: "Vital", ar: "حيوي", cls: "border-red-600 bg-red-600/15 text-red-500" },
  2: { fr: "Urgent", ar: "عاجل", cls: "border-amber-500 bg-amber-500/10 text-amber-500" },
  3: { fr: "Important", ar: "مهم", cls: "border-line bg-surface2 opacity-80" },
};

const GROUPS: { key: undefined | "bio" | "img" | "ecg"; fr: string; ar: string }[] = [
  { key: undefined, fr: "Constantes", ar: "الحيوية" },
  { key: "bio", fr: "Biologie", ar: "بيولوجيا" },
  { key: "img", fr: "Imagerie", ar: "تصوير" },
  { key: "ecg", fr: "ECG / monitorage", ar: "تخطيط ومراقبة" },
];

function GuidageInner() {
  useRegisterRecent("guidage");
  const { lang } = useApp();
  const sp = useSearchParams();
  const [caseId, setCaseId] = useState(() => GCASES.find((x) => x.id === sp?.get("c"))?.id ?? GCASES[0].id);
  const [site, setSite] = useState<"pre" | "hosp">("pre");
  const [sev, setSev] = useState<0 | 1 | 2 | 3>(0);
  const c = GCASES.find((x) => x.id === caseId)!;
  const [vals, setVals] = useState<Record<string, GVal>>(() => Object.fromEntries(c.fields.map((f) => [f.id, f.def])));
  const engineRef = useRef<HTMLDivElement>(null);

  const pick = (id: string) => {
    const nc = GCASES.find((x) => x.id === id)!;
    setCaseId(id);
    setVals(Object.fromEntries(nc.fields.map((f) => [f.id, f.def])));
    reveal(engineRef.current);
  };
  const set = (id: string, v: GVal) => setVals((x) => ({ ...x, [id]: v }));

  const fields = c.fields.filter((f) => site === "hosp" || !f.hosp);
  const hiddenHosp = site === "pre" ? c.fields.filter((f) => f.hosp) : [];
  const defs = c.defs.filter((d) => d.when(vals));
  const steps = c.steps.filter((s) => s.when(vals) && (site === "hosp" ? !s.preOnly : !s.hospOnly));
  const first = steps[0];

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-red-500"><T fr="Intervention guidée" ar="تدخل موجّه" /></h1>
      <p className="text-xs opacity-60"><T fr="Entrez constantes et résultats: le moteur détecte, adapte et enchaîne." ar="أدخل الحيوية والنتائج: المحرك يكشف ويكيّف ويسلسل." /></p>

      <div className="flex gap-2">
        <button onClick={() => setSite("pre")} aria-pressed={site === "pre"}
          className={`touch flex-1 rounded-xl border p-3 font-black ${site === "pre" ? "border-red-600 bg-red-600 text-white" : "border-line bg-surface"}`}>
          <T fr="Pré-hospitalier (terrain)" ar="قبل المستشفى (ميدان)" />
        </button>
        <button onClick={() => setSite("hosp")} aria-pressed={site === "hosp"}
          className={`touch flex-1 rounded-xl border p-3 font-black ${site === "hosp" ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface"}`}>
          <T fr="Hospitalier" ar="مستشفى" />
        </button>
      </div>


      <nav aria-label="filtre" className="eutn-secnav sticky top-1 z-30 -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        {([0, 1, 2, 3] as const).map((s) => (
          <button key={s} onClick={() => setSev(s)} aria-pressed={sev === s}
            className={`touch shrink-0 rounded-full border px-3 py-1.5 text-xs font-black ${sev === s ? "border-red-600 bg-red-600 text-white" : "border-line bg-surface/90 backdrop-blur"}`}>
            {s === 0 ? (lang === "ar" ? `الكل · ${GCASES.length}` : `Tout · ${GCASES.length}`) : lang === "ar" ? SEV_TAG[s].ar : SEV_TAG[s].fr}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap gap-2">
        {[...GCASES].sort((a, b) => a.sev - b.sev).filter((g) => !sev || g.sev === sev).map((g) => (
          <button key={g.id} onClick={() => pick(g.id)} aria-pressed={g.id === caseId}
            className={`touch flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-black ${g.id === caseId ? "border-red-600 bg-red-600 text-white" : "border-line bg-surface"}`}>
            <span className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10px] font-black ${g.id === caseId ? "border-white/40 text-white" : SEV_TAG[g.sev].cls}`}>
              {lang === "ar" ? SEV_TAG[g.sev].ar : SEV_TAG[g.sev].fr}
            </span>
            {lang === "ar" ? g.ar : g.fr}
          </button>
        ))}
      </div>

      <div ref={engineRef} className="scroll-mt-16" aria-hidden />

      {first && <NowBanner fr={first.fr} ar={first.ar} />}

      {hiddenHosp.length > 0 && (
        <p className="rounded-xl border border-line bg-surface2 p-3 text-xs font-bold opacity-80">
          <T fr="À l'arrivée (structure):" ar="عند الوصول (المرفق): " />
          {hiddenHosp.map((f) => (lang === "ar" ? f.ar : f.fr)).join(" · ")}
        </p>
      )}

      {GROUPS.map((grp) => {
        const gf = fields.filter((f) => f.group === grp.key);
        if (gf.length === 0) return null;
        return (
          <section key={grp.key ?? "vitals"} className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-xs font-black uppercase tracking-wide opacity-60">{lang === "ar" ? grp.ar : grp.fr}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gf.map((f) => (
                <div key={f.id} className={f.kind === "choice" ? "col-span-2 flex flex-col gap-1 sm:col-span-3" : "flex flex-col gap-1"}>
                  <p className="text-xs font-black opacity-70">{lang === "ar" ? f.ar : f.fr}{f.unit ? ` (${f.unit})` : ""}</p>
                  {f.kind === "num" ? (
                    <div className="flex items-center gap-1" dir="ltr">
                      <button onClick={() => set(f.id, Math.max(f.min ?? 0, Number(vals[f.id]) - (f.step ?? 1)))} aria-label="moins"
                        className="touch h-10 w-10 rounded-lg border border-line bg-surface2 text-lg font-black">−</button>
                      <p className="min-w-12 text-center text-lg font-black tabular-nums text-blue-500">{String(vals[f.id])}</p>
                      <button onClick={() => set(f.id, Math.min(f.max ?? 999, Number(vals[f.id]) + (f.step ?? 1)))} aria-label="plus"
                        className="touch h-10 w-10 rounded-lg border border-line bg-surface2 text-lg font-black">+</button>
                    </div>
                  ) : f.kind === "bool" ? (
                    <button onClick={() => set(f.id, !vals[f.id])} aria-pressed={Boolean(vals[f.id])}
                      className={`touch rounded-lg border px-3 py-2 text-sm font-black ${vals[f.id] ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface2"}`}>
                      {vals[f.id] ? <T fr="Oui" ar="نعم" /> : <T fr="Non" ar="لا" />}
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(f.options ?? []).map((o) => (
                        <button key={o.id} onClick={() => set(f.id, o.id)} aria-pressed={vals[f.id] === o.id}
                          className={`touch rounded-lg border px-2.5 py-1.5 text-xs font-black ${vals[f.id] === o.id ? "border-red-600 bg-red-600 text-white" : "border-line bg-surface2"}`}>
                          {lang === "ar" ? o.ar : o.fr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="mb-2 font-extrabold"><T fr="Dérèglements détectés" ar="التعكرات المكتشفة" /></h2>
        {defs.length === 0 ? (
          <p className="rounded-xl border border-blue-600 bg-blue-600/10 p-3 text-sm font-black text-blue-500">
            <T fr="Pas de dérèglement majeur sur ces valeurs." ar="لا تعكر جوهري على هذه القيم." />
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {defs.map((d, i) => (
              <li key={i} className="rounded-xl border border-red-600 bg-red-600/15 px-3 py-2 text-sm font-black text-red-500">
                {lang === "ar" ? d.ar : d.fr}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-extrabold"><T fr="Conduite à tenir adaptée" ar="التصرف المتكيف" /></h2>
        <ol className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">{i + 1}</span>
              <div className="flex flex-col gap-1.5">
                <p className="font-black">{lang === "ar" ? s.ar : s.fr}</p>
                {s.detail?.(vals) && <p className="text-sm font-black text-blue-500" dir="ltr">{s.detail(vals)}</p>}
                {s.go && (
                  <Link href={s.go.href} className="touch inline-flex w-fit items-center gap-1 rounded-lg border border-amber-500 bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-500">
                    <span dir="ltr">⇒</span> {lang === "ar" ? s.go.ar : s.go.fr}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {c.href && (
        <Link href={c.href} className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 text-center font-black text-blue-500">
          <T fr="Ouvrir l'assistant complet" ar="افتح المساعد الكامل" />
        </Link>
      )}
    </div>
  );
}

export default function GuidagePage() {
  return (
    <Suspense fallback={null}>
      <GuidageInner />
    </Suspense>
  );
}
