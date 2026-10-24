# جرد الإسناد المرجعي الشامل — 2026-10-24

> **حدود:** هذا جرد آلي شامل لحقول الإسناد على مستوى السجل، وليس اعتماداً سريرياً أو مطابقة جرعة بجرعة. اسم المصدر أو تاريخ المراجعة لا يثبت أن كل عبارة/رقم مدعوم به. لم يُجرِ البرنامج فتح كل دراسة أو RCP أو مقارنة كل جملة بمصدرها.

## خلاصة التغطية المرجعية المستخرجة

- السجلات/المدخلات المفهرسة: **750**.
- **335** سجلًا فيها حقلا مصدر وتاريخ مراجعة معلنَان في metadata؛ هذا لا يثبت الاطلاع على الوثيقة أو مقابلة كل ادعاء.
- **50** سجل فرز/تسريب فيه اسم مصدر مختصر فقط، بلا تاريخ أو صفحة على مستوى السجل.
- **93** صفًا للمضادات يشير إلى صفحة في PDF مشترك؛ RCP/GPR/ePOPI ليس مربوطًا بكل جرعة/خلية.
- لفحص الأعداد: `npm run audit:reference-inventory:check`; لإعادة توليد هذا التقرير: `node scripts/audit-source-inventory.mjs > docs/REFERENCE-INVENTORY-2026-10-24.md`.
- التوليد الآلي لا يقرأ أو يثبت النص السريري ولا يراجع الترجمات؛ وظيفة الأداة جرد المصادر والمواضع فقط.
- **272** مدخلًا بلا إحالة أولية على مستوى السجل.
- **636** ذكرًا خامًا للمصادر و**491** تسمية مصدر فريدة؛ منها **11** فقط لها URL في metadata (بعضها رابط موقع عام لا للوثيقة).
- مخطط `ReviewMeta` يحفظ أسماء مصادر كنصوص وتاريخ `AAAA-MM` فقط؛ لا يفرض DOI، الإصدار الكامل، الصفحة/الجدول، النص الداعم، تاريخ الاطلاع، أو اسم المراجع.

## تغطية مجموعات البيانات

| المجموعة | العدد المتوقع | السجلات المفهرسة | حالة الإسناد |
|---|---:|---:|---|
| protocols | 98 | 98 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| medications | 73 | 73 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| calculators | 131 | 131 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| procedures | 10 | 10 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| trees | 9 | 9 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| ecg | 11 | 11 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| checklists | 3 | 3 | حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً |
| triage | 22 | 22 | اسم مصدر عام؛ لا تاريخ/صفحة/نسخة على مستوى السجل |
| perfusions | 28 | 28 | اسم مصدر عام؛ لا تاريخ/صفحة/نسخة على مستوى السجل |
| atb-renal | 93 | 93 | PDF + رقم الصفحة؛ المرجع الأولي الدقيق لكل جرعة غير مربوط |
| guidage | 41 | 41 | لا يوجد مصدر على مستوى السجل |
| quiz | 42 | 42 | لا يوجد مصدر على مستوى السجل |
| reval | 98 | 98 | لا يوجد مصدر على مستوى السجل |
| med-tools | 15 | 15 | لا يوجد مصدر على مستوى السجل |
| protocol-categories | 8 | 8 | لا يوجد مصدر على مستوى السجل |
| abbreviations | 47 | 47 | لا يوجد مصدر على مستوى السجل |
| motifs | 6 | 6 | لا يوجد مصدر على مستوى السجل |
| quickref-vitalSigns | 4 | 4 | لا مصدر أولي/تاريخ تحقق لكل سطر |
| quickref-emergencyNumbers | 5 | 5 | لا مصدر أولي/تاريخ تحقق لكل سطر |
| glasgow | 6 | 6 | لا يوجد مصدر على مستوى السجل |

## سجل جميع تسميات المصادر الفريدة كما وردت

