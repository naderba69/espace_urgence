// IndexedDB pour l'historique IA des ECG (purge au nouvel onglet ; données non persistées entre sessions).
// Miniatures JPEG ≤300 px, max 30 entrées, éviction FIFO.

import { sanitizeEcgAnalysis } from "./ecg-parse";

const DB_NAME = "eutn-db";
const STORE = "ecg-analyses";
const MAX_ENTRIES = 30;
const SESSION_MARKER = "eutn:ecg-history-session-v1";
let sessionInitialization: Promise<void> | null = null;
let sessionInitializedInMemory = false;

export interface EcgRecord {
  id?: number;
  ts: number;              // epoch ms
  thumb: string;           // dataURL JPEG miniature
  analysis: EcgAnalysis;   // structuré (parsing libéré du texte brut)
  raw: string;             // champ historique compatible ; les réponses brutes ne sont plus enregistrées
}

export interface EcgAnalysis {
  rhythm?: string;
  heartRateBpm?: number | null;
  intervals?: string;
  stSegment?: string;
  tWave?: string;
  hyperkalemiaSigns?: string;
  avBlockSigns?: string;
  suspectedDiagnosis?: string;
  severity?: "normal" | "caution" | "critical";
  confidence?: number;
  immediateRecommendations?: string[];
  protocolIds?: string[];
  summary?: string;
}

function openDbRaw(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB non supporté"));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Les images ECG sont des données de santé : vider l’historique IndexedDB au début d’un nouvel onglet. */
async function ensureSessionHistory(): Promise<void> {
  if (typeof window === "undefined") throw new Error("Historique ECG indisponible hors navigateur");
  if (sessionInitializedInMemory) return;
  try {
    if (window.sessionStorage.getItem(SESSION_MARKER) === "1") {
      sessionInitializedInMemory = true;
      return;
    }
  } catch { /* stockage de session bloqué : poursuivre sans marqueur, mais purger */ }
  if (!sessionInitialization) {
    sessionInitialization = (async () => {
      const db = await openDbRaw();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }).finally(() => db.close());
      sessionInitializedInMemory = true;
      try { window.sessionStorage.setItem(SESSION_MARKER, "1"); } catch { /* le marqueur mémoire protège cette instance */ }
    })().finally(() => { sessionInitialization = null; });
  }
  await sessionInitialization;
}

export async function addEcgRecord(rec: Omit<EcgRecord, "id">): Promise<void> {
  await ensureSessionHistory();
  const db = await openDbRaw();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).add({ ts: rec.ts, thumb: rec.thumb, analysis: rec.analysis });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
  // FIFO : supprimer les plus anciennes au-delà de MAX_ENTRIES
  const all = await listEcgRecords();
  const extra = all.length - MAX_ENTRIES;
  if (extra > 0) for (const r of all.slice(-extra)) if (r.id !== undefined) await deleteEcgRecord(r.id);
  db.close();
}

export async function listEcgRecords(): Promise<EcgRecord[]> {
  try {
    await ensureSessionHistory();
    const db = await openDbRaw();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).getAll();
      req.onsuccess = () => {
        const rawRecords = req.result as unknown[];
        const safeRecords: EcgRecord[] = [];
        for (const item of rawRecords) {
          if (!item || typeof item !== "object") continue;
          const candidate = item as Record<string, unknown>;
          const analysis = sanitizeEcgAnalysis(candidate.analysis);
          if (typeof candidate.id !== "number" || !Number.isFinite(candidate.id) ||
              typeof candidate.ts !== "number" || !Number.isFinite(candidate.ts) ||
              candidate.ts <= 0 || typeof candidate.thumb !== "string" || candidate.thumb.length > 1_000_000 ||
              !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(candidate.thumb) || !analysis) continue;
          safeRecords.push({ id: candidate.id, ts: candidate.ts, thumb: candidate.thumb, analysis, raw: "" });
        }
        db.close();
        resolve(safeRecords.sort((a, b) => b.ts - a.ts)); // récent d'abord
      };
      req.onerror = () => { db.close(); resolve([]); };
    });
  } catch {
    return [];
  }
}

export async function deleteEcgRecord(id: number): Promise<void> {
  try {
    const db = await openDbRaw();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
    });
  } catch { /* silencieux */ }
}

export async function clearEcgRecords(): Promise<void> {
  try {
    const db = await openDbRaw();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
    });
  } catch { /* silencieux */ }
}

/** Compresse une image dataURL en miniature JPEG (dimension maximale 300 px). */
export function thumbnail(dataUrl: string, maxW = 300): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        if (!Number.isFinite(img.width) || img.width <= 0 || !Number.isFinite(img.height) || img.height <= 0) return resolve(null);
        const widthLimit = Math.max(1, Math.min(300, Math.floor(maxW)));
        const scale = Math.min(1, widthLimit / img.width, widthLimit / img.height);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        const ctx = c.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const result = c.toDataURL("image/jpeg", 0.6);
        resolve(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(result) ? result : null);
      } catch {
        resolve(null);
      }
    };
    // Ne jamais conserver l'image originale si la miniature échoue.
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/** Redimensionne une image pour l'envoi à l'IA (max 1280 px, JPEG q≈0.85) → base64 pur (sans préfixe). */
export function prepareForAi(dataUrl: string, maxW = 1280): Promise<{ b64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        if (!Number.isFinite(img.width) || img.width <= 0 || !Number.isFinite(img.height) || img.height <= 0) {
          return reject(new Error("invalid-image"));
        }
        const widthLimit = Math.max(1, Math.min(1280, Math.floor(maxW)));
        const scale = Math.min(1, widthLimit / img.width, widthLimit / img.height);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        const ctx = c.getContext("2d");
        if (!ctx) return reject(new Error("invalid-image"));
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const out = c.toDataURL("image/jpeg", 0.85);
        const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(out);
        if (!match?.[1]) return reject(new Error("invalid-image"));
        resolve({ b64: match[1], mime: "image/jpeg" });
      } catch {
        reject(new Error("invalid-image"));
      }
    };
    // Ne jamais transmettre les octets originaux en cas d'échec de décodage/redimensionnement.
    img.onerror = () => reject(new Error("invalid-image"));
    img.src = dataUrl;
  });
}
