"use client";
// v4.7 — مساعد نقل الدم الفردي: حجم بالوزن، مراقبة بدء 15 د، سقف 4 س للوحدة + سجل.
import { useEffect, useState } from "react";
import { fmtMMSS } from "@/lib/calc";
import { fmtJournal } from "@/lib/journal";
import { useRegisterRecent } from "@/components/SearchBar";
import { useApp } from "@/components/Providers";
import T from "@/components/T";
import PageHeader from "@/components/ui/PageHeader";
import { HeartPulse } from "lucide-react";

export default function TransfusionPage() {
  useRegisterRecent("calculateur:transfusion");
  const { lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState("");
  const [ped, setPed] = useState(false);
  const [chrono, setChrono] = useState<{ start: number | null; acc: number }>({ start: null, acc: 0 });
  const [now, setNow] = useState(0);
  const [starts, setStarts] = useState<number[]>([]);
  const [ends, setEnds] = useState<number[]>([]);
  const [checks, setChecks] = useState<number[]>([]);

  useEffect(() => {
    if (chrono.start === null) return;
    const id = setInterval(() => setNow(chrono.acc + (Date.now() - chrono.start!) / 1000), 500);
    return () => clearInterval(id);
  }, [chrono]);

  const weight = parseFloat(w);
  const ok = Number.isFinite(weight) && weight > 0;
  const pedMl = ok ? Math.round(weight * 10) : 0;
  const pedMax = ok ? Math.round(weight * 15) : 0;

  const lastStart = starts[0] ?? null;
  const sinceStart = lastStart === null ? null : now - lastStart;
  const lastEndBeforeStart = ends.find((e) => lastStart !== null && e >= lastStart) ?? null;
  const checkLate = lastStart !== null && lastEndBeforeStart === null && sinceStart !== null && sinceStart >= 900 && checks.length === 0;
  const unitLate = lastStart !== null && lastEndBeforeStart === null && sinceStart !== null && sinceStart >= 4 * 3600;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<HeartPulse className="h-6 w-6" />}
        title={<T fr="Assistant transfusion individuel" ar="مساعد نقل الدم الفردي" />}
        sub={<T fr="Débit, surveillance et réactions transfusionnelles." ar="سرعة، مراقبة وتفاعلات النقل." />}
      />
      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p className="text-base font-black" style={{ color: "var(--sev-critical)" }}><T fr="Réaction pendant la transfusion ?" ar="تفاعل أثناء النقل؟" /></p>
        <p><T fr="1) ARRÊTER la transfusion + garder la voie (NaCl)." ar="١) أوقف النقل + أبق الوريد (ملح)." /></p>
        <p><T fr="2) Fièvre isolée → fébrile non hémolytique (paracétamol, surveiller)." ar="٢) حمى معزولة → حمّية غير انحلالية (باراسيتامول، مراقبة)." /></p>
        <p><T fr="3) Urticaire → allergique (antihistaminique; adrénaline si anaphylaxie)." ar="٣) شرى → تحسسي (مضاد هيستامين؛ أدرينالين إن تأق)." /></p>
        <p><T fr="4) Douleur lombaire + choc + saignement → hémolytique aiguë: choc traité, diurèse, hémostase." ar="٤) ألم قطني + صدمة + نزف → انحلالية حادة: عالج الصدمة، البيلة، التخثر." /></p>
        <p><T fr="5) Dyspnée + œdème pulm.: TRALI (pas de diurétique) vs TACO (diurétique)." ar="٥) زلة + وذمة رئة: TRALI (لا مدرّ) مقابل TACO (مدرّ)." /></p>
      </div>

      <div className="card flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
        <p className="text-4xl font-black tabular-nums" dir="ltr">{fmtMMSS(now)}</p>
        <div className="flex gap-2">
          <button onClick={() => setChrono((c) => {
            if (c.start) { const acc = c.acc + (Date.now() - c.start) / 1000; setNow(acc); return { start: null, acc }; }
            return { start: Date.now(), acc: c.acc };
          })}
            className="touch rounded-xl bg-red-600 px-5 py-3 font-black text-white active:scale-[.98]">
            {chrono.start ? <T fr="Pause" ar="إيقاف" /> : <T fr="Démarrer" ar="ابدأ" />}
          </button>
          <button onClick={() => { setChrono({ start: null, acc: 0 }); setNow(0); setStarts([]); setEnds([]); setChecks([]); }}
            className="touch rounded-xl border border-line px-4 py-3 font-bold">
            <T fr="Nouveau" ar="جديد" />
          </button>
        </div>
      </div>

      <div className="card rounded-2xl border border-line bg-surface p-4">
        <div className="mb-2 flex gap-2">
          <button onClick={() => setPed(false)} aria-pressed={!ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${!ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Adulte" ar="كبير" />
          </button>
          <button onClick={() => setPed(true)} aria-pressed={ped}
            className={`touch rounded-full border px-4 py-1.5 text-sm font-bold ${ped ? "border-blue-600 bg-blue-600 text-white" : "border-line"}`}>
            <T fr="Enfant" ar="طفل" />
          </button>
        </div>
        {ped && (
          <>
            <label className="mb-1 block text-sm font-bold opacity-70"><T fr="Poids (kg)" ar="الوزن (كغ)" /></label>
            <input value={w} onChange={(e) => setW(e.target.value)} inputMode="decimal" placeholder="15"
              className="w-28 rounded-xl border border-line bg-surface2 px-3 py-2 font-black tabular-nums" dir="ltr" />
          </>
        )}
        <ul className="mt-3 space-y-1 text-sm font-black text-blue-500" dir="ltr">
          {ped
            ? <li>{`CGR ${ok ? `${pedMl}-${pedMax}` : "10-15"} mL/kg`}</li>
            : <li>{`1 CGR ≈ 300 mL → Hb +1 g/dL attendu`}</li>}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button onClick={() => setStarts((s) => [now, ...s])}
          className={`touch flex items-center justify-between gap-2 rounded-2xl border p-4 font-black ${unitLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <span><T fr="Unité démarrée" ar="بدأت الوحدة" /></span>
          <span className="tabular-nums text-sm" dir="ltr">{sinceStart === null ? "—" : fmtMMSS(sinceStart)}</span>
        </button>
        <button onClick={() => setChecks((c) => [now, ...c])}
          className={`touch rounded-2xl border p-4 font-black ${checkLate ? "border-red-600 bg-red-600/15 text-red-500" : "border-line bg-surface"}`}>
          <T fr="Surveillance 15 min (pouls/TA/T°)" ar="مراقبة 15 د (نبض/ضغط/حرارة)" />
        </button>
        <button onClick={() => setEnds((c) => [now, ...c])} disabled={lastStart === null}
          className={`touch rounded-2xl border p-4 font-black ${lastStart === null ? "border-line opacity-40" : "border-line bg-surface"}`}>
          <T fr="Unité terminée" ar="انتهت الوحدة" />
        </button>
      </div>

      {checkLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 15 min: contrôle de surveillance dû (réaction transfusionnelle ?)." ar="≥ 15 د: فحص المراقبة مستحق (تفاعل نقل؟)." />
        </p>
      )}
      {unitLate && (
        <p className="rounded-xl bg-red-600/15 p-3 font-black text-red-500">
          <T fr="≥ 4 h: unité trop lente — stopper/évaluer (risque bactérien)." ar="≥ 4 س: الوحدة بطيئة جداً — أوقف/قيّم (خطر جرثومي)." />
        </p>
      )}

      {starts.length + ends.length + checks.length > 0 && (
        <section className="card rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 font-extrabold"><T fr="Journal" ar="السجل" /> <span className="text-xs opacity-60">({starts.length + ends.length + checks.length})</span></h2>
          <ul className="space-y-1 text-sm font-bold">
            {[...starts.map((at) => ({ at, label: lang === "ar" ? "بدء وحدة" : "Unité démarrée" })),
              ...checks.map((at) => ({ at, label: lang === "ar" ? "مراقبة 15 د" : "Surveillance 15 min" })),
              ...ends.map((at) => ({ at, label: lang === "ar" ? "نهاية وحدة" : "Unité terminée" }))]
              .sort((a, b) => b.at - a.at)
              .map((e, i) => (
                <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface2 px-3 py-1.5">
                  <span>{e.label}</span>
                  <span className="tabular-nums opacity-70" dir="ltr">{fmtMMSS(e.at)}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {starts.length + ends.length + checks.length > 0 && (
        <button onClick={() => {
          navigator.clipboard?.writeText(fmtJournal(lang === "ar" ? "سجل النقل" : "Journal transfusion", [...starts.map((at) => ({ at, label: lang === "ar" ? "بدء وحدة" : "Unité démarrée" })), ...checks.map((at) => ({ at, label: lang === "ar" ? "مراقبة 15 د" : "Surveillance 15 min" })), ...ends.map((at) => ({ at, label: lang === "ar" ? "نهاية وحدة" : "Unité terminée" }))].sort((a, b) => a.at - b.at)));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
          className="touch rounded-xl border border-blue-600 bg-blue-600/10 px-4 py-3 font-black text-blue-500">
          {copied ? <T fr="Copié !" ar="نُسخ!" /> : <T fr="Copier le journal" ar="انسخ السجل" />}
        </button>
      )}

      <p className="text-xs opacity-60"><T fr="Fièvre/frissons/douleur lombaire = stopper immédiatement + cultures. Sources: HAS 2014, OMS sang 2016." ar="حمى/قشعريرة/ألم قطني = أوقف فوراً + مزارع. المصادر: HAS 2014 وOMS 2016." /></p>
    </div>
  );
}
