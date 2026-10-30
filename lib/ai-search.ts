const MAX_RESPONSE_LENGTH = 500;
const MAX_KEYWORD_LENGTH = 40;

/** Accepte uniquement 1 à 3 mots-clés nus, sans chiffres ni prose libre. */
export function parseAiSearchKeywords(raw: string): string | null {
  const value = raw.trim().normalize("NFC");
  if (!value || value.length > MAX_RESPONSE_LENGTH || /\p{N}/u.test(value)) return null;

  const parts = value.split(/\s+/u);
  if (parts.length < 1 || parts.length > 3) return null;
  if (parts.some((part) => part.length > MAX_KEYWORD_LENGTH || !/^\p{L}+(?:-\p{L}+)*$/u.test(part))) return null;

  return parts.join(" ");
}
