"use client";
// v2.6 — درجات سريرية تفاعلية: qSOFA، sPESI، HEART.
import { useState } from "react";
import { qsofa, spesi, heart, heartBand } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

function NumField({ label, value, onChange }: { label: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-xs font-bold opacity-70">{label}</span>
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line bg-[color:var(--surface-2)] px-3 py-2 text-center text-lg font-black tabular-nums outline-none focus:ring-2 focus:ring-blue-600" />
    </label>
  );
}

function Check({ on, onToggle, children }: { on: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface2 px-3 py-2 text-sm font-bold">
      <input type="checkbox" checked={on} onChange={onToggle} className="h-5 w-5 accent-blue-600" />
      <span>{children}</span>
    </label>
  );
}

function Seg({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((v) => (
        <button key={v} onClick={() => onChange(v)} aria-pressed={value === v}
          className={`touch h-9 w-9 rounded-lg border font-black tabular-nums ${value === v ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
          {v}
        </button>
      ))}
    </div>
  );
}

export default function ScoresPage() {
  useRegisterRecent("calculateur:scores");
  const [rr, setRr] = useState("20");
  const [sbp, setSbp] = useState("120");
  const [alt, setAlt] = useState(false);
  const q = qsofa(Number(rr), Number(sbp), alt);

  const [sp, setSp] = useState<boolean[]>(Array(6).fill(false));
  const s = spesi({ age80: sp[0], cancer: sp[1], hf: sp[2], hr110: sp[3], sbp100: sp[4], spo290: sp[5] });

  const [h, setH] = useState(0); const [e, setE] = useState(0); const [a, setA] = useState(0);
  const [r, setR] = useState(0); const [t, setT] = useState(0);
  const hs = heart(h, e, a, r, t);
  const band = heartBand(hs);

  const SP_LABELS: [string, string][] = [
    ["Âge > 80 ans", "عمر أكثر من 80"],
    ["Cancer actif", "سرطان نشط"],
    ["Insuff. cardiaque ou respiratoire chronique", "قصور قلب أو تنفس مزمن"],
    ["FC ≥ 110/min", "نبض ≥ 110/د"],
    ["PAS < 100 mmHg", "انقباضي أقل من 100"],
    ["SpO2 < 90 %", "تشبع أقل من 90%"],
  ];

  const HEART_ROWS: [React.ReactNode, number, (v: number) => void][] = [
    [<T key="1" fr="Histoire: peu suspect 1 / très suspect 2" ar="القصة: قليلة الاشتباه 1 / شديدة 2" />, h, setH],
    [<T key="2" fr="ECG: anomalies non spécifiques 1 / déviation ST 2" ar="التخطيط: تغيرات غير نوعية 1 / إزاحة ST 2" />, e, setE],
    [<T key="3" fr="Âge: 45-64 = 1 / ≥ 65 = 2" ar="العمر: 45-64 = 1 / ≥ 65 = 2" />, a, setA],
    [<T key="4" fr="Facteurs de risque: 1-2 = 1 / ≥ 3 ou athérome connu = 2" ar="عوامل الخطر: 1-2 = 1 / ≥ 3 أو تصلب معروف = 2" />, r, setR],
    [<T key="5" fr="Troponine: 1-3× = 1 / > 3× = 2" ar="التروبونين: 1-3 أضعاف = 1 / أكثر من 3 = 2" />, t, setT],
  ];

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold"><T fr="Scores cliniques" ar="درجات سريرية" /></h1>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-extrabold text-sky-500">qSOFA</h2>
        <div className="flex gap-3">
          <NumField label={<T fr="FR /min" ar="التردد/د" />} value={rr} onChange={setRr} />
          <NumField label={<T fr="PAS mmHg" ar="الانقباضي" />} value={sbp} onChange={setSbp} />
        </div>
        <div className="mt-2">
          <Check on={alt} onToggle={() => setAlt(!alt)}><T fr="Trouble de conscience (GCS < 15)" ar="اضطراب وعي (غلاسكو أقل من 15)" /></Check>
        </div>
        <p className={`mt-3 rounded-xl p-3 text-center text-xl font-black tabular-nums ${q >= 2 ? "bg-red-600/15 text-red-500" : "bg-blue-600/15 text-blue-500"}`}>
          {q} / 3 — {q >= 2
            ? <T fr="≥ 2: pronostic péjoratif, évoquer sepsis, lactates + surveillance rapprochée" ar="≥ 2: إنذار سيئ، فكّ بالإنتان، لاكتات ومراقبة لصيقة" />
            : <T fr="< 2: pas d'alerte qSOFA" ar="أقل من 2: لا إنذار qSOFA" />}
        </p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-extrabold text-sky-500">sPESI <span className="text-xs opacity-60">(<T fr="embolie pulmonaire" ar="انصمام رئوي" />)</span></h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SP_LABELS.map(([fr, ar], i) => (
            <Check key={fr} on={sp[i]} onToggle={() => setSp(sp.map((v, j) => (j === i ? !v : v)))}>
              <T fr={fr} ar={ar} />
            </Check>
          ))}
        </div>
        <p className={`mt-3 rounded-xl p-3 text-center text-xl font-black tabular-nums ${s >= 1 ? "bg-red-600/15 text-red-500" : "bg-blue-600/15 text-blue-500"}`}>
          {s} — {s === 0
            ? <T fr="0: faible risque (ambulatoire possible si contexte favorable)" ar="0: خطورة منخفضة (خارجي ممكن إن سمح السياق)" />
            : <T fr="≥ 1: risque élevé — hospitalisation" ar="≥ 1: خطورة عالية — إدخال" />}
        </p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-extrabold text-sky-500">HEART <span className="text-xs opacity-60">(<T fr="douleur thoracique" ar="ألم صدري" />)</span></h2>
        <div className="space-y-2">
          {HEART_ROWS.map(([lab, val, set], i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface2 px-3 py-2">
              <span className="text-sm font-bold">{lab}</span>
              <Seg value={val} onChange={set} />
            </div>
          ))}
        </div>
        <p className={`mt-3 rounded-xl p-3 text-center text-xl font-black tabular-nums ${band === "high" ? "bg-red-600/15 text-red-500" : band === "mod" ? "bg-amber-500/15 text-amber-500" : "bg-blue-600/15 text-blue-500"}`}>
          {hs} / 10 — {band === "low"
            ? <T fr="faible: sortie avec consignes + suivi" ar="منخفضة: خروج مع تعليمات ومتابعة" />
            : band === "mod"
              ? <T fr="modéré: observation, troponines série, avis" ar="متوسطة: مراقبة، تروبونين متسلسل، رأي" />
              : <T fr="élevé: avis cardio / stratégie invasive" ar="مرتفعة: رأي قلبي / استراتيجية تدخلية" />}
        </p>
      </section>

      <p className="text-xs opacity-60"><T fr="Aide à la décision — ne remplace pas le jugement clinique." ar="أداة مساعدة على القرار — لا تعوّض الحكم السريري." /></p>
    </div>
  );
}
