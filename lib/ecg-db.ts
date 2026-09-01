// IndexedDB pour l'historique IA des ECG (images → trop grosses pour les 5 Mo de localStorage).
// Miniatures JPEG ≤300 px, max 30 entrées, éviction FIFO.

const DB_NAME = "eutn-db";
const STORE = "ecg-analyses";
const MAX_ENTRIES = 30;

export interface EcgRecord {
  id?: number;
  ts: number;              // epoch ms
  thumb: string;           // dataURL JPEG miniature
  analysis: EcgAnalysis;   // structuré (parsing libéré du texte brut)
  raw: string;             // réponse brute de l'IA
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

function openDb(): Promise<IDBDatabase> {
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

export async function addEcgRecord(rec: Omit<EcgRecord, "id">): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(rec);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  // FIFO : supprimer les plus anciennes au-delà de MAX_ENTRIES
  const all = await listEcgRecords();
  const extra = all.length - MAX_ENTRIES;
  if (extra > 0) for (const r of all.slice(-extra)) r.id !== undefined && (await deleteEcgRecord(r.id));
  db.close();
}

export async function listEcgRecords(): Promise<EcgRecord[]> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result as EcgRecord[]).sort((a, b) => b.ts - a.ts)); // récent d'abord
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteEcgRecord(id: number): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
    });
  } catch { /* silencieux */ }
}

export async function clearEcgRecords(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
    });
  } catch { /* silencieux */ }
}

/** Compresse une image dataURL en miniature JPEG (max 300 px de large). */
export function thumbnail(dataUrl: string, maxW = 300): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Redimensionne une image pour l'envoi à l'IA (max 1280 px, JPEG q≈0.85) → base64 pur (sans préfixe). */
export function prepareForAi(dataUrl: string, maxW = 1280): Promise<{ b64: string; mime: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      const out = c.toDataURL("image/jpeg", 0.85);
      resolve({ b64: out.split(",")[1], mime: "image/jpeg" });
    };
    img.onerror = () => resolve({ b64: dataUrl.split(",")[1] ?? dataUrl, mime: "image/jpeg" });
    img.src = dataUrl;
  });
}
