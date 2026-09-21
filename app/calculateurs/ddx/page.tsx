"use client";
// v7.9 — « Les 2 diagnostics les plus proches » : matrice signes × hypothèses pondérée.
// Aide-mémoire de raisonnement — ne remplace jamais le jugement clinique.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";
import { trackEvent } from "@/lib/analytics";
import { Stethoscope } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";

const SIGNS = [
  { id: "douleurThor", fr: "Douleur thoracique", ar: "ألم صدري" },
  { id: "dyspnee", fr: "Dyspnée", ar: "زلة تنفسية" },
  { id: "syncope", fr: "Syncope", ar: "إغماء" },
  { id: "palp", fr: "Palpitations", ar: "خفقان" },
  { id: "hemop", fr: "Hémoptysie", ar: "نفث دم" },
  { id: "oedemeMI", fr: "Œdème unilatéral du mollet", ar: "ورم ساق وحيد الجانب" },
  { id: "fievre", fr: "Fièvre", ar: "حمى" },
  { id: "toux", fr: "Toux productive", ar: "سعال منتج" },
  { id: "siffl", fr: "Sibilants", ar: "أزيز" },
  { id: "consc", fr: "Trouble de conscience", ar: "اضطراب وعي" },
  { id: "convul", fr: "Convulsions", ar: "اختلاجات" },
  { id: "focal", fr: "Déficit neurologique focal", ar: "عجز عصبي بؤري" },
  { id: "ceph", fr: "Céphalée brutale", ar: "صداع صاعق" },
  { id: "abd", fr: "Douleur abdominale", ar: "ألم بطني" },
  { id: "vomi", fr: "Vomissements", ar: "إقياء" },
  { id: "hemoD", fr: "Hématémèse / méléna", ar: "إقياء دموي/براز أسود" },
  { id: "rash", fr: "Urticaire / angio-œdème", ar: "شرى/وذمة وعائية" },
  { id: "choc", fr: "Hypotension / choc", ar: "هبوط ضغط/صدمة" },
  { id: "nuque", fr: "Raideur de nuque", ar: "تصلب رقبة" },
] as const;

const DX: { id: string; sev: 1 | 2 | 3; fr: string; ar: string; href: string; w: Record<string, number> }[] = [
  { id: "acs", sev: 1 as 1|2|3, fr: "SCA (STEMI/NSTEMI)", ar: "متلازمة تاجية", href: "/protocoles/sca-stemi", w: { douleurThor: 3, dyspnee: 1, syncope: 1, palp: 1, choc: 2 } },
  { id: "ep", sev: 1 as 1|2|3, fr: "Embolie pulmonaire", ar: "انصمام رئوي", href: "/protocoles/embolie-pulmonaire", w: { douleurThor: 2, dyspnee: 3, syncope: 2, hemop: 2, oedemeMI: 2, palp: 1, choc: 2 } },
  { id: "sepsis", sev: 1 as 1|2|3, fr: "Sepsis / pneumonie", ar: "إنتان/ذات رئة", href: "/protocoles/choc-septique", w: { fievre: 3, toux: 2, dyspnee: 1, consc: 1, choc: 3 } },
  { id: "asthme", sev: 1 as 1|2|3, fr: "Asthme aigu / BPCO", ar: "ربو حاد/انسداد مزمن", href: "/protocoles/asthme-aigu-grave", w: { siffl: 3, dyspnee: 2, toux: 1 } },
  { id: "avc", sev: 1 as 1|2|3, fr: "AVC", ar: "سكتة دماغية", href: "/protocoles/avc", w: { focal: 3, consc: 2, ceph: 1, convul: 1 } },
  { id: "meningite", sev: 1 as 1|2|3, fr: "Méningite", ar: "التهاب سحايا", href: "/protocoles/choc-septique", w: { fievre: 2, nuque: 3, ceph: 2, consc: 1 } },
  { id: "hypo", sev: 1 as 1|2|3, fr: "Hypoglycémie", ar: "نقص سكر", href: "/protocoles/hypoglycemie", w: { consc: 3, convul: 2, palp: 1, focal: 1 } },
  { id: "dka", sev: 2 as 1|2|3, fr: "Acidocétose diabétique", ar: "حماض كيتوني سكري", href: "/protocoles/acidocetose-diabetique", w: { vomi: 2, abd: 2, consc: 2, dyspnee: 1 } },
  { id: "hemoD", sev: 1 as 1|2|3, fr: "Hémorragie digestive", ar: "نزف هضمي", href: "/protocoles/hemorragie-digestive-haute", w: { hemoD: 3, syncope: 2, choc: 3, abd: 1 } },
  { id: "anaph", sev: 1 as 1|2|3, fr: "Anaphylaxie", ar: "تأق", href: "/protocoles/anaphylaxie", w: { rash: 3, siffl: 2, choc: 2, abd: 1, vomi: 1 } },
  { id: "eme", sev: 1 as 1|2|3, fr: "État de mal épileptique", ar: "حالة صرعية", href: "/protocoles/etat-mal-epileptique", w: { convul: 3, consc: 2, fievre: 1 } },
  { id: "dissection", sev: 1 as 1|2|3, fr: "Dissection aortique", ar: "تسلخ أبهري", href: "/protocoles/hta-urgence", w: { douleurThor: 3, syncope: 1, focal: 1, choc: 1 } },
  { id: "tamponnade", sev: 1 as 1|2|3, fr: "Tamponnade cardiaque", ar: "اندحاس قلبي", href: "/protocoles/thorax-penetrant", w: { dyspnee: 2, choc: 3, douleurThor: 1, syncope: 1 } },
  { id: "hta", sev: 2 as 1|2|3, fr: "Urgence hypertensive", ar: "طارئة ارتفاع ضغط", href: "/protocoles/hta-urgence", w: { ceph: 2, focal: 1, douleurThor: 1, consc: 1, dyspnee: 1 } },
];

