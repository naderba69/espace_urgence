"use client";
// v4.5 — محور المساعدين الشخصيين: كل المساعدين في مكان واحد مع تصفية فورية.
import { useState } from "react";
import Link from "next/link";
import { calculators } from "@/data/calculators";
import CalculatorCard, { type LucideName } from "@/components/cards/CalculatorCard";
import { useApp } from "@/components/Providers";
import { useRegisterRecent } from "@/components/SearchBar";
import T from "@/components/T";

const ASSISTANT_IDS = new Set([
  "rcp-equipe", "sepsis-cde", "neonat-ran", "iot-rsi", "rcp-peds", "anaphylaxie",
  "dka-h1", "eclampsie", "asthme", "hpp", "opioides", "etat-mal", "hypoglycemie", "hyperkalemie",
  "coup-chaleur", "rau", "raaf", "plaies", "syncope", "tetanos", "transfusion", "pac", "hemo-digestive", "hypothermie", "noyade", "colique", "sevrage-alcool", "agitation", "brulures", "migraine", "trauma-membres",
]);

export default function AssistantsHubPage() {
  useRegisterRecent("assistants");
  const { lang } = useApp();
  const [q, setQ] = useState("");

  const all = calculators.filter((c) => ASSISTANT_IDS.has(c.id));
  const needle = q.trim().toLowerCase();
  const list = all.filter((c) =>
    !needle ||
    c.title.fr.toLowerCase().includes(needle) ||
    c.title.ar.includes(q.trim()) ||
    c.description.fr.toLowerCase().includes(needle) ||
    c.description.ar.includes(q.trim()));

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold"><T fr="Assistants personnels" ar="المساعدون الشخصيون" /></h1>
        <Link href="/calculateurs" className="touch rounded-xl border border-line px-3 py-1.5 text-sm font-bold">
          <T fr="Toutes les calculs" ar="كل الحاسبات" />
        </Link>
      </header>

      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder={lang === "ar" ? "ابحث: ربو، تنبيب، إنتان…" : "Chercher : asthme, intubation…"}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-bold" />

      <p className="text-sm font-bold opacity-60">{list.length} / {all.length} <T fr="assistants" ar="مساعداً" /></p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <li key={c.id}>
            <CalculatorCard id={c.id} href={c.href} title={c.title} description={c.description} icon={c.icon as LucideName} meta={c.meta} />
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="rounded-xl border border-line bg-surface p-4 text-center font-bold opacity-60">
          <T fr="Aucun assistant ne correspond." ar="لا مساعد مطابقاً." />
        </p>
      )}
    </div>
  );
}
