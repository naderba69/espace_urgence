"use client";
// v10.0-A3 — كاشف المتلازمات السمية : علامات → متلازمة → ترياق.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import Badge from "@/components/ui/Badge";
import T from "@/components/T";
import { Flame } from "lucide-react";

const TOX = [
  {
    id: "sym", fr: "Sympathomimétique", ar: "وديّة (كوكايين/أمفيتامين)",
    signs: ["tachy", "hta", "myd", "sueur", "agit"],
    actFr: "Benzodiazépines d'abord ; jamais bêta-bloquant seul.", actAr: "بنزوديازيبين أولاً؛ لا حاصرات بيتا وحدها.",
  },
  {
    id: "anti", fr: "Anticholinergique", ar: "مضادة الكولين",
    signs: ["myd", "sec", "retUrine", "hyperT", "delir"],
    actFr: "Sédation ; physostigmine seulement si indication sûre.", actAr: "تهدئة؛ فيزوستيغمين فقط عند استطباب مؤكد.",
  },
  {
    id: "chol", fr: "Cholinergique (organophosphorés)", ar: "كولينية (فوسفور عضوي)",
    signs: ["miosis", "sueur", "saliv", "broncho", "brady"],
    actFr: "Atropine + décontamination ; EPI pour l'équipe.", actAr: "أتروبين + إزالة تلوث؛ وقاية للمسعف.",
  },
  {
    id: "opi", fr: "Opioïde", ar: "أفيونية",
    signs: ["miosis", "frBasse", "coma"],
    actFr: "Naloxone titrée + ventilation.", actAr: "نالوكسون معاير + تهوية.",
  },
  {
    id: "sed", fr: "Sédatif (benzo/alcool)", ar: "مهدئة (بنزو/كحول)",
    signs: ["coma", "pupNorm", "frBasse"],
    actFr: "Supportif ; flumazénil avec prudence (épilepsie).", actAr: "داعم؛ فلومازينيل بحذر (صرع).",
  },
] as const;

const SIGNS: { id: string; fr: string; ar: string }[] = [
  { id: "tachy", fr: "Tachycardie", ar: "تسرع قلب" },
  { id: "hta", fr: "Hypertension", ar: "ارتفاع ضغط" },
  { id: "myd", fr: "Mydriase", ar: "اتساع بؤبؤ" },
  { id: "miosis", fr: "Myosis", ar: "تضيق بؤبؤ" },
  { id: "sueur", fr: "Sueurs", ar: "تعرق" },
  { id: "sec", fr: "Peau/muqueuses sèches", ar: "جلد/أغشية جافة" },
  { id: "saliv", fr: "Hypersalivation", ar: "فرط إلعاب" },
  { id: "broncho", fr: "Bronchorrhée/sibilants", ar: "فرط إفراز قصبي" },
  { id: "brady", fr: "Bradycardie", ar: "بطء قلب" },
  { id: "frBasse", fr: "FR < 12", ar: "تنفس < ١٢" },
  { id: "agit", fr: "Agitation", ar: "هياج" },
  { id: "delir", fr: "Délire/confusion", ar: "هذيان/تشوش" },
  { id: "coma", fr: "Coma", ar: "غيبوبة" },
  { id: "pupNorm", fr: "Pupilles normales", ar: "بؤبؤ طبيعي" },
  { id: "retUrine", fr: "Rétention urinaire", ar: "احتباس بول" },
  { id: "hyperT", fr: "Hyperthermie", ar: "فرط حرارة" },
];

export default function ToxidromesPage() {
  useRegisterRecent("calculateur:toxidromes");
  const { lang } = useApp();
  const [on, setOn] = useState<Set<string>>(new Set());

  const best = useMemo(() => {
    if (on.size === 0) return null;
    return TOX.map((t) => ({ ...t, hit: t.signs.filter((s) => on.has(s)).length }))
      .filter((t) => t.hit > 0)
      .sort((a, b) => b.hit - a.hit)[0] ?? null;
  }, [on]);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <PageHeader
        icon={<Flame className="h-6 w-6" />}
        title={lang === "ar" ? "كاشف المتلازمات السمية" : "Toxidromes"}
        sub={lang === "ar" ? "علّم العلامات — المتلازمة الأرجح والترياق." : "Cochez les signes — toxidrome probable et antidote."}
      />

      <section className="card grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-4">
        {SIGNS.map((s) => {
          const sel = on.has(s.id);
          return (
            <button
              key={s.id} role="checkbox" aria-checked={sel}
              onClick={() => setOn((p) => { const n = new Set(p); if (sel) n.delete(s.id); else n.add(s.id); return n; })}
              className={`touch rounded-xl border px-3 py-2 text-start text-sm font-bold ${sel ? "border-transparent text-white" : "border-line hover:bg-surface2"}`}
              style={sel ? { background: "var(--accent)" } : undefined}
            >
              {lang === "ar" ? s.ar : s.fr}
            </button>
          );
        })}
      </section>

      {best ? (
        <section className="flex flex-col gap-3">
          <SectionTitle>{lang === "ar" ? "المتلازمة الأرجح" : "Toxidrome probable"}</SectionTitle>
          <div className="card sev-strip sev-critical rounded-2xl border border-line bg-surface p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-lg font-black">{lang === "ar" ? best.ar : best.fr}</p>
              <Badge tone="critical">{best.hit}/{best.signs.length}</Badge>
            </div>
            <p className="text-sm font-bold opacity-80">{lang === "ar" ? best.actAr : best.actFr}</p>
            <Link href="/calculateurs/antidotes" className="mt-3 inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              <span dir="ltr">⇒</span> {lang === "ar" ? "ملاح الترياقات" : "Navigateur d'antidotes"}
            </Link>
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm opacity-70">
          <T fr="Cochez au moins un signe." ar="علّم علامة واحدة على الأقل." />
        </p>
      )}
    </div>
  );
}