export default function DdxPage() {
  const { lang } = useApp();
  const [on, setOn] = useState<Set<string>>(new Set());
  useRegisterRecent("calculateur:ddx");

  const ranking = useMemo(() => {
    return DX.map((d) => ({
      ...d,
      score: Object.entries(d.w).reduce((n, [k, v]) => (on.has(k) ? n + v : n), 0),
    })).sort((a, b) => b.score - a.score || a.sev - b.sev);
  }, [on]);

  const top = on.size > 0 ? ranking.filter((d) => d.score > 0).slice(0, 2) : [];
  const max = top.length ? top[0].score : 1;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Stethoscope className="h-6 w-6" />}
        title={<T fr="Les 2 diagnostics les plus proches" ar="أقرب تشخيصين" />}
        sub={<T fr="Coche les signes présents — classement pondéré TRIÉ PAR GRAVITÉ puis score. Aide-mémoire, pas un diagnostic." ar="علّم العلامات — ترتيب موزون يُفرز بالخطورة ثم النقاط. وسيلة تذكير لا تشخيص." />}
      />

      <div className="card flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SIGNS.map((s) => {
            const sel = on.has(s.id);
            return (
              <button key={s.id} role="checkbox" aria-checked={sel}
                onClick={() => {
                  setOn((p) => { const n = new Set(p); if (sel) { n.delete(s.id); } else { n.add(s.id); } return n; });
                  trackEvent("calculator_use", { id: "ddx" });
                }}
                className={`touch rounded-xl border px-3 py-2.5 text-start text-sm font-bold ${sel ? "border-blue-600 bg-blue-600/15 text-blue-400" : "border-line hover:bg-surface2"}`}>
                {lang === "ar" ? s.ar : s.fr}
              </button>
            );
          })}
        </div>
      </div>

      {top.length > 0 ? (
        <div className="flex flex-col gap-3">
          {top.map((d, i) => (
            <div key={d.id} className={`card rounded-2xl border-2 p-4 ${i === 0 ? "border-blue-600" : "border-line"}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-lg font-black">{i + 1}. {lang === "ar" ? d.ar : d.fr}</p>
                <span className="flex items-center gap-1.5">
                  <Badge tone={d.sev === 1 ? "critical" : d.sev === 2 ? "urgent" : "standard"}>
                    {d.sev === 1 ? (lang === "ar" ? "حيوي" : "Vital") : d.sev === 2 ? (lang === "ar" ? "عاجل" : "Urgent") : (lang === "ar" ? "مهم" : "Important")}
                  </Badge>
                  <span className="rounded-lg px-2.5 py-1 text-sm font-black tabular-nums" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{d.score} pts</span>
                </span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.round((d.score / max) * 100)}%` }} />
              </div>
              <Link href={d.href} className="touch inline-flex items-center gap-1 rounded-lg border border-amber-500 bg-amber-500/10 px-3 py-1.5 text-sm font-black text-amber-500">
                <span dir="ltr">⇒</span> {lang === "ar" ? "افتح البروتوكول" : "Ouvrir le protocole"}
              </Link>
            </div>
          ))}
          <p className="text-xs opacity-60">
            <T fr="Toujours vérifier la glycémie capillaire et l'ECG devant tout tableau aigu — les deux « imposteurs » universels." ar="تحقق دائماً من السكر الشعيري والتخطيط في كل حالة حادة — «المقلّدان» العالميان." />
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Coche au moins un signe pour voir le classement." ar="علّم علامة واحدة على الأقل لعرض الترتيب." />
        </p>
      )}
    </div>
  );
}
