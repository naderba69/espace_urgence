"use client";
// v13.1 — «لا تنسَ قبل أن…» : ١٠ لحظات خطر بقوائم مصغّرة تفاعلية، مرتبطة بالمحركات.
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { AlertTriangle } from "lucide-react";

type Guard = {
  id: string; sev: number; fr: string; ar: string;
  items: { fr: string; ar: string }[];
  links: { href: string; fr: string; ar: string }[];
};

const GUARDS: Guard[] = [
  { id: "transfusion", sev: 2, fr: "Avant de transfuser", ar: "قبل أن تنقل دماً",
    items: [
      { fr: "Concordance: identité + groupe + n° de culot + péremption, relue deux fois.", ar: "المطابقة: الهوية + الفئة + رقم الكيس + الصلاحية، مرتين." },
      { fr: "Ligne dédiée NaCl uniquement — ni Ringer, ni calcium (ni ceftriaxone dans la même voie).", ar: "مسار بملح فقط — لا رينغر ولا كالسيوم (لا سيفترياكسون في المسار نفسه)." },
      { fr: "Rester à proximité les 15 premières minutes (réaction précoce).", ar: "ابقَ قريباً أول ١٥ دقيقة (رد الفعل المبكر)." },
    ],
    links: [{ href: "/calculateurs/transfusion", fr: "Réactions transfusionnelles", ar: "تفاعلات النقل" }] },
  { id: "insuline", sev: 2, fr: "Avant l'insuline", ar: "قبل الأنسولين",
    items: [
      { fr: "K+ connu: si < 3,3 mmol/L, corriger AVANT l'insuline.", ar: "البوتاسيوم معروف: إذا < ٣٫٣ صحّحه قبل الأنسولين." },
      { fr: "Glycémie revérifiée; dose relue deux fois (erreur ×10 classique).", ar: "أعد قياس الغلوكوز؛ أعد قراءة الجرعة مرتين (خطأ ×١٠ الكلاسيكي)." },
      { fr: "Seringue/seringue électrique dédiée, étiquetée « insuline ».", ar: "سرنجة/مضخة مخصّصة موسومة «أنسولين»." },
    ],
    links: [{ href: "/calculateurs/insuline", fr: "Protocole insuline", ar: "بروتوكول الأنسولين" }, { href: "/calculateurs/safe-dose", fr: "Moteur de dose sûre", ar: "محرّك الجرعة الآمنة" }] },
  { id: "bicarbonate", sev: 2, fr: "Avant le bicarbonate", ar: "قبل الناضض",
    items: [
      { fr: "pH, K+ et calcémie connus (l'alcalose fait chuter le K+ et le Ca ionisé).", ar: "الـpH والبوتاسيوم والكالسيوم معروفة (القلواء تُنقص K⁺ والكالسيوم المتأين)." },
      { fr: "Pas dans la même ligne que calcium ou catécholamines (précipitation).", ar: "ليس في المسار نفسه مع الكالسيوم أو الكاتيكولامينات (ترسّب)." },
      { fr: "Objectif écrit: pH cible, pas de « normalisation » brutale.", ar: "هدف مكتوب: pH مستهدف، لا تصحيح عنيف." },
    ],
    links: [{ href: "/calculateurs/acide-base", fr: "Interprétation acidobasique", ar: "تفسير الحمض-القاعدة" }, { href: "/calculateurs/dilutions", fr: "Ne pas mélanger", ar: "لا تخلط" }] },
  { id: "morphine", sev: 2, fr: "Avant la morphine IV", ar: "قبل المورفين الوريدي",
    items: [
      { fr: "Fréquence respiratoire ≥ 12/min et PAS ≥ 90 mmHg.", ar: "تفتّف ≥ ١٢/د وضغط ≥ ٩٠." },
      { fr: "Naloxone disponible dans la pièce; titrer, jamais en bolus complet.", ar: "النالوكسون متوفر بالغرفة؛ عاير، لا بولوس كامل." },
      { fr: "Asthme instable, insuffisance respiratoire ou rénale: repenser le choix.", ar: "ربو غير مستقر، قصور تنفسي أو كلوي: أعد التفكير في الخيار." },
    ],
    links: [{ href: "/calculateurs/antidotes", fr: "Antidotes (naloxone)", ar: "الترياقات (نالوكسون)" }] },
  { id: "sux", sev: 3, fr: "Avant la succinylcholine", ar: "قبل السكسينيل كولين",
    items: [
      { fr: "K+ connu: hyperkaliémie = contre-indication absolue.", ar: "البوتاسيوم معروف: فرط البوتاسيوم = ممنوع مطلقاً." },
      { fr: "Brûlure > 48 h, écrasement, dénervation, myopathie → rocuronium.", ar: "حرق > ٤٨ س، انضغاط، انقطاع تعصيب، اعتلال عضلي ← روكورونيوم." },
      { fr: "Antécédent d'hyperthermie maligne → rocuronium.", ar: "تاريخ فرط حرارة خبيث ← روكورونيوم." },
      { fr: "Aspiration prête et hypnotique déjà administré (jamais de curare seul).", ar: "شفط جاهز والمخدّر أُعطي (لا مرخٍ وحده)." },
    ],
    links: [{ href: "/calculateurs/rsi", fr: "Séquence rapide", ar: "التسلسل السريع" }] },
  { id: "phenytoine", sev: 2, fr: "Avant la phénytoïne", ar: "قبل الفينيتوين",
    items: [
      { fr: "Dilution NaCl 0,9 % UNIQUEMENT (jamais glucose = cristaux).", ar: "التخفيف بملح ٠٫٩٪ فقط (غلوكوز أبداً = بلورات)." },
      { fr: "≤ 50 mg/min (≤ 25 si > 60 ans ou trouble du rythme).", ar: "≤ ٥٠ مغ/د (≤ ٢٥ إذا > ٦٠ س أو اضطراب نظم)." },
      { fr: "Scope ECG + TA pendant toute la perfusion; filtre en place.", ar: "تخطيط + ضغط طوال التسريب؛ الفلتر مركّب." },
    ],
    links: [{ href: "/calculateurs/antiepileptiques", fr: "Doses de charge", ar: "جرعات التحميل" }, { href: "/calculateurs/jumeaux", fr: "Phénytoïne vs Fos- (mg ÉP)", ar: "فينيتوين مقابل فوس- (مغ مكافئ)" }] },
  { id: "kcl", sev: 3, fr: "Avant le potassium IV", ar: "قبل البوتاسيوم الوريدي",
    items: [
      { fr: "JAMAIS d'ampoule concentrée en direct (elle porte « À DILUER »).", ar: "أبداً الأمبول المركّز مباشرة (مكتوب عليه «للتخفيف»)." },
      { fr: "≤ 10 mmol/h par voie périphérique, ≤ 40 mmol/L de soluté, pompe.", ar: "≤ ١٠ مليمول/س محيطياً، ≤ ٤٠ مليمول/ل، بالمضخة." },
      { fr: "Diurèse du jour connue (l'oligurie bloque l'élimination).", ar: "التبول اليومي معروف (قلة البول تحجب الإطراح)." },
    ],
    links: [{ href: "/calculateurs/electrolytes", fr: "Correction électrolytique", ar: "تصحيح الشوارد" }, { href: "/calculateurs/jumeaux", fr: "Mémo KCl", ar: "تذكير KCl" }] },
  { id: "sepsis-ab", sev: 2, fr: "Avant le 1er antibiotique du sepsis", ar: "قبل أول مضاد في الإنتان",
    items: [
      { fr: "Hémocultures ×2 AVANT, sans retarder l'antibiotique > 45-60 min.", ar: "دم ×٢ قبل، دون تأخير المضاد > ٤٥-٦٠ د." },
      { fr: "Poids et clairance pris en compte (dose de charge adaptée).", ar: "الوزن والتصفية محسوبان (جرعة تحميل مناسبة)." },
      { fr: "Allergie bêta-lactamine interrogée/étiquetée.", ar: "حساسية البيتا-لاكتام مُسألة/موسومة." },
    ],
    links: [{ href: "/calculateurs/sepsis-commandement", fr: "Bundle heure-1", ar: "حزمة الساعة ١" }, { href: "/calculateurs/antibiotiques", fr: "Doses et rein", ar: "الجرعة والكلى" }] },
  { id: "noac-saign", sev: 2, fr: "NOAC chez le patient qui saigne", ar: "مضاد مباشر عند المريض النازف",
    items: [
      { fr: "Heure exacte de la dernière prise (< 2-4 h: charbon si conscient).", ar: "توقيت آخر جرعة (< ٢-٤ س: فحم إذا واعٍ)." },
      { fr: "Molécule identifiée: dabigatran = dialysable, Xa = PCC/andexanet.", ar: "الجزيء محدّد: دابيغاتران = يُغسل، Xa = PCC/andexanet." },
      { fr: "Créatinine et poids disponibles (quantifient l'exposition).", ar: "الكرياتينين والوزن متوفران (يقيسان التعرض)." },
    ],
    links: [{ href: "/calculateurs/noac", fr: "Renversement NOAC", ar: "تراجع NOAC" }, { href: "/calculateurs/antidotes", fr: "Antidotes", ar: "الترياقات" }] },
  { id: "transfert", sev: 1, fr: "Avant de déplacer le patient", ar: "قبل نقل المريض",
    items: [
      { fr: "Voie, O2 et monitorage sécurisés pour le trajet.", ar: "الوريد، الأكسجين والمراقبة مؤمّنة للرحلة." },
      { fr: "Analgésie/sédation faites AVANT le départ (pas en route).", ar: "التسكين/التخدير قبل الإقلاع، لا في الطريق." },
      { fr: "Documents + imagerie + traitements; lit et interlocuteur confirmés.", ar: "الوثائق + التصوير + الأدوية؛ السرير والمستقبِل مؤكّدان." },
    ],
    links: [{ href: "/fiche-samu", fr: "Fiche d'intervention", ar: "فيشة التدخل" }] },
];

