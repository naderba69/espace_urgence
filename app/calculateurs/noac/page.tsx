"use client";
// v12.2-A — NOAC/DOAC : dose adaptée (âge/poids/créatinine), limites rénales, contre-indications, renversement.
import Link from "next/link";
import NumStepper from "@/components/ui/NumStepper";
import { useApp, usePrefillPatient } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { HeartPulse } from "lucide-react";
import { useState } from "react";

type Lvl = "standard" | "reduced" | "avoid";
type Res = { dose: string; lvl: Lvl; rule: { fr: string; ar: string } };
type Ctx = { crcl: number; age: number; lowW: boolean; highCr: boolean; vte: boolean };

const MOLS: { id: string; fr: string; ar: string; f: (c: Ctx) => Res }[] = [
  { id: "apixaban", fr: "Apixaban (Eliquis)", ar: "أبيكسابان", f: (c) => {
      const n = [c.age >= 80, c.lowW, c.highCr].filter(Boolean).length;
      if (c.crcl < 15) return { dose: "—", lvl: "avoid", rule: { fr: "CrCl < 15: à éviter (données insuffisantes).", ar: "تصفية < ١٥: يُتجنّب (معطيات غير كافية)." } };
      if (c.vte) return n >= 2
        ? { dose: "10 mg × 2/j pendant 7 j puis 2,5 mg × 2/j", lvl: "reduced", rule: { fr: "MTEV: réduction si ≥ 2 critères (âge ≥ 80, poids ≤ 60, créat ≥ 133 µmol/L).", ar: "MTEV: تخفيض إذا ≥ ٢ معيار (عمر ≥ ٨٠، وزن ≤ ٦٠، كريات ≥ ١٣٣)." } }
        : { dose: "10 mg × 2/j pendant 7 j puis 5 mg × 2/j", lvl: "standard", rule: { fr: "MTEV: schéma 7 jours à dose charge.", ar: "MTEV: ٧ أيام بجرعة تحميل." } };
      return n >= 2
        ? { dose: "2,5 mg × 2/j", lvl: "reduced", rule: { fr: "≥ 2 critères parmi: âge ≥ 80, poids ≤ 60 kg, créat ≥ 133 µmol/L.", ar: "≥ ٢ معيار من: عمر ≥ ٨٠، وزن ≤ ٦٠ كغ، كريات ≥ ١٣٣." } }
        : { dose: "5 mg × 2/j", lvl: "standard", rule: { fr: "Fibrillation atriale non valvulaire.", ar: "رجفان أذيني غير صمامي." } };
    } },
  { id: "rivaroxaban", fr: "Rivaroxaban (Xarelto)", ar: "ريفاروكسابان", f: (c) => {
      if (c.crcl < 30) return { dose: "—", lvl: "avoid", rule: { fr: "CrCl < 30: à éviter.", ar: "تصفية < ٣٠: يُتجنّب." } };
      if (c.crcl < 50 && !c.vte) return { dose: "15 mg × 1/j avec le repas", lvl: "reduced", rule: { fr: "FA si CrCl 30-49: dose réduite, toujours avec le repas.", ar: "رجفان مع تصفية ٣٠-٤٩: جرعة مخفّضة، دائماً مع الأكل." } };
      if (c.vte) return { dose: "15 mg × 2/j pendant 21 j puis 20 mg × 1/j", lvl: "standard", rule: { fr: "MTEV: phase de charge 21 jours, avec le repas.", ar: "MTEV: مرحلة تحميل ٢١ يوماً، مع الأكل." } };
      return { dose: "20 mg × 1/j avec le repas", lvl: "standard", rule: { fr: "L'absorption dépend du repas (FA).", ar: "الامتصاص مرتبط بالوجبة (رجفان)." } };
    } },
  { id: "dabigatran", fr: "Dabigatran (Pradaxa)", ar: "دابيغاتران", f: (c) => {
      if (c.crcl < 30) return { dose: "—", lvl: "avoid", rule: { fr: "CrCl < 30: contre-indiqué (dialysable en urgence).", ar: "تصفية < ٣٠: ممنوع (يمكن غسله في المستعجل)." } };
      if (c.crcl < 50 && !c.vte) return { dose: "110 mg × 2/j", lvl: "reduced", rule: { fr: "FA si CrCl 30-50: dose réduite.", ar: "رجفان مع تصفية ٣٠-٥٠: جرعة مخفّضة." } };
      if (c.vte) return { dose: "150 mg × 2/j après 5 j d'héparine", lvl: "standard", rule: { fr: "MTEV: relais après 5 jours parentéraux.", ar: "MTEV: تعاقب بعد ٥ أيام وريدية." } };
      return { dose: "150 mg × 2/j", lvl: "standard", rule: { fr: "Prodrogue à élimination rénale: vigilance chez le sujet âgé.", ar: "دواء أولي يُطرح كلوياً: يقظة عند المسنّ." } };
    } },
  { id: "edoxaban", fr: "Edoxaban (Lixiana)", ar: "إيدوكسابان", f: (c) => {
      if (c.crcl > 95) return { dose: "—", lvl: "avoid", rule: { fr: "CrCl > 95: non recommandé en FA.", ar: "تصفية > ٩٥: غير موصى به في الرجفان." } };
      if (c.crcl < 15) return { dose: "—", lvl: "avoid", rule: { fr: "CrCl < 15: à éviter.", ar: "تصفية < ١٥: يُتجنّب." } };
      if (c.crcl < 50 || c.lowW) return { dose: "30 mg × 1/j", lvl: "reduced", rule: { fr: "Réduction si poids ≤ 60 kg ou CrCl 15-50.", ar: "تخفيض إذا وزن ≤ ٦٠ كغ أو تصفية ١٥-٥٠." } };
      if (c.vte) return { dose: "60 mg × 1/j après 5 j d'héparine", lvl: "standard", rule: { fr: "MTEV: relais après 5 jours parentéraux.", ar: "MTEV: تعاقب بعد ٥ أيام وريدية." } };
      return { dose: "60 mg × 1/j", lvl: "standard", rule: { fr: "Fibrillation atriale non valvulaire.", ar: "رجفان أذيني غير صمامي." } };
    } },
];

