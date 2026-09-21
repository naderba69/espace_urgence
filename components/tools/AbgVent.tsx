"use client";
// v1.9 — gazométrie : interprétation systématique + ajustement ventilatoire
// « méthode combinée » : table complète, changements surlignés avec raison, constants estompés.
import { useState } from "react";
import type { Localized } from "@/data/types";
import { interpretAbg, ventSuggest, ibwKg, type VentSettings } from "@/lib/calc";
import T from "@/components/T";
import { NumField, WarnNote } from "./ui";

const FINDINGS: Record<string, Localized> = {
  acidemie: { fr: "Acidémie", ar: "أحمضية الدم" },
  alcalemie: { fr: "Alcalémie", ar: "قلوية الدم" },
  "ph-normal": { fr: "pH dans les limites", ar: "pH ضمن الحدود" },
  "resp-acidose": { fr: "Acidose respiratoire", ar: "حماض تنفسي" },
  "met-acidose": { fr: "Acidose métabolique", ar: "حماض استقلابي" },
  "resp-alcalose": { fr: "Alcalose respiratoire", ar: "قلوية تنفسية" },
  "met-alcalose": { fr: "Alcalose métabolique", ar: "قلوية استقلابية" },
  "mixte-acidose": { fr: "Acidose MIXTE respiratoire + métabolique", ar: "حماض مختلط: تنفسي واستقلابي" },
  "mixte-alcalose": { fr: "Alcalose mixte", ar: "قلوية مختلطة" },
  compense: { fr: "Trouble compensé (pH normal)", ar: "اضطراب مُعوَّض (pH طبيعي)" },
  "mixte-comp-ac": { fr: "Mixte: acidose métabolique + alcalose respiratoire", ar: "مختلط: حماض استقلابي وقلوية تنفسية" },
  "mixte-comp-al": { fr: "Mixte: alcalose métabolique + acidose respiratoire", ar: "مختلط: قلوية استقلابية وحماض تنفسي" },
  "winter-haut": { fr: "pCO2 au-dessus de Winter → acidose respiratoire surajoutée (attendu {n})", ar: "ثاني أكسيد فوق تعويض وينتر → حماض تنفسي مضاف (المتوقع {n})" },
  "winter-bas": { fr: "pCO2 sous Winter → alcalose respiratoire associée (attendu {n})", ar: "ثاني أكسيد تحت وينتر → قلوية تنفسية مرافقة (المتوقع {n})" },
  "comp-met-al-inad": { fr: "Compensation respiratoire inadéquate (attendu {n})", ar: "تعويض تنفسي غير ملائم (المتوقع {n})" },
  "resp-aigu": { fr: "Profil aigu", ar: "نمط حاد" },
  "resp-chron": { fr: "Profil chronique (bicarbonates retenus)", ar: "نمط مزمن (احتباس بيكربونات)" },
  "ta-eleve": { fr: "Trou anionique élevé (AGc {n})", ar: "فجوة أنيونية مرتفعة ({n})" },
  "delta-gt2": { fr: "Delta {n} > 2: alcalose métabolique associée", ar: "دلتا {n} أكبر من 2: قلوية استقلابية مرافقة" },
  "delta-lt08": { fr: "Delta {n} < 0,8: acidose hyperchlorémique associée", ar: "دلتا {n} أقل من 0.8: حماض فرط كلور مرافق" },
  "ards-severe": { fr: "P/F {n}: SDRA sévère", ar: "نسبة أكسجة {n}: ضائقة تنفسية شديدة" },
  "ards-mod": { fr: "P/F {n}: SDRA modéré", ar: "نسبة أكسجة {n}: ضائقة متوسطة" },
  "ards-mild": { fr: "P/F {n}: SDRA léger", ar: "نسبة أكسجة {n}: ضائقة خفيفة" },
  hypoxemie: { fr: "Hypoxémie sévère (PaO2 < 55)", ar: "نقص أكسجة شديد (أقل من 55)" },
};

