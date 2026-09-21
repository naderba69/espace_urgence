"use client";
// v2.3 — centre de commande par médicament : pompe (manuelle ou dérivée RE.NAU),
// dose vivante, liens, protocoles liés, badges de sécurité.
import { useState } from "react";
import { Scale, Syringe, Link2, FileText, AlertTriangle } from "lucide-react";
import { MED_TOOLS, pumpCfgFromPerfusion } from "@/data/med-tools";
import { clampDose } from "@/lib/calc";
import T from "@/components/T";
import { TabBar, NumField, Hero, ChipLink } from "./tools/ui";
import PumpTool from "./tools/PumpTool";

// v17.2 — `linkedProtos` arrive résolu par le serveur (id + titre) : plus besoin de
// télécharger la base des 98 protocoles pour afficher deux ou trois liens.
export default function MedTools({ medId, hasNativeDose, linkedProtos = [] }: { medId: string; hasNativeDose: boolean; linkedProtos?: { id: string; title: { fr: string; ar: string } }[] }) {
  const manual = MED_TOOLS[medId];
  const pump = manual?.pump ?? pumpCfgFromPerfusion(medId);
  const wd = manual?.weightDose;
  const links = manual?.links ?? [];
  const protos = manual?.protocols ?? [];
  const badges = manual?.badges;
  const [tab, setTab] = useState<"dose" | "pump" | "links">(pump ? "pump" : wd && !hasNativeDose ? "dose" : "links");
  const [weight, setWeight] = useState("70");

  if (!pump && !wd && links.length === 0 && protos.length === 0) return null;

  const tabs = [
    (wd && !hasNativeDose) && { id: "dose" as const, label: <span className="inline-flex items-center gap-1"><Scale className="h-4 w-4" aria-hidden /><T fr="Dose" ar="الجرعة" /></span> },
    pump && { id: "pump" as const, label: <span className="inline-flex items-center gap-1"><Syringe className="h-4 w-4" aria-hidden /><T fr="Pompe" ar="المضخة" /></span> },
    (links.length > 0 || protos.length > 0) && { id: "links" as const, label: <span className="inline-flex items-center gap-1"><Link2 className="h-4 w-4" aria-hidden /><T fr="Liens" ar="روابط" /></span> },
  ].filter(Boolean) as { id: "dose" | "pump" | "links"; label: React.ReactNode }[];

  const w = Number(weight);
  const doseMg = wd ? clampDose(wd.mgPerKg, w, wd.maxMg) : 0;
  const dec = wd?.decimals ?? 1;
  // les protocoles liés sont fournis par le serveur (voir lib/medication-props.ts)

  return (
    <section className="card flex flex-col gap-4 rounded-2xl border border-blue-600/40 bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-black text-blue-500">
          <Syringe className="h-5 w-5" aria-hidden />
          <T fr="Outils à la volée" ar="أدوات فورية" />
        </h2>
        {badges && (
          <div className="flex flex-wrap justify-end gap-1">
            {badges.qt && <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-400"><AlertTriangle className="h-3 w-3" aria-hidden />QT</span>}
            {badges.pregnancy && <span className="rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-400"><T fr={badges.pregnancy.fr} ar={badges.pregnancy.ar} /></span>}
            {badges.renal && <span className="rounded-full border border-sky-500/60 bg-sky-500/10 px-2 py-0.5 text-[10px] font-black text-sky-400"><T fr={badges.renal.fr} ar={badges.renal.ar} /></span>}
          </div>
        )}
      </div>

      {tabs.length > 1 && <TabBar tabs={tabs} active={tab} onChange={setTab} />}

      {tab === "dose" && wd && (
        <div className="flex flex-col gap-3">
          <NumField label={<T fr="Poids (kg)" ar="الوزن (كغ)" />} value={weight} onChange={setWeight} suffix="kg" />
          <Hero value={doseMg.toFixed(dec)} unit="mg" sub={<>{doseMg >= wd.maxMg ? <T fr="plafond atteint" ar="بلغت الحد الأقصى" /> : <span dir="ltr" className="tabular-nums">{wd.mgPerKg} mg/kg</span>}</>} />
          <p className="text-sm font-semibold opacity-80"><T fr={wd.note.fr} ar={wd.note.ar} /></p>
        </div>
      )}

      {tab === "pump" && pump && (
        <PumpTool cfg={pump} storageKey={`eutn:pump:${medId}`} />
      )}

      {tab === "links" && (
        <div className="flex flex-col gap-3">
          {links.map((l) => (
            <ChipLink key={l.href} href={l.href}>
              <Link2 className="h-3 w-3" aria-hidden /> <T fr={l.label.fr} ar={l.label.ar} />
            </ChipLink>
          ))}
          {linkedProtos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {linkedProtos.map((p) => (
                <ChipLink key={p.id} href={`/protocoles/${p.id}`}>
                  <FileText className="h-3 w-3" aria-hidden /> <T fr={p.title.fr} ar={p.title.ar} />
                </ChipLink>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