export default function GardeFousPage() {
  useRegisterRecent("calculateur:garde-fous");
  const { lang } = useApp();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setDone((d) => ({ ...d, [k]: !d[k] }));
  const resetList = (g: Guard) => setDone((d) => { const n = { ...d }; g.items.forEach((_, j) => delete n[`${g.id}:${j}`]); return n; });

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title={lang === "ar" ? "لا تنسَ قبل أن…" : "Ne pas oublier avant…"}
        sub={lang === "ar" ? "١٠ لحظات خطر: تحقّق المربعات قبل الفعل — تُمسح عند كل مريض." : "10 moments à risque : cochez avant d'agir — remis à zéro à chaque patient."}
      />

      <ul className="flex flex-col gap-3">
        {GUARDS.map((g) => {
          const n = g.items.filter((_, j) => done[`${g.id}:${j}`]).length;
          const all = n === g.items.length;
          return (
            <li key={g.id} className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${all ? "sev-standard" : g.sev === 3 ? "sev-critical" : "sev-urgent"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-black">{lang === "ar" ? g.ar : g.fr}</p>
                <div className="flex items-center gap-2">
                  <Badge tone={all ? "standard" : "neutral"}>{n} / {g.items.length}</Badge>
                  {n > 0 && (
                    <button onClick={() => resetList(g)} className="touch rounded-full border border-line px-2 py-1 text-[10px] font-black opacity-70" aria-label={lang === "ar" ? "إعادة" : "Réinitialiser"}>
                      ↺
                    </button>
                  )}
                </div>
              </div>
              <ul className="mt-2 flex flex-col gap-1.5">
                {g.items.map((it, j) => {
                  const k = `${g.id}:${j}`;
                  return (
                    <li key={k}>
                      <label className="flex cursor-pointer items-start gap-2 rounded-lg p-1.5 text-sm font-bold hover:bg-surface2">
                        <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600" aria-label={lang === "ar" ? it.ar : it.fr} />
                        <span className={done[k] ? "opacity-50 line-through" : ""}>{it[lang === "ar" ? "ar" : "fr"]}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-full border px-3 py-1.5 text-[11px] font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                    {lang === "ar" ? l.ar : l.fr}
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Link href="/calculateurs/jumeaux" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Frères jumeaux" ar="مُفرّق التوائم" /></Link>
        <Link href="/calculateurs/dose-check" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Vérification de dose" ar="التحقق من الجرعة" /></Link>
        <Link href="/calculateurs/chronologie" className="rounded-full border px-4 py-2 text-xs font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}><T fr="Chronologie" ar="خط الزمن" /></Link>
      </div>
    </div>
  );
}
