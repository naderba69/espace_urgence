// v17.2 — الفئات وحدها في وحدة مستقلة.
//
// كانت `protocolCategories` تعيش داخل `data/protocols.ts` (البرميل الذي يجمع 98 بروتوكولاً،
// نحو 500 كيلوبايت). أي مكوّن طرفي يريد اسم فئة واحدة كان يجرّ معه القاعدة كاملة.
// فصلها في ملف مستقل يجعل الاستيراد خفيفًا فعلاً، مع إبقاء مصدر واحد للحقيقة
// (`data/protocols.ts` يعيد التصدير للتوافق).
//
// Les catégories de protocoles isolées : un composant qui n'a besoin que d'un libellé
// de catégorie n'embarque plus les 98 protocoles. `data/protocols.ts` les ré-exporte.
import type { Localized } from "./types";

export interface ProtocolCategory {
  id: string;
  label: Localized;
}

export const protocolCategories: ProtocolCategory[] = [
  { id: "reanimation", label: { fr: "Réanimation", ar: "الإنعاش" } },
  { id: "medecine", label: { fr: "Urgences médicales", ar: "استعجالات طبية" } },
  { id: "traumatologie", label: { fr: "Traumatologie", ar: "الإصابات والجروح" } },
  { id: "pediatrie", label: { fr: "Pédiatrie", ar: "طب الأطفال" } },
  { id: "obstetrique", label: { fr: "Obstétrique", ar: "التوليد" } },
  { id: "psychiatrie", label: { fr: "Urgences psychiatriques", ar: "الطب النفسي" } },
  { id: "toxicologie", label: { fr: "Toxicologie", ar: "السموم" } },
];
