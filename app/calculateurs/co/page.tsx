"use client";
// v10.0-A5 — تسمّم أكسيد الكربون / inhalations de fumées.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Wind } from "lucide-react";

export default function CoPage() {
  useRegisterRecent("calculateur:co");
  const { lang } = useApp();
  const [cohb, setCohb] = useState("");
  const [fumeur, setFumeur] = useState(false);
  const [signes, setSignes] = useState<Set<string>>(new Set(["aucun"]));

  const v = parseFloat(cohb);
  const has = Number.isFinite(v);
  const fumeurBase = fumeur ? 10 : 5;

  const band = useMemo(() => {
    if (!has) return 0;
    if (v <= fumeurBase) return 1;
    if (v < 20) return 2;
    if (v < 25) return 3;
    return 4;
  }, [has, v, fumeurBase]);

  const SIG: { id: string; fr: string; ar: string; hbo: boolean }[] = [
    { id: "aucun", fr: "Aucun signe neurologique", ar: "لا علامات عصبية", hbo: false },
    { id: "cephalees", fr: "Céphalées / nausées", ar: "صداع / غثيان", hbo: false },
    { id: "pdc", fr: "Perte de connaissance", ar: "فقدان وعي", hbo: true },
    { id: "conf", fr: "Confusion / agitation", ar: "تشوش / هياج", hbo: true },
    { id: "defcite", fr: "Déficit neurologique", ar: "عجز عصبي", hbo: true },
    { id: "isch", fr: "Ischémie myocardique (ECG)", ar: "إقفار قلبي (ECG)", hbo: true },
    { id: "enceinte", fr: "Grossesse", ar: "حمل", hbo: true },
    { id: "sync", fr: "Syncope à l'effort", ar: "إغماء بالجهد", hbo: true },
  ];

  const hboSign = SIG.some((s) => s.hbo && signes.has(s.id));
  const hboLevel = has && (v >= 25 || (fumeur ? v >= 20 : v >= 25));
  const hbo = hboSign || hboLevel;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Wind className="h-6 w-6" />}
        title={lang === "ar" ? "أكسيد الكربون والفاقات" : "Monoxyde de carbone / fumées"}
        sub={lang === "ar" ? "COHb + عناصر الاستطباب للعلاج بالأكسجين عالي الضغط." : "COHb + critères d'oxygénothérapie hyperbare."}
      />

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 text-sm font-bold">
        <p className="font-black" style={{ color: "var(--sev-critical)" }}><T fr="Réflexes immédiats" ar="ردود فورية" /></p>
        <p><T fr="O2 100 % au masque à haute concentration dès la suspicion — sans attendre le dosage." ar="أكسجين ١٠٠٪ بقناع عالي التركيز فور الشك — دون انتظار النتيجة." /></p>
        <p><T fr="SpO2 normale: ne pas se fier — utiliser la CO-oxymétrie (ou dosage sanguin)." ar="SpO2 طبيعية: لا تثق بها — استخدم قياس CO-oxymétrie أو الدم." /></p>
        <p><T fr="Poursuivre O2 jusqu'à COHb < 5 % (10 % si fumeur); demi-vie ≈ 4-6 h à l'air, ~80 min sous O2 100 %, ~20-30 min en caisson." ar="واصل الأكسجين حتى COHb < ٥٪ (١٠٪ للمدخّن)؛ نصف العمر ≈ ٤-٦ س بالهواء و٨٠ د بأكسجين ١٠٠٪ و٢٠-٣٠ د بالغرفة." /></p>
      </div>

      <section className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
            <span className="text-xs font-black opacity-70"><T fr="COHb (%)" ar="COHb (%)" /></span>
            <input type="number" inputMode="decimal" step="0.1" value={cohb} onChange={(e) => setCohb(e.target.value)}
              className="w-full bg-transparent text-lg font-black tabular-nums outline-none" dir="ltr" />
          </label>
          <button onClick={() => setFumeur((f) => !f)} aria-pressed={fumeur}
            className={`touch rounded-xl border p-3 text-sm font-black ${fumeur ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
            style={fumeur ? { background: "var(--accent)" } : undefined}>
            <T fr="Fumeur (base 10 %)" ar="مدخّن (أساس ١٠٪)" />
          </button>
        </div>
        <div className="card flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-4">
          {SIG.map((s) => {
            const on = signes.has(s.id);
            return (
              <button key={s.id} aria-pressed={on}
                onClick={() => setSignes((p) => { const n = new Set(p); if (on) n.delete(s.id); else n.add(s.id); return n; })}
                className={`touch rounded-full border px-3 py-2 text-xs font-black ${on ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
                style={on ? { background: "var(--accent)" } : undefined}>
                {lang === "ar" ? s.ar : s.fr}
              </button>
            );
          })}
        </div>
      </section>

      {(has || hboSign) && (
        <div className={`card sev-strip rounded-2xl border border-line bg-surface p-4 ${hbo ? "sev-critical" : band >= 3 ? "sev-urgent" : "sev-standard"}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-lg font-black">
              {hbo ? <T fr="Discussion caisson (OHB)" ar="مناقشة غرفة الأكسجين عالي الضغط" />
                : band === 4 ? <T fr="Intoxication grave" ar="تسمّم شديد" />
                  : band === 3 ? <T fr="Intoxication modérée" ar="تسمّم متوسط" />
                    : band === 2 ? <T fr="Intoxication légère" ar="تسمّم خفيف" />
                      : <T fr="Taux compatible avec le statut" ar="نسبة موافقة للحالة" />}
            </p>
            <Badge tone={hbo ? "critical" : band >= 3 ? "urgent" : "standard"}>
              {has ? <span dir="ltr">{v}%</span> : <T fr="Signes" ar="علامات" />}
            </Badge>
          </div>
          <p className="text-sm font-bold opacity-80">
            {hbo
              ? <T fr="Critère présent: O2 100 % continu + avis centre hyperbare (transfert sans interrompre l'O2)." ar="يوجد معيار: أكسجين ١٠٠٪ مستمر + استشارة مركز الضغط (نقل دون قطع الأكسجين)." />
              : <T fr="O2 100 % + surveillance ECG/neuro; contrôle COHb (attention au taux déjà baissé après transport)." ar="أكسجين ١٠٠٪ + مراقبة ECG/عصبية؛ أعد قياس COHb (انتبه لهبوطه بعد النقل)." />}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/calculateurs/antidotes" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              <T fr="Fumées: penser cyanures → antidotes" ar="الفاقات: فكّر بالسيانيد → الترياقات" />
            </Link>
            <Link href="/calculateurs/rcp-equipe" className="rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              <T fr="Arrêt: équipe RCP" ar="توقف: فريق الإنعاش" />
            </Link>
          </div>
        </div>
      )}

      <p className="rounded-xl border border-dashed border-line p-3 text-xs opacity-70">
        <T fr="Pièges: cause domestique (chauffe-eau) → dépister toute la famille; enfants/adultes âgés plus sensibles; effet retardé neuro-psychiatrique à 2-40 jours." ar="مصائد: سبب منزلي (سخّان) → افحص كل الأسرة؛ الأطفال والمسنّون أكثر حساسية؛ تأخر عصبي-نفسي بعد ٢-٤٠ يوماً." />
      </p>
    </div>
  );
}
