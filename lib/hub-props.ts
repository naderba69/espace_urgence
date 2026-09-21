// v17.2 — تحضير خصائص صفحة التخصص على الخادم (وقت البناء).
//
// صفحات التخصص (طب الأطفال، التوليد، الإصابات، الطب النفسي…) كانت تستورد قاعدتي
// البروتوكولات والأدوية كاملتين لتعرض عنوانين أو ثلاثة. صار الحل على الخادم.
//
// Les pages de spécialité ne téléchargent plus les bases : la page serveur résout les
// titres liés et les passe en props (voir app/pediatrie/page.tsx & co).
import type { Localized, Medication, Protocol } from "@/data/types";
import { protocols } from "@/data/protocols";
import { getMedication } from "@/data/medications";

export function hubProps(protocolIds: string[], medicationIds: string[] = []) {
  const linkedProtos = protocolIds
    .map((id) => protocols.find((p) => p.id === id))
    .filter((p): p is Protocol => Boolean(p))
    .map((p) => ({ id: p.id, title: p.title as Localized }));
  const linkedMeds = medicationIds
    .map((id) => getMedication(id))
    .filter((m): m is Medication => Boolean(m))
    .map((m) => ({ id: m.id, name: m.name as Localized }));
  return { linkedProtos, linkedMeds };
}
