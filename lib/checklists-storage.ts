import { CHECKLISTS } from "@/data/checklists";

export type Checks = Record<string, Record<string, boolean>>;

export function sanitizeChecks(value: unknown): Checks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const safe: Checks = {};
  for (const checklist of CHECKLISTS) {
    const group = source[checklist.id];
    if (!group || typeof group !== "object" || Array.isArray(group)) continue;
    const saved = group as Record<string, unknown>;
    const entries: Record<string, boolean> = {};
    checklist.groups.forEach((g, gi) => g.items.forEach((_, ii) => {
      const key = `${checklist.id}:${gi}:${ii}`;
      if (saved[key] === true) entries[key] = true;
    }));
    if (Object.keys(entries).length) safe[checklist.id] = entries;
  }
  return safe;
}

export function loadChecks(): Checks {
  if (typeof window === "undefined") return {};
  try {
    return sanitizeChecks(JSON.parse(window.localStorage.getItem("eutn:checklists") || "{}") as unknown);
  } catch {
    return {};
  }
}