| التسمية كما في البيانات | عدد مرات الاستشهاد | المجموعات | السجلات المرتبطة | URL المسجل |
|---|---:|---|---|---|
| AACT/EAPCCT position statement | 1 | protocols | protocols/intoxication-tricycliques | — |
| AANS/CNS 2013 | 1 | protocols | protocols/traumatisme-medullaire | — |
| AAO acute angle closure | 1 | protocols | protocols/glaucome-aigu | — |
| AAO glaucome | 1 | medications | medications/mannitol | — |
| AAO glaucome aigu | 1 | medications | medications/acetazolamide | — |
| AAO-HNS 2020 | 1 | calculators | calculators/raaf | — |
| AAP 2014 | 1 | protocols | protocols/bronchiolite | — |
| AAP febrile seizures | 1 | protocols | protocols/convulsion-febrile | — |
| AAP gastro-entérite 2014 | 1 | medications | medications/ondansetron | — |
| AAP/SFP ; RE.NAU péd. | 1 | triage | triage/enfant-febrile | — |
| ABA / PHTLS brûlure | 1 | protocols | protocols/brulure-grave | — |
| ABA 2018 | 1 | calculators | calculators/brulures-a | — |
| ABA 2023 ; Monash/SRLF | 1 | triage | triage/brulure-grave | — |
| ACC/AHA | 1 | medications | medications/morphine | — |
| ACC/AHA STEMI | 1 | medications | medications/aspirine | — |
| ACC/AHA STEMI 2023+ | 1 | protocols | protocols/sca-stemi | — |
| ACC/AHA VTE | 1 | medications | medications/heparine | — |
| ACCP Antithrombotic Guidelines | 1 | calculators | calculators/enoxaparine | — |
| ACEP 2018 | 1 | calculators | calculators/perc | — |
| ACEP 2021 agitation | 1 | calculators | calculators/agitation | — |
| ACEP alcohol intoxication | 1 | protocols | protocols/intoxication-alcool-aigue | — |
| ACEP POCUS | 1 | calculators | calculators/pocus | — |
| ACG 2024 | 1 | calculators | calculators/bisap | — |
| ACG lower GI bleeding 2016 | 1 | protocols | protocols/hemorragie-digestive-basse | — |
| ACG pancreatitis 2024 | 1 | protocols | protocols/pancreatite-aigue | — |
| ACG upper GI bleeding | 1 | protocols | protocols/hemorragie-digestive-haute | — |
| ACMT lipid emulsion 2017 | 1 | medications | medications/emulsion-lipidique | — |
| ACMT/AACT expert consensus 2017 | 1 | protocols | protocols/intoxication-bb-icc | — |
| ACOG/ISSHP pré-éclampsie | 1 | protocols | protocols/hypertension-gravidique | — |
| ADA / SFE ; SFAR | 1 | triage | triage/hypoglycemie | — |
| ADA 2023 | 1 | calculators | calculators/hypoglycemie | — |
| ADA 2026 | 1 | protocols | protocols/hypoglycemie | — |
| ADA Standards of Care | 1 | medications | medications/glucagon | — |
| ADA Standards of Care 2025 | 1 | calculators | calculators/insuline | — |
| ADA/EASD consensus 2024 | 1 | protocols | protocols/hhs-hyperosmolaire | — |
| ADA/EASD consensus DKA | 1 | medications | medications/insuline-rapide | — |
| ADA/EASD consensus DKA 2024 | 1 | protocols | protocols/acidocetose-diabetique | — |
| Adrogué-Madias (correction Na) | 1 | calculators | calculators/sodium | — |
| AES 2016 (Glauser) | 1 | calculators | calculators/etat-mal | — |
| AES status epilepticus 2016 | 1 | medications | medications/phenobarbital | — |
| AES/ILAE status epilepticus | 1 | medications | medications/midazolam | — |
| AFU | 1 | protocols | protocols/colique-nephretique | — |
| AFU RAU | 1 | protocols | protocols/retention-aigue-urine | — |
| AHA 2008 cocaine chest pain | 1 | calculators | calculators/cocaine | — |
| AHA 2023 | 3 | medications, protocols | medications/bicarbonate, medications/gluconate-calcium, protocols/hyperkaliemie | — |
| AHA 2023 man. spéciales intoxications | 1 | medications | medications/naloxone | — |
| AHA 2025 | 5 | ecg, medications, protocols | ecg/tachycardie-sinusale, ecg/torsades, medications/propofol, protocols/hta-urgence, protocols/hypothermie | — |
| AHA 2025 — Adult Cardiac Arrest Algorithm | 1 | trees | trees/acr | https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines |
| AHA 2025 Bradycardia algorithm | 1 | protocols | protocols/bradycardie | — |
| AHA 2025 post-ACR | 1 | medications | medications/phenylephrine | — |
| AHA 2025 Tachycardia algorithm | 1 | protocols | protocols/tachycardie | — |
| AHA 2025 Tachycardie | 1 | medications | medications/esmolol | — |
| AHA ACLS | 1 | medications | medications/isoprenaline | — |
| AHA ACLS 2020 ; ERC 2021 | 1 | perfusions | perfusions/adrenaline | — |
| AHA ACLS 2025 | 10 | calculators, ecg, medications | calculators/chrono-rcp, calculators/rcp-equipe, ecg/asystolie, ecg/fv, ecg/tv-sans-pouls, medications/adrenaline, medications/amiodarone, medications/atropine, medications/lidocaine, medications/sulfate-magnesium | — |
| AHA ACLS 2025 — tachycardies | 1 | medications | medications/adenosine | — |
| AHA ACLS bradycardie 2025 | 1 | ecg | ecg/bradycardie-sinusale | — |
| AHA ACLS Guidelines 2025 | 1 | protocols | protocols/acr-adulte | — |
| AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376 | 1 | procedures | procedures/synchronized-cardioversion | — |
| AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376 (IV/IO in cardiac arrest) | 1 | procedures | procedures/intra-osseuse | — |
| AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376; Adult Cardiac Arrest Algorithm 2025 | 1 | procedures | procedures/defibrillation | — |
| AHA arrhythmias électriques | 1 | protocols | protocols/electrocution | — |
| AHA BLS 2025 | 1 | protocols | protocols/corps-etranger-aerien | — |
| AHA bradycardies | 1 | ecg | ecg/bav3 | — |
| AHA ECG basics | 1 | ecg | ecg/rythme-sinusal | — |
| AHA Electrical Cardioversion Algorithm 2025 | 1 | procedures | procedures/synchronized-cardioversion | — |
| AHA FOAM tox | 1 | medications | medications/glucose30 | — |
| AHA Heat stroke | 1 | protocols | protocols/coup-de-chaleur | — |
| AHA hyperK | 1 | medications | medications/insuline-rapide | — |
| AHA insuffisance cardiaque aiguë | 1 | medications | medications/trinitrine | — |
| AHA PALS 2020 | 6 | calculators, medications, protocols | calculators/dose-anaphylaxie, calculators/dose-poids, calculators/poids-pediatrique, medications/amiodarone, medications/atropine, protocols/acr-pediatrique | — |
| AHA scientific statement | 1 | protocols | protocols/myocardite | — |
| AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 | 1 | procedures | procedures/accouchement-inopine | — |
| AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (newborn-specific guidance) | 1 | procedures | procedures/masque-larynge | — |
| AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (sections ventilation, oxygen, compressions, vascular access, epinephrine) | 1 | procedures | procedures/neonat-ran | — |
| AHA/AAP PALS 2025, DOI 10.1161/CIR.0000000000001368; ERC PLS 2025, DOI 10.1016/j.resuscitation.2025.110767 | 1 | procedures | procedures/defibrillation | — |
| AHA/ACC 2022 | 1 | protocols | protocols/dissection-aortique | — |
| AHA/ACC AF 2023 | 1 | ecg | ecg/fibrillation-auriculaire | — |
| AHA/ACC hypertension d'urgence | 1 | medications | medications/nicardipine | — |
| AHA/ACC NSTE-ACS 2025 | 1 | calculators | calculators/stemi | — |
| AHA/ASA 2019 | 1 | calculators | calculators/thrombolyse | — |
| AHA/ASA 2019 (mise à jour 2023) | 1 | protocols | protocols/avc | — |
| AHA/ASA HSA 2023 | 2 | medications, protocols | medications/nimodipine, protocols/hemorragie-sous-arachnoidienne | — |
| AHA/ASA stroke | 1 | medications | medications/alteplase | — |
| Ahmad et al., WJES 2025, DOI 10.1186/s13017-025-00613-7 (hétérogénéité site/longueur ; ne fixe pas de technique locale) | 1 | protocols | protocols/pneumothorax-suffocant | — |
| Ahmad et al., WJES 2025, méta-analyse longueur/site, DOI 10.1186/s13017-025-00613-7 | 1 | procedures | procedures/exsufflation | — |
| Alvarado 1986 | 1 | calculators | calculators/alvarado | — |
| ANSM (France) — RCP AMIKACINE PANPHARMA 250 mg/mL, mise à jour 30/07/2024, §§4.2–4.4 et 6.2–6.4 (schéma différent, plafond produit 1,5 g/j) | 1 | medications | medications/amikacine | — |
| ANSM (France) — RCP AMIKACINE VIATRIS 250 mg, mise à jour 27/05/2024, §§4.2–4.6 (15–30 mg/kg/j, poids corrigé, surveillance) | 1 | medications | medications/amikacine | — |
| ANSM (France) — RCP Céfotaxime Panpharma 1 g, mise à jour 12/04/2024, §§4.1–4.8 et 6.2–6.4 | 1 | medications | medications/cefotaxime | — |
| ANSM (France) — RCP DOBUTAMINE PANPHARMA 250 mg/20 mL, mise à jour 18/03/2022, §§4.1–4.4 et 6.2–6.6 (référence française ; ne vaut pas validation tunisienne) | 1 | medications | medications/dobutamine | — |
| ANSM (France) — RCP DOBUTAMINE PANPHARMA, mise à jour 18/03/2022, §§4.1–4.4 et 6.6 ; SSC 2026 (indication septique adulte) | 1 | perfusions | perfusions/dobutamine | — |
| ANSM (France) — RCP PHENYLEPHRINE RENAUDIN 100 µg/mL, mise à jour 23/08/2024, §§4.1–4.4 ; SSC 2026 (noradrénaline 1re ligne en choc septique adulte) | 1 | perfusions | perfusions/phenylephrine | — |
| ANSM interactions | 1 | calculators | calculators/interactions | — |
| ANSM LASA | 1 | calculators | calculators/jumeaux | — |
| Antidote registry Tunisia | 1 | protocols | protocols/intoxication-digoxine | — |
| Antman 2000 (TIMI 11B) | 1 | calculators | calculators/timi-nstem | — |
| APLS 2020 | 1 | calculators | calculators/fluids-enfant | — |
| ARDSnet | 1 | calculators | calculators/gazometrie | — |
| ARDSnet (Vt 6–8 mL/kg PIT) | 1 | calculators | calculators/ventilateur | — |
| ASA vasopresseurs | 1 | medications | medications/phenylephrine | — |
| ASAM 2020 | 5 | calculators, medications | calculators/ciwa-ar, calculators/sevrage-alcool, medications/haloperidol, medications/phenobarbital, medications/thiamine | — |
| ASAM alcohol withdrawal 2020 | 1 | protocols | protocols/sevrage-alcoolique | — |
| ASH sickle cell 2020 | 1 | protocols | protocols/drepanocytose-crise | — |
| ASH VTE | 1 | medications | medications/enoxaparine | — |
| ASHP/IDSA vancomycine 2020 | 1 | medications | medications/vancomycine | — |
| ASRA LAST 2020 | 1 | medications | medications/emulsion-lipidique | — |
| ATA 2014 | 1 | calculators | calculators/thyroide | — |
| ATA 2016 | 2 | calculators, medications | calculators/burch-wartofsky, medications/propranolol | — |
| ATA thyréotoxicose 2016 | 2 | medications, protocols | medications/propylthiouracil, protocols/crise-thyrotoxique | — |
| ATLS | 1 | calculators | calculators/guidage | — |
| ATLS ; ILCOR | 1 | triage | triage/electrocution | — |
| ATLS 10 | 1 | medications | medications/succinylcholine | — |
| ATLS 10 ; BTF 4th ed | 1 | triage | triage/trauma-cranien | — |
| ATLS 10 ; RE.NAU Exacyl | 1 | triage | triage/hemorragie-externe | — |
| ATLS 10 ; SFAR | 1 | triage | triage/trouble-conscience | — |
| ATLS 10 ; Vittel | 1 | triage | triage/polytrauma | — |
| ATLS 10e | 3 | calculators, medications, protocols | calculators/mecanisme, medications/acide-tranexamique, protocols/traumatisme-cranien | — |
| ATLS 10e éd. | 7 | calculators, protocols | calculators/coma, calculators/gcs, protocols/amputation-crush, protocols/fast-echo, protocols/fracture-ouverte, protocols/pelvis-instable, protocols/thorax-penetrant | — |
| ATLS 10e édition (ACS) | 1 | protocols | protocols/polytraumatisme | — |
| ATLS 10ᵉ édition, ACS-COT | 1 | trees | trees/polytraumatisme | https://www.facs.org |
| ATLS 2018 | 1 | calculators | calculators/vitaux | — |
| ATLS crush syndrome | 1 | protocols | protocols/rhabdomyolyse | — |
| ATLS électrocution | 1 | protocols | protocols/electrocution | — |
| ATS-IDSA 2019 | 2 | medications | medications/amoxicilline, medications/azithromycine | — |
| AUA acute scrotum | 1 | protocols | protocols/torsade-testiculaire | — |
| BAP NICE | 1 | protocols | protocols/agitation-aigue | — |
| Berlin 2012 | 1 | calculators | calculators/gaz-advanced | — |
| BNF / RCP | 2 | calculators | calculators/antipsychotiques, calculators/monitoring | — |
| BOA/BAPRAS guidelines 2020 | 1 | protocols | protocols/fracture-ouverte | — |
| Bologna guidelines | 1 | protocols | protocols/occlusion-intestinale | — |
| Brain Trauma Foundation | 1 | medications | medications/mannitol | — |
| Brain Trauma Foundation 4e | 1 | protocols | protocols/traumatisme-cranien | — |
| Broselow clinical-database 2026 | 1 | calculators | calculators/rcp-peds | — |
| Broselow-Luten / PALS | 1 | calculators | calculators/broselow | — |
| BSPED 2018 | 1 | calculators | calculators/dka-h1 | — |
| BSPED pédia | 1 | protocols | protocols/acidocetose-diabetique | — |
| BTS 2019 (CURB-65) | 1 | calculators | calculators/pac | — |
| BTS CAP 2023 | 1 | protocols | protocols/pneumonie-aigue | — |
| BTS Community Pneumonia | 1 | calculators | calculators/curb65 | — |
| BTS/SIGN | 2 | medications, protocols | medications/salbutamol, protocols/exacerbation-bpco | — |
| BTS/SIGN 2024 | 1 | protocols | protocols/asthme-aigu-grave | — |
| Burch & Wartofsky 1993 | 1 | calculators | calculators/burch-wartofsky | — |
| Burch-Wartofsky 1993 | 1 | protocols | protocols/crise-thyrotoxique | — |
| CA-SFM/SPILF/SFPT 2025 v1.1 — amikacine 25–30 mg/kg en 30 min, dose unique journalière (adultes non obèses, sans insuffisance rénale/hépatique) | 1 | medications | medications/amikacine | — |
| CAP paracétamol | 2 | medications, protocols | medications/acetylcysteine, protocols/intoxication-paracetamol | — |
| CAP tox | 1 | medications | medications/flumazenil | — |
| CAP/SRLF tox | 1 | protocols | protocols/intoxication-organophosphores | — |
| CDC Intravascular Catheter Recommendations, sections 2.1, 3 and 5.1 | 1 | procedures | procedures/vvp | — |
| CDC/ACIP 2020 | 1 | calculators | calculators/tetanos | — |
| CEM/SFMC | 1 | protocols | protocols/syncope | — |
| Centre Anti Poison Tunis | 2 | protocols | protocols/ingestion-caustique, protocols/intoxication-methanol | — |
| Centre antipoison Tunis 71 335 500 | 2 | protocols | protocols/intoxication-medicamenteuse, protocols/piqre-scorpion | — |
| Check-list transport SFAR 2019 ; HAS « Sortie du patient » ; RE.NAU régulation | 1 | checklists | checklists/transport-interhosp | — |
| Cherniack | 1 | calculators | calculators/spirometrie | — |
| CHEST Antithrombotic 2012 | 1 | calculators | calculators/heparine | — |
| CIWA-Ar | 1 | calculators | calculators/sevrage-alcool | — |
| CIWA-Ar Sullivan 1989 | 1 | protocols | protocols/sevrage-alcoolique | — |
| CNGOF 2021 | 1 | calculators | calculators/eclampsie | — |
| CNGOF GEU | 1 | protocols | protocols/geu | — |
| CNPP Tunisie | 1 | protocols | protocols/intoxication-phosphure-aluminium | — |
| Cockcroft-Gault | 1 | calculators | calculators/renal-dose | — |
| Contenu interne | 1 | calculators | calculators/quiz | — |
| CRASH-2 | 1 | medications | medications/acide-tranexamique | — |
| Duke modifiés | 1 | protocols | protocols/endocardite-infectieuse | — |
| EAACI | 1 | protocols | protocols/anaphylaxie | — |
| EACTS | 1 | protocols | protocols/tamponnade | — |
| EAN status epilepticus | 1 | medications | medications/levetiracetam | — |
| EASL | 1 | protocols | protocols/angiocholite | — |
| EASL 2023 | 1 | calculators | calculators/bilan-hepatique | — |
| EAST guidelines 2022 | 1 | protocols | protocols/thorax-penetrant | — |
| EAU 2023 | 2 | calculators | calculators/colique, calculators/rau | — |
| EAU guidelines | 1 | protocols | protocols/retention-aigue-urine | — |
| EAU Guidelines on Urological Infections 2026, §§3.6–3.9 | 1 | protocols | protocols/pyelonephrite-aigue | — |
| EAU paediatric urology 2023 | 1 | protocols | protocols/torsade-testiculaire | — |
| EAU urolithiasis 2023 | 3 | medications, protocols | medications/ketoprofene, medications/tamsulosine, protocols/colique-nephretique | — |
| EBA Practice Guidelines 2019 | 1 | calculators | calculators/brulures | — |
| EFNS Wernicke 2010 | 1 | medications | medications/thiamine | — |
| EFNS/AHS 2021 | 1 | calculators | calculators/migraine | — |
| EHRA 2021 | 2 | calculators | calculators/anticoag, calculators/noac | — |
| EMA valproate 2018 | 1 | calculators | calculators/epilepsie-grossesse | — |
| Endocrine Society 2016 | 2 | medications, protocols | medications/dexamethasone, protocols/crise-surrenale | — |
| ENT-UK epistaxis 2020 | 1 | protocols | protocols/epistaxis | — |
| ERA/EAHyponatremia 2014 | 1 | calculators | calculators/sodium | — |
| ERC 2021 | 17 | calculators, ecg, medications, protocols | calculators/chrono-rcp, calculators/coma, calculators/guidage, calculators/hyperkalemie, calculators/opioides, calculators/rcp-equipe, ecg/fibrillation-auriculaire, ecg/fv, ecg/torsades, medications/adenosine, medications/adrenaline, medications/amiodarone, medications/noradrenaline, protocols/anaphylaxie, protocols/bradycardie, protocols/intoxication-co, protocols/tachycardie | — |
| ERC 2021 ; AHA 2025 | 1 | triage | triage/arret-cardio | — |
| ERC 2021 ; EAACI 2021 ; RE.NAU anaphylaxie | 1 | triage | triage/anaphylaxie | — |
| ERC 2021 choking | 1 | protocols | protocols/corps-etranger-aerien | — |
| ERC 2021 Drowning | 1 | protocols | protocols/noyade | — |
| ERC 2021 Hypothermia | 1 | protocols | protocols/hypothermie | — |
| ERC 2021 hypothermie | 1 | calculators | calculators/hypothermie | — |
| ERC 2021 nouveau-né | 1 | calculators | calculators/neonat-ran | — |
| ERC 2021 noyade | 1 | calculators | calculators/noyade | — |
| ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 | 2 | procedures | procedures/defibrillation, procedures/iot-rsi | — |
| ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 (scope: adult ALS) | 1 | procedures | procedures/masque-larynge | — |
| ERC airway | 1 | medications | medications/rocuronium | — |
| ERC airway 2021 | 1 | calculators | calculators/iot-rsi | — |
| ERC Guidelines 2021 | 1 | protocols | protocols/acr-adulte | — |
| ERC Guidelines 2021 — Adult Advanced Life Support | 1 | trees | trees/acr | https://www.erc.edu |
| ERC Guidelines 2021 — reconnaissance de l'arrêt cardiaque | 1 | trees | trees/triage-prehospitalier | https://www.erc.edu |
| ERC Newborn Resuscitation 2025, DOI 10.1016/j.resuscitation.2025.110766 | 1 | procedures | procedures/neonat-ran | — |
| ERC Paediatric Life Support 2021 | 1 | protocols | protocols/acr-pediatrique | — |
| ERC Trauma 2021 | 1 | protocols | protocols/polytraumatisme | — |
| ERC traumatologie | 1 | protocols | protocols/brulure-grave | — |
| ERC/ASCIA 2021 | 1 | calculators | calculators/anaphylaxie | — |
| ERS/ATS NIV | 1 | calculators | calculators/vni | — |
| ERSCI guidelines | 1 | protocols | protocols/traumatisme-medullaire | — |
| ESC 2019 EP | 1 | calculators | calculators/spesi | — |
| ESC 2019/2024 EP guidelines | 1 | protocols | protocols/embolie-pulmonaire | — |
| ESC 2021 ; RE.NAU OAP | 1 | triage | triage/oap | — |
| ESC 2022 | 2 | calculators | calculators/ecg-grid, calculators/qtc | — |
| ESC 2023 ACS ; ERC 2021 ; RE.NAU PEC SCA | 1 | triage | triage/douleur-thoracique | — |
| ESC 2024 | 1 | medications | medications/nicardipine | — |
| ESC AF 2024 | 1 | protocols | protocols/fa-nouvelle | — |
| ESC aorte 2022 | 1 | protocols | protocols/dissection-aortique | — |
| ESC arythmie | 1 | medications | medications/esmolol | — |
| ESC endocarditis 2023 | 2 | medications, protocols | medications/gentamicine, protocols/endocardite-infectieuse | — |
| ESC EP 2019 | 2 | calculators, medications | calculators/wells-ep, medications/alteplase | — |
| ESC FA 2020 | 1 | calculators | calculators/has-bled | — |
| ESC Guidelines 2023 — Acute Coronary Syndromes | 1 | trees | trees/douleur-thoracique | https://www.escardio.org |
| ESC IC aiguë 2021 | 1 | medications | medications/furosemide | — |
| ESC insuffisance cardiaque aiguë 2021 | 1 | protocols | protocols/oap | — |
| ESC myocardite 2023 | 1 | protocols | protocols/myocardite | — |
| ESC NSTE-ACS 2023 | 5 | medications, protocols | medications/aspirine, medications/enoxaparine, medications/trinitrine, protocols/sca-nstem, protocols/sca-stemi | — |
| ESC pacing | 1 | ecg | ecg/bav3 | — |
| ESC péricarde 2015 | 1 | protocols | protocols/tamponnade | — |
| ESC pericardial 2015 | 1 | medications | medications/colchicine | — |
| ESC pericardial diseases 2015 | 1 | protocols | protocols/pericardite-aigue | — |
| ESC STEMI 2023 | 3 | calculators, ecg | calculators/stemi, calculators/thrombolyse, ecg/stemi | — |
| ESC SVT 2019 | 1 | ecg | ecg/flutter | — |
| ESC syncope 2018 | 2 | calculators, protocols | calculators/syncope, protocols/syncope | — |
| ESC/ESH hypertension guidelines | 1 | protocols | protocols/hta-urgence | — |
| ESCMID méningites 2016 | 1 | protocols | protocols/meningite-bacterienne | — |
| ESETT 2019 | 2 | calculators, medications | calculators/antiepileptiques, medications/levetiracetam | — |
| ESGE | 1 | protocols | protocols/hemorragie-digestive-basse | — |
| ESGE 2021 | 2 | calculators, protocols | calculators/hemo-digestive, protocols/hemorragie-digestive-haute | — |
| ESGE caustiques 2015 | 1 | protocols | protocols/ingestion-caustique | — |
| ESICM sédation | 1 | medications | medications/lorazepam | — |
| ESMO 2016 | 1 | protocols | protocols/fievre-neutropenique | — |
| ESO 2021 ; RE.NAU téléthrombolyse | 1 | triage | triage/avf-suspect | — |
| ESO Guidelines | 1 | protocols | protocols/avc | — |
| ESO/AHA AVC ischémique 2021 | 1 | calculators | calculators/nihss | — |
| ESPGHAN entérite aiguë | 1 | protocols | protocols/deshydratation-enfant | — |
| ESPR intussusception | 1 | protocols | protocols/invagination-intestinale | — |
| ESVM mésentérique | 1 | protocols | protocols/ischemie-mesenterique | — |
| ESVS 2020 | 1 | triage | triage/dvp-membre | — |
| ESVS périphérique 2017 | 1 | protocols | protocols/ischemie-membre-aigu | — |
| EULAR gout | 1 | medications | medications/colchicine | — |
| EURAP | 1 | calculators | calculators/epilepsie-grossesse | — |
| European Trauma Guidelines 2023 | 1 | calculators | calculators/transfusion | — |
| EUSI | 1 | protocols | protocols/hemorragie-sous-arachnoidienne | — |
| EXTRIP 2021 | 1 | calculators | calculators/gap-metabolique | — |
| EXTRIP lithium 2015 | 1 | protocols | protocols/intoxication-lithium | — |
| EXTRIP methanol 2021 | 1 | protocols | protocols/intoxication-methanol | — |
| EXTRIP salicylates 2018 | 1 | protocols | protocols/intoxication-salicyles | — |
| FGO/SFAR obstétrique | 1 | medications | medications/terbutaline | — |
| FIGO | 2 | protocols | protocols/eclampsie, protocols/hemorragie-post-partum | — |
| FIGO 2022 | 1 | calculators | calculators/hpp | — |
| FIGO atonie | 1 | medications | medications/oxytocine | — |
| GINA 2023 | 1 | calculators | calculators/asthme | — |
| GINA 2024 | 5 | medications, protocols | medications/hydrocortisone, medications/ipratropium, medications/salbutamol, medications/sulfate-magnesium, protocols/asthme-aigu-grave | — |
| GOLD 2024 | 1 | calculators | calculators/spirometrie | — |
| GOLD 2025 | 2 | medications, protocols | medications/ipratropium, protocols/exacerbation-bpco | — |
| Goldfrank's | 3 | protocols | protocols/intoxication-digoxine, protocols/intoxication-lithium, protocols/intoxication-salicyles | — |
| Goldfrank's Toxicologic Emergencies | 3 | calculators, protocols | calculators/antidotes, calculators/toxidromes, protocols/intoxication-opioides | — |
| Groupe croup Canada 2022 | 2 | calculators, protocols | calculators/westley, protocols/laryngite-croup | — |
| Guidelines crush disaster (ISN 2023) | 1 | protocols | protocols/amputation-crush | — |
| Guidelines européennes hyponatrémie 2014 | 1 | medications | medications/nacl-hypertonique | — |
| Guidelines européennes hyponatrémie 2014 (ESICM/ERA-EDTA) | 1 | protocols | protocols/hyponatremie-severe | — |
| HAS | 1 | protocols | protocols/embolie-pulmonaire | — |
| HAS — diabète | 1 | protocols | protocols/hypoglycemie | — |
| HAS 2014 | 1 | calculators | calculators/transfusion-a | — |
| HAS bronchiolite 2019 | 1 | protocols | protocols/bronchiolite | — |
| HAS checklist | 1 | calculators | calculators/garde-fous | — |
| HAS drépanocytose 2010 | 1 | protocols | protocols/drepanocytose-crise | — |
| HAS hypoglycémie | 1 | medications | medications/glucagon | — |
| HAS hypoglycémie urgence | 1 | medications | medications/glucose30 | — |
| HAS intox. benzodiazépines | 1 | medications | medications/flumazenil | — |
| HAS OAP | 1 | medications | medications/furosemide | — |
| HAS organisation SU ; SFMU triage 2013 ; ERC 2021 (chaine de survie) | 1 | checklists | checklists/sauv-accueil | — |
| HAS prescription | 1 | medications | medications/paracetamol | — |
| HAS tox urgence | 1 | medications | medications/naloxone | — |
| HEART study | 1 | calculators | calculators/heart | — |
| HELPERR/ALSO | 1 | protocols | protocols/dystocie-epaules | — |
| Hunter serotonin toxicity 2003 | 1 | protocols | protocols/serotoninergique-snm | — |
| IAP/APA guidelines | 1 | protocols | protocols/pancreatite-aigue | — |
| IDSA 2010 | 1 | medications | medications/piperacilline-tazobactam | — |
| IDSA neutropenic fever 2010 | 1 | protocols | protocols/fievre-neutropenique | — |
| IDSA neutropénie 2010 | 1 | triage | triage/fièvre-néoplasie | — |
| IDSA SSTI 2014 | 1 | medications | medications/clindamycine | — |
| ILAE état de mal | 1 | medications | medications/diazepam | — |
| ILAE état de mal 2020 | 1 | protocols | protocols/etat-mal-epileptique | — |
| Institut Pasteur de Tunis | 2 | protocols | protocols/morsure-serpent, protocols/prophylaxie-rage | — |
| Interne | 4 | calculators | calculators/assistants-hub, calculators/revision, calculators/stats, calculators/terrain | — |
| Interne — usage personnel | 1 | calculators | calculators/chronologie | — |
| ISMP high-alert | 1 | calculators | calculators/safe-dose | — |
| ISPAD / SFD | 1 | calculators | calculators/dka | — |
| ISPAD 2022 | 2 | calculators | calculators/dka-h1, calculators/hypoglycemie | — |
| ISSHP pré-éclampsie | 1 | medications | medications/sulfate-magnesium | — |
| ISSHP pré-éclampsie 2021 | 1 | protocols | protocols/eclampsie | — |
| ISTH 2001 | 1 | calculators | calculators/dic | — |
| JHES guidelines | 1 | protocols | protocols/hhs-hyperosmolaire | — |
| KDIGO / AHA 2020 — hyperkaliémie | 1 | trees | trees/hyperkaliemie | https://kdigo.org |
| KDIGO 2012 | 2 | calculators | calculators/aki, calculators/urines | — |
| KDIGO 2020 | 1 | calculators | calculators/hyperkalemie | — |
| KDIGO AKI | 1 | protocols | protocols/rhabdomyolyse | — |
| KDIGO/US guidelines hyperK | 1 | protocols | protocols/hyperkaliemie | — |
| Kline PERC 2004 | 1 | calculators | calculators/perc | — |
| Kraut & Madias 2014 | 1 | calculators | calculators/acide-base | — |
| Kumar & Clark | 1 | calculators | calculators/gap-metabolique | — |
| Le Gal 2006 (Arch Intern Med) | 1 | calculators | calculators/geneva | — |
| Lim et al. 2003 (CURB-65) | 1 | calculators | calculators/curb65 | — |
| Livret ATB Tunisie | 1 | medications | medications/amoxicilline | — |
| Livret RE.NAU 2018 | 17 | perfusions | perfusions/amiodarone, perfusions/heparine, perfusions/isoprenaline, perfusions/ketamine, perfusions/labetalol, perfusions/midazolam, perfusions/morphine, perfusions/nicardipine, perfusions/noradrenaline, perfusions/octreotide, perfusions/oxytocine, perfusions/propofol, perfusions/sufentanil, perfusions/sulfate-magnesium, perfusions/urapidil | — |
| Livret RE.NAU 2018 ; CRASH-2 | 1 | perfusions | perfusions/acide-tranexamique | — |
| Livret RE.NAU 2018 ; ERC 2021 | 1 | perfusions | perfusions/adrenaline | — |
| Livret RE.NAU 2018 ; ERC 2021 anaphylaxie | 1 | perfusions | perfusions/adrenaline | — |
| Livret RE.NAU 2018 ; ESC 2014 SAA | 1 | perfusions | perfusions/esmolol | — |
| Livret RE.NAU 2018 ; ESC 2021 OAP | 1 | perfusions | perfusions/trinitrine | — |
| Livret RE.NAU 2018 ; SFAR | 1 | perfusions | perfusions/fentanyl | — |
| Livret RE.NAU 2018 ; SFD/SFE 2023 | 1 | perfusions | perfusions/insuline-rapide | — |
| Livret RE.NAU 2018 (dose/preparation) | 1 | medications | medications/noradrenaline | — |
| Livret RE.NAU 2018 (dose/préparation) ; Surviving Sepsis Campaign 2026 (first-line agent, MAP target, peripheral start) | 1 | perfusions | perfusions/noradrenaline | — |
| LRINEC Wong 2004 | 1 | protocols | protocols/fasciite-necrosante | — |
| Luscombe & Owens 2007 (formule APLS) | 1 | calculators | calculators/poids-pediatrique | — |
| MASCC | 1 | protocols | protocols/fievre-neutropenique | — |
| Matrice éditoriale urgences vitales | 1 | calculators | calculators/motif | — |
| Matrice pondérée editoriale (urgences vitales) | 1 | calculators | calculators/ddx | — |
| Médecine tropicale — vipères du Maghreb | 1 | protocols | protocols/morsure-serpent | — |
| MHRA/EMA Paracétamol | 1 | calculators | calculators/nac | — |
| Ministère de la Santé Tunisie — programme antirabique | 1 | protocols | protocols/prophylaxie-rage | — |
| NASPGHAN 2015 | 1 | protocols | protocols/pile-bouton | — |
| Neuroleptic Malignant Syndrome — UpToDate | 1 | protocols | protocols/serotoninergique-snm | — |
| NICE CG174 | 1 | calculators | calculators/fluides-sodium | — |
| NICE croup | 1 | protocols | protocols/laryngite-croup | — |
| NICE NG41, recommendations 1.1.2–1.1.4, 1.1.13–1.1.14 and 1.1.19 | 1 | procedures | procedures/immobilisation-rachis | — |
| NICE TIA 2019 | 1 | calculators | calculators/abcd2 | — |
| NINDS (NIHSS) | 1 | calculators | calculators/nihss | — |
| NRP 8e éd. 2020 | 1 | calculators | calculators/neonat-ran | — |
| OMEDIT Pays de la Loire V2.3 (2026) | 1 | calculators | calculators/antibio-renal | — |
| OMEDIT V2.3 (antibiotiques uniquement) | 1 | calculators | calculators/renal-dose | — |
| OMS | 2 | calculators, protocols | calculators/garde-fous, protocols/eclampsie | — |
| OMS / FIGO — recommandations HPP | 1 | trees | trees/hemorragie-post-partum | https://www.who.int |
| OMS 2011 | 1 | calculators | calculators/eclampsie | — |
| OMS déshydratation | 1 | protocols | protocols/deshydratation-enfant | — |
| OMS envenimations 2016 | 1 | protocols | protocols/morsure-serpent | — |
| OMS HPP | 1 | medications | medications/oxytocine | — |
| OMS HPP 2012 | 1 | calculators | calculators/hpp | — |
| OMS HPP 2023 | 1 | protocols | protocols/hemorragie-post-partum | — |
| OMS naloxone 2023 | 1 | calculators | calculators/opioides | — |
| OMS pesticides | 1 | protocols | protocols/intoxication-organophosphores | — |
| OMS rage 2018 (position paper) | 1 | protocols | protocols/prophylaxie-rage | — |
| OMS sang 2016 | 1 | calculators | calculators/transfusion-a | — |
| OMS securite des medicaments | 1 | calculators | calculators/dose-check | — |
| OMS travail prématuré | 1 | medications | medications/terbutaline | — |
| PALS / RCUK | 1 | calculators | calculators/doses-ped | — |
| PALS 2020 | 1 | medications | medications/fentanyl | — |
| PALS/AHA 2020 | 1 | calculators | calculators/rcp-peds | — |
| Pisters et al. 2010 (HAS-BLED) | 1 | calculators | calculators/has-bled | — |
| Poison控制中心 button battery | 1 | protocols | protocols/pile-bouton | — |
| positions tox tricycliques | 1 | medications | medications/bicarbonate | — |
| Prescrire antidotes | 1 | protocols | protocols/intoxication-paracetamol | — |
| Prescrire intox. médicamenteuses | 1 | medications | medications/acetylcysteine | — |
| Protocole trauma local à préciser avant utilisation comme guide technique | 2 | procedures, protocols | procedures/exsufflation, protocols/pneumothorax-suffocant | — |
| Proudfoot 2019 review | 1 | protocols | protocols/intoxication-phosphure-aluminium | — |
| Radiopaedia | 1 | calculators | calculators/rx-thorax | — |
| RCOG ectopic 2016 | 1 | protocols | protocols/geu | — |
| RCOG shoulder dystocia 2012 | 1 | protocols | protocols/dystocie-epaules | — |
| RCP / BNF equivalence | 1 | calculators | calculators/corticoids | — |
| RCP ANSM Gabapentine Zentiva 400 mg (2026) | 1 | calculators | calculators/renal-dose | — |
| RCP ANSM Pregabaline HCS 75 mg (2024) | 1 | calculators | calculators/renal-dose | — |
| RCUK | 1 | medications | medications/hydrocortisone | — |
| RCUK — Emergency treatment of anaphylaxis 2021 | 1 | trees | trees/anaphylaxie | https://www.resus.org.uk |
| RCUK Anaphylaxis 2021 | 2 | calculators, medications | calculators/dose-anaphylaxie, medications/adrenaline | — |
| RE.NAU | 1 | medications | medications/nacl-hypertonique | — |
| RE.NAU ; CDC/WHO tox | 1 | triage | triage/intoxication | — |
| RE.NAU ; WHO PPH 2017 | 1 | triage | triage/hpp-accouchement | — |
| RE.NAU 2018 | 8 | calculators, medications | calculators/start, medications/dexamethasone, medications/isoprenaline, medications/labetalol, medications/octreotide, medications/propranolol, medications/sufentanil, medications/urapidil | — |
| RE.NAU Livret du médicament 2018 | 6 | calculators | calculators/amines, calculators/debit-perfusion, calculators/dose-poids, calculators/heparine, calculators/insuline, calculators/perfusions | — |
| Réanimation métabolique | 1 | medications | medications/chlorure-potassium | — |
| Résumé des caractéristiques produit | 6 | medications | medications/azithromycine, medications/ciprofloxacine, medications/ketoprofene, medications/metronidazole, medications/ondansetron, medications/piperacilline-tazobactam | — |
| Resuscitation Council UK 2021 | 1 | protocols | protocols/anaphylaxie | — |
| Roper-Hall/Dua classification | 1 | protocols | protocols/oeil-chimique | — |
| ROX index 2019 | 1 | calculators | calculators/gaz-advanced | — |
| Rutherford classification | 1 | protocols | protocols/ischemie-membre-aigu | — |
| SAMU | 1 | protocols | protocols/intoxication-opioides | — |
| SAMU intoxications | 1 | protocols | protocols/intoxication-alcool-aigue | — |
| Sankaran et al., Arch Dis Child Fetal Neonatal Ed 2021, DOI 10.1136/archdischild-2020-321034 (animal model; flush evidence) | 1 | procedures | procedures/neonat-ran | — |
| SCCM PADIS 2018 | 1 | medications | medications/haloperidol | — |
| Sepsis-3 | 1 | calculators | calculators/qsofa | — |
| SFAP | 1 | calculators | calculators/sedation-palliative | — |
| SFAR | 2 | medications | medications/diazepam, medications/midazolam | — |
| SFAR ; ATS / ACEP | 1 | triage | triage/agitation-aigue | — |
| SFAR 2019 | 1 | calculators | calculators/rsi | — |
| SFAR analgésie | 1 | medications | medications/paracetamol | — |
| SFAR analgésie SU | 1 | medications | medications/morphine | — |
| SFAR obstétrique | 1 | protocols | protocols/hypertension-gravidique | — |
| SFAR RSI | 3 | medications | medications/ketamine, medications/propofol, medications/succinylcholine | — |
| SFAR RSI/DAS | 1 | medications | medications/rocuronium | — |
| SFAR RSI/DAS 2023 | 1 | calculators | calculators/iot-rsi | — |
| SFAR sédation | 1 | medications | medications/sufentanil | — |
| SFAR sédation SU | 1 | medications | medications/fentanyl | — |
| SFAR/SFMU RFE 2025, DOI 10.1684/afmu.2025.0673 (R2.2.1, R3.1–R3.5, R5.1–R5.2) | 1 | procedures | procedures/iot-rsi | — |
| SFAR/SRLF 2017 ; ERC 2021 | 1 | triage | triage/detresse-resp | — |
| SFCP | 1 | protocols | protocols/invagination-intestinale | — |
| SFH 2021 | 1 | calculators | calculators/hemogramme | — |
| SFMU — insuffisance surrénale aiguë | 1 | protocols | protocols/crise-surrenale | — |
| SFMU — matériel SMUR minimum ; RE.NAU Livret du médicament (Mars 2018) | 1 | checklists | checklists/malle-urgence | — |
| SFMU agitation / psychiatrie urgence | 1 | protocols | protocols/agitation-aigue | — |
| SFMU OAP | 1 | protocols | protocols/oap | — |
| SFMU/SFU — Triage en structure des urgences (RFE 2013) | 1 | trees | trees/triage-prehospitalier | https://www.sfmu.org/upload/referentielsSFMU/rfe_triage2013.pdf |
| SFMU/SRLF recommandations envenimation | 1 | protocols | protocols/piqre-scorpion | — |
| SFMU/UUS agitation | 1 | medications | medications/ketamine | — |
| SFN 2022 ; RE.NAU EME | 1 | triage | triage/convulsion | — |
| SFP/nice | 1 | protocols | protocols/convulsion-febrile | — |
| SFU / EAN guidelines — Status epilepticus | 1 | trees | trees/etat-mal | https://www.sfmu.org |
| SFU agitation | 1 | medications | medications/lorazepam | — |
| SFU ophtalmologie | 1 | protocols | protocols/glaucome-aigu | — |
| SFU ophtalmologie 2022 | 1 | protocols | protocols/oeil-chimique | — |
| SI units | 1 | calculators | calculators/gaz-units | — |
| Société française de médecine d'urgence | 1 | protocols | protocols/coup-de-chaleur | — |
| Société française de pharmacie clinique | 1 | medications | medications/chlorure-potassium | — |
| Société française ORL | 1 | protocols | protocols/epistaxis | — |
| SPILF | 4 | medications | medications/amoxicilline, medications/gentamicine, medications/metronidazole, medications/piperacilline-tazobactam | — |
| SPILF / RCP aciclovir | 1 | calculators | calculators/antiviraux | — |
| SPILF 2019 | 1 | protocols | protocols/meningite-bacterienne | — |
| SPILF 2023 | 1 | calculators | calculators/antibiotiques | — |
| SPILF DHB 2019 | 3 | calculators, medications, protocols | calculators/lrinec, medications/clindamycine, protocols/fasciite-necrosante | — |
| SPILF PNA 2018 | 1 | medications | medications/ciprofloxacine | — |
| SPILF/ATS-IDSA | 1 | protocols | protocols/pneumonie-aigue | — |
| SRLF | 1 | protocols | protocols/noyade | — |
| SRLF — intoxications médicamenteuses | 1 | protocols | protocols/intoxication-medicamenteuse | — |
| SRLF 2015 — aminosides en réanimation : amikacine 25–30 mg/kg/j en choc septique, durée <5 jours | 1 | medications | medications/amikacine | — |
| SRLF 2021 | 1 | calculators | calculators/ventilateur | — |
| SRLF convulsions aiguës | 1 | protocols | protocols/etat-mal-epileptique | — |
| SRLF VNI | 1 | protocols | protocols/exacerbation-bpco | — |
| SRLF/SFMU — intoxication CO | 1 | protocols | protocols/intoxication-co | — |
| SSC 2021 | 1 | medications | medications/heparine | — |
| SSC 2026 (adult sepsis timing/resuscitation) | 1 | calculators | calculators/guidage | — |
| SSC 2026 (délai d'antibiothérapie adulte uniquement) | 2 | medications, protocols | medications/cefotaxime, protocols/pyelonephrite-aigue | — |
| SSC 2026 (indication d'inotrope dans le sepsis adulte ; pas de posologie précisée) | 1 | medications | medications/dobutamine | — |
| Stabilis 2024 | 1 | calculators | calculators/dilutions | — |
| START/JumpSTART — CDC | 1 | calculators | calculators/start | — |
| Stiell Lancet 2001 | 1 | calculators | calculators/canadian-ct-head | — |
| Stiell NEJM 2001 | 1 | calculators | calculators/canadian-cspine | — |
| STPI (Tunisie) — Recommandations antibiothérapie IU communautaires de l'adulte, février 2018 | 1 | protocols | protocols/pyelonephrite-aigue | — |
| STPI Tunisie 2018 — PNA grave adulte uniquement : amikacine 30 mg/kg/j pendant 1–3 jours (référence historique, protocole actuel à confirmer) | 1 | medications | medications/amikacine | — |
| Sullivan 1989 | 1 | calculators | calculators/ciwa-ar | — |
| Surviving Sepsis Campaign 2021 (dose reference) | 1 | medications | medications/hydrocortisone | — |
| Surviving Sepsis Campaign 2026 — recommandations adultes (SCCM) | 1 | trees | trees/choc-septique | https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026 |
| Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | 5 | calculators, protocols, triage | calculators/fluides-sodium, calculators/lactate, calculators/sepsis-cde, protocols/choc-septique, triage/choc-sepsis | — |
| Surviving Sepsis Campaign 2026 (adult shock fluids) | 1 | protocols | protocols/fievre-neutropenique | — |
| Surviving Sepsis Campaign 2026 (adult-only fluid note) | 1 | calculators | calculators/fluids-enfant | — |
| Surviving Sepsis Campaign 2026 (IV steroid recommendation) | 1 | medications | medications/hydrocortisone | — |
| Surviving Sepsis Campaign 2026 (MAP, first-line agent, peripheral start) | 1 | medications | medications/noradrenaline | — |
| Surviving Sepsis Campaign 2026 (screening adults) | 1 | calculators | calculators/qsofa | — |
| Surviving Sepsis Campaign 2026 (sepsis timing distinction) | 1 | calculators | calculators/pac | — |
| Système international d’unités | 1 | calculators | calculators/convertisseur | — |
| Teasdale & Jennett 1974 (GCS) | 1 | calculators | calculators/gcs | — |
| Teleflex Arrow EZ-IO IFU 8049, Rev. 01 (device-specific indications, sites, contraindications and dwell time) | 1 | procedures | procedures/intra-osseuse | — |
| The ICU Book (Marino) | 1 | calculators | calculators/gazometrie | — |
| Tintinalli 9e éd. | 3 | calculators | calculators/plaies, calculators/tetanos, calculators/trauma-membres | — |
| Tokyo Guidelines 2018 | 1 | protocols | protocols/angiocholite | — |
| Toxbase TCA | 1 | protocols | protocols/intoxication-tricycliques | — |
| travaux hyperK | 1 | medications | medications/gluconate-calcium | — |
| UK Renal Association | 1 | calculators | calculators/electrolytes | — |
| Undersea & Hyperbaric Med Soc | 1 | calculators | calculators/co | — |
| UpToDate | 2 | protocols | protocols/hyponatremie-severe, protocols/intoxication-tricycliques | — |
| UpToDate CCB/BB poisoning | 1 | protocols | protocols/intoxication-bb-icc | — |
| UpToDate methanol poisoning | 1 | protocols | protocols/intoxication-methanol | — |
| Use the instructions for the exact supraglottic device selected | 1 | procedures | procedures/masque-larynge | — |
| Wallace (règle des 9) / Lund-Browder | 1 | calculators | calculators/brulures | — |
| Wells 1995-1997 | 1 | calculators | calculators/wells-tvp | — |
| Wells et al. 2000 | 1 | calculators | calculators/wells-ep | — |
| Western Trauma Association 2023 | 1 | protocols | protocols/pelvis-instable | — |
| Westley 1978 | 1 | calculators | calculators/westley | — |
| WHO Consolidated PPH Guidelines 2025, recommendations 19, 20, 23 and 26 | 1 | procedures | procedures/accouchement-inopine | — |
| WHO Intrapartum Care 2018, recommendations 34–36 | 1 | procedures | procedures/accouchement-inopine | — |
| WHO MUAC 2013 | 1 | calculators | calculators/croissance | — |
| WHO Peripheral Catheter Guidelines 2024, section 3 (ISBN 978-92-4-009382-9) | 1 | procedures | procedures/vvp | — |
| WINFOCUS 2020 | 1 | protocols | protocols/fast-echo | — |
| WMS 2019 | 1 | calculators | calculators/coup-chaleur | — |
| WOMAN 2017 | 1 | calculators | calculators/hpp | — |
| WOMAN trial | 2 | medications, protocols | medications/acide-tranexamique, protocols/hemorragie-post-partum | — |
| Wong 2004 | 1 | calculators | calculators/lrinec | — |
| WSES 2017 | 1 | protocols | protocols/ischemie-mesenterique | — |
| WSES ASBO 2017 | 1 | protocols | protocols/occlusion-intestinale | — |
| WSES guidelines ; SFAR | 1 | triage | triage/douleur-abdo | — |
| WSES Jerusalem guidelines 2020 | 1 | protocols | protocols/appendicite | — |
| WSES perforated peptic ulcer 2020 | 1 | protocols | protocols/perforation-peritonite | — |
| Wu 2008 | 1 | calculators | calculators/bisap | — |

## سجل كل سجل ذي مصدر مُدخل

| المجموعة | المعرّف | الاسم/العنوان الفرنسي | المصدر كما هو مسجل / نطاقه | URL | الصفحة | lastReviewed | الملف:السطر |
|---|---|---|---|---|---:|---|---|
| atb-renal | acide-fusidique-iv-po | Acide Fusidique IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1018 |
| atb-renal | amikacine-iv | Amikacine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:599 |
| atb-renal | amoxicilline-acide-clavulanique-iv | Amoxicilline + acide clavulanique IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 1 | — | data/atb-renal.ts:107 |
| atb-renal | amoxicilline-acide-clavulanique-po | Amoxicilline + acide clavulanique PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 1 | — | data/atb-renal.ts:94 |
| atb-renal | amoxicilline-iv | Amoxicilline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 1 | — | data/atb-renal.ts:82 |
| atb-renal | amoxicilline-po | Amoxicilline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 1 | — | data/atb-renal.ts:70 |
| atb-renal | ampicilline-sulbactam-im | Ampicilline + Sulbactam IM | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:136 |
| atb-renal | ampicilline-sulbactam-iv | Ampicilline + Sulbactam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:121 |
| atb-renal | azithromycine-po | Azithromycine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:838 |
| atb-renal | aztreonam-im | Aztréonam IM | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:272 |
| atb-renal | aztreonam-iv | Aztréonam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:284 |
| atb-renal | bedaquiline-po | Bédaquiline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1122 |
| atb-renal | benzathine-benzylpenicilline-im | Benzathine benzylpenicilline IM | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:149 |
| atb-renal | benzylpenicilline-sodique-im-ou-iv | Benzylpenicilline sodique IM ou IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:163 |
| atb-renal | cefaclor-po | Céfaclor PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:296 |
| atb-renal | cefadroxil-po | Céfadroxil PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:307 |
| atb-renal | cefalexine-po | Céfalexine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:321 |
| atb-renal | cefazoline-im-iv | Céfazoline IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 4 | — | data/atb-renal.ts:332 |
| atb-renal | cefepime-iv-im-possible | Céfépime IV (*IM possible) | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 4 | — | data/atb-renal.ts:344 |
| atb-renal | cefiderocol-iv | Céfidérocol IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 4 | — | data/atb-renal.ts:360 |
| atb-renal | cefixime-po | Céfixime PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 4 | — | data/atb-renal.ts:373 |
| atb-renal | cefotaxime-im-iv | Céfotaxime IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 4 | — | data/atb-renal.ts:386 |
| atb-renal | cefoxitine-iv | Céfoxitine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:399 |
| atb-renal | cefpodoxime-proxetil-po | Cefpodoxime (proxetil) PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:414 |
| atb-renal | ceftaroline-fosamil-iv | Ceftaroline (fosamil) IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:425 |
| atb-renal | ceftazidime-avibactam-iv | Ceftazidime + avibactam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:450 |
| atb-renal | ceftazidime-im-iv | Ceftazidime IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:438 |
| atb-renal | ceftobiprole-iv | Ceftobiprole IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:465 |
| atb-renal | ceftolozane-tazobactam-iv | Ceftolozane + tazobactam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 5 | — | data/atb-renal.ts:478 |
| atb-renal | ceftriaxone-im-iv | Ceftriaxone IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:493 |
| atb-renal | cefuroxime-axetil-po | Cefuroxime (axétil) PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:504 |
| atb-renal | cefuroxime-iv | Cefuroxime IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:515 |
| atb-renal | ciprofloxacine-iv | Ciprofloxacine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:650 |
| atb-renal | ciprofloxacine-po | Ciprofloxacine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:639 |
| atb-renal | clarithromycine-iv | Clarithromycine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:861 |
| atb-renal | clarithromycine-po | Clarithromycine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:849 |
| atb-renal | clindamycine-iv-po | Clindamycine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:872 |
| atb-renal | cloxacilline-iv | Cloxacilline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:187 |
| atb-renal | cloxacilline-po | Cloxacilline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:176 |
| atb-renal | colistine-iv-colistimethate-sodique | Colistine IV (Colistiméthate sodique) | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1029 |
| atb-renal | cotrimoxazole-iv-po | Cotrimoxazole IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:939 |
| atb-renal | dalbavancine-iv | Dalbavancine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:735 |
| atb-renal | daptomycine-iv | Daptomycine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1043 |
| atb-renal | delafloxacine-iv | Délafloxacine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:672 |
| atb-renal | delafloxacine-po | Délafloxacine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:661 |
| atb-renal | delamanide-po | Delamanide PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1133 |
| atb-renal | doxycycline-iv-po | Doxycycline IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:972 |
| atb-renal | ertapenem-iv | Ertapénem IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:526 |
| atb-renal | erythromycine-iv-po | Erythromycine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:883 |
| atb-renal | ethambutol-m-iv-po | Ethambutol M IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1144 |
| atb-renal | fidaxomicine-po | Fidaxomicine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1055 |
| atb-renal | fosfomycine-iv | Fosfomycine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1077 |
| atb-renal | fosfomycine-trometamol-po | Fosfomycine trométamol PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1066 |
| atb-renal | gentamicine-im-iv | Gentamicine IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:613 |
| atb-renal | imipenem-cilastatine-iv | Imipénem + cilastatine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:537 |
| atb-renal | imipenem-cilastatine-relebactam-iv | Imipénem + cilastatine + relebactam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:555 |
| atb-renal | isoniazide-im-iv-po | Isoniazide IM IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1157 |
| atb-renal | levofloxacine-iv-po | Lévofloxacine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:683 |
| atb-renal | linezolide-iv-po | Linezolide IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1088 |
| atb-renal | lymecycline-po | Lymecycline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:983 |
| atb-renal | meropenem-iv | Méropénem IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:568 |
| atb-renal | meropenem-vaborbactam-iv-atb-de-reserve | Méropénem + vaborbactam IV (ATB de réserve) | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 6 | — | data/atb-renal.ts:583 |
| atb-renal | metronidazole-iv | Métronidazole IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:815 |
| atb-renal | metronidazole-po | Métronidazole PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:802 |
| atb-renal | minocycline-po | Minocycline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:995 |
| atb-renal | moxifloxacine-iv-po | Moxifloxacine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:698 |
| atb-renal | nitrofurantoine-po | Nitrofurantoïne PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1100 |
| atb-renal | norfloxacine-po | Norfloxacine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:709 |
| atb-renal | ofloxacine-iv-po | Ofloxacine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:720 |
| atb-renal | oritavancine-iv | Oritavancine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:746 |
| atb-renal | ornidazole-iv-po | Ornidazole IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:827 |
| atb-renal | oxacilline-iv | Oxacilline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:198 |
| atb-renal | phenoxymethyl-penicilline-po | Phénoxyméthyl- -pénicilline PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:209 |
| atb-renal | piperacilline-iv | Pipéracilline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 2 | — | data/atb-renal.ts:220 |
| atb-renal | piperacilline-tazobactam-iv | Pipéracilline + tazobactam IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:234 |
| atb-renal | pivmecillinam-po | Pivmécillinam PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:249 |
| atb-renal | pristinamycine-po | Pristinamycine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:894 |
| atb-renal | pyrazinamide-po | Pyrazinamide PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1168 |
| atb-renal | rifabutine-po | Rifabutine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1179 |
| atb-renal | rifampicine-iv-po | Rifampicine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 12 | — | data/atb-renal.ts:1191 |
| atb-renal | roxithromycine-po | Roxithromycine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:905 |
| atb-renal | spiramycine-iv-po | Spiramycine IV PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:916 |
| atb-renal | spiramycine-metronidazole-po | Spiramycine + Métronidazole PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 9 | — | data/atb-renal.ts:928 |
| atb-renal | sulfadiazine-po | Sulfadiazine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:950 |
| atb-renal | tedizolide-po | Tédizolide PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 11 | — | data/atb-renal.ts:1111 |
| atb-renal | teicoplanine-im-iv | Teicoplanine IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:757 |
| atb-renal | teicoplanine-po | Teicoplanine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:769 |
| atb-renal | temocilline-iv | Témocilline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 3 | — | data/atb-renal.ts:260 |
| atb-renal | tigecycline-iv | Tigécycline IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:1006 |
| atb-renal | tobramycine-im-iv | Tobramycine IM IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 7 | — | data/atb-renal.ts:626 |
| atb-renal | trimethoprime-po | Triméthoprime PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 10 | — | data/atb-renal.ts:961 |
| atb-renal | vancomycine-iv | Vancomycine IV | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:780 |
| atb-renal | vancomycine-po | Vancomycine PO | OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne) | — | 8 | — | data/atb-renal.ts:791 |
| calculators | abcd2 | ABCD2 (post-AIT) | NICE TIA 2019 | — | — | 2026-09 | data/calculators.ts:661 |
| calculators | acide-base | Acido-basique pas à pas | Kraut & Madias 2014 | — | — | 2026-09 | data/calculators.ts:413 |
| calculators | agitation | Assistant agitation aiguë individuel | ACEP 2021 agitation | — | — | 2026-09 | data/calculators.ts:981 |
| calculators | aki | AKI — KDIGO + doses | KDIGO 2012 | — | — | 2026-09 | data/calculators.ts:365 |
| calculators | alvarado | Alvarado (appendicite) | Alvarado 1986 | — | — | 2026-09 | data/calculators.ts:669 |
| calculators | amines | Amines (µg/kg/min) | RE.NAU Livret du médicament 2018 | — | — | 2026-09 | data/calculators.ts:469 |
| calculators | anaphylaxie | Assistant anaphylaxie individuel | ERC/ASCIA 2021 | — | — | 2026-09 | data/calculators.ts:797 |
| calculators | antibio-renal | Antibiotiques & fonction renale (93 lignes) | OMEDIT Pays de la Loire V2.3 (2026) | — | — | 2026-09 | data/calculators.ts:205 |
| calculators | antibiotiques | Antibiotiques : dose et rein | SPILF 2023 | — | — | 2026-09 | data/calculators.ts:197 |
| calculators | anticoag | Réversion des anticoagulants | EHRA 2021 | — | — | 2026-09 | data/calculators.ts:389 |
| calculators | antidotes | Navigateur d'antidotes | Goldfrank's Toxicologic Emergencies | — | — | 2026-09 | data/calculators.ts:381 |
| calculators | antiepileptiques | Antiepileptiques en urgence | ESETT 2019 | — | — | 2026-09 | data/calculators.ts:141 |
| calculators | antipsychotiques | Antipsychotiques et manies | BNF / RCP | — | — | 2026-09 | data/calculators.ts:101 |
| calculators | antiviraux | Antiviraux | SPILF / RCP aciclovir | — | — | 2026-09 | data/calculators.ts:117 |
| calculators | assistants-hub | Assistants personnels (hub) | Interne | — | — | 2026-09 | data/calculators.ts:869 |
| calculators | asthme | Assistant crise d'asthme individuel | GINA 2023 | — | — | 2026-09 | data/calculators.ts:821 |
| calculators | bilan-hepatique | Patterns du bilan hepatique | EASL 2023 | — | — | 2026-09 | data/calculators.ts:269 |
| calculators | bisap | BISAP (pancréatite) | Wu 2008 · ACG 2024 | — | — | 2026-09 | data/calculators.ts:21 |
| calculators | broselow | Broselow pédiatrique | Broselow-Luten / PALS | — | — | 2026-09 | data/calculators.ts:733 |
| calculators | brulures | Brûlures (règle des 9 + Parkland) | Wallace (règle des 9) / Lund-Browder · EBA Practice Guidelines 2019 | — | — | 2026-09 | data/calculators.ts:461 |
| calculators | brulures-a | Assistant brûlure individuel | ABA 2018 | — | — | 2026-09 | data/calculators.ts:989 |
| calculators | burch-wartofsky | Burch-Wartofsky (tempête thyroïdienne) | Burch & Wartofsky 1993 · ATA 2016 | — | — | 2026-09 | data/calculators.ts:45 |
| calculators | canadian-cspine | Règle canadienne — rachis cervical | Stiell NEJM 2001 | — | — | 2026-09 | data/calculators.ts:85 |
| calculators | canadian-ct-head | Canadian CT Head | Stiell Lancet 2001 | — | — | 2026-09 | data/calculators.ts:93 |
| calculators | chrono-rcp | Chronomètre RCP | AHA ACLS 2025 · ERC 2021 | — | — | 2026-09 | data/calculators.ts:453 |
| calculators | chronologie | Chronologie medicamenteuse | Interne — usage personnel | — | — | 2026-09 | data/calculators.ts:1045 |
| calculators | ciwa-ar | CIWA-Ar (sevrage alcool) | Sullivan 1989 · ASAM 2020 | — | — | 2026-09 | data/calculators.ts:13 |
| calculators | co | Monoxyde de carbone / fumee | Undersea & Hyperbaric Med Soc | — | — | 2026-09 | data/calculators.ts:341 |
| calculators | cocaine | Douleur thoracique sous cocaine | AHA 2008 cocaine chest pain | — | — | 2026-09 | data/calculators.ts:349 |
| calculators | colique | Assistant colique néphrétique individuel | EAU 2023 | — | — | 2026-09 | data/calculators.ts:965 |
| calculators | coma | Coma — approche structurée | ATLS 10e éd. · ERC 2021 | — | — | 2026-09 | data/calculators.ts:405 |
| calculators | convertisseur | Convertisseur d'unités | Système international d’unités | — | — | 2026-09 | data/calculators.ts:493 |
| calculators | corticoids | Equivalences corticoides | RCP / BNF equivalence | — | — | 2026-09 | data/calculators.ts:149 |
| calculators | coup-chaleur | Assistant coup de chaleur individuel | WMS 2019 | — | — | 2026-09 | data/calculators.ts:877 |
| calculators | croissance | Croissance et depistage nutritionnel | WHO MUAC 2013 | — | — | 2026-09 | data/calculators.ts:237 |
| calculators | curb65 | CURB-65 (pneumonie) | Lim et al. 2003 (CURB-65) · BTS Community Pneumonia | — | — | 2026-09 | data/calculators.ts:509 |
| calculators | ddx | Les 2 diagnostics les plus proches | Matrice pondérée editoriale (urgences vitales) | — | — | 2026-09 | data/calculators.ts:421 |
| calculators | debit-perfusion | Débit de perfusion | RE.NAU Livret du médicament 2018 | — | — | 2026-09 | data/calculators.ts:445 |
| calculators | dic | CIVD — score ISTH | ISTH 2001 | — | — | 2026-09 | data/calculators.ts:293 |
| calculators | dilutions | Dilution et perfusion | Stabilis 2024 | — | — | 2026-09 | data/calculators.ts:213 |
| calculators | dka | Acidocétose — conduite horaire | ISPAD / SFD | — | — | 2026-09 | data/calculators.ts:717 |
| calculators | dka-h1 | Assistant heure-1 DKA | ISPAD 2022 · BSPED 2018 | — | — | 2026-09 | data/calculators.ts:805 |
| calculators | dose-anaphylaxie | Dose adrénaline anaphylaxie | RCUK Anaphylaxis 2021 · AHA PALS 2020 | — | — | 2026-09 | data/calculators.ts:477 |
| calculators | dose-check | Verification avant administration | OMS securite des medicaments | — | — | 2026-09 | data/calculators.ts:253 |
| calculators | dose-poids | Dose selon le poids | AHA PALS 2020 · RE.NAU Livret du médicament 2018 | — | — | 2026-09 | data/calculators.ts:429 |
| calculators | doses-ped | Doses critiques pediatriques | PALS / RCUK | — | — | 2026-09 | data/calculators.ts:357 |
| calculators | ecg-grid | Grille de lecture ECG | ESC 2022 | — | — | 2026-09 | data/calculators.ts:301 |
| calculators | eclampsie | Assistant éclampsie individuel | OMS 2011 · CNGOF 2021 | — | — | 2026-09 | data/calculators.ts:813 |
| calculators | electrolytes | Calcium corrigé & potassium | UK Renal Association | — | — | 2026-09 | data/calculators.ts:621 |
| calculators | enoxaparine | Énoxaparine par poids et rein | ACCP Antithrombotic Guidelines | — | — | 2026-09 | data/calculators.ts:605 |
| calculators | epilepsie-grossesse | Epilepsie et grossesse | EMA valproate 2018 · EURAP | — | — | 2026-09 | data/calculators.ts:157 |
| calculators | etat-mal | Assistant état de mal individuel | AES 2016 (Glauser) | — | — | 2026-09 | data/calculators.ts:845 |
| calculators | fluides-sodium | Fluides et sodium par situation | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) · NICE CG174 | — | — | 2026-10 | data/calculators.ts:165 |
| calculators | fluids-enfant | Hydratation de l'enfant | APLS 2020 · Surviving Sepsis Campaign 2026 (adult-only fluid note) | — | — | 2026-10 | data/calculators.ts:629 |
| calculators | gap-metabolique | Trou anionique & osmolaire | Kumar & Clark · EXTRIP 2021 | — | — | 2026-09 | data/calculators.ts:37 |
| calculators | garde-fous | Ne pas oublier avant… | HAS checklist · OMS | — | — | 2026-09 | data/calculators.ts:1037 |
| calculators | gaz-advanced | Lecture avancee des gaz | Berlin 2012 · ROX index 2019 | — | — | 2026-09 | data/calculators.ts:221 |
| calculators | gaz-units | Conversion kPa / mmHg | SI units | — | — | 2026-09 | data/calculators.ts:229 |
| calculators | gazometrie | Gazométrie & ventilation | ARDSnet · The ICU Book (Marino) | — | — | 2026-09 | data/calculators.ts:565 |
| calculators | gcs | Glasgow (GCS) | Teasdale & Jennett 1974 (GCS) · ATLS 10e éd. | — | — | 2026-09 | data/calculators.ts:437 |
| calculators | geneva | Genève révisé (EP) | Le Gal 2006 (Arch Intern Med) | — | — | 2026-09 | data/calculators.ts:77 |
| calculators | guidage | Intervention guidée | SSC 2026 (adult sepsis timing/resuscitation) · ATLS · ERC 2021 | — | — | 2026-10 | data/calculators.ts:1021 |
| calculators | has-bled | HAS-BLED | Pisters et al. 2010 (HAS-BLED) · ESC FA 2020 | — | — | 2026-09 | data/calculators.ts:533 |
| calculators | heart | Score HEART (douleur thoracique) | HEART study | — | — | 2026-09 | data/calculators.ts:709 |
| calculators | hemo-digestive | Assistant HDO individuel | ESGE 2021 | — | — | 2026-09 | data/calculators.ts:941 |
| calculators | hemogramme | Lecture de l'hemogramme | SFH 2021 | — | — | 2026-09 | data/calculators.ts:261 |
| calculators | heparine | Héparine IV | RE.NAU Livret du médicament 2018 · CHEST Antithrombotic 2012 | — | — | 2026-09 | data/calculators.ts:541 |
| calculators | hpp | Assistant HPP individuel | OMS HPP 2012 · WOMAN 2017 · FIGO 2022 | — | — | 2026-09 | data/calculators.ts:829 |
| calculators | hyperkalemie | Assistant hyperkaliémie individuel | ERC 2021 · KDIGO 2020 | — | — | 2026-09 | data/calculators.ts:861 |
| calculators | hypoglycemie | Assistant hypoglycémie individuel | ISPAD 2022 · ADA 2023 | — | — | 2026-09 | data/calculators.ts:853 |
| calculators | hypothermie | Assistant hypothermie individuel | ERC 2021 hypothermie | — | — | 2026-09 | data/calculators.ts:949 |
| calculators | insuline | ACD — insuline IV | ADA Standards of Care 2025 · RE.NAU Livret du médicament 2018 | — | — | 2026-09 | data/calculators.ts:557 |
| calculators | interactions | Interactions graves | ANSM interactions | — | — | 2026-09 | data/calculators.ts:189 |
| calculators | iot-rsi | Assistant intubation individuel (RSI) | SFAR RSI/DAS 2023 · ERC airway 2021 | — | — | 2026-09 | data/calculators.ts:781 |
| calculators | jumeaux | Freres jumeaux : ne pas confondre | ANSM LASA | — | — | 2026-09 | data/calculators.ts:1029 |
| calculators | lactate | Lactate : valeur et évolution | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | — | — | 2026-10 | data/calculators.ts:285 |
| calculators | lrinec | LRINEC (fasciite nécrosante) | Wong 2004 · SPILF DHB 2019 | — | — | 2026-09 | data/calculators.ts:5 |
| calculators | mecanisme | Analyseur de mecanisme | ATLS 10e | — | — | 2026-09 | data/calculators.ts:333 |
| calculators | migraine | Assistant migraine aiguë individuel | EFNS/AHS 2021 | — | — | 2026-09 | data/calculators.ts:997 |
| calculators | monitoring | Monitoring des medicaments | BNF / RCP | — | — | 2026-09 | data/calculators.ts:125 |
| calculators | motif | Motif de recours (moteur) | Matrice éditoriale urgences vitales | — | — | 2026-09 | data/calculators.ts:397 |
| calculators | nac | NAC — trois poches | MHRA/EMA Paracétamol | — | — | 2026-09 | data/calculators.ts:653 |
| calculators | neonat-ran | Assistant minute d'or — nouveau-né | NRP 8e éd. 2020 · ERC 2021 nouveau-né | — | — | 2026-09 | data/calculators.ts:773 |
| calculators | nihss | NIHSS (AVC) | NINDS (NIHSS) · ESO/AHA AVC ischémique 2021 | — | — | 2026-09 | data/calculators.ts:525 |
| calculators | noac | NOAC / anticoagulants directs | EHRA 2021 | — | — | 2026-09 | data/calculators.ts:133 |
| calculators | noyade | Assistant noyade individuel | ERC 2021 noyade | — | — | 2026-09 | data/calculators.ts:957 |
| calculators | opioides | Assistant surdosage opioïde individuel | OMS naloxone 2023 · ERC 2021 | — | — | 2026-09 | data/calculators.ts:837 |
| calculators | pac | Assistant pneumonie (PAC) individuel | BTS 2019 (CURB-65) · Surviving Sepsis Campaign 2026 (sepsis timing distinction) | — | — | 2026-10 | data/calculators.ts:933 |
| calculators | perc | PERC | Kline PERC 2004 · ACEP 2018 | — | — | 2026-09 | data/calculators.ts:69 |
| calculators | perfusions | Vitesses PSE — paliers de débit | RE.NAU Livret du médicament 2018 | — | — | 2026-09 | data/calculators.ts:573 |
| calculators | plaies | Assistant plaies & suture individuel | Tintinalli 9e éd. | — | — | 2026-09 | data/calculators.ts:901 |
| calculators | pocus | Checklist POCUS / FAST | ACEP POCUS | — | — | 2026-09 | data/calculators.ts:317 |
| calculators | poids-pediatrique | Poids pédiatrique estimé | Luscombe & Owens 2007 (formule APLS) · AHA PALS 2020 | — | — | 2026-09 | data/calculators.ts:485 |
| calculators | qsofa | qSOFA (sepsis) | Sepsis-3 · Surviving Sepsis Campaign 2026 (screening adults) | — | — | 2026-10 | data/calculators.ts:693 |
| calculators | qtc | QTc (Bazett & Fridericia) | ESC 2022 | — | — | 2026-09 | data/calculators.ts:597 |
| calculators | quiz | Quiz — auto-évaluation | Contenu interne | — | — | 2026-09 | data/calculators.ts:725 |
| calculators | raaf | Assistant épistaxis individuel | AAO-HNS 2020 | — | — | 2026-09 | data/calculators.ts:893 |
| calculators | rau | Assistant RAU individuel | EAU 2023 | — | — | 2026-09 | data/calculators.ts:885 |
| calculators | rcp-equipe | Assistant RCP individuel | AHA ACLS 2025 · ERC 2021 | — | — | 2026-09 | data/calculators.ts:757 |
| calculators | rcp-peds | Assistant RCP pédiatrique individuel | PALS/AHA 2020 · Broselow clinical-database 2026 | — | — | 2026-09 | data/calculators.ts:789 |
| calculators | renal-dose | Bridge renal pharmacologique | Cockcroft-Gault · OMEDIT V2.3 (antibiotiques uniquement) · RCP ANSM Gabapentine Zentiva 400 mg (2026) · RCP ANSM Pregabaline HCS 75 mg (2024) | — | — | 2026-09 | data/calculators.ts:181 |
| calculators | revision | Revue éditoriale | Interne | — | — | 2026-09 | data/calculators.ts:741 |
| calculators | rsi | RSI par poids | SFAR 2019 | — | — | 2026-09 | data/calculators.ts:645 |
| calculators | rx-thorax | Grille radio thoracique | Radiopaedia | — | — | 2026-09 | data/calculators.ts:309 |
| calculators | safe-dose | Moteur de dose sure | ISMP high-alert | — | — | 2026-09 | data/calculators.ts:173 |
| calculators | sedation-palliative | Sedation palliative : doses | SFAP | — | — | 2026-09 | data/calculators.ts:109 |
| calculators | sepsis-cde | Assistant sepsis adulte | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | — | — | 2026-10 | data/calculators.ts:765 |
| calculators | sevrage-alcool | Assistant sevrage alcool individuel | ASAM 2020 · CIWA-Ar | — | — | 2026-09 | data/calculators.ts:973 |
| calculators | sodium | Correction du sodium | Adrogué-Madias (correction Na) · ERA/EAHyponatremia 2014 | — | — | 2026-09 | data/calculators.ts:549 |
| calculators | spesi | sPESI (embolie pulmonaire) | ESC 2019 EP | — | — | 2026-09 | data/calculators.ts:701 |
| calculators | spirometrie | Spirometrie et debit de pointe | GOLD 2024 · Cherniack | — | — | 2026-09 | data/calculators.ts:325 |
| calculators | start | Triage START / JumpSTART | START/JumpSTART — CDC · RE.NAU 2018 | — | — | 2026-09 | data/calculators.ts:685 |
| calculators | stats | Statistiques locales | Interne | — | — | 2026-09 | data/calculators.ts:749 |
| calculators | stemi | Localisation du ST+ (STEMI) | ESC STEMI 2023 · AHA/ACC NSTE-ACS 2025 | — | — | 2026-09 | data/calculators.ts:581 |
| calculators | syncope | Assistant syncope individuel | ESC syncope 2018 | — | — | 2026-09 | data/calculators.ts:909 |
| calculators | terrain | Mode terrain | Interne | — | — | 2026-09 | data/calculators.ts:1013 |
| calculators | tetanos | Assistant tétanos individuel | CDC/ACIP 2020 · Tintinalli 9e éd. | — | — | 2026-09 | data/calculators.ts:917 |
| calculators | thrombolyse | Thrombolyse par poids | ESC STEMI 2023 · AHA/ASA 2019 | — | — | 2026-09 | data/calculators.ts:613 |
| calculators | thyroide | Patterns thyroidiens | ATA 2014 | — | — | 2026-09 | data/calculators.ts:245 |
| calculators | timi-nstem | TIMI NSTEMI | Antman 2000 (TIMI 11B) | — | — | 2026-09 | data/calculators.ts:53 |
| calculators | toxidromes | Toxidromes (kashif) | Goldfrank's Toxicologic Emergencies | — | — | 2026-09 | data/calculators.ts:373 |
| calculators | transfusion | Transfusion massive | European Trauma Guidelines 2023 | — | — | 2026-09 | data/calculators.ts:677 |
| calculators | transfusion-a | Assistant transfusion individuel | HAS 2014 · OMS sang 2016 | — | — | 2026-09 | data/calculators.ts:925 |
| calculators | trauma-membres | Assistant trauma de membre individuel | Tintinalli 9e éd. | — | — | 2026-09 | data/calculators.ts:1005 |
| calculators | urines | Lecture de l'analyse urinaire | KDIGO 2012 | — | — | 2026-09 | data/calculators.ts:277 |
| calculators | ventilateur | Réglages ventilatoires | ARDSnet (Vt 6–8 mL/kg PIT) · SRLF 2021 | — | — | 2026-09 | data/calculators.ts:501 |
| calculators | vitaux | Choc en 30 secondes | ATLS 2018 | — | — | 2026-09 | data/calculators.ts:589 |
| calculators | vni | VNI — démarrage & titration | ERS/ATS NIV | — | — | 2026-09 | data/calculators.ts:637 |
| calculators | wells-ep | Wells (embolie pulmonaire) | Wells et al. 2000 · ESC EP 2019 | — | — | 2026-09 | data/calculators.ts:517 |
| calculators | wells-tvp | Wells TVP | Wells 1995-1997 | — | — | 2026-09 | data/calculators.ts:61 |
| calculators | westley | Westley (croup) | Westley 1978 · Groupe croup Canada 2022 | — | — | 2026-09 | data/calculators.ts:29 |
| checklists | malle-urgence | — | SFMU — matériel SMUR minimum ; RE.NAU Livret du médicament (Mars 2018) | — | — | 2026-09 | data/checklists.ts:82 |
| checklists | sauv-accueil | — | HAS organisation SU ; SFMU triage 2013 ; ERC 2021 (chaine de survie) | — | — | 2026-09 | data/checklists.ts:140 |
| checklists | transport-interhosp | — | Check-list transport SFAR 2019 ; HAS « Sortie du patient » ; RE.NAU régulation | — | — | 2026-09 | data/checklists.ts:26 |
| ecg | asystolie | Asystolie | AHA ACLS 2025 | — | — | 2026-08 | data/ecg.ts:98 |
| ecg | bav3 | Bloc AV complet (3e degré) | AHA bradycardies · ESC pacing | — | — | 2026-08 | data/ecg.ts:82 |
| ecg | bradycardie-sinusale | Bradycardie sinusale | AHA ACLS bradycardie 2025 | — | — | 2026-08 | data/ecg.ts:34 |
| ecg | fibrillation-auriculaire | Fibrillation auriculaire (FA) | AHA/ACC AF 2023 · ERC 2021 | — | — | 2026-08 | data/ecg.ts:42 |
| ecg | flutter | Flutter auriculaire | ESC SVT 2019 | — | — | 2026-08 | data/ecg.ts:50 |
| ecg | fv | Fibrillation ventriculaire | AHA ACLS 2025 · ERC 2021 | — | — | 2026-08 | data/ecg.ts:74 |
| ecg | rythme-sinusal | Rythme sinusal normal | AHA ECG basics | — | — | 2026-08 | data/ecg.ts:18 |
| ecg | stemi | SCA avec sus-décalage du ST (STEMI) | ESC STEMI 2023 | — | — | 2026-08 | data/ecg.ts:90 |
| ecg | tachycardie-sinusale | Tachycardie sinusale | AHA 2025 | — | — | 2026-08 | data/ecg.ts:26 |
| ecg | torsades | Torsades de pointes | AHA 2025 · ERC 2021 | — | — | 2026-08 | data/ecg.ts:66 |
| ecg | tv-sans-pouls | Tachycardie ventriculaire | AHA ACLS 2025 | — | — | 2026-08 | data/ecg.ts:58 |
| medications | acetazolamide | Acétazolamide | AAO glaucome aigu | — | — | 2026-09 | data/medications-p9.ts:166 |
| medications | acetylcysteine | N-acétylcystéine (NAC) | CAP paracétamol · Prescrire intox. médicamenteuses | — | — | 2026-08 | data/medications-p3.ts:58 |
| medications | acide-tranexamique | Acide tranexamique | CRASH-2 · WOMAN trial · ATLS 10e | — | — | 2026-08 | data/medications-p3.ts:85 |
| medications | adenosine | Adénosine | AHA ACLS 2025 — tachycardies · ERC 2021 | — | — | 2026-08 | data/medications-p2.ts:6 |
| medications | adrenaline | Adrénaline (Épinéphrine) | AHA ACLS 2025 · ERC 2021 · RCUK Anaphylaxis 2021 | — | — | 2026-08 | data/medications.ts:16 |
| medications | alteplase | Altéplase (rt-PA) | AHA/ASA stroke · ESC EP 2019 | — | — | 2026-09 | data/medications-p4.ts:24 |
| medications | amikacine | Amikacine | CA-SFM/SPILF/SFPT 2025 v1.1 — amikacine 25–30 mg/kg en 30 min, dose unique journalière (adultes non obèses, sans insuffisance rénale/hépatique) · SRLF 2015 — aminosides en réanimation : amikacine 25–30 mg/kg/j en choc septique, durée <5 jours · STPI Tunisie 2018 — PNA grave adulte uniquement : amikacine 30 mg/kg/j pendant 1–3 jours (référence historique, protocole actuel à confirmer) · ANSM (France) — RCP AMIKACINE VIATRIS 250 mg, mise à jour 27/05/2024, §§4.2–4.6 (15–30 mg/kg/j, poids corrigé, surveillance) · ANSM (France) — RCP AMIKACINE PANPHARMA 250 mg/mL, mise à jour 30/07/2024, §§4.2–4.4 et 6.2–6.4 (schéma différent, plafond produit 1,5 g/j) | — | — | 2026-10 | data/medications-p4.ts:106 |
| medications | amiodarone | Amiodarone | AHA ACLS 2025 · AHA PALS 2020 · ERC 2021 | — | — | 2026-08 | data/medications.ts:63 |
| medications | amoxicilline | Amoxicilline | SPILF · ATS-IDSA 2019 · Livret ATB Tunisie | — | — | 2026-09 | data/medications-p8.ts:6 |
| medications | aspirine | Aspirine (acide acétylsalicylique) | ESC NSTE-ACS 2023 · ACC/AHA STEMI | — | — | 2026-08 | data/medications-p3.ts:146 |
| medications | atropine | Atropine | AHA ACLS 2025 · AHA PALS 2020 | — | — | 2026-08 | data/medications.ts:106 |
| medications | azithromycine | Azithromycine | ATS-IDSA 2019 · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p8.ts:46 |
| medications | bicarbonate | Bicarbonate de sodium 8,4 % | AHA 2023 · positions tox tricycliques | — | — | 2026-08 | data/medications-p2.ts:79 |
| medications | cefotaxime | Céfotaxime (C3G) | ANSM (France) — RCP Céfotaxime Panpharma 1 g, mise à jour 12/04/2024, §§4.1–4.8 et 6.2–6.4 · SSC 2026 (délai d'antibiothérapie adulte uniquement) | — | — | 2026-10 | data/medications-p4.ts:61 |
| medications | chlorure-potassium | Chlorure de potassium (KCl) | Réanimation métabolique · Société française de pharmacie clinique | — | — | 2026-09 | data/medications-p11.ts:206 |
| medications | ciprofloxacine | Ciprofloxacine | SPILF PNA 2018 · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p11.ts:86 |
| medications | clindamycine | Clindamycine | SPILF DHB 2019 · IDSA SSTI 2014 | — | — | 2026-09 | data/medications-p9.ts:86 |
| medications | colchicine | Colchicine | ESC pericardial 2015 · EULAR gout | — | — | 2026-09 | data/medications-p11.ts:166 |
| medications | dexamethasone | Dexaméthasone | Endocrine Society 2016 · RE.NAU 2018 | — | — | 2026-09 | data/medications-p7.ts:133 |
| medications | diazepam | Diazépam | ILAE état de mal · SFAR | — | — | 2026-08 | data/medications-p2.ts:227 |
| medications | dobutamine | Dobutamine | ANSM (France) — RCP DOBUTAMINE PANPHARMA 250 mg/20 mL, mise à jour 18/03/2022, §§4.1–4.4 et 6.2–6.6 (référence française ; ne vaut pas validation tunisienne) · SSC 2026 (indication d'inotrope dans le sepsis adulte ; pas de posologie précisée) | — | — | 2026-10 | data/medications-p5.ts:151 |
| medications | emulsion-lipidique | Émulsion lipidique 20 % (Intralipide®) | ACMT lipid emulsion 2017 · ASRA LAST 2020 | — | — | 2026-09 | data/medications-p7.ts:7 |
| medications | enoxaparine | Énoxaparine (HBPM) | ESC NSTE-ACS 2023 · ASH VTE | — | — | 2026-08 | data/medications-p3.ts:173 |
| medications | esmolol | Esmolol (Béta-bloquant ultra-court) | AHA 2025 Tachycardie · ESC arythmie | — | — | 2026-09 | data/medications-p5.ts:23 |
| medications | fentanyl | Fentanyl | SFAR sédation SU · PALS 2020 | — | — | 2026-08 | data/medications-p2.ts:291 |
| medications | flumazenil | Flumazénil | HAS intox. benzodiazépines · CAP tox | — | — | 2026-08 | data/medications-p3.ts:285 |
| medications | furosemide | Furosémide | ESC IC aiguë 2021 · HAS OAP | — | — | 2026-08 | data/medications.ts:277 |
| medications | gentamicine | Gentamicine | ESC endocarditis 2023 · SPILF | — | — | 2026-09 | data/medications-p11.ts:126 |
| medications | glucagon | Glucagon | ADA Standards of Care · HAS hypoglycémie | — | — | 2026-09 | data/medications-p4.ts:43 |
| medications | gluconate-calcium | Gluconate de calcium 10 % | AHA 2023 · travaux hyperK | — | — | 2026-08 | data/medications-p2.ts:109 |
| medications | glucose30 | Glucose 30 % (G30) | HAS hypoglycémie urgence · AHA FOAM tox | — | — | 2026-08 | data/medications.ts:247 |
| medications | haloperidol | Halopéridol | SCCM PADIS 2018 · ASAM 2020 | — | — | 2026-09 | data/medications-p10.ts:46 |
| medications | heparine | Héparine sodique (HNF) | ACC/AHA VTE · SSC 2021 | — | — | 2026-09 | data/medications-p4.ts:6 |
| medications | hydrocortisone | Hydrocortisone (HSHC) | Surviving Sepsis Campaign 2021 (dose reference) · Surviving Sepsis Campaign 2026 (IV steroid recommendation) · GINA 2024 · RCUK | — | — | 2026-10 | data/medications-p2.ts:203 |
| medications | insuline-rapide | Insuline rapide (Actrapid) | ADA/EASD consensus DKA · AHA hyperK | — | — | 2026-08 | data/medications-p2.ts:140 |
| medications | ipratropium | Ipratropium (Atrovent®) | GINA 2024 · GOLD 2025 | — | — | 2026-09 | data/medications-p5.ts:115 |
| medications | isoprenaline | Isoprénaline (Isuprel®) | RE.NAU 2018 · AHA ACLS | — | — | 2026-09 | data/medications-p6.ts:6 |
| medications | ketamine | Kétamine | SFAR RSI · SFMU/UUS agitation | — | — | 2026-08 | data/medications-p3.ts:5 |
| medications | ketoprofene | Kétoprofène | EAU urolithiasis 2023 · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p11.ts:6 |
| medications | labetalol | Labétalol (Trandate®) | RE.NAU 2018 | — | — | 2026-09 | data/medications-p6.ts:44 |
| medications | levetiracetam | Lévétiracétam | ESETT 2019 · EAN status epilepticus | — | — | 2026-09 | data/medications-p4.ts:166 |
| medications | lidocaine | Lidocaïne (antiaarythmique) | AHA ACLS 2025 | — | — | 2026-08 | data/medications-p3.ts:227 |
| medications | lorazepam | Lorazépam (Temesta®) | SFU agitation · ESICM sédation | — | — | 2026-09 | data/medications-p5.ts:97 |
| medications | mannitol | Mannitol 20 % | Brain Trauma Foundation · AAO glaucome | — | — | 2026-09 | data/medications-p9.ts:206 |
| medications | metronidazole | Métronidazole | SPILF · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p10.ts:126 |
| medications | midazolam | Midazolam | AES/ILAE status epilepticus · SFAR | — | — | 2026-08 | data/medications.ts:182 |
| medications | morphine | Morphine | SFAR analgésie SU · ACC/AHA | — | — | 2026-08 | data/medications-p2.ts:257 |
| medications | nacl-hypertonique | NaCl hypertonique 3 % | Guidelines européennes hyponatrémie 2014 · RE.NAU | — | — | 2026-09 | data/medications-p7.ts:34 |
| medications | naloxone | Naloxone | AHA 2023 man. spéciales intoxications · HAS tox urgence | — | — | 2026-08 | data/medications.ts:216 |
| medications | nicardipine | Nicardipine (Loxen®) | AHA/ACC hypertension d'urgence · ESC 2024 | — | — | 2026-09 | data/medications-p5.ts:60 |
| medications | nimodipine | Nimodipine | AHA/ASA HSA 2023 | — | — | 2026-09 | data/medications-p9.ts:126 |
| medications | noradrenaline | Noradrénaline | Livret RE.NAU 2018 (dose/preparation) · Surviving Sepsis Campaign 2026 (MAP, first-line agent, peripheral start) · ERC 2021 | — | — | 2026-10 | data/medications.ts:140 |
| medications | octreotide | Octréotide (Sandostatine®) | RE.NAU 2018 | — | — | 2026-09 | data/medications-p6.ts:82 |
| medications | ondansetron | Ondansétron | AAP gastro-entérite 2014 · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p10.ts:166 |
| medications | oxytocine | Ocytocine | OMS HPP · FIGO atonie | — | — | 2026-08 | data/medications-p3.ts:200 |
| medications | paracetamol | Paracétamol IV | SFAR analgésie · HAS prescription | — | — | 2026-08 | data/medications-p3.ts:36 |
| medications | phenobarbital | Phénobarbital | AES status epilepticus 2016 · ASAM 2020 | — | — | 2026-09 | data/medications-p10.ts:86 |
| medications | phenylephrine | Phényléphrine (Néosynéphrine®) | AHA 2025 post-ACR · ASA vasopresseurs | — | — | 2026-09 | data/medications-p5.ts:42 |
| medications | piperacilline-tazobactam | Pipéracilline-tazobactam | IDSA 2010 · SPILF · Résumé des caractéristiques produit | — | — | 2026-09 | data/medications-p9.ts:6 |
| medications | propofol | Propofol (Diprivan®) | SFAR RSI · AHA 2025 | — | — | 2026-09 | data/medications-p5.ts:5 |
| medications | propranolol | Propranolol | ATA 2016 · RE.NAU 2018 | — | — | 2026-09 | data/medications-p7.ts:97 |
| medications | propylthiouracil | Propylthiouracile (PTU) | ATA thyréotoxicose 2016 | — | — | 2026-09 | data/medications-p7.ts:64 |
| medications | rocuronium | Rocuronium | SFAR RSI/DAS · ERC airway | — | — | 2026-08 | data/medications-p3.ts:254 |
| medications | salbutamol | Salbutamol | GINA 2024 · BTS/SIGN | — | — | 2026-08 | data/medications-p2.ts:173 |
| medications | succinylcholine | Succinylcholine (Célocurine®) | SFAR RSI · ATLS 10 | — | — | 2026-09 | data/medications-p5.ts:78 |
| medications | sufentanil | Sufentanil (Sufenta®) | RE.NAU 2018 · SFAR sédation | — | — | 2026-09 | data/medications-p6.ts:63 |
| medications | sulfate-magnesium | Sulfate de magnésium (MgSO4) | ISSHP pré-éclampsie · AHA ACLS 2025 · GINA 2024 | — | — | 2026-08 | data/medications-p2.ts:46 |
| medications | tamsulosine | Tamsulosine | EAU urolithiasis 2023 | — | — | 2026-09 | data/medications-p11.ts:46 |
| medications | terbutaline | Terbutaline SC (Bricanyl®) | FGO/SFAR obstétrique · OMS travail prématuré | — | — | 2026-09 | data/medications-p5.ts:133 |
| medications | thiamine | Thiamine (vitamine B1) | EFNS Wernicke 2010 · ASAM 2020 | — | — | 2026-09 | data/medications-p10.ts:6 |
| medications | trinitrine | Trinitrine (glycéryl trinitrate) | ESC NSTE-ACS 2023 · AHA insuffisance cardiaque aiguë | — | — | 2026-08 | data/medications-p3.ts:113 |
| medications | urapidil | Urapidil (Eupressyl®) | RE.NAU 2018 | — | — | 2026-09 | data/medications-p6.ts:25 |
| medications | vancomycine | Vancomycine | ASHP/IDSA vancomycine 2020 | — | — | 2026-09 | data/medications-p9.ts:46 |
| perfusions | acide-tranexamique | Acide tranéxamique (Exacyl®) — entretien post-charge | Livret RE.NAU 2018 ; CRASH-2 | — | — | — | data/perfusions.ts:341 |
| perfusions | adrenaline | Adrénaline — choc anaphylactique réfractaire | Livret RE.NAU 2018 ; ERC 2021 anaphylaxie | — | — | — | data/perfusions.ts:53 |
| perfusions | adrenaline | Adrénaline — choc cardiogénique / post-AC (µg/kg/min) | Livret RE.NAU 2018 ; ERC 2021 | — | — | — | data/perfusions.ts:66 |
| perfusions | adrenaline | Adrénaline — bradycardie résistante à l'atropine | AHA ACLS 2020 ; ERC 2021 | — | — | — | data/perfusions.ts:77 |
| perfusions | amiodarone | Cordarone® — charge TdR (5 mg/kg sur 1 h) | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:179 |
| perfusions | amiodarone | Cordarone® — entretien (relais continu) | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:192 |
| perfusions | dobutamine | Dobutamine — inotrope (adulte) | ANSM (France) — RCP DOBUTAMINE PANPHARMA, mise à jour 18/03/2022, §§4.1–4.4 et 6.6 ; SSC 2026 (indication septique adulte) | — | — | — | data/perfusions.ts:88 |
| perfusions | esmolol | Esmolol (Brevibloc®) — SAA / FA rapide / dissection | Livret RE.NAU 2018 ; ESC 2014 SAA | — | — | — | data/perfusions.ts:166 |
| perfusions | fentanyl | Fentanyl — sédation/analgésie | Livret RE.NAU 2018 ; SFAR | — | — | — | data/perfusions.ts:255 |
| perfusions | heparine | Héparine HNF — SCA (bolus 70 UI/kg puis 12 UI/kg/h) | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:292 |
| perfusions | heparine | Héparine HNF — EP (bolus 80 UI/kg puis 18 UI/kg/h) | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:304 |
| perfusions | insuline-rapide | Insuline rapide (Actrapid®) — ACD/HHS | Livret RE.NAU 2018 ; SFD/SFE 2023 | — | — | — | data/perfusions.ts:317 |
| perfusions | isoprenaline | Isoprénaline (Isuprel®) — BAV / torsades sur QT non congénital | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:101 |
| perfusions | ketamine | Kétamine (Kétalar®) — sédation prolongée | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:242 |
| perfusions | labetalol | Labétalol (Trandate®) — SAA / prééclampsie | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:141 |
| perfusions | midazolam | Midazolam (Hypnovel®) — sédation | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:229 |
| perfusions | morphine | Morphine — sédation/analgésie continue | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:279 |
| perfusions | nicardipine | Nicardipine (Loxen®) — urgence hypertensive / SAA | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:115 |
| perfusions | noradrenaline | Noradrénaline — choc septique (µg/kg/min) | Livret RE.NAU 2018 (dose/préparation) ; Surviving Sepsis Campaign 2026 (first-line agent, MAP target, peripheral start) | — | — | — | data/perfusions.ts:27 |
| perfusions | noradrenaline | Noradrénaline — RE.NAU (mg/h) | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:40 |
| perfusions | octreotide | Octréotide (Sandostatine®) — rupture varices œsophagiennes | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:329 |
| perfusions | oxytocine | Ocytocine (Syntocinon®) — hémorragie du post-partum | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:352 |
| perfusions | phenylephrine | Phényléphrine — hypotension peropératoire / rachianesthésie (adulte) | ANSM (France) — RCP PHENYLEPHRINE RENAUDIN 100 µg/mL, mise à jour 23/08/2024, §§4.1–4.4 ; SSC 2026 (noradrénaline 1re ligne en choc septique adulte) | — | — | — | data/perfusions.ts:364 |
| perfusions | propofol | Propofol (Diprivan®) — sédation entretenue | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:216 |
| perfusions | sufentanil | Sufentanil (Sufenta®) — sédation patient ventilé | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:267 |
| perfusions | sulfate-magnesium | Sulfate de magnésium — torsades / hypokaliémie | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:203 |
| perfusions | trinitrine | Trinitrine IV — OAP / SCA | Livret RE.NAU 2018 ; ESC 2021 OAP | — | — | — | data/perfusions.ts:153 |
| perfusions | urapidil | Urapidil (Eupressyl®) — SAA / urgence hypertensive | Livret RE.NAU 2018 | — | — | — | data/perfusions.ts:128 |
| procedures | accouchement-inopine | Accouchement inopiné (pré-hospitalier) | WHO Intrapartum Care 2018, recommendations 34–36 · WHO Consolidated PPH Guidelines 2025, recommendations 19, 20, 23 and 26 · AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 | — | — | 2026-10 | data/procedures.ts:230 |
| procedures | defibrillation | Défibrillation (arrêt cardiaque sans pouls) | AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376; Adult Cardiac Arrest Algorithm 2025 · AHA/AAP PALS 2025, DOI 10.1161/CIR.0000000000001368; ERC PLS 2025, DOI 10.1016/j.resuscitation.2025.110767 · ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 | — | — | 2026-10 | data/procedures.ts:59 |
| procedures | exsufflation | Suspicion de pneumothorax sous tension — décompression urgente | Protocole trauma local à préciser avant utilisation comme guide technique · Ahmad et al., WJES 2025, méta-analyse longueur/site, DOI 10.1186/s13017-025-00613-7 | — | — | 2026-10 | data/procedures.ts:161 |
| procedures | immobilisation-rachis | Précautions rachidiennes / immobilisation sélective | NICE NG41, recommendations 1.1.2–1.1.4, 1.1.13–1.1.14 and 1.1.19 | — | — | 2026-10 | data/procedures.ts:208 |
| procedures | intra-osseuse | Voie intra-osseuse (VIO) | AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376 (IV/IO in cardiac arrest) · Teleflex Arrow EZ-IO IFU 8049, Rev. 01 (device-specific indications, sites, contraindications and dwell time) | — | — | 2026-10 | data/procedures.ts:135 |
| procedures | iot-rsi | Intubation orotrachéale (RSI) | SFAR/SFMU RFE 2025, DOI 10.1684/afmu.2025.0673 (R2.2.1, R3.1–R3.5, R5.1–R5.2) · ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 | — | — | 2026-10 | data/procedures.ts:17 |
| procedures | masque-larynge | Dispositif supraglottique (masque laryngé, i-gel…) | ERC Adult ALS 2025, DOI 10.1016/j.resuscitation.2025.110769 (scope: adult ALS) · AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (newborn-specific guidance) · Use the instructions for the exact supraglottic device selected | — | — | 2026-10 | data/procedures.ts:184 |
| procedures | neonat-ran | Réanimation du nouveau-né (salle de naissance) | AHA/AAP Neonatal Resuscitation 2025, DOI 10.1161/CIR.0000000000001367 (sections ventilation, oxygen, compressions, vascular access, epinephrine) · ERC Newborn Resuscitation 2025, DOI 10.1016/j.resuscitation.2025.110766 · Sankaran et al., Arch Dis Child Fetal Neonatal Ed 2021, DOI 10.1136/archdischild-2020-321034 (animal model; flush evidence) | — | — | 2026-10 | data/procedures.ts:255 |
| procedures | synchronized-cardioversion | Cardioversion synchronisée (tachyarythmie avec pouls) | AHA Electrical Cardioversion Algorithm 2025 · AHA Adult ALS 2025, DOI 10.1161/CIR.0000000000001376 | — | — | 2026-10 | data/procedures.ts:86 |
| procedures | vvp | Voie veineuse périphérique (VVP) | WHO Peripheral Catheter Guidelines 2024, section 3 (ISBN 978-92-4-009382-9) · CDC Intravascular Catheter Recommendations, sections 2.1, 3 and 5.1 | — | — | 2026-10 | data/procedures.ts:110 |
| protocols | acidocetose-diabetique | Acidocétose diabétique (ACD) | ADA/EASD consensus DKA 2024 · BSPED pédia | — | — | 2026-08 | data/protocols-p2.ts:217 |
| protocols | acr-adulte | Arrêt cardiaque de l'adulte (ACR) | AHA ACLS Guidelines 2025 · ERC Guidelines 2021 | — | — | 2026-08 | data/protocols.ts:23 |
| protocols | acr-pediatrique | ACR de l'enfant (PALS) | AHA PALS 2020 · ERC Paediatric Life Support 2021 | — | — | 2026-08 | data/protocols.ts:221 |
| protocols | agitation-aigue | Agitation aiguë / hyperactivité psychomotrice | SFMU agitation / psychiatrie urgence · BAP NICE | — | — | 2026-08 | data/protocols-p3.ts:47 |
| protocols | amputation-crush | Amputation traumatique & syndrome d'écrasement | ATLS 10e éd. · Guidelines crush disaster (ISN 2023) | — | — | 2026-09 | data/protocols-p7.ts:42 |
| protocols | anaphylaxie | Anaphylaxie | Resuscitation Council UK 2021 · ERC 2021 · EAACI | — | — | 2026-08 | data/protocols.ts:76 |
| protocols | angiocholite | Angiocholite aiguë (cholangite) | Tokyo Guidelines 2018 · EASL | — | — | 2026-09 | data/protocols-p11.ts:301 |
| protocols | appendicite | Appendicite aiguë | WSES Jerusalem guidelines 2020 | — | — | 2026-09 | data/protocols-p11.ts:259 |
| protocols | asthme-aigu-grave | Crise d'asthme aigu grave | GINA 2024 · BTS/SIGN 2024 | — | — | 2026-08 | data/protocols-p2.ts:133 |
| protocols | avc | AVC phase aiguë | AHA/ASA 2019 (mise à jour 2023) · ESO Guidelines | — | — | 2026-08 | data/protocols.ts:128 |
| protocols | bradycardie | Bradycardie symptomatique | AHA 2025 Bradycardia algorithm · ERC 2021 | — | — | 2026-09 | data/protocols-p4.ts:6 |
| protocols | bronchiolite | Bronchiolite aiguë du nourrisson | HAS bronchiolite 2019 · AAP 2014 | — | — | 2026-09 | data/protocols-p9.ts:227 |
| protocols | brulure-grave | Brûlure grave | ABA / PHTLS brûlure · ERC traumatologie | — | — | 2026-08 | data/protocols-p3.ts:211 |
| protocols | choc-septique | Sepsis / Choc septique | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | — | — | 2026-10 | data/protocols-p2.ts:173 |
| protocols | colique-nephretique | Colique néphrétique | EAU urolithiasis 2023 · AFU | — | — | 2026-09 | data/protocols-p12.ts:7 |
| protocols | convulsion-febrile | Convulsion fébrile (enfant) | AAP febrile seizures · SFP/nice | — | — | 2026-09 | data/protocols-p6.ts:102 |
| protocols | corps-etranger-aerien | Obstruction aiguë des voies aériennes par corps étranger | ERC 2021 choking · AHA BLS 2025 | — | — | 2026-09 | data/protocols-p9.ts:299 |
| protocols | coup-de-chaleur | Coup de chaleur (hyperthermie grave) | AHA Heat stroke · Société française de médecine d'urgence | — | — | 2026-09 | data/protocols-p4.ts:226 |
| protocols | crise-surrenale | Insuffisance surrénale aiguë (crise addisonienne) | Endocrine Society 2016 · SFMU — insuffisance surrénale aiguë | — | — | 2026-09 | data/protocols-p8.ts:219 |
| protocols | crise-thyrotoxique | Crise thyréotoxique (tempête thyroïdienne) | ATA thyréotoxicose 2016 · Burch-Wartofsky 1993 | — | — | 2026-09 | data/protocols-p8.ts:254 |
| protocols | deshydratation-enfant | Déshydratation aiguë de l'enfant (entérite) | OMS déshydratation · ESPGHAN entérite aiguë | — | — | 2026-08 | data/protocols-p3.ts:252 |
| protocols | dissection-aortique | Dissection aortique (syndrome aortique aigu) | ESC aorte 2022 · AHA/ACC 2022 | — | — | 2026-09 | data/protocols-p9.ts:8 |
| protocols | drepanocytose-crise | Crise drépanocytaire (CVO & syndrome thoracique aigu) | HAS drépanocytose 2010 · ASH sickle cell 2020 | — | — | 2026-09 | data/protocols-p9.ts:336 |
| protocols | dystocie-epaules | Dystocie des épaules | RCOG shoulder dystocia 2012 · HELPERR/ALSO | — | — | 2026-09 | data/protocols-p10.ts:117 |
| protocols | eclampsie | Éclampsie / Pré-éclampsie sévère | ISSHP pré-éclampsie 2021 · FIGO · OMS | — | — | 2026-08 | data/protocols-p2.ts:299 |
| protocols | electrocution | Électrisation / électrocution | ATLS électrocution · AHA arrhythmias électriques | — | — | 2026-09 | data/protocols-p6.ts:143 |
| protocols | embolie-pulmonaire | Embolie pulmonaire (suspicion / haute probabilité) | ESC 2019/2024 EP guidelines · HAS | — | — | 2026-09 | data/protocols-p4.ts:102 |
| protocols | endocardite-infectieuse | Endocardite infectieuse | ESC endocarditis 2023 · Duke modifiés | — | — | 2026-09 | data/protocols-p12.ts:170 |
| protocols | epistaxis | Épistaxis (saignement de nez) | ENT-UK epistaxis 2020 · Société française ORL | — | — | 2026-09 | data/protocols-p10.ts:340 |
| protocols | etat-mal-epileptique | État de mal convulsif (tonico-clonique) | ILAE état de mal 2020 · SRLF convulsions aiguës | — | — | 2026-08 | data/protocols-p2.ts:93 |
| protocols | exacerbation-bpco | Exacerbation de BPCO | GOLD 2025 · BTS/SIGN · SRLF VNI | — | — | 2026-09 | data/protocols-p6.ts:54 |
| protocols | fa-nouvelle | Fibrillation atriale de découverte récente | ESC AF 2024 | — | — | 2026-09 | data/protocols-p7.ts:280 |
| protocols | fasciite-necrosante | Fasciite nécrosante (dermo-hypodermite bactérienne nécrosante) | SPILF DHB 2019 · LRINEC Wong 2004 | — | — | 2026-09 | data/protocols-p10.ts:154 |
| protocols | fast-echo | eFAST — échographie d'urgence au lit | ATLS 10e éd. · WINFOCUS 2020 | — | — | 2026-09 | data/protocols-p7.ts:176 |
| protocols | fievre-neutropenique | Fièvre chez le neutropénique | IDSA neutropenic fever 2010 · ESMO 2016 · MASCC · Surviving Sepsis Campaign 2026 (adult shock fluids) | — | — | 2026-10 | data/protocols-p10.ts:228 |
| protocols | fracture-ouverte | Fracture ouverte | BOA/BAPRAS guidelines 2020 · ATLS 10e éd. | — | — | 2026-09 | data/protocols-p7.ts:111 |
| protocols | geu | Grossesse extra-utérine (GEU) | CNGOF GEU · RCOG ectopic 2016 | — | — | 2026-09 | data/protocols-p10.ts:81 |
| protocols | glaucome-aigu | Glaucome aigu à angle fermé | AAO acute angle closure · SFU ophtalmologie | — | — | 2026-09 | data/protocols-p10.ts:303 |
| protocols | hemorragie-digestive-basse | Hémorragie digestive basse (HDB) | ACG lower GI bleeding 2016 · ESGE | — | — | 2026-09 | data/protocols-p12.ts:294 |
| protocols | hemorragie-digestive-haute | Hémorragie digestive haute | ESGE 2021 · ACG upper GI bleeding | — | — | 2026-09 | data/protocols-p6.ts:5 |
| protocols | hemorragie-post-partum | Hémorragie du post-partum (HPP) | OMS HPP 2023 · WOMAN trial · FIGO | — | — | 2026-08 | data/protocols-p3.ts:5 |
| protocols | hemorragie-sous-arachnoidienne | Hémorragie sous-arachnoïdienne (rupture d'anévrisme) | AHA/ASA HSA 2023 · EUSI | — | — | 2026-09 | data/protocols-p10.ts:191 |
| protocols | hhs-hyperosmolaire | État hyperosmolaire hyperglycémique (HHS) | ADA/EASD consensus 2024 · JHES guidelines | — | — | 2026-09 | data/protocols-p12.ts:211 |
| protocols | hta-urgence | Urgence hypertensive (avec atteinte d'organe) | ESC/ESH hypertension guidelines · AHA 2025 | — | — | 2026-09 | data/protocols-p5.ts:101 |
| protocols | hyperkaliemie | Hyperkaliémie sévère | AHA 2023 · KDIGO/US guidelines hyperK | — | — | 2026-08 | data/protocols-p2.ts:259 |
| protocols | hypertension-gravidique | Pré-éclampsie sévère / éclampsie | ACOG/ISSHP pré-éclampsie · SFAR obstétrique | — | — | 2026-09 | data/protocols-p6.ts:186 |
| protocols | hypoglycemie | Hypoglycémie sévère (< 0,5 g/L avec signes) | ADA 2026 · HAS — diabète | — | — | 2026-09 | data/protocols-p4.ts:143 |
| protocols | hyponatremie-severe | Hyponatrémie sévère symptomatique | Guidelines européennes hyponatrémie 2014 (ESICM/ERA-EDTA) · UpToDate | — | — | 2026-09 | data/protocols-p8.ts:184 |
| protocols | hypothermie | Hypothermie accidentelle | ERC 2021 Hypothermia · AHA 2025 | — | — | 2026-09 | data/protocols-p5.ts:228 |
| protocols | ingestion-caustique | Ingestion de caustique (eau de Javel, acide, soude) | ESGE caustiques 2015 · Centre Anti Poison Tunis | — | — | 2026-09 | data/protocols-p10.ts:7 |
| protocols | intoxication-alcool-aigue | Intoxication éthylique aiguë (ivresse) | SAMU intoxications · ACEP alcohol intoxication | — | — | 2026-09 | data/protocols-p12.ts:376 |
| protocols | intoxication-bb-icc | Intoxication aux bêta-bloquants et inhibiteurs calciques | ACMT/AACT expert consensus 2017 · UpToDate CCB/BB poisoning | — | — | 2026-09 | data/protocols-p8.ts:78 |
| protocols | intoxication-co | Intoxication oxycarbonée (CO) | SRLF/SFMU — intoxication CO · ERC 2021 | — | — | 2026-09 | data/protocols-p5.ts:54 |
| protocols | intoxication-digoxine | Intoxication à la digoxine | Goldfrank's · Antidote registry Tunisia | — | — | 2026-09 | data/protocols-p11.ts:91 |
| protocols | intoxication-lithium | Intoxication au lithium | EXTRIP lithium 2015 · Goldfrank's | — | — | 2026-09 | data/protocols-p11.ts:133 |
| protocols | intoxication-medicamenteuse | Intoxication médicamenteuse aiguë (paracétamol, BZD, opioïdes, cardiotoxiques) | Centre antipoison Tunis 71 335 500 · SRLF — intoxications médicamenteuses | — | — | 2026-09 | data/protocols-p5.ts:269 |
| protocols | intoxication-methanol | Intoxication au méthanol (alcool frelaté) | EXTRIP methanol 2021 · UpToDate methanol poisoning · Centre Anti Poison Tunis | — | — | 2026-09 | data/protocols-p8.ts:7 |
| protocols | intoxication-opioides | Intoxication aux opioïdes | Goldfrank's Toxicologic Emergencies · SAMU | — | — | 2026-09 | data/protocols-p11.ts:7 |
| protocols | intoxication-organophosphores | Intoxication organophosphorée (pesticides) | CAP/SRLF tox · OMS pesticides | — | — | 2026-08 | data/protocols-p3.ts:129 |
| protocols | intoxication-paracetamol | Intoxication au paracétamol | CAP paracétamol · Prescrire antidotes | — | — | 2026-08 | data/protocols-p3.ts:88 |
| protocols | intoxication-phosphure-aluminium | Intoxication au phosphure d'aluminium (« grain tablets ») | Proudfoot 2019 review · CNPP Tunisie | — | — | 2026-09 | data/protocols-p7.ts:209 |
| protocols | intoxication-salicyles | Intoxication aux salicylés (aspirine) | EXTRIP salicylates 2018 · Goldfrank's | — | — | 2026-09 | data/protocols-p11.ts:175 |
| protocols | intoxication-tricycliques | Intoxication aux antidépresseurs tricycliques | Toxbase TCA · AACT/EAPCCT position statement · UpToDate | — | — | 2026-09 | data/protocols-p8.ts:43 |
| protocols | invagination-intestinale | Invagination intestinale aiguë (IIA) | ESPR intussusception · SFCP | — | — | 2026-09 | data/protocols-p12.ts:253 |
| protocols | ischemie-membre-aigu | Ischémie aiguë de membre | ESVS périphérique 2017 · Rutherford classification | — | — | 2026-09 | data/protocols-p9.ts:117 |
| protocols | ischemie-mesenterique | Ischémie mésentérique aiguë | WSES 2017 · ESVM mésentérique | — | — | 2026-09 | data/protocols-p9.ts:81 |
| protocols | laryngite-croup | Laryngite aiguë (croup) de l'enfant | Groupe croup Canada 2022 · NICE croup | — | — | 2026-09 | data/protocols-p9.ts:264 |
| protocols | meningite-bacterienne | Méningite bactérienne & purpura fulminans | ESCMID méningites 2016 · SPILF 2019 | — | — | 2026-09 | data/protocols-p9.ts:153 |
| protocols | morsure-serpent | Morsure de serpent (vipères tunisiennes) | OMS envenimations 2016 · Institut Pasteur de Tunis · Médecine tropicale — vipères du Maghreb | — | — | 2026-09 | data/protocols-p8.ts:114 |
| protocols | myocardite | Myocardite aiguë | ESC myocardite 2023 · AHA scientific statement | — | — | 2026-09 | data/protocols-p7.ts:315 |
| protocols | noyade | Noyade (submersion) | ERC 2021 Drowning · SRLF | — | — | 2026-09 | data/protocols-p5.ts:185 |
| protocols | oap | Œdème aigu du poumon (OAP) | ESC insuffisance cardiaque aiguë 2021 · SFMU OAP | — | — | 2026-08 | data/protocols-p2.ts:50 |
| protocols | occlusion-intestinale | Occlusion intestinale aiguë | WSES ASBO 2017 · Bologna guidelines | — | — | 2026-09 | data/protocols-p11.ts:342 |
| protocols | oeil-chimique | Brûlure oculaire chimique | Roper-Hall/Dua classification · SFU ophtalmologie 2022 | — | — | 2026-09 | data/protocols-p7.ts:146 |
| protocols | pancreatite-aigue | Pancréatite aiguë | ACG pancreatitis 2024 · IAP/APA guidelines | — | — | 2026-09 | data/protocols-p11.ts:217 |
| protocols | pelvis-instable | Fracture du bassin instable | ATLS 10e éd. · Western Trauma Association 2023 | — | — | 2026-09 | data/protocols-p7.ts:6 |
| protocols | perforation-peritonite | Perforation d'organe creux & péritonite | WSES perforated peptic ulcer 2020 | — | — | 2026-09 | data/protocols-p12.ts:335 |
| protocols | pericardite-aigue | Péricardite aiguë | ESC pericardial diseases 2015 | — | — | 2026-09 | data/protocols-p12.ts:130 |
| protocols | pile-bouton | Ingestion de pile bouton | NASPGHAN 2015 · Poison控制中心 button battery | — | — | 2026-09 | data/protocols-p10.ts:44 |
| protocols | piqre-scorpion | Envenimation scorpionique | SFMU/SRLF recommandations envenimation · Centre antipoison Tunis 71 335 500 | — | — | 2026-09 | data/protocols-p5.ts:5 |
| protocols | pneumonie-aigue | Pneumonie aiguë communautaire | BTS CAP 2023 · SPILF/ATS-IDSA | — | — | 2026-09 | data/protocols-p9.ts:190 |
| protocols | pneumothorax-suffocant | Pneumothorax suffocant (tension) | Protocole trauma local à préciser avant utilisation comme guide technique · Ahmad et al., WJES 2025, DOI 10.1186/s13017-025-00613-7 (hétérogénéité site/longueur ; ne fixe pas de technique locale) | — | — | 2026-10 | data/protocols-p4.ts:269 |
| protocols | polytraumatisme | Polytraumatisme — XABCDE | ATLS 10e édition (ACS) · ERC Trauma 2021 | — | — | 2026-08 | data/protocols.ts:180 |
| protocols | prophylaxie-rage | Morsure animale — prophylaxie antirabique | OMS rage 2018 (position paper) · Ministère de la Santé Tunisie — programme antirabique · Institut Pasteur de Tunis | — | — | 2026-09 | data/protocols-p8.ts:149 |
| protocols | pyelonephrite-aigue | Pyélonéphrite aiguë de l'adulte | STPI (Tunisie) — Recommandations antibiothérapie IU communautaires de l'adulte, février 2018 · EAU Guidelines on Urological Infections 2026, §§3.6–3.9 · SSC 2026 (délai d'antibiothérapie adulte uniquement) | — | — | 2026-10 | data/protocols-p12.ts:47 |
| protocols | retention-aigue-urine | Rétention aiguë d'urine (RAU) | AFU RAU · EAU guidelines | — | — | 2026-09 | data/protocols-p12.ts:90 |
| protocols | rhabdomyolyse | Rhabdomyolyse (syndrome d'écrasement / effort) | ATLS crush syndrome · KDIGO AKI | — | — | 2026-09 | data/protocols-p5.ts:143 |
| protocols | sca-nstem | SCA sans sus-décalage ST (NSTEMI / angor instable) | ESC NSTE-ACS 2023 | — | — | 2026-09 | data/protocols-p7.ts:245 |
| protocols | sca-stemi | Douleur thoracique / SCA (STEMI & NSTEMI) | ESC NSTE-ACS 2023 · ACC/AHA STEMI 2023+ | — | — | 2026-08 | data/protocols-p2.ts:5 |
| protocols | serotoninergique-snm | Syndrome sérotoninergique & syndrome malin des neuroleptiques | Hunter serotonin toxicity 2003 · Neuroleptic Malignant Syndrome — UpToDate | — | — | 2026-09 | data/protocols-p10.ts:265 |
| protocols | sevrage-alcoolique | Sevrage alcoolique & delirium tremens | ASAM alcohol withdrawal 2020 · CIWA-Ar Sullivan 1989 | — | — | 2026-09 | data/protocols-p11.ts:48 |
| protocols | syncope | Syncope / lipothymie | ESC syncope 2018 · CEM/SFMC | — | — | 2026-09 | data/protocols-p4.ts:184 |
| protocols | tachycardie | Tachycardie à QRS fins ou larges instable | AHA 2025 Tachycardia algorithm · ERC 2021 | — | — | 2026-09 | data/protocols-p4.ts:53 |
| protocols | tamponnade | Tamponnade cardiaque | ESC péricarde 2015 · EACTS | — | — | 2026-09 | data/protocols-p9.ts:45 |
| protocols | thorax-penetrant | Plaie thoracique pénétrante | ATLS 10e éd. · EAST guidelines 2022 | — | — | 2026-09 | data/protocols-p7.ts:76 |
| protocols | torsade-testiculaire | Torsade du cordon spermatique (torsion testiculaire) | EAU paediatric urology 2023 · AUA acute scrotum | — | — | 2026-09 | data/protocols-p8.ts:290 |
| protocols | traumatisme-cranien | Traumatisme crânien grave | Brain Trauma Foundation 4e · ATLS 10e | — | — | 2026-08 | data/protocols-p3.ts:170 |
| protocols | traumatisme-medullaire | Traumatisme médullaire | AANS/CNS 2013 · ERSCI guidelines | — | — | 2026-09 | data/protocols-p11.ts:384 |
| trees | acr | — | AHA 2025 — Adult Cardiac Arrest Algorithm · ERC Guidelines 2021 — Adult Advanced Life Support | https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines · https://www.erc.edu | — | 2026-09-01 | data/trees.ts:26 |
| trees | anaphylaxie | — | RCUK — Emergency treatment of anaphylaxis 2021 | https://www.resus.org.uk | — | 2026-09-01 | data/trees.ts:197 |
| trees | choc-septique | — | Surviving Sepsis Campaign 2026 — recommandations adultes (SCCM) | https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026 | — | 2026-10-23 | data/trees.ts:404 |
| trees | douleur-thoracique | — | ESC Guidelines 2023 — Acute Coronary Syndromes | https://www.escardio.org | — | 2026-09-01 | data/trees.ts:509 |
| trees | etat-mal | — | SFU / EAN guidelines — Status epilepticus | https://www.sfmu.org | — | 2026-09-01 | data/trees.ts:289 |
| trees | hemorragie-post-partum | — | OMS / FIGO — recommandations HPP | https://www.who.int | — | 2026-09-01 | data/trees.ts:612 |
| trees | hyperkaliemie | — | KDIGO / AHA 2020 — hyperkaliémie | https://kdigo.org | — | 2026-09-01 | data/trees.ts:700 |
| trees | polytraumatisme | — | ATLS 10ᵉ édition, ACS-COT | https://www.facs.org | — | 2026-09-01 | data/trees.ts:789 |
| trees | triage-prehospitalier | — | SFMU/SFU — Triage en structure des urgences (RFE 2013) · ERC Guidelines 2021 — reconnaissance de l'arrêt cardiaque | https://www.sfmu.org/upload/referentielsSFMU/rfe_triage2013.pdf · https://www.erc.edu | — | 2026-09-11 | data/trees.ts:869 |
| triage | agitation-aigue | Agitation violente / danger immédiat | SFAR ; ATS / ACEP | — | — | — | data/triage.ts:352 |
| triage | anaphylaxie | Anaphylaxie | ERC 2021 ; EAACI 2021 ; RE.NAU anaphylaxie | — | — | — | data/triage.ts:112 |
| triage | arret-cardio | Arrêt cardiaque vu / massé | ERC 2021 ; AHA 2025 | — | — | — | data/triage.ts:75 |
| triage | avf-suspect | Déficit neurologique brutal / suspicion AVC | ESO 2021 ; RE.NAU téléthrombolyse | — | — | — | data/triage.ts:55 |
| triage | brulure-grave | Brûlure grave / carbonisation | ABA 2023 ; Monash/SRLF | — | — | — | data/triage.ts:242 |
| triage | choc-sepsis | Sepsis suspecté chez l'adulte / choc | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | — | — | — | data/triage.ts:130 |
| triage | convulsion | Convulsion active / état de mal | SFN 2022 ; RE.NAU EME | — | — | — | data/triage.ts:149 |
| triage | detresse-resp | Détresse respiratoire aiguë | SFAR/SRLF 2017 ; ERC 2021 | — | — | — | data/triage.ts:93 |
| triage | douleur-abdo | Douleur abdominale sévère | WSES guidelines ; SFAR | — | — | — | data/triage.ts:297 |
| triage | douleur-thoracique | Douleur thoracique / suspicion SCA | ESC 2023 ACS ; ERC 2021 ; RE.NAU PEC SCA | — | — | — | data/triage.ts:34 |
| triage | dvp-membre | Membre froid douloureux = ischémie aiguë | ESVS 2020 | — | — | — | data/triage.ts:403 |
| triage | electrocution | Électrisation / foudroiement | ATLS ; ILCOR | — | — | — | data/triage.ts:386 |
| triage | enfant-febrile | Enfant fébrile / détresse pédiatrique | AAP/SFP ; RE.NAU péd. | — | — | — | data/triage.ts:334 |
| triage | fièvre-néoplasie | Fièvre isolée du sujet à risque | IDSA neutropénie 2010 | — | — | — | data/triage.ts:419 |
| triage | hemorragie-externe | Hémorragie externe / membre sectionné | ATLS 10 ; RE.NAU Exacyl | — | — | — | data/triage.ts:187 |
| triage | hpp-accouchement | Accouchement imprévu / hémorragie du post-partum | RE.NAU ; WHO PPH 2017 | — | — | — | data/triage.ts:278 |
| triage | hypoglycemie | Hypoglycémie (sueurs + trouble de conscience) | ADA / SFE ; SFAR | — | — | — | data/triage.ts:369 |
| triage | intoxication | Intoxication suspectée (CO, OP, médicaments) | RE.NAU ; CDC/WHO tox | — | — | — | data/triage.ts:316 |
| triage | oap | Dyspnée + crépitants = OAP | ESC 2021 ; RE.NAU OAP | — | — | — | data/triage.ts:260 |
| triage | polytrauma | Polytraumatisme (vitesses, chutes > 3 m, éjection) | ATLS 10 ; Vittel | — | — | — | data/triage.ts:205 |
| triage | trauma-cranien | Traumatisme crânien (perte de connaissance) | ATLS 10 ; BTF 4th ed | — | — | — | data/triage.ts:223 |
| triage | trouble-conscience | Trouble de la conscience (GCS < 15) | ATLS 10 ; SFAR | — | — | — | data/triage.ts:168 |

## كل السجلات التي لا تملك استشهاداً أولياً على مستوى السجل

| المجموعة | المعرّف | النص التعريفي إن توفر | سبب عدم كفاية الإسناد |
|---|---|---|---|
| abbreviations | ABCDE | ABCDE | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | ACD | ACD | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | ACR | ACR | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | AINS | AINS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | AVC | AVC | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | AVK | AVK | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | BIPAP | BIPAP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | CK | CK | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | Covid | Covid | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | CPAP | CPAP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | CRP | CRP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | DAE / DEA | DAE / DEA | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | ECG | ECG | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | EP | EP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | EtCO2 | EtCO2 | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | FAST | FAST | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | FC | FC | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | FR | FR | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | GCS | GCS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | HDF | HDF | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | HNF / HBPM | HNF / HBPM | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | IM / SC / PO | IM / SC / PO | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | INR | INR | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | IRA | IRA | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | IRC | IRC | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | IV / IO | IV / IO | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | NFS | NFS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | NIHSS | NIHSS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | NSAID | NSAID | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | NSTEMI | NSTEMI | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | OAP | OAP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | PAD | PAD | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | PAM | PAM | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | PAS | PAS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | PLS | PLS | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | PSE | PSE | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | RCP | RCP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | ROSC | ROSC | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | SCA | SCA | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | SpO2 | SpO2 | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | STEMI | STEMI | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | TA | TA | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | TCA | TCA | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | TVP | TVP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | VNI | VNI | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | VVO2 / O2 | VVO2 / O2 | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| abbreviations | VVP | VVP | Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils. |
| glasgow | adult-eyes | Adulte — ouverture des yeux | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| glasgow | adult-motor | Adulte — réponse motrice | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| glasgow | adult-verbal | Adulte — réponse verbale | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| glasgow | pediatric-eyes | Pédiatrie préverbale — ouverture des yeux | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| glasgow | pediatric-motor | Pédiatrie préverbale — réponse motrice | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| glasgow | pediatric-verbal | Pédiatrie préverbale — réponse verbale | Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques. |
| guidage | acr-adulte | ACR adulte | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | acr-ped | ACR pédiatrique | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | agitation | Agitation aiguë | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | anaphylaxie | Anaphylaxie | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | asthme | Asthme aigu sévère | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | avc | AVC — imagerie adaptative | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | bpco | Exacerbation BPCO | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | brady | Bradycardie sévère | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | brul | Brûlure grave | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | chaleur | Coup de chaleur | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | choc | Choc / sepsis | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | co | Intoxication au CO | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | conv-feb | Convulsion fébrile | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | deshy-enf | Déshydratation enfant | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | detresse-resp | Détresse respiratoire | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | dka | Acidocétose diabétique | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | douleur-thor | Douleur thoracique / SCA | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | eclampsie | Éclampsie / prééclampsie sévère | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | electro | Électrisation / électrocution | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | ep | Embolie pulmonaire | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | etatmal | Crise convulsive / état de mal | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hdo | Hémorragie digestive haute | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hpp | Hémorragie du post-partum | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hta-grav | HTA gravidique | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hta-urg | HTA urgence | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hyperk | Hyperkaliémie | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hypo | Hypoglycémie | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | hypoT | Hypothermie (stades suisses) | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | intox-med | Intoxication médicamenteuse | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | meningite | Méningite / purpura | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | neonat | Nouveau-né — minute d'or | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | neuro | Trouble neurologique | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | noyade | Noyade / hypothermie | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | opio | Dépression respiratoire / opioïdes | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | org-ph | Organophosphorés | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | rhabdo | Rhabdomyolyse | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | scorpion | Envenimation scorpionique | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | syncope | Syncope | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | tetanos | Plaie & tétanos | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | trauma | Trauma — bilan primaire | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| guidage | tv | Tachycardies / TV | Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation. |
| med-tools | adrenaline | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | amikacine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | amiodarone | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | dobutamine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | enoxaparine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | heparine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | insuline-rapide | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | ketamine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | midazolam | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | morphine | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | noradrenaline | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | paracetamol | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | propofol | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | rocuronium | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| med-tools | sulfate-magnesium | — | Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées. |
| motifs | abdo | Douleur abdominale | Aucune source/date au niveau de l'entrée. |
| motifs | conscience | Trouble de conscience | Aucune source/date au niveau de l'entrée. |
| motifs | convul | Convulsions | Aucune source/date au niveau de l'entrée. |
| motifs | dyspnee | Dyspnée | Aucune source/date au niveau de l'entrée. |
| motifs | fievre | Fièvre | Aucune source/date au niveau de l'entrée. |
| motifs | thorax | Douleur thoracique | Aucune source/date au niveau de l'entrée. |
| protocol-categories | avc | Neurovasculaire | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | medecine | Urgences médicales | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | obstetrique | Obstétrique | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | pediatrie | Pédiatrie | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | psychiatrie | Urgences psychiatriques | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | reanimation | Réanimation | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | toxicologie | Toxicologie | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| protocol-categories | traumatologie | Traumatologie | Catégories de navigation; aucune référence clinique au niveau de la catégorie. |
| quickref-emergencyNumbers | 190 | SAMU (urgences médicales) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-emergencyNumbers | 193 | Garde nationale | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-emergencyNumbers | 197 | Police secours | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-emergencyNumbers | 198 | Protection civile | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-emergencyNumbers | 71 335 500 | Centre antipoison (Tunis) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-vitalSigns | Fréquence cardiaque (/min) | Fréquence cardiaque (/min) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-vitalSigns | Fréquence respiratoire (/min) | Fréquence respiratoire (/min) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-vitalSigns | SpO2 cible (%) | SpO2 cible (%) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quickref-vitalSigns | TA systolique (mmHg) | TA systolique (mmHg) | Aucune source primaire/date de vérification au niveau de la ligne. |
| quiz | med | Anaphylaxie adulte : dose d'adrénaline IM ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | ACR rythme choquable : amiodarone après quel choc ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Éclampsie : dose de charge de MgSO4 ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Antidote de la toxicité du MgSO4 ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | ACD : seuil de K+ imposant de retarder l'insuline ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | ACD : à quelle glycémie ajouter du G5 % ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Adénosine 1ʳᵉ dose pédiatrique ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Remplissage choc septique pédiatrique: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | D10 hypoglycémie pédiatrique: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | HPP : acide tranexamique: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Anaphylaxie : durée de surveillance (biphasique) ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Hyperkaliémie avec troubles ECG : premier geste ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | BPCO exacerbé : SpO2 cible ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Hypoglycémie sans voie veineuse: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Crise convulsive : 1ʳᵉ ligne ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Envenimation scorpionique grade II avant l'hôpital ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Parkland : 70 kg × 20 % SCQ, volume 24 h ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Organophosphorés : critère de titration de l'atropine ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Exacerbation BPCO : cible de SpO2 ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | HTA gravidique : seuil de traitement aigu ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Convulsion fébrile : quand traiter par midazolam ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Déshydratation enfant avec choc : bolus initial ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | Rhabdomyolyse : cible de diurèse sous hydratation ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | PAS 200 asymptomatique (sans atteinte d'organe): | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | med | ACR pédiatrique : dose d'adrénaline IV ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Sevrage : RSBI seuil ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Ventilation protectrice SDRA : Vt cible ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Broselow 70 cm : zone ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Premier choc pédiatrique: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Sevrage : fuite au ballonnet absente: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | IDM ST+ : délai porte-ballon cible ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | AVC ischémique : fenêtre thrombolyse IV ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Pneumothorax compressif : geste immédiat ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Post-ACR comateux : température cible ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | proc | Électrocution haute tension : tout premier geste ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | score | qSOFA : seuil de la FR ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | score | Pédiatrie : entretien hydrique 10 kg (Holliday-Segar) ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | score | HEART ≥ 7 : conduite ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | score | sPESI = 0: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | score | Syncope : lequel impose monitorage/hospitalisation ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | triage | START adulte : FR 36/min, quelle couleur ? | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| quiz | triage | JumpSTART : FR 12/min chez un enfant: | Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet. |
| reval | acidocetose-diabetique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | acr-adulte | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | acr-pediatrique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | agitation-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | amputation-crush | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | anaphylaxie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | angiocholite | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | appendicite | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | asthme-aigu-grave | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | avc | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | bradycardie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | bronchiolite | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | brulure-grave | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | choc-septique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | colique-nephretique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | convulsion-febrile | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | corps-etranger-aerien | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | coup-de-chaleur | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | crise-surrenale | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | crise-thyrotoxique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | deshydratation-enfant | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | dissection-aortique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | drepanocytose-crise | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | dystocie-epaules | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | eclampsie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | electrocution | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | embolie-pulmonaire | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | endocardite-infectieuse | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | epistaxis | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | etat-mal-epileptique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | exacerbation-bpco | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | fa-nouvelle | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | fasciite-necrosante | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | fast-echo | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | fievre-neutropenique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | fracture-ouverte | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | geu | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | glaucome-aigu | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hemorragie-digestive-basse | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hemorragie-digestive-haute | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hemorragie-post-partum | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hemorragie-sous-arachnoidienne | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hhs-hyperosmolaire | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hta-urgence | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hyperkaliemie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hypertension-gravidique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hypoglycemie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hyponatremie-severe | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | hypothermie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | ingestion-caustique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-alcool-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-bb-icc | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-co | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-digoxine | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-lithium | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-medicamenteuse | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-methanol | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-opioides | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-organophosphores | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-paracetamol | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-phosphure-aluminium | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-salicyles | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | intoxication-tricycliques | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | invagination-intestinale | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | ischemie-membre-aigu | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | ischemie-mesenterique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | laryngite-croup | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | meningite-bacterienne | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | morsure-serpent | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | myocardite | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | noyade | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | oap | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | occlusion-intestinale | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | oeil-chimique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pancreatite-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pelvis-instable | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | perforation-peritonite | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pericardite-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pile-bouton | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | piqre-scorpion | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pneumonie-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pneumothorax-suffocant | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | polytraumatisme | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | prophylaxie-rage | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | pyelonephrite-aigue | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | retention-aigue-urine | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | rhabdomyolyse | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | sca-nstem | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | sca-stemi | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | serotoninergique-snm | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | sevrage-alcoolique | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | syncope | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | tachycardie | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | tamponnade | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | thorax-penetrant | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | torsade-testiculaire | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | traumatisme-cranien | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |
| reval | traumatisme-medullaire | — | Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action. |

## سجلات ذات إحالة جزئية فقط

| المجموعة | المعرّف | الاسم/العنوان | المصدر المسجل | الملف:السطر |
|---|---|---|---|---|
| perfusions | acide-tranexamique | Acide tranéxamique (Exacyl®) — entretien post-charge | Livret RE.NAU 2018 ; CRASH-2 | data/perfusions.ts:341 |
| perfusions | adrenaline | Adrénaline — choc anaphylactique réfractaire | Livret RE.NAU 2018 ; ERC 2021 anaphylaxie | data/perfusions.ts:53 |
| perfusions | adrenaline | Adrénaline — choc cardiogénique / post-AC (µg/kg/min) | Livret RE.NAU 2018 ; ERC 2021 | data/perfusions.ts:66 |
| perfusions | adrenaline | Adrénaline — bradycardie résistante à l'atropine | AHA ACLS 2020 ; ERC 2021 | data/perfusions.ts:77 |
| perfusions | amiodarone | Cordarone® — charge TdR (5 mg/kg sur 1 h) | Livret RE.NAU 2018 | data/perfusions.ts:179 |
| perfusions | amiodarone | Cordarone® — entretien (relais continu) | Livret RE.NAU 2018 | data/perfusions.ts:192 |
| perfusions | dobutamine | Dobutamine — inotrope (adulte) | ANSM (France) — RCP DOBUTAMINE PANPHARMA, mise à jour 18/03/2022, §§4.1–4.4 et 6.6 ; SSC 2026 (indication septique adulte) | data/perfusions.ts:88 |
| perfusions | esmolol | Esmolol (Brevibloc®) — SAA / FA rapide / dissection | Livret RE.NAU 2018 ; ESC 2014 SAA | data/perfusions.ts:166 |
| perfusions | fentanyl | Fentanyl — sédation/analgésie | Livret RE.NAU 2018 ; SFAR | data/perfusions.ts:255 |
| perfusions | heparine | Héparine HNF — SCA (bolus 70 UI/kg puis 12 UI/kg/h) | Livret RE.NAU 2018 | data/perfusions.ts:292 |
| perfusions | heparine | Héparine HNF — EP (bolus 80 UI/kg puis 18 UI/kg/h) | Livret RE.NAU 2018 | data/perfusions.ts:304 |
| perfusions | insuline-rapide | Insuline rapide (Actrapid®) — ACD/HHS | Livret RE.NAU 2018 ; SFD/SFE 2023 | data/perfusions.ts:317 |
| perfusions | isoprenaline | Isoprénaline (Isuprel®) — BAV / torsades sur QT non congénital | Livret RE.NAU 2018 | data/perfusions.ts:101 |
| perfusions | ketamine | Kétamine (Kétalar®) — sédation prolongée | Livret RE.NAU 2018 | data/perfusions.ts:242 |
| perfusions | labetalol | Labétalol (Trandate®) — SAA / prééclampsie | Livret RE.NAU 2018 | data/perfusions.ts:141 |
| perfusions | midazolam | Midazolam (Hypnovel®) — sédation | Livret RE.NAU 2018 | data/perfusions.ts:229 |
| perfusions | morphine | Morphine — sédation/analgésie continue | Livret RE.NAU 2018 | data/perfusions.ts:279 |
| perfusions | nicardipine | Nicardipine (Loxen®) — urgence hypertensive / SAA | Livret RE.NAU 2018 | data/perfusions.ts:115 |
| perfusions | noradrenaline | Noradrénaline — choc septique (µg/kg/min) | Livret RE.NAU 2018 (dose/préparation) ; Surviving Sepsis Campaign 2026 (first-line agent, MAP target, peripheral start) | data/perfusions.ts:27 |
| perfusions | noradrenaline | Noradrénaline — RE.NAU (mg/h) | Livret RE.NAU 2018 | data/perfusions.ts:40 |
| perfusions | octreotide | Octréotide (Sandostatine®) — rupture varices œsophagiennes | Livret RE.NAU 2018 | data/perfusions.ts:329 |
| perfusions | oxytocine | Ocytocine (Syntocinon®) — hémorragie du post-partum | Livret RE.NAU 2018 | data/perfusions.ts:352 |
| perfusions | phenylephrine | Phényléphrine — hypotension peropératoire / rachianesthésie (adulte) | ANSM (France) — RCP PHENYLEPHRINE RENAUDIN 100 µg/mL, mise à jour 23/08/2024, §§4.1–4.4 ; SSC 2026 (noradrénaline 1re ligne en choc septique adulte) | data/perfusions.ts:364 |
| perfusions | propofol | Propofol (Diprivan®) — sédation entretenue | Livret RE.NAU 2018 | data/perfusions.ts:216 |
| perfusions | sufentanil | Sufentanil (Sufenta®) — sédation patient ventilé | Livret RE.NAU 2018 | data/perfusions.ts:267 |
| perfusions | sulfate-magnesium | Sulfate de magnésium — torsades / hypokaliémie | Livret RE.NAU 2018 | data/perfusions.ts:203 |
| perfusions | trinitrine | Trinitrine IV — OAP / SCA | Livret RE.NAU 2018 ; ESC 2021 OAP | data/perfusions.ts:153 |
| perfusions | urapidil | Urapidil (Eupressyl®) — SAA / urgence hypertensive | Livret RE.NAU 2018 | data/perfusions.ts:128 |
| triage | agitation-aigue | Agitation violente / danger immédiat | SFAR ; ATS / ACEP | data/triage.ts:352 |
| triage | anaphylaxie | Anaphylaxie | ERC 2021 ; EAACI 2021 ; RE.NAU anaphylaxie | data/triage.ts:112 |
| triage | arret-cardio | Arrêt cardiaque vu / massé | ERC 2021 ; AHA 2025 | data/triage.ts:75 |
| triage | avf-suspect | Déficit neurologique brutal / suspicion AVC | ESO 2021 ; RE.NAU téléthrombolyse | data/triage.ts:55 |
| triage | brulure-grave | Brûlure grave / carbonisation | ABA 2023 ; Monash/SRLF | data/triage.ts:242 |
| triage | choc-sepsis | Sepsis suspecté chez l'adulte / choc | Surviving Sepsis Campaign 2026 (adult guidelines, SCCM) | data/triage.ts:130 |
| triage | convulsion | Convulsion active / état de mal | SFN 2022 ; RE.NAU EME | data/triage.ts:149 |
| triage | detresse-resp | Détresse respiratoire aiguë | SFAR/SRLF 2017 ; ERC 2021 | data/triage.ts:93 |
| triage | douleur-abdo | Douleur abdominale sévère | WSES guidelines ; SFAR | data/triage.ts:297 |
| triage | douleur-thoracique | Douleur thoracique / suspicion SCA | ESC 2023 ACS ; ERC 2021 ; RE.NAU PEC SCA | data/triage.ts:34 |
| triage | dvp-membre | Membre froid douloureux = ischémie aiguë | ESVS 2020 | data/triage.ts:403 |
| triage | electrocution | Électrisation / foudroiement | ATLS ; ILCOR | data/triage.ts:386 |
| triage | enfant-febrile | Enfant fébrile / détresse pédiatrique | AAP/SFP ; RE.NAU péd. | data/triage.ts:334 |
| triage | fièvre-néoplasie | Fièvre isolée du sujet à risque | IDSA neutropénie 2010 | data/triage.ts:419 |
| triage | hemorragie-externe | Hémorragie externe / membre sectionné | ATLS 10 ; RE.NAU Exacyl | data/triage.ts:187 |
| triage | hpp-accouchement | Accouchement imprévu / hémorragie du post-partum | RE.NAU ; WHO PPH 2017 | data/triage.ts:278 |
| triage | hypoglycemie | Hypoglycémie (sueurs + trouble de conscience) | ADA / SFE ; SFAR | data/triage.ts:369 |
| triage | intoxication | Intoxication suspectée (CO, OP, médicaments) | RE.NAU ; CDC/WHO tox | data/triage.ts:316 |
| triage | oap | Dyspnée + crépitants = OAP | ESC 2021 ; RE.NAU OAP | data/triage.ts:260 |
| triage | polytrauma | Polytraumatisme (vitesses, chutes > 3 m, éjection) | ATLS 10 ; Vittel | data/triage.ts:205 |
| triage | trauma-cranien | Traumatisme crânien (perte de connaissance) | ATLS 10 ; BTF 4th ed | data/triage.ts:223 |
| triage | trouble-conscience | Trouble de la conscience (GCS < 15) | ATLS 10 ; SFAR | data/triage.ts:168 |

## قاعدة التصنيف

- **مصدر/تاريخ موجودان:** يثبت وجود حقول نصية في الكود فقط. لا يثبت أن المرجع موجود بالاسم المسجل، أو أن نسخته صحيحة، أو أنه يسند كل رقم وشرط وترجمة.
- **إحالة جزئية:** تسمية عامة بلا رقم إصدار/صفحة/جدول أو تاريخ مراجعة لكل سجل.
- **لا يوجد استشهاد أولي:** السجل غير قابل للاعتماد المرجعي حتى يضاف مصدر محدد ويطابقه مختص.
- **الجداول المنقولة من PDF:** رقم الصفحة يتيح التتبع إلى ملف OMEDIT، لكنه لا يثبت أن كل الجرعات فيه حديثة أو متوافقة مع RCP تونسي.
- **لا توجد أي حالة مصنفة معتمدة سريرياً في هذا الجرد.**