const REASONS: Record<string, Localized> = {
  protection: { fr: "Ventilation protectrice: Vt > 8 mL/kg IBW", ar: "تهوية حمائية: الحجم تجاوز 8 مل/كغ" },
  "vt-bas": { fr: "Volume trop bas, remonter au plancher protecteur", ar: "حجم منخفض، ارفعه إلى الحد الحمائي" },
  "hypercapnie-acide": { fr: "Hypercapnie acide: augmenter la fréquence", ar: "احتباس حامضي: ارفع التردد" },
  "alcalose-resp": { fr: "Alcalose respiratoire: réduire la fréquence", ar: "قلوية تنفسية: خفّض التردد" },
  hypoxemie: { fr: "Hypoxémie: monter d'un cran (table PEEP/FiO2)", ar: "نقص أكسجة: اصعد درجة وفق جدول PEEP/FiO2" },
  "sevrage-o2": { fr: "Oxygénation confortable: descendre d'un cran", ar: "أكسجة مريحة: انزل درجة" },
};

const GUARDS: Record<string, Localized> = {
  "rr-max": { fr: "Fréquence au plafond 35/min: revoir Vt ou stratégie", ar: "التردد عند السقف 35: راجع الحجم أو الاستراتيجية" },
  "vt-min": { fr: "Volume au plancher 4 mL/kg IBW", ar: "الحجم عند الأرضية 4 مل/كغ" },
  "fio2-max": { fr: "FiO2 100 % encore hypoxémique: PEEP supérieure, décubitus ventral, avis réa", ar: "أكسجين 100% مع نقص أكسجة: PEEP أعلى، وضع بطني، استشارة إنعاش" },
  "acidemie-severe": { fr: "pH < 7,15: danger immédiat, avis réanimation", ar: "pH أقل من 7.15: خطر داهم، استشارة إنعاش فورية" },
};

const withNums = (l: Localized, nums?: string): Localized => ({
  fr: l.fr.replace("{n}", nums ?? ""), ar: l.ar.replace("{n}", nums ?? ""),
});

