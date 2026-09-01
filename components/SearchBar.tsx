"use client";
// Barre de recherche globale : suggestions clavier, historique, voix (Web Speech API).
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, CornerDownLeft } from "lucide-react";
import { useApp } from "./Providers";
import { searchItems, resolveRef, type SearchItem } from "@/lib/search";
import { KEYS, readJSON, writeJSON } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { generateText } from "@/lib/ai";
import { aiReady } from "@/lib/ai-config";

interface SpeechRec {
  lang: string;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}
type SpeechCtor = new () => SpeechRec;

function getSpeechRecognition(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function SearchBar({ big = false }: { big?: boolean }) {
  const { t, lang, pushRecent } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce + recherche
  useEffect(() => {
    const id = setTimeout(() => setResults(searchItems(q)), 120);
    return () => clearTimeout(id);
  }, [q]);

  // Historique au focus + fermeture au clic extérieur
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (item: SearchItem) => {
    setOpen(false);
    setQ("");
    pushRecent(item.key);
    const hist = [item.title[lang], ...readJSON<string[]>(KEYS.searchHistory, []).filter((h) => h !== item.title[lang])].slice(0, 6);
    writeJSON(KEYS.searchHistory, hist);
    trackEvent("search_select", { key: item.key });
    router.push(item.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === "Enter" && active >= 0 && results[active]) { e.preventDefault(); go(results[active]); }
    else if (e.key === "Escape") setOpen(false);
  };

  const startVoice = () => {
    const R = getSpeechRecognition();
    if (!R) return;
    const rec = new R();
    rec.lang = lang === "ar" ? "ar-TN" : "fr-FR";
    rec.onresult = (e) => { setQ(e.results[0][0].transcript); setOpen(true); };
    rec.onend = () => {};
    try { rec.start(); } catch { /* double start */ }
  };

  const showHistory = open && !q && history.length > 0;
  const voiceSupported = typeof window !== "undefined" && getSpeechRecognition() !== null;

  return (
    <div ref={boxRef} className={`relative w-full ${big ? "max-w-2xl" : "max-w-md"}`}>
      <div className="flex items-center gap-1 rounded-2xl bg-surface border border-line px-3 focus-within:ring-2 focus-within:ring-teal-600">
        <Search className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { setOpen(true); setHistory(readJSON(KEYS.searchHistory, [])); }}
          onKeyDown={onKey}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          aria-expanded={open}
          role="combobox"
          aria-activedescendant={active >= 0 ? `sr-${active}` : undefined}
          className={`w-full bg-transparent outline-none py-3 ${big ? "text-lg" : ""}`}
        />
        {voiceSupported && (
          <button onClick={startVoice} aria-label={t("search.voice")} className="touch rounded-xl hover:bg-surface2 text-teal-500">
            <Mic className="h-5 w-5" aria-hidden />
          </button>
        )}
        {/* IA : extraction de mots-clés d'une question en langage naturel */}
        {q.trim().split(/\s+/).length >= 3 && aiReady() && (
          <button
            onClick={async () => {
              try {
                trackEvent("ai_query", { kind: "search" });
                const kw = await generateText(
                  `Extrais 1 à 3 mots-clés médicaux (français ou arabe) pour chercher dans une base de données de protocoles d'urgence. Réponds UNIQUEMENT avec les mots-clés séparés par des espaces, rien d'autre.\nQuestion : ${q}`,
                  "Tu es un extracteur de mots-clés pour la recherche médicale."
                );
                setQ(kw.trim());
                setOpen(true);
              } catch { /* silencieux */ }
            }}
            aria-label="IA"
            title={lang === "ar" ? "استخراج الكلمات بالذكاء الاصطناعي" : "Extraire les mots-clés (IA)"}
            className="touch rounded-xl bg-teal-600/15 px-2 text-teal-500 font-black text-sm hover:bg-teal-600/25">
            IA
          </button>
        )}
      </div>

      {open && (results.length > 0 || showHistory) && (
        <div className="absolute z-40 mt-2 w-full rounded-2xl border border-line bg-surface shadow-xl overflow-hidden">
          {showHistory && (
            <div className="p-2 text-sm opacity-70">
              <div className="px-2 pb-1 font-semibold">{t("search.history")}</div>
              {history.map((h) => (
                <button key={h} onClick={() => setQ(h)} className="block w-full text-start px-3 py-2 rounded-lg hover:bg-surface2">
                  {h}
                </button>
              ))}
            </div>
          )}
          {results.map((r, i) => (
            <button
              id={`sr-${i}`}
              key={r.key}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(r)}
              className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-start hover:bg-surface2 ${i === active ? "bg-surface2" : ""}`}
            >
              <span className="font-medium">{lang === "ar" ? r.title.ar : r.title.fr}</span>
              <span className="flex items-center gap-1 text-xs opacity-60 capitalize">
                {r.type === "protocole" ? t("nav.protocols") : r.type === "medicament" ? t("nav.medications") : r.type === "procedure" ? t("nav.procedures") : r.type === "ecg" ? "ECG" : r.type === "arbre" ? t("nav.trees") : t("nav.calculators")}
                {i === active && <CornerDownLeft className="h-3 w-3" aria-hidden />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Enregistre la visite d'une page (appelé par les pages de détail). */
export function useRegisterRecent(key: string) {
  const { pushRecent, hydrated } = useApp();
  useEffect(() => {
    if (hydrated) pushRecent(key);
  }, [hydrated, key, pushRecent]);
}

export { resolveRef };
