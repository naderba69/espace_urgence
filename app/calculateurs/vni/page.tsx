"use client";
// v2.0 — التهوية غير الباضعة : بدء ومعايرة حسب profile + قواعد السلامة.
import { useState } from "react";
import { nivStart } from "@/lib/calc";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { WarnNote } from "@/components/tools/ui";

export default function VniPage() {
  const [profile, setProfile] = useState<"bpco" | "oap">("bpco");
  useRegisterRecent("calculateur:vni");
  const s = nivStart(profile);
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="VNI — démarrage & titration" ar="التهوية غير الباضعة: بدء ومعايرة" /></h1>
      </header>
      <div className="flex gap-2">
        {(["bpco", "oap"] as const).map((p) => (
          <button key={p} onClick={() => setProfile(p)} aria-pressed={profile === p}
            className={`touch flex-1 rounded-xl border px-4 py-3 font-bold ${profile === p ? "border-blue-600 bg-blue-600 text-white" : "border-line hover:bg-[color:var(--surface-2)]"}`}>
            {p === "bpco" ? <T fr="BPCO hypercapnique" ar="قصور تنفس فرط ثاني أكسيد" /> : <T fr="OAP cardiogénique" ar="وذمة رئة قلبية" />}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="card rounded-2xl border border-blue-600/40 bg-blue-600/10 p-4">
          <p className="text-xs font-bold text-blue-500">IPAP</p>
          <p className="text-4xl font-black tabular-nums" dir="ltr">{s.ipap}</p>
          <p className="text-xs opacity-60">cmH2O</p>
        </div>
        <div className="card rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-bold opacity-70">EPAP</p>
          <p className="text-4xl font-black tabular-nums" dir="ltr">{s.epap}</p>
          <p className="text-xs opacity-60">cmH2O</p>
        </div>
      </div>
      <p className="text-sm font-bold opacity-80"><T fr={`Cible : ${s.target}`} ar={`الهدف: ${s.target}`} /></p>
      <ul className="list-inside list-decimal flex flex-col gap-1 text-sm font-semibold opacity-90">
        <li><T fr="Monter l'IPAP de 2 en 2 si effort ou pCO2 monte (max 25)." ar="ارفع IPAP بمقدار 2 عند الجهد أو ارتفاع ثاني أكسيد الكربون (الحد 25)." /></li>
        <li><T fr="Monter l'EPAP de 1-2 si hypoxémie persistante." ar="ارفع EPAP عند استمرار نقص الأكسجة." /></li>
        <li><T fr="Estomac plein, tolérance: vérifier masque + gaz du sang 2 h après." ar="بعد ساعة من البدء: تحقق من امتلاء المعدة وغازات الدم بعد ساعتين." /></li>
        <li><T fr="Échec à 1-2 h: préparer l'intubation." ar="عند الفشل خلال ساعة إلى ساعتين: حضّر للتنبيب." /></li>
      </ul>
      <WarnNote tone="red"><T fr="Contre-indications: arrêt respiratoire, vomissements incoercibles, chirurgie faciale." ar="موانع: توقف تنفسي، إقياء متواصل، جراحة وجه." /></WarnNote>
    </div>
  );
}
