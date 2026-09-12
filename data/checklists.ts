// Check-lists opérationnelles — matériel SMUR / transport / accueil SAUV.
// Tout élément porte ses sources + date de revue (convention du projet).
import type { Localized } from "@/data/types";

export interface ChecklistGroup {
  title: Localized;
  items: Localized[];
}

export interface Checklist {
  id: string;
  title: Localized;
  description: Localized;
  icon: string;
  groups: ChecklistGroup[];
  source: string;
  lastReviewed: string;
}

const L = (fr: string, ar: string): Localized => ({ fr, ar });

export const CHECKLISTS: Checklist[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Transport sanitaire inter-hospitalier — avant le départ (SFAR 2019 / HAS)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "transport-interhosp",
    title: L("Transport inter-hospitalier — avant le départ", "النقل بين المستشفيات — قبل الانطلاق"),
    description: L(
      "Check-list minutes avant départ : patient, matériel, médicaments, organisation. Un item manquant = risque pendant le transport.",
      "قائمة التدقيق قبل الانطلاق بقليل: المريض، التجهيز، الأدوية، التنظيم. بند ناقص = خطر أثناء النقل."
    ),
    icon: "Truck",
    groups: [
      {
        title: L("🧍 Patient", "🧍 المريض"),
        items: [
          L("Bilan complet fait + imagerie et biologie emportées (CD/copies)", "تم الفحص الكامل + حمل الصور والتحاليل (نسخ)"),
          L("État stabilisé : PAS > 90, SpO₂ ≥ 94 % sans effort, douleur ≤ 3/10", "حالة مستقرة: انقباضي >90، تشبع ≥94% دون جهد، ألم ≤3/10"),
          L("Voie veineuse périphérique fonctionnelle (± 2ᵉ si risque)", "خط وريدي طرفي عامل (± ثانٍ إذا خطورة)"),
          L("Analgésie / sédation adaptée et réévaluée juste avant", "تسكين/تهدئة مضبوطة وأعيد تقييمها قبل الانطلاق"),
          L("Sonde gastrique si risque de vomissement ; sonde vésicale si surveillance de diurèse", "أنبوب معدي إذا خطر قيء؛ قسطرة بولية إذا مراقبة التحبور"),
          L("Immobilisation vérifiée : collier, attelles, matelas coquille si trauma", "التحقيق من التثبيت: طوق، حاضنات، حوض صدف إذا رضوح"),
        ],
      },
      {
        title: L("🧰 Matériel", "🧰 التجهيز"),
        items: [
          L("O₂ : autonomie ≥ (durée × 1,5) avec marge ; détendeur + débitmètre fonctionnels", "أكسجين: استقلالية ≥ (المدة ×1.5) بهامش؛ منظّم ومقياس جريان عاملان"),
          L("BAVU + masques toutes tailles + canules oropharyngées", "بالون تهوية + أقنعة كل المقاسات + قنيات بلعومية"),
          L("Aspirateur de mucosités chargé et testé", "شفاط إفرازات مشحون ومجرَّب"),
          L("Scope / SpO₂ / PA automatique (± capnographe si patient intubé)", "مراقب/تشبع/ضغط آلي (± قياس CO₂ إذا أنبوب)"),
          L("PSE : drogues programmées, alarmes visibles, piles de secours", "مضخات: أدوية مبرمجة، إنذارات ظاهرة، بطاريات احتياط"),
          L("DSA accessible si rythme à risque ; couverture thermique", "مزيل رجفان متاح إذا إيقاع خاطر؛ غطاء حراري"),
        ],
      },
      {
        title: L("💊 Médicaments", "💊 الأدوية"),
        items: [
          L("Kit d'urgence complet : adrénaline, atropine, salbutamol, midazolam, glucose 30 %", "طقم طوارئ كامل: أدرينالين، أتروبين، سالبوتامول، ميدازولام، غلوكوز 30%"),
          L("Sédation-analgésie + antidotes du contexte (NAL, flumazénil, vit. K si AVK…)", "تهدئة-تسكين + ترياقات السياق (نالوكسون، فلومازينيل، فيتامين K إذا مضادات فيتامين K…)"),
          L("Dates de péremption vérifiées (contrôle mensuel daté)", "تحقّق تواريخ الصلاحية (مراقبة شهرية موؤرخة)"),
        ],
      },
      {
        title: L("📞 Organisation", "📞 التنظيم"),
        items: [
          L("Régulation SAMU 190 informée : niveau de soins, accord du transfert", "إبلاغ تنظيم SAMU 190: مستوى العناية، موافقة النقل"),
          L("Service receveur prévenu : lit, spécialité, heure d'arrivée estimée", "إخطار المستقبل: سرير، تخصص، ساعة وصول متوقعة"),
          L("Dossier transmis : compte rendu, consentement (si), traçabilité des produits", "إرسال الملف: تقرير، موافقة (إن وجدت)، تتبع المنتجات"),
          L("Équipe conforme au niveau de soins requis (médecin si instable)", "فريق مطابق لمستوى العناية (طبيب إذا عدم استقرار)"),
        ],
      },
    ],
    source: "Check-list transport SFAR 2019 ; HAS « Sortie du patient » ; RE.NAU régulation",
    lastReviewed: "2026-09",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Sac / malle d'urgence — contenu minimal (SFMU / RE.NAU)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "malle-urgence",
    title: L("Sac / malle d'urgence — contenu minimal", "حافظة الطوارئ — المحتوى الأدنى"),
    description: L(
      "Contrôle mensuel daté obligatoire, responsable identifié. Toute malle incomplète = risque vital en intervention.",
      "مراقبة شهرية مؤرخة إلزامية بمسؤول معيَّن. حافظة ناقصة = خطر حيوي أثناء التدخل."
    ),
    icon: "BriefcaseMedical",
    groups: [
      {
        title: L("🫁 Voies aériennes / ventilation", "🫁 المسلك الهوائي / التهوية"),
        items: [
          L("O₂ bouteille pleine + détendeur + débitmètre ; BAVU adulte/enfant + masques S-M-L", "زجاجة أكسجين ممتلئة + منظّم + مقياس جريان؛ بالون تهوية كهل/طفل + أقنعة S-M-L"),
          L("Canules oropharyngées G3–G6 ; sondes d'intubation 6–7–8 + guide", "قنيات بلعومية G3–G6؛ أنابيب تنبيب 6–7–8 + دليل"),
          L("Laryngoscope : 2 lames + piles neuves testées ; pince de Magill", "منظار الحنجرة: شفيران + بطاريات جديدة مجرَّبة؛ ملقط Magill"),
          L("Masque laryngé (2 tailles) ; canules de trachéotomie + matériel de crise", "قناع حنجري (مقاسان)؛ قنيات فغر + معدات الأزمة"),
        ],
      },
      {
        title: L("🩸 Circulation / perfusion", "🩸 الدوران / التسريب"),
        items: [
          L("Cathlons 16–20 G (×2 chacun) + robinets 3 voies + prolongateurs", "قثاطر 16–20G (×2 لكل) + محابس 3 اتجاهات + ممتدات"),
          L("NaCl 0,9 % et Ringer lactate (≥ 4 poches) ; perfuseurs transfuseurs", "محلول ملحي 0.9% ورينغر لاكتات (≥4 أكياس)؛ عُدّ نقل دم"),
          L("Garrot veineux + garrot tourniquet (hémorragie) ; compresses + antiseptique + gants", "رباط وريدي + عصبة (نزف)؛ ضمادات + مطهر + قفازات"),
        ],
      },
      {
        title: L("📊 Surveillance / diagnostic", "📊 المراقبة / التشخيص"),
        items: [
          L("Scope-défibrillateur chargé + électrodes de rechange ; brassards PA complets", "مراقب-مزيل رجفان مشحون + أقطاب احتياط؛ أكمام ضغط كاملة"),
          L("Oxymètre de pouls de rechange ; thermomètre ; torche", "مقياس تشبع احتياطي؛ ميزان حرارة؛ مصباح"),
          L("Glucomètre + bandelettes + glucose 30 % + glucagon", "مقياس سكر + شرائط + غلوكوز 30% + غلوكاغون"),
        ],
      },
      {
        title: L("🦴 Immobilisation / trauma", "🦴 التثبيت / الرضوح"),
        items: [
          L("Colliers cervicaux (2 tailles) + attelles modelables + matelas coquille", "أطواق عنقية (مقاسان) + حاضنات قابلة للتشكيل + حوض صدف"),
          L("Couverture de survie + draps brûlés + sérum physiologique d'irrigation", "غطاء إنقاذ + أقمشة الحروق + محلول ملحي للغسل"),
          L("Bandes, filets, pansements hémostatiques d'urgence", "رباطات، شبكات، ضمادات جازية للطوارئ"),
        ],
      },
      {
        title: L("💉 Drogues prêtes à l'emploi", "💉 أدوية جاهزة للاستعمال"),
        items: [
          L("Adrénaline (1 mg/10 mL ET 1 mg/mL), atropine, salbutamol, midazolam", "أدرينالين (1ملغ/10مل و1ملغ/مل)، أتروبين، سالبوتامول، ميدازولام"),
          L("Trinitrine, furosémide, N-acétylcystéine, phénobarbital/valproate selon kit local", "ترينترين، فوروسيميد، أسيتيل سيستئين، فينوباربيتال/فالبروات حسب الطقم المحلي"),
          L("Liste du contenu collée sur le couvercle + contrôle mensuel signé et daté", "قائمة المحتوى ملصقة على الغطاء + مراقبة شهرية موقعة ومؤرخة"),
        ],
      },
    ],
    source: "SFMU — matériel SMUR minimum ; RE.NAU Livret du médicament (Mars 2018)",
    lastReviewed: "2026-09",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Accueil SAUV / déchoquage — check d'installation (< 5 min)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "sauv-accueil",
    title: L("Accueil SAUV / déchoquage — installation", "استقبال قاعة الإنعاش — التجهيز"),
    description: L(
      "Les 5 premières minutes décident : tout doit être branché, testé et prêt AVANT l'arrivée du patient.",
      "الخمس دقائق الأولى حاسمة: كل شيء موصول ومجرَّب وجاهز قبل وصول المريض."
    ),
    icon: "ActivitySquare",
    groups: [
      {
        title: L("🏥 Environnement", "🏥 البيئة"),
        items: [
          L("Plan dur ; moniteur multiparamétrique branché, alarmes réglées", "سرير صلب؛ مراقب متعدد المعايير موصول، إنذارات مضبوطة"),
          L("Aspiration branchée + sondes + canules de Yankauer", "شفاط موصول + أنابيب + قنيات Yankauer"),
          L("O₂ mural/bouteille + débitmètres ; DSA accessible + électrodes + gel", "أكسجين جداري/زجاجة + مقاييس جريان؛ مزيل رجفان في المتناول + أقطاب + جل"),
        ],
      },
      {
        title: L("🧍 Patient dès l'arrivée", "🧍 المريض فور الوصول"),
        items: [
          L("VVP ×2 (18–20 G) + prélèvements : NFS, iono, coag, groupe, lactates, troponine selon motif", "خطان وريديان (18–20G) + سحب: صورة دم، أملاح، تخثر، زمرة، لاكتات، تروبونين حسب السبب"),
          L("ECG 12 dérivations < 10 min si douleur thoracique / syncope / dyspnée", "تخطيط 12 اشتقاق خلال <10 د إذا ألم صدري / إغماء / ضيق تنفس"),
          L("Scope + SpO₂ + PA automatique ; couverture thermique (hypothermie = risque)", "مراقبة + تشبع + ضغط آلي؛ غطاء حراري (انخفاض الحرارة = خطر)"),
          L("Sonde vésicale si surveillance de diurèse ; horodatage de l'arrivée", "قسطرة بولية إذا مراقبة التحبور؛ توقيت وصول المريض"),
        ],
      },
      {
        title: L("💊 Médicaments prêts", "💊 أدوية جاهزة"),
        items: [
          L("Drogues d'urgence reconstituées selon motif (adrénaline 1 mg/10 mL diluée)", "أدوية طوارئ معاد تحضيرها حسب السبب (أدرينالين 1ملغ/10مل مخففة)"),
          L("PSE montées et étiquetées (nom, concentration, débit)", "مضخات مثبتة ومعنونة (الاسم، التركيز، الجريان)"),
          L("Antidotes accessibles selon contexte (NAL, vit. K, NAC…)", "ترياقات في المتناول حسب السياق (نالوكسون، فيتامين K، أسيتيل سيستئين…)"),
        ],
      },
      {
        title: L("📋 Documentation", "📋 التوثيق"),
        items: [
          L("Triage identifié (P1/P2/P3) affiché au lit", "الفرز محدَّد (P1/P2/P3) معروض عند السرير"),
          L("Antécédents + traitements chroniques notés ; régulation SAMU informée si SMUR", "السوابق + العلاجات المزمنة مسجلة؛ إبلاغ تنظيم SAMU إذا SMUR"),
        ],
      },
    ],
    source: "HAS organisation SU ; SFMU triage 2013 ; ERC 2021 (chaine de survie)",
    lastReviewed: "2026-09",
  },
];

export function getChecklist(id: string): Checklist | undefined {
  return CHECKLISTS.find((c) => c.id === id);
}