export default function NoacPage() {
  useRegisterRecent("calculateur:noac");
  const { lang } = useApp();
  const [sel, setSel] = useState("apixaban");
  const [vte, setVte] = useState(false);
  const [age, setAge] = useState("");
  const [w, setW] = useState("");
  const [scr, setScr] = useState("");
  usePrefillPatient((p) => {
    if (!w && p.w) setW(p.w);
    if (!age && p.age) setAge(p.age);
    if (!scr && p.scr) setScr(p.scr);
  });

  const mol = MOLS.find((m) => m.id === sel) ?? MOLS[0];
  const A = parseFloat(age), W = parseFloat(w), S = parseFloat(scr);
  const suspectMg = Number.isFinite(S) && S > 0 && S < 20; // µmol/L attendu : < 20 = probable mg/dL
  const Smu = suspectMg ? S * 88.4 : S;
  const crcl = Number.isFinite(A) && Number.isFinite(W) && Number.isFinite(Smu) && Smu > 0
    ? ((140 - A) * W) / (72 * (Smu / 88.4)) : null;
  const res = crcl !== null ? mol.f({ crcl, age: A, lowW: W <= 60, highCr: Smu >= 133, vte }) : null;
  const sev = res ? (res.lvl === "avoid" ? "sev-critical" : res.lvl === "reduced" ? "sev-urgent" : "sev-standard") : "sev-standard";
  const cell = "flex flex-col gap-1 rounded-xl border border-line bg-surface p-3";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<HeartPulse className="h-6 w-6" />}
        title={lang === "ar" ? "مضادات التخثر الفموية المباشرة (NOAC)" : "Anticoagulants oraux directs (NOAC)"}
        sub={lang === "ar" ? "الجرعة حسب العمر والوزن والتصفية — وحدود كل جزيء." : "Dose selon âge/poids/clearance — et les limites de chaque molécule."}
      />

      <div className="flex gap-2">
        <button onClick={() => setVte(false)} aria-pressed={!vte} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${!vte ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={!vte ? { background: "var(--accent)" } : undefined}><T fr="Fibrillation atriale" ar="رجفان أذيني" /></button>
        <button onClick={() => setVte(true)} aria-pressed={vte} className={`touch flex-1 rounded-xl border p-3 text-sm font-black ${vte ? "border-transparent text-white" : "border-line hover:bg-surface2"}`} style={vte ? { background: "var(--accent)" } : undefined}><T fr="Maladie thrombo-embolique" ar="خثار وريدي (MTEV)" /></button>
      </div>

      <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
        <span className="text-xs font-black opacity-70"><T fr="Molécule" ar="الجزيء" /></span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full bg-transparent text-base font-black outline-none">
          {MOLS.map((m) => <option key={m.id} value={m.id} className="bg-surface">{lang === "ar" ? m.ar : m.fr}</option>)}
        </select>
      </label>

      <section className="grid grid-cols-3 gap-2">
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Âge" ar="العمر" /></span><NumStepper value={ age } onValue={ setAge } className="w-full" label="age" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Poids (kg)" ar="الوزن" /></span><NumStepper value={ w } onValue={ setW } className="w-full" label="w" /></label>
        <label className={cell}><span className="text-xs font-black opacity-70"><T fr="Créat. µmol/L" ar="كرياتينين" /></span><NumStepper value={ scr } onValue={ setScr } className="w-full" label="scr" /></label>
      </section>

      {suspectMg && (
        <p className="rounded-xl p-3 text-sm font-black" style={{ background: "var(--sev-urgent-bg)", color: "var(--sev-urgent)" }}>
          <T fr="Valeur < 20: probablement en mg/dL. Le calcul utilise la conversion × 88,4 — confirmez l'unité du laboratoire." ar="القيمة < ٢٠: على الأرجح مغ/دل. الحساب يستعمل التحويل × ٨٨٫٤ — أكّد وحدة المختبر." />
        </p>
      )}

      {crcl !== null && res && (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${sev}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-lg font-black" dir="ltr">{res.dose}</p>
            <Badge tone={res.lvl === "avoid" ? "critical" : res.lvl === "reduced" ? "urgent" : "standard"}>
              {res.lvl === "avoid" ? <T fr="À éviter" ar="يُتجنّب" /> : res.lvl === "reduced" ? <T fr="Dose réduite" ar="جرعة مخفّضة" /> : <T fr="Dose standard" ar="جرعة عادية" />}
            </Badge>
          </div>
          <p className="text-sm font-bold opacity-80">{res.rule[lang === "ar" ? "ar" : "fr"]}</p>
          <p className="mt-1 text-xs opacity-70" dir="ltr">Cockcroft-Gault : {Math.round(crcl)} mL/min</p>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2"><Badge tone="critical"><T fr="Contre-indiqué" ar="ممنوع" /></Badge></div>
        <ul className="flex flex-col gap-2">
          {[
            { fr: "Prothèse mécanique ou rétrécissement mitral modéré-sévère → AVK.", ar: "صمام ميكانيكي أو تضيّق مِترالي متوسط/شديد ← AVK." },
            { fr: "Grossesse et allaitement.", ar: "الحمل والإرضاع." },
            { fr: "Saignement actif, lésion hémorragique récente.", ar: "نزف نشط أو آفة نزفية حديثة." },
            { fr: "Rifampicine, azolés fortes doses, dronédarone, double anticoagulation.", ar: "ريفامبين، أزولات بجرعات عالية، درونيدارون، مضاد تخثر مزدوج." },
          ].map((i) => <li key={i.fr} className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-3 text-sm font-bold">{lang === "ar" ? i.ar : i.fr}</li>)}
        </ul>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-4">
        <p className="text-base font-black"><T fr="Renversement" ar="التراجع عن المفعول" /></p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-bold">
          <li dir="ltr" style={{ textAlign: "start" }}>Dabigatran → <b>idarucizumab 5 g IV</b> (2 × 2,5 g)</li>
          <li dir="ltr" style={{ textAlign: "start" }}>Xa (apixaban, rivaroxaban, edoxaban) → <b>andexanet</b> ou <b>PCC 50 UI/kg</b></li>
          <li><T fr="Charbon activé si prise < 2-4 h et patient conscient." ar="فحم منشّط إذا البلع < ٢-٤ س والمريض واعٍ." /></li>
          <li><T fr="Dabigatran est dialysable; les inhibiteurs du Xa ne le sont pas." ar="دابيغاتران يُغسل بالكلى؛ مثبطات Xa لا تُغسل." /></li>
        </ul>
      </section>

      <p className="card rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <T fr="Anesthésie péridurale / rachianesthésie: attendre ≥ 24 h (dabigatran 24-48 h si la clairance est basse)." ar="التخدير فوق الجافية/الشوكي: انتظر ≥ ٢٤ س (دابيغاتران ٢٤-٤٨ س إذا التصفية منخفضة)." />
      </p>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/anticoag" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Anticoagulants AVK/HNF" ar="مضادات التخثر AVK/HNF" /></Link>
        <Link href="/calculateurs/renal-dose" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Bridge rénal" ar="الجسر الكلوي" /></Link>
        <Link href="/calculateurs/interactions" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Interactions" ar="التفاعلات" /></Link>
      </div>
    </div>
  );
}