export default function AbgVent() {
  const [ph, setPh] = useState("7.40");
  const [paco2, setPaco2] = useState("40");
  const [hco3, setHco3] = useState("24");
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [alb, setAlb] = useState("");
  const [pao2, setPao2] = useState("");
  const [fio2, setFio2] = useState("");

  const [taille, setTaille] = useState("170");
  const [sex, setSex] = useState<"m" | "f">("m");
  const [vt, setVt] = useState("450");
  const [rr, setRr] = useState("14");
  const [peep, setPeep] = useState("5");
  const [vfio2, setVFio2] = useState("40");

  const findings = interpretAbg({
    ph: Number(ph), paco2: Number(paco2), hco3: Number(hco3),
    na: na ? Number(na) : undefined, cl: cl ? Number(cl) : undefined, alb: alb ? Number(alb) : undefined,
    pao2: pao2 ? Number(pao2) : undefined, fio2: fio2 ? Number(fio2) : undefined,
  });

  const ibw = ibwKg(Number(taille), sex);
  const cur: VentSettings = { vt: Number(vt), rr: Number(rr), peep: Number(peep), fio2: Number(vfio2) };
  const sug = ventSuggest(cur, { ph: Number(ph), paco2: Number(paco2), pao2: pao2 ? Number(pao2) : 0 }, ibw);
  const rows: { field: keyof VentSettings; label: Localized; unit: string }[] = [
    { field: "vt", label: { fr: "Volume courant", ar: "الحجم التياري" }, unit: "mL" },
    { field: "rr", label: { fr: "Fréquence", ar: "التردد" }, unit: "/min" },
    { field: "peep", label: { fr: "PEEP", ar: "PEEP" }, unit: "cmH2O" },
    { field: "fio2", label: { fr: "FiO2", ar: "الأكسجين" }, unit: "%" },
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <section className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-black text-blue-500"><T fr="Gazométrie artérielle" ar="الغازات الشريانية" /></h2>
        <div className="grid grid-cols-3 gap-3">
          <NumField label={<span dir="ltr">pH</span>} value={ph} onChange={setPh} step="0.01" />
          <NumField label={<span dir="ltr">PaCO2</span>} value={paco2} onChange={setPaco2} suffix="mmHg" />
          <NumField label={<span dir="ltr">HCO3</span>} value={hco3} onChange={setHco3} suffix="mmol/L" />
          <NumField label={<span dir="ltr">Na+</span>} value={na} onChange={setNa} suffix={<T fr="opt" ar="اختياري" />} />
          <NumField label={<span dir="ltr">Cl-</span>} value={cl} onChange={setCl} suffix={<T fr="opt" ar="اختياري" />} />
          <NumField label={<span dir="ltr">Alb</span>} value={alb} onChange={setAlb} suffix={<T fr="opt" ar="اختياري" />} />
          <NumField label={<span dir="ltr">PaO2</span>} value={pao2} onChange={setPao2} suffix={<T fr="opt" ar="اختياري" />} />
          <NumField label={<span dir="ltr">FiO2</span>} value={fio2} onChange={setFio2} suffix={<><span dir="ltr">%</span> <T fr="opt" ar="اختياري" /></>} />
        </div>
        {findings.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {findings.map((f, i) => (
              <li key={i} className={`rounded-xl border px-3 py-2 text-sm font-bold ${f.sev === "danger" ? "border-red-500/60 bg-red-500/10 text-red-400" : f.sev === "warn" ? "border-amber-500/60 bg-amber-500/10 text-amber-400" : "border-line bg-[color:var(--surface-2)] opacity-80"}`}>
                <T fr={withNums(FINDINGS[f.id] ?? { fr: f.id, ar: f.id }, f.nums).fr} ar={withNums(FINDINGS[f.id] ?? { fr: f.id, ar: f.id }, f.nums).ar} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-black text-blue-500"><T fr="Réglages actuels du ventilateur" ar="إعدادات الجهاز الحالية" /></h2>
        <div className="flex gap-2">
          {(["m", "f"] as const).map((s) => (
            <button key={s} onClick={() => setSex(s)} aria-pressed={sex === s}
              className={`touch rounded-xl border px-4 py-2 font-bold ${sex === s ? "border-blue-600 bg-blue-600 text-white" : "border-line hover:bg-[color:var(--surface-2)]"}`}>
              {s === "m" ? <T fr="Homme" ar="ذكر" /> : <T fr="Femme" ar="أنثى" />}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <NumField label={<T fr="Taille (cm)" ar="القامة (سم)" />} value={taille} onChange={setTaille} />
          <NumField label="Vt" value={vt} onChange={setVt} suffix="mL" />
          <NumField label="FR" value={rr} onChange={setRr} suffix="/min" />
          <NumField label="PEEP" value={peep} onChange={setPeep} />
          <NumField label="FiO2" value={vfio2} onChange={setVFio2} suffix="%" />
        </div>
        <p className="text-xs font-bold opacity-60">
          <T fr="IBW" ar="الوزن المثالي" /> : <span className="tabular-nums" dir="ltr">{Math.round(ibw)} kg</span> · Vt = <span className="tabular-nums" dir="ltr">{(cur.vt / ibw).toFixed(1)} mL/kg</span>
        </p>

        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="border-b border-line text-xs opacity-70">
              <th className="py-1 text-start font-bold"><T fr="Paramètre" ar="المعامل" /></th>
              <th className="py-1 font-bold"><T fr="Actuel" ar="الحالي" /></th>
              <th className="py-1 font-bold"><T fr="Proposé" ar="المقترح" /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ch = sug.changes.find((c) => c.field === r.field);
              return (
                <tr key={r.field} className={`border-b border-line/40 ${ch ? "bg-blue-600/15" : "opacity-50"}`}>
                  <td className="py-1.5 font-bold"><T fr={r.label.fr} ar={r.label.ar} /> <span className="text-[10px] opacity-60">{r.unit}</span></td>
                  <td className="py-1.5 text-center" dir="ltr">{cur[r.field]}</td>
                  <td className={`py-1.5 text-center ${ch ? "font-black text-blue-500" : ""}`} dir="ltr">{sug.proposed[r.field]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sug.changes.map((c) => (
          <p key={c.field} className="rounded-xl border border-blue-600/50 bg-blue-600/10 px-3 py-2 text-sm font-bold text-blue-500">
            <T fr={REASONS[c.reason]?.fr ?? c.reason} ar={REASONS[c.reason]?.ar ?? c.reason} />
          </p>
        ))}
        {sug.changes.length === 0 && (
          <p className="rounded-xl border border-line px-3 py-2 text-sm font-bold opacity-70">
            <T fr="Réglages actuels cohérents avec la gazométrie — pas de changement proposé." ar="الإعدادات الحالية منسجمة مع الغازات — لا تغيير مقترحاً." />
          </p>
        )}
        {sug.guards.map((g) => (
          <WarnNote key={g} tone="red"><T fr={GUARDS[g]?.fr ?? g} ar={GUARDS[g]?.ar ?? g} /></WarnNote>
        ))}
        <p className="text-xs opacity-50"><T fr="Aide à la décision — ne remplace pas le jugement clinique." ar="أداة مساعدة للقرار — لا تغني عن الحكم السريري." /></p>
      </section>
    </div>
  );
}
