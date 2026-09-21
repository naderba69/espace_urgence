"use client";
// v2.7 — الحماض الكيتوني السكري بالساعة: حسابات وقرارات ومراقبة.
import { useState } from "react";
import Link from "next/link";
import { dkaBolusMl, dkaInsulinUh, dkaKDecision, dkaNeedsDextrose } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { Droplets } from "lucide-react";

const HOURLY: [string, string][] = [
  ["Glycémie capillaire chaque heure", "سكر شعيري كل ساعة"],
  ["K⁺ / gazométrie toutes les 1-2 h", "بوتاسيوم/غازات كل 1-2 س"],
  ["Examen neurologique chaque heure (œdème cérébral)", "فحص عصبي كل ساعة (وذمة دماغ)"],
  ["Diurèse horaire stricte", "بيلة ساعة صارمة"],
  ["Baisse glycémique 0,5-1 g/L/h seulement", "هبوط السكر 0.5-1 غ/ل/س فقط"],
];

export default function DkaPage() {
  useRegisterRecent("calculateur:dka");
  const [ped, setPed] = useState(true);
  const [w, setW] = useState("30");
  const [k, setK] = useState("4");
  const [gly, setGly] = useState("4.5");
  const [done, setDone] = useState<boolean[]>(Array(HOURLY.length).fill(false));

  const weight = Number(w) || 0;
  const kNum = Number(k);
  const glyNum = Number(gly);
  const kDec = dkaKDecision(kNum);
  const nDone = done.filter(Boolean).length;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <Link href="/calculateurs/dka-h1" className="touch rounded-full border px-4 py-2 text-center text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
        <T fr="État hyperosmolaire (HHS) → assistant dédié" ar="حالة فرط الأسمولية (HHS) ← مساعد مخصص" />
      </Link>
      <PageHeader
        icon={<Droplets className="h-6 w-6" />}
        title={<T fr="Acidocétose — conduite horaire" ar="حماض كيتوني — تسيير بالساعة" />}
        sub={<T fr="Solvés, insuline, potassium — heure par heure." ar="سوائل، أنسولين، بوتاسيوم — ساعة بساعة." />}
      />

      <div className="flex gap-2">
        {([true, false] as const).map((p) => (
          <button key={String(p)} onClick={() => setPed(p)} aria-pressed={ped === p}
            className={`touch flex-1 rounded-xl border px-4 py-2 font-bold ${ped === p ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            {p ? <T fr="Enfant" ar="طفل" /> : <T fr="Adulte" ar="كبير" />}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></span>
          <input type="number" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)}
            className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-bold opacity-70">K⁺ mmol/L</span>
          <input type="number" inputMode="decimal" value={k} onChange={(e) => setK(e.target.value)}
            className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-bold opacity-70"><T fr="Glycémie g/L" ar="السكر غ/ل" /></span>
          <input type="number" inputMode="decimal" value={gly} onChange={(e) => setGly(e.target.value)}
            className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <p className="rounded-xl bg-blue-600/10 p-3 text-center font-black text-blue-500">
          <T fr="Remplissage 1ʳᵉ h:" ar="توسيع الساعة الأولى:" /> {dkaBolusMl(weight, ped)} mL <span className="text-xs opacity-70">NaCl 0,9 %</span>
        </p>
        <p className="rounded-xl bg-blue-600/10 p-3 text-center font-black text-blue-500">
          <T fr="Insuline PSE:" ar="إنسولين بمضخة:" /> {dkaInsulinUh(weight, ped ? 0.1 : 0.1)} U/h
        </p>
      </div>

      {kDec === "hold" ? (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="K⁺ < 3,3: SUSPENDRE l'insuline — KCl 20-40 mmol/h sous scope, reprendre à K ≥ 3,3."
             ar="بوتاسيوم أقل من 3.3: أوقف الإنسولين — كلوريد بوتاسيوم 20-40 ميلي مكافئ/س تحت المراقبة، واستأنف عند ≥ 3.3." />
        </p>
      ) : (
        <p className="rounded-xl bg-blue-600/15 p-3 font-black text-blue-500">
          <T fr="K⁺ ≥ 3,3: insuline 0,1 U/kg/h possible (sans bolus initial)." ar="بوتاسيوم ≥ 3.3: يمكن بدء الإنسولين 0.1 وحدة/كغ/س (دون دفعة أولية)." />
        </p>
      )}

      {dkaNeedsDextrose(glyNum) && (
        <p className="rounded-xl bg-amber-500/15 p-3 font-black text-amber-500">
          <T fr="Glycémie < 2,5 g/L: ajouter G5 % et POURSUIVRE l'insuline (les cétones priment)."
             ar="سكر أقل من 2.5 غ/ل: أضف غلوكوز 5% وواصل الإنسولين (الكيتونات هي المعيار)." />
        </p>
      )}

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-extrabold"><T fr="Chaque heure" ar="كل ساعة" /> <span className="tabular-nums opacity-60">{nDone}/{HOURLY.length}</span></h2>
        <div className="space-y-1">
          {HOURLY.map(([fr, ar], i) => (
            <label key={fr} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface2 px-3 py-2 text-sm font-bold">
              <input type="checkbox" checked={done[i]} onChange={() => setDone(done.map((v, j) => (j === i ? !v : v)))} className="h-5 w-5 accent-blue-600" />
              <span><T fr={fr} ar={ar} /></span>
            </label>
          ))}
        </div>
      </section>

      <p className="text-xs opacity-60"><T fr="Aide à la décision — ne remplace pas le jugement clinique." ar="أداة مساعدة على القرار — لا تعوّض الحكم السريري." /></p>
    </div>
  );
}
