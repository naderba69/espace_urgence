"use client";
// v1.9 — moteur pompe-seringue avancé : 3 modes (ma prépa / seringue entrante / inconnue),
// conventions de dilution, table dose↔débit, garde-fous, défaut département mémorisé.
import { useEffect, useMemo, useState } from "react";
import { Settings2, ArrowRightLeft, HelpCircle, FlaskConical } from "lucide-react";
import type { PumpCfg } from "@/data/med-tools";
import { readJSON, writeJSON } from "@/lib/storage";
import { concUgPerMl, prepVolume, flowForUnit, inferConcUgMl, doseLadder } from "@/lib/calc";
import T from "@/components/T";
import { NumField, Hero, Sheet, WarnNote, TabBar } from "./ui";

const fmt = (x: number) => (x >= 10 ? x.toFixed(1) : x.toFixed(2));

interface PrepState { ampMg: number; ampVol: number; count: number; target: number; convention: "total" | "added" }

export default function PumpTool({ cfg, storageKey }: { cfg: PumpCfg; storageKey: string }) {
  const def: PrepState = useMemo(
    () => ({ ampMg: cfg.defAmpMg, ampVol: cfg.defAmpVol, count: cfg.defCount, target: cfg.defTarget, convention: "total", ...readJSON<Partial<PrepState>>(storageKey, {}) }),
    [storageKey, cfg]
  );
  const [mode, setMode] = useState<"prep" | "incoming" | "unknown">("prep");
  const [sheet, setSheet] = useState(false);
  const [prep, setPrep] = useState<PrepState>(def);
  const [weight, setWeight] = useState("70");
  const [dose, setDose] = useState(String(cfg.doseStart));
  const [inFlow, setInFlow] = useState("");
  const [inDose, setInDose] = useState(String(cfg.doseStart));

  useEffect(() => { writeJSON(storageKey, prep); }, [prep, storageKey]);

  const w = Number(weight);
  const vol = prepVolume(prep.count, prep.ampVol, prep.target, prep.convention);
  const volAlt = prepVolume(prep.count, prep.ampVol, prep.target, prep.convention === "total" ? "added" : "total");
  const isUI = cfg.unit.startsWith("UI");
  const conc = isUI ? (vol > 0 ? (prep.count * prep.ampMg) / vol : 0) : concUgPerMl(prep.count * prep.ampMg, vol);
  const concAlt = isUI ? (volAlt > 0 ? (prep.count * prep.ampMg) / volAlt : 0) : concUgPerMl(prep.count * prep.ampMg, volAlt);
  const d = Number(dose);
  const flow = flowForUnit(cfg.unit, d, w, conc);
  const over = cfg.warnAbove && d > cfg.warnAbove;

  const ladder = useMemo(() => doseLadder(cfg.doseMin, cfg.doseMax, cfg.doseStep), [cfg]);
  const nearest = ladder.length ? ladder.reduce((a, b) => (Math.abs(b - d) < Math.abs(a - d) ? b : a)) : null;

  const inferred = inferConcUgMl(Number(inFlow), Number(inDose), w);
  const relay = flowForUnit(cfg.unit, Number(inDose), w, conc);

  const prepForm = (
    <div className="grid grid-cols-2 gap-3">
      <NumField label={<T fr="Ampoule (mg ou UI)" ar="الأمبولة (ملغ أو وحدة)" />} value={String(prep.ampMg)} onChange={(v) => setPrep((p) => ({ ...p, ampMg: Number(v) }))} />
      <NumField label={<T fr="Volume ampoule (mL)" ar="حجم الأمبولة (مل)" />} value={String(prep.ampVol)} onChange={(v) => setPrep((p) => ({ ...p, ampVol: Number(v) }))} />
      <NumField label={<T fr="Nombre d'ampoules" ar="عدد الأمبولات" />} value={String(prep.count)} onChange={(v) => setPrep((p) => ({ ...p, count: Number(v) }))} />
      <NumField label={<T fr="Volume cible (mL)" ar="الحجم الهدف (مل)" />} value={String(prep.target)} onChange={(v) => setPrep((p) => ({ ...p, target: Number(v) }))} />
      <div className="col-span-2 flex gap-2" role="radiogroup">
        {(["total", "added"] as const).map((c) => (
          <button key={c} role="radio" aria-checked={prep.convention === c}
            onClick={() => setPrep((p) => ({ ...p, convention: c }))}
            className={`flex-1 rounded-xl border px-2 py-2 text-xs font-bold ${prep.convention === c ? "border-blue-600 bg-blue-600 text-white" : "border-line opacity-70"}`}>
            {c === "total"
              ? <T fr="Complété à ce volume" ar="مُكمَّل إلى هذا الحجم" />
              : <T fr="Ajouté sur ce volume" ar="مُضاف فوق هذا الحجم" />}
            </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <TabBar
        tabs={[
          { id: "prep" as const, label: <span className="inline-flex items-center gap-1"><FlaskConical className="h-4 w-4" aria-hidden /><T fr="Ma prépa" ar="تحضيري" /></span> },
          { id: "incoming" as const, label: <span className="inline-flex items-center gap-1"><ArrowRightLeft className="h-4 w-4" aria-hidden /><T fr="Seringue entrante" ar="محقنة قادمة" /></span> },
          { id: "unknown" as const, label: <span className="inline-flex items-center gap-1"><HelpCircle className="h-4 w-4" aria-hidden /><T fr="Inconnue" ar="مجهولة" /></span> },
        ]}
        active={mode} onChange={setMode}
      />

      {mode === "prep" && (
        <>
          <button onClick={() => setSheet(true)}
            className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-bold hover:bg-[color:var(--surface-2)] sm:hidden">
            <span className="inline-flex items-center gap-2"><Settings2 className="h-4 w-4" aria-hidden /><T fr="Préparation de la seringue" ar="تحضير المحقنة" /></span>
            <span className="tabular-nums opacity-70" dir="ltr">{prep.count}×{prep.ampMg} → {vol} mL</span>
          </button>
          <Sheet open={sheet} onClose={() => setSheet(false)} title={<T fr="Préparation" ar="التحضير" />}>{prepForm}</Sheet>

          <div className="rounded-2xl border border-line bg-[color:var(--surface)] p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-xs font-bold opacity-70"><T fr="Concentration" ar="التركيز" /></p>
              <p className="text-sm font-black tabular-nums" dir="ltr">
                {isUI ? `${fmt(conc)} UI/mL` : `${fmt(conc / 1000)} mg/mL`}
              </p>
            </div>
            <p className="text-xs opacity-60">
              <T fr="Autre convention de dilution:" ar="باتفاقية التخفيف الأخرى:" />{" "}
              <span className="tabular-nums font-bold" dir="ltr">{isUI ? `${fmt(concAlt)} UI/mL` : `${fmt(concAlt / 1000)} mg/mL`}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} suffix="kg" />
            <NumField label={<span dir="ltr">{cfg.unit}</span>} value={dose} onChange={setDose} step={String(cfg.doseStep)} />
          </div>
          {over && <WarnNote tone="amber"><T fr="Dose élevée: vérifier l'indication et la voie avant d'augmenter." ar="جرعة مرتفعة: تحقق من الاستطباب والطريق قبل الزيادة." /></WarnNote>}

          <Hero value={fmt(flow)} unit="mL/h" sub={<><T fr="pour" ar="لجرعة" /> <span dir="ltr" className="tabular-nums">{dose} {cfg.unit}</span> · <span dir="ltr" className="tabular-nums">{weight} kg</span></>} />

          <div className="sticky bottom-[72px] z-30 rounded-2xl bg-blue-600 px-4 py-2 text-center text-white shadow-xl sm:hidden" dir="ltr">
            <span className="text-xl font-black tabular-nums">{fmt(flow)} mL/h</span>
          </div>

          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="border-b border-line text-xs opacity-70">
                <th className="py-1 font-bold"><span dir="ltr">{cfg.unit}</span></th>
                <th className="py-1 font-bold">mL/h</th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((x) => (
                <tr key={x} className={`border-b border-line/40 ${x === nearest ? "bg-blue-600/20 font-black text-blue-500" : ""}`}>
                  <td className="py-1 text-center" dir="ltr">{x}</td>
                  <td className="py-1 text-center" dir="ltr">{fmt(flowForUnit(cfg.unit, x, w, conc))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === "incoming" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumField label={<T fr="Débit actuel (mL/h)" ar="السرعة الجارية (مل/س)" />} value={inFlow} onChange={setInFlow} />
            <NumField label={<span dir="ltr">{cfg.unit}</span>} value={inDose} onChange={setInDose} />
          </div>
          <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} suffix="kg" />
          {Number(inFlow) > 0 && (
            <>
              <Hero value={isUI ? fmt(inferred) : fmt(inferred / 1000)} unit={isUI ? "UI/mL" : "mg/mL"} tone="amber"
                sub={<T fr="concentration inférée de la seringue entrante" ar="التركيز المستنتج للمحقنة القادمة" />} />
              <div className="rounded-2xl border border-line p-4 text-center">
                <p className="text-xs font-bold opacity-70"><T fr="Relais sûr sur votre prépa (même dose)" ar="الترحيل الآمن على تحضيركم (نفس الجرعة)" /></p>
                <p className="text-3xl font-black tabular-nums text-blue-500" dir="ltr">{fmt(relay)} mL/h</p>
              </div>
              <WarnNote tone="red"><T fr="Toujours confronter au bon de transfert; en cas de doute, mode « inconnue »." ar="طابق دائماً مع ملف النقل؛ عند الشك انتقل إلى وضع «مجهولة»." /></WarnNote>
            </>
          )}
        </>
      )}

      {mode === "unknown" && (
        <div className="flex flex-col gap-3">
          <WarnNote tone="red">
            <T fr="Seringue non documentée: ne pas poursuivre à l'aveugle."
              ar="محقنة غير موثقة: لا تُتابَع على العمياء." />
          </WarnNote>
          <ol className="list-inside list-decimal flex flex-col gap-1 text-sm font-semibold opacity-90">
            <li><T fr="Arrêter la seringue inconnue et poser votre préparation standard." ar="أوقف المحقنة المجهولة وجهّز تحضيركم المعياري." /></li>
            <li><T fr="Reprendre à la dose de départ usuelle, puis titrer sur la cible clinique." ar="استأنف بجرعة البدء المعتادة ثم عايِر على الهدف السريري." /></li>
            <li><T fr="Surveillance rapprochée 10 min (pression, fréquence, perfusion)." ar="مراقبة لصيقة 10 دقائق (ضغط، تردد، تروية)." /></li>
          </ol>
          <button onClick={() => { setDose(String(cfg.doseStart)); setMode("prep"); }}
            className="rounded-xl bg-blue-600 px-4 py-3 font-black text-white active:scale-[.98]">
            <T fr="Utiliser la prépa du service" ar="استعمل تحضير القسم" />
          </button>
        </div>
      )}
    </div>
  );
}
