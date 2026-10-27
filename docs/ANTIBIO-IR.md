# Antibiotiques & fonction rénale — documentation développeur

**Page :** `/calculateurs/antibio-renal` · **Données :** `data/atb-renal.ts` · **Moteur :** `lib/atb-dose.ts`
**Tests :** `__tests__/atb-renal.test.ts`, `__tests__/renal-clearance.test.ts`, `__tests__/ui.test.tsx` · **État :** corrections rénales en cours de revue, 2026-10-25 (application v18.1, non publiée)

---

## 1. Source et périmètre

| Élément | Valeur |
|---|---|
| Référentiel | OMEDIT Pays de la Loire — « Adaptation des antibiotiques à la fonction rénale », **V2.3 (avril 2026)** |
| Sources citées par le tableau | RCP (base-donnees-publique.medicaments.gouv.fr), GPR (SPILF–SPT–SFPT–CA-SFM, juin 2023), ePOPI — données arrêtées au **10/01/2024** |
| Formats | 12 pages, 841,7 × 595,2 pt (paysage), **93 lignes de molécules**, 13 bandeaux de classe, 5 colonnes de stade |
| Copie archivée | `data/issues/OMEDIT-ATB-IR-V2.3-avril2026.pdf` (+ `…rows.json`, `tools-*.py`) |

Le PDF fourni ultérieurement (`20260427_ATB-et-IR_version-ETS_V23_261023_180534.pdf`, SHA-256
`949c7eaf80d5158023482e7d0ea780240cca552b897016f3007d41223331d6b1`) a été comparé à la copie
archivée : texte des 12 pages, 440 cellules et leurs coordonnées, métadonnées et rendus raster
à 1,5× identiques. Les empreintes diffèrent, mais aucun écart textuel, géométrique ou visuel n'a
été détecté par ces contrôles ; la copie déjà versionnée est conservée comme source reproductible,
sans créer de doublon.

**Populations : adultes ≥ 18 ans NON dialysés.** Toute situation de dialyse (péritonéale ou
hémodialyse) ou de pédiatrie sort du périmètre : la page renvoie vers le tableau original.

## 2. Modèle de données (`data/atb-renal.ts`)

```ts
ATB_RENAL_STAGES   : 5 × { id, fr, ar, dgf }        // normorenal ≥90 … terminale <15
ATB_RENAL_SECTIONS : 13 × { id, fr, ar }            // classes du tableau
ATB_RENAL_ROWS     : 93 × { id, fr, ar, section, page, lines, notes, contextReviewRequired? }
ATB_RENAL_BY_ID    : index id → ligne
```

Une `lines[i]` décrit **une ligne de conduite** : `{ kind: "dose" | "info", context?, d: [fr ×5] }`.
- Le JSON archivé conserve toutes les cellules et coordonnées PDF. Quand une tranche géométrique
  intersecte plusieurs textes source distincts, `d[j]` contient un marqueur de revue (pas une
  posologie choisie) et une note limitée à cette tranche recopie les textes source. Les cellules
  non choisies par l'affectation automatique restent dans le JSON et, si elles ne figurent pas déjà
  dans ces notes, dans une note explicite de revue.
- Les cellules simples sont projetées par recouvrement géométrique majoritaire ; une tranche sans
  majorité est marquée si elle reçoit une cellule par proximité. Cette projection n'établit pas
  de bornes cliniques de DFG. La comparaison complète automatisée figure dans
  `docs/AUDIT-ATB-CELLULES-2026-10-23.md`; la relecture visuelle et clinique indépendante reste
  inachevée.
- `kind: "info"` = consigne transverse non calculable (ex. ceftriaxone) ; elle n'est jamais
  présentée comme une dose.
- `context` porte une étiquette éditoriale lorsqu'une cellule réunit plusieurs contextes. Le flag
  `contextReviewRequired` bloque « Retenir » tant que l'interface ne collecte pas l'indication.
  **Ceftobiprole IV (p.5)** en est le cas contrôlé : le PDF juxtapose 500 mg/8h et la variante
  conditionnelle « infection sévère : 1 g/8h » dans une cellule unique. Les cellules rénales ne
  reprennent pas le libellé sévère ; leurs valeurs ne sont pas attribuées à cette variante, qui
  reste bloquée en IRC. La relecture visuelle confirme la structure, pas l'interprétation médicale.
- Noms de molécules, classes et notes arabes sont des traductions éditoriales ; la vérification
  terminologique/clinique arabe reste à effectuer par des relecteurs qualifiés.

**Règle de calcul :** le moteur ne convertit que les segments pondéraux (`mg/kg`) explicitement
repérés et applique les plafonds numériques explicites de la même cellule lorsqu'ils sont
compatibles ; il ne dérive pas de dose, limite ou schéma nouveau. La reproduction du pipeline
prouve la cohérence technique du générateur, pas la justesse clinique de chaque cellule.

## 3. Moteur de calcul (`lib/atb-dose.ts`)

| Fonction | Rôle |
|---|---|
| `parseWeightDoses(txt)` | extrait les vrais segments de dose `mg/kg` ; écarte un `mg/kg` qui est lui-même un plafond (il ne devient pas une dose) ; lit une fréquence fixe locale ou « 1 fois/24h » ; une fourchette (`en 4 à 6 injections`) n'est jamais réduite à une borne |
| `calculateWeightDose(txt, kg, lang)` | renvoie le calcul et le motif éventuel de refus ; multiplie par le poids saisi et applique les plafonds du même texte uniquement si unité et période concordent. Plafond inconnu/incompatible ou de portée ambiguë ⇒ aucun calcul |
| `weightDoseText(txt, kg, lang)` | façade d'affichage de `calculateWeightDose` ; conserve les liens « ou »/« puis » entre fragments et ne dédouble pas un plafond en pseudo-dose |
| `stageFromDfg(dfg)` | bornes des colonnes DFG du tableau ; renvoie `null` à 30 (valeur imprimée dans deux colonnes), ainsi que pour les valeurs non finies/négatives ; ne reçoit jamais une ClCr Cockcroft–Gault |
| `cockcroftGault(a, kg, mgDl, sexe)` | `(140 − âge) × poids × 0,85 (F) / (72 × créatinine)` ; estime séparément la ClCr, sans choisir une colonne DFG |

**Avertissement spécial cotrimoxazole/BACTRIM :** la notice tunisienne TERIAK de BACTRIM FORTE (AMM 9253082) demande une adaptation en insuffisance rénale et un contrôle de la kaliémie chez certains patients à risque ; elle ne donne pas de seuils rénaux dans le texte récupéré. Le RCP ANSM français de BACTRIM FORTE (mis à jour le 21/07/2025) raisonne selon la clairance de la créatinine et signale une surestimation d'environ 10 % avec la méthode à l'acide picrique ; il s'agit d'une source française, pas du RCP tunisien. La note dans `data/atb-renal.ts` est un rappel de sécurité, pas une règle de dose : ne transpose pas de seuils à partir du DFG indexé OMEDIT et vérifie la notice/RCP exacte du produit. Sources : [DPM, CTSP du 06/02/2024](http://www.dpm.tn/medicament/humain/antibioresistance/28-banner/399-comite-technique-des-specialites-pharmaceutiques-du-06-fevrier-2024), [notice tunisienne TERIAK BACTRIM FORTE (AMM 9253082)](https://www.med.tn/imedicament-notice-c6dfd827b55edbe28e564f9bf1f782ea.pdf), [RCP ANSM français](https://base-donnees-publique.medicaments.gouv.fr/medicament/64121235/extrait).
| `toMgDl(v, unit)` | µmol/L → mg/dL (÷88,4) ; >20 mg/dL est signalé et refusé (aucune conversion automatique de l'unité) |
| `requiresSourceCheck(txt)` | « Aucune donnée », cellule fusionnée, textes source multiples, contexte source non attribué, « Réduction de la posologie », ½ / ¼ dose → ⚠ vérification source |

**الخوارزمية المستخلصة من خلايا PDF ليست معادلة جرعة عامة.** ملف OMEDIT جدول اختيار قيم: يُختار العمود من DFG، ثم تُقرأ خلية الدواء والمرحلة كما هي. الحساب الآلي الوحيد هو ضرب مقطع `mg/kg` الصريح في الوزن المُدخل؛ لا تُستنتج جرعة ثابتة من خلية مجاورة، ولا يُستنتج عدد مرات أو مدة علاج أو نظام أطفال/غسيل.

**قواعد التحويل والتنفيذ:**
1. الخلايا المدمجة أو المتداخلة، «Aucune donnée»، موانع الاستعمال، الجرعة غير الرقمية، وخلايا `kind: "info"` لا تعطي حساب جرعة. يبقى نص PDF ظاهراً، ويُحجب اعتماد خلية متداخلة.
2. الجرعة اليومية مثل `mg/kg/24h` أو `mg/kg/j` تُضرب بالوزن. لا تُحسب الجرعة لكل مرة إلا إذا كان المصدر يذكر مجموع 24 ساعة وعدداً ثابتاً للجرعات؛ لا نختار رقماً من «4 à 6». وتُقرأ «1 fois/24h» صراحةً كجرعة يومية واحدة.
3. يُطبّق الحد الأقصى الرقمي الموجود في الخلية نفسها إذا كانت وحدته وفترته واضحتين ومتوافقتين: `50 mg/kg/24h … sans dépasser 4 g/24h`، و`4 à 5 mg/kg/24h (300 mg/j maximum)`، و`25 mg/kg/j maximum`. الحدّ ليس جرعة إضافية. إذا تعذر تفسيره أو ربطه بالجرعة بلا التباس، يُحجب الحساب ولا يُتجاهل الحد.
4. تُحفظ دلالة «ou» كبديل و«puis» كتتابع؛ لا تُدمج البدائل في نظام واحد. لا تُختار جرعة وسطية من مدى جرعات.
5. الكمية المعروضة ناتج حسابي من الوزن المدخل، وليست وصفة ولا تقريباً عملياً للقوارير؛ لا يحدد PDF دائماً الوزن الواجب استعماله في السمنة. تُراجع النشرة الرسمية/المختص لكل منتج.

**أمثلة مراجعة خلية-بخلية:** صفحة 2: سقف Cloxacilline PO البالغ `4 g/24h` يُطبّق قبل تقسيم المجموع على ثلاث جرعات؛ صفحة 12: حد Isoniazide `300 mg/j` أو `200 mg/j` يُطبّق حسب الخلية المختارة، بينما حد Ethambutol `25 mg/kg/j` لا يُفسر كجرعة ثانية؛ صفحة 11: عبارة Daptomycine `1 fois/24h` تُحفظ كوتيرة صريحة. صفحة 2/4: التركيبات التي تحتوي «OU … puis …» تعرض البديل منفصلاً عن التسلسل. هذه اختبارات نقل/حساب، لا اعتماد سريري ولا تأكيد لتطبيقها محلياً في تونس. التفاصيل وحدود الحساب موثقة في [`docs/ATB-WEIGHT-CALCULATION-AUDIT-2026-10-24.md`](ATB-WEIGHT-CALCULATION-AUDIT-2026-10-24.md).

## 4. Pipeline d'extraction (hors application, `data/issues/`)

1. `tools-atb-grid.py` — PDF → **440 cellules** via `get_drawings()` + spans, règle de
   non-croisement et contrôle d'attribution des spans : **0 span hors cellule ou attribué en double**.
2. `tools-atb-rows.py` — cellules → **93 molécules / 129 lignes brutes** : chaque cellule est
   affectée selon le recouvrement majoritaire (>50 %), sans règle spéciale fondée sur le nombre
   total de cellules. Une tranche sans majorité reçoit la cellule la plus proche et est marquée.
   Toutes les cellules, coordonnées et listes de recouvrement sont archivées. Toute tranche
   intersectant plusieurs textes distincts est marquée ambiguë, sans valeur sélectionnée.
   Réextraction actuelle : **32 lignes à revoir, 47 cas ligne×tranche sur 33 combinaisons
   médicament×tranche**, et 34 cellules non retenues par le choix automatique. Ces observations
   sont géométriques, sans inférence de limites cliniques. Les notes sont séparées par l'italique,
   le préfixe « Posologies exprimées » ou la fusion verticale.
3. `tools-gen-atb-ts.py` — extraction JSON → `data/atb-renal.ts` (sections/noms AR, notes AR,
   corrections `PATCH`, marqueurs et notes pour les tranches ambiguës, nettoyage typographique).
   Le générateur conserve les fragments source non sélectionnés dans des notes de revue lorsqu'ils
   ne sont pas déjà inclus dans une note de chevauchement. Les intermédiaires vont sous
   `/tmp/eutn-atb-audit/`, pas dans le dépôt.

**Rejouer la chaîne depuis le PDF** (avec un interpréteur Python où PyMuPDF est installé) :

```bash
PYTHON=/chemin/vers/python-avec-pymupdf
$PYTHON data/issues/tools-atb-grid.py data/issues/OMEDIT-ATB-IR-V2.3-avril2026.pdf /tmp/eutn-atb-audit/atb_cells.json
$PYTHON data/issues/tools-atb-rows.py /tmp/eutn-atb-audit/atb_cells.json data/issues/OMEDIT-ATB-IR-V2.3.rows.json
$PYTHON data/issues/tools-gen-atb-ts.py data/issues/OMEDIT-ATB-IR-V2.3.rows.json data/issues/OMEDIT-ATB-IR-V2.3-avril2026.pdf data/atb-renal.ts /tmp/eutn-atb-audit/atb-app-rows.json
$PYTHON data/issues/tools-atb-audit.py
```

La dernière commande régénère le rapport complet sous `docs/` et compare l'archive et les données
TypeScript ; elle n'écrase pas les données de production. Pour créer les cellules dans le chemin
temporaire par défaut, le premier argument de `tools-atb-grid.py` peut être omis. Le générateur
écrit `data/atb-renal.ts` par défaut ; fournir les chemins ci-dessus rend les entrées/sorties
explicites.

Corrections et ajouts déclarés dans `PATCH` (`tools-gen-atb-ts.py`) : Céfidérocol, aminosides,
Aztréonam IM/IV, Ceftobiprole, Ceftolozane + tazobactam et ceftriaxone (info). Le Ceftobiprole
sépare la posologie de base de la variante conditionnelle sévère ; l'interface n'enregistre pas de
choix « Retenir » sans contexte, et n'attribue aucune cellule rénale à la variante sévère. La
consigne du méropénem
« Si posologie élevée (> 6 g/24h) : monitorage pharmacologique » est conservée comme note FR/AR ;
elle était auparavant supprimée par le patch d'extraction. Pour l'amikacine, une note éditoriale
séparée du texte PDF distingue explicitement la ligne OMEDIT des références CA-SFM/SPILF/SFPT 2025
et rappelle DFG ≠ Cockcroft–Gault. Elle est produite par le générateur (`editorial_notes`) afin que
la comparaison octet-par-octet reste reproductible ; elle n'est pas une cellule de dose du PDF.

## Résultats de l'audit automatisé des cellules (relancé le 2026-10-25)

Le rapport `docs/AUDIT-ATB-CELLULES-2026-10-23.md` compare les **440 cellules physiques** du PDF,
les **129 lignes source** et les **465 cases médicament×stade** du modèle. L'extraction ne trouve
aucun span hors cellule ou dupliqué et la sortie TypeScript reproduit octet pour octet le générateur.
Cela vérifie la chaîne, non la validité clinique des valeurs. La note séparant l'entrée historique
OMEDIT pour l'amikacine des références externes 2025 est maintenant intégrée au `PATCH.editorial_notes`
du générateur ; elle n'est pas traitée comme une cellule de dose.

- Le contrôle géométrique a trouvé **47 cas ligne×tranche** où plusieurs textes source distincts
  se recoupent, dans **33 combinaisons médicament×tranche** (léger 4, modéré 24, sévère 12,
  terminal 7 ; aucun au normorénal). Il s'agit d'une observation des coordonnées PDF, **pas**
  d'une déduction de seuils cliniques de DFG.
- Pour `Benzylpenicilline sodique IM ou IV` (p.2), la première cellule traverse une grande partie
  du tableau, puis `3 MUI /4h` et `2 MUI/4h` recoupent la tranche modérée. L'application n'attribue
  plus `3 MUI/4h` à la tranche légère par simple ordre de cellules ; elle n'affiche aucune dose
  unique dans la tranche ambiguë et montre les trois textes source dans une note de revue.
- Pour `Méropénem + vaborbactam IV` (p.6), `1g/12h` demeure visible parmi les textes source des
  tranches qui en recoupent plusieurs. La tranche affiche le marqueur de revue, pas une dose choisie.
- Les lignes d'aminosides gardent la cellule fusionnée et la note commune limitée aux quatre stades
  d'IRC ; le Céfidérocol conserve sa mention répétée en note. Le classifieur du rapport distingue
  maintenant aussi les notes partagées, les notes géométriques et les corrections textuelles.
- Pour `Rifampicine IV PO` (p.12), le texte d'espacement corrigé après comparaison de l'image est
  « espacer les prises si besoin selon rifampicémie du 2ᵉ ou 3ᵉ jour du traitement » ; aucun schéma
  de dose n'est inféré à partir de cette correction de texte.

Le rapport présente chaque paire médicament×stade, **tous les fragments des cellules qui la
recoupent**, la valeur du générateur et la valeur de l'application, ainsi que les cellules que
l'affectation automatique n'a pas choisies. Cette comparaison scriptée ne remplace pas encore une
relecture visuelle indépendante de chacune des 440 cellules, la validation pharmaceutique/médicale,
ni la vérification séparée des sources primaires citées dans le PDF. L'audit élargi du reste de
l'application n'est pas terminé.

## 5. Limites connues et garde-fous

- **Relecture humaine obligatoire** : la valeur médicale n'est pas validée par un test ; chaque
  posologie doit être relue par un médecin/pharmacien tunisien (bannière permanente sur la page).
- **« Aucune donnée »** n'a pas de sens unique : résolu cellule par cellule, jamais par règle globale.
- Molécules à forte liaison protéique (doxycycline, tigécycline, dalbavancine, fidaxomicine) :
  pas d'adaptation rénale — le texte de la source est conservé tel quel.
- **Dialyse/épuration extrarénale : hors périmètre et bloquée dans l'interface.** La case contextuelle suspend le choix de stade, le tableau de doses et l'action « Retenir », y compris si un stade manuel était sélectionné auparavant.
- **DFG et ClCr restent distincts :** CKD-EPI 2021 (indexé, mL/min/1,73 m²) choisit le stade adulte stable du tableau ; Cockcroft–Gault affiche une ClCr séparée et ne choisit jamais une colonne. Ce choix d'équation CKD-EPI est une implémentation du calculateur, pas une formule imposée par le PDF OMEDIT.
- Le tableau ne remplace pas le RCP pour les situations particulières (obésité, ECMO, sepsis
  avec clairance augmentée…). Pour l'amikacine, l'interface bloque le calcul pondéral si la taille manque, si l'IMC ≥30 ou si l'option de poids idéal est activée ; la formule de poids propre au produit doit alors être vérifiée dans son RCP.
- Une créatinine > 20 mg/dL avec l'unité mg/dL affichée suspend les résultats ; aucune conversion
  vers µmol/L n'est devinée. Vérifier le compte-rendu biologique avant de poursuivre.
- Le PDF imprime le seuil 30 dans les deux plages voisines (modérée `59 → 30`, sévère `30 → 15`).
  **Garde-fou ajouté** : à DFG exactement 30, le moteur refuse le stade automatique et la page masque
  les posologies. Le choix manuel reste désactivé jusqu'à une confirmation explicite de vérification
  du PDF avec un médecin/pharmacien ; ensuite le professionnel doit choisir la colonne. Cela évite
  d'inventer une interprétation, mais ne résout pas l'ambiguïté éditoriale/pharmaceutique de la source.

## 6. Étage 2 — fonction rénale chronique / aiguë / enfant (`lib/renal-clearance.ts`)

| Règle | Mise en œuvre actuelle |
|---|---|
| Évolution/stabilité | Sélecteur explicite : inconnu (défaut), stable/chronique connu, ou aigu/variable/suspecté. Une créatinine isolée donne un DFG estimatif, mais ne prouve pas la stabilité ni la chronicité ; en mode inconnu aucune dose/stade n'est sélectionné. Le parcours aigu déclaré bloque même sans critère KDIGO saisi. Le choix « stable » est une donnée clinique déclarative, pas un diagnostic automatique. |
| Adulte stable ≥18 ans, non dialysé | **CKD-EPI 2021** estime le DFG `mL/min/1,73 m²` et sélectionne seul la colonne adulte après déclaration de stabilité et en l'absence d'AKI détectée. Si `poids < 0,8 × IBW`, l'interface avertit que le DFG est indexé et demande une interprétation prudente. |
| ClCr Cockcroft–Gault | Calcul affiché séparément pour information, avec poids réel si IMC <30 et poids ajusté `IBW + 0,4 × (réel − IBW)` si IMC ≥30 (Devine) ; l'option « poids idéal » agit uniquement sur cette ClCr. Cockcroft–Gault ne choisit ni ne modifie un stade du tableau DFG. |
| Enfant <18 ans | **CKID U25** (`0,413 × taille (cm) / créatinine (mg/dL)`) affiché comme estimation pédiatrique informative ; taille obligatoire. Aucun stade ou dosage du tableau adulte n'est fourni, même en choix manuel. |
| AKI selon KDIGO | Détection par hausse de créatinine `≥0,3 mg/dL/48 h`, rapport `≥1,5` sur 48 h/7 j, ou critères de diurèse : `<0,5 mL/kg/h` pendant 6 à <12 h (stade 1), pendant ≥12 h (stade 2), `<0,3` pendant ≥24 h (stade 3), ou anurie ≥12 h (stade 3). Une créatinine `≥4 mg/dL` correspond au stade 3 seulement avec une hausse aiguë `≥0,5 mg/dL` ; c'est l'initiation de l'épuration extrarénale pendant l'épisode aigu (pas la dialyse chronique à elle seule) qui constitue un critère de stade 3. Les critères d'AKI bloquent l'affichage des doses et tout choix automatique ou manuel dans ce tableau ; utiliser une conduite adaptée et un avis professionnel. |
| Dialyse/épuration extrarénale | Hors du périmètre du tableau adulte non dialysé ; le champ dédié bloque le stade, le tableau de dose et les décisions, sans option de contournement manuel. |
| DFG = 30 | Le PDF place 30 dans deux colonnes adjacentes ; hors AKI/dialyse, le calcul automatique est bloqué et le choix manuel attend une confirmation de relecture professionnelle. |
| Règle GPR antérieure non retenue | L'ancienne règle automatique « DFG 30–90 dégradé → +2 stades » et son exception dite des « molécules vitales » ont été retirées : aucune référence primaire/édition/phrase vérifiable retrouvée ne justifiait cette transformation précise. Elle n'est donc pas appliquée ni présentée comme règle GPR ; ne pas la réintroduire sans source identifiable et validation locale. |
| Stade vide ou cellule ambiguë | « Aucune donnée » n'est jamais remplacée silencieusement. Si plusieurs textes source se recoupent, ils restent visibles dans une note ; aucun chiffre voisin n'est inféré, et « Retenir » est désactivé pour cette cellule. |

## 7. Étage 3 — plan antibiotique et boucle a → b (`lib/atb-plan.ts`)

- Chaque molécule peut être **retenue** ou **abandonnée** (motif : fonction rénale, résistance,
  allergie, interaction, autre + note ≤ 120 caractères) ; l'action **Réévaluer** crée un nouveau
  tour (`#1 → #2 → …`) : l'historique n'est jamais écrasé.
- Le panneau « Plan antibiotique » affiche les décisions courantes, permet **Copier**, **Imprimer**
  et **Vider**, et expose le texte exportable (`planToText`, FR/AR).
- Persistance locale `eutn:atb-plan-v3` (aucune donnée ne quitte l'appareil). Les plans `v1` et `v2`
  antérieurs aux corrections de cellules/contextes ne sont pas importés ; s'ils contiennent des
  entrées, un avertissement rappelle que les anciens snapshots restent conservés sur l'appareil,
  mais doivent être reconstruits et vérifiés. JSON ancien ou corrompu ⇒ plan courant vide, jamais
  d'erreur. Snapshot contextuel conservé par décision (poids, stade, dose affichée).

## 8. Pont de clairance général (`/calculateurs/renal-dose`)

- Le bouton de chaque antibiotique de l'ancienne liste ouvre la recherche correspondante dans le
  tableau complet de 93 lignes issu du PDF ; aucune ancienne dose abrégée n'est reprise dans ce pont.
- La clairance Cockcroft–Gault calculée sur ce pont n'est pas transposée aux stades du tableau PDF,
  qui possède son propre estimateur, ses refus et ses limites.
- Le pont demande maintenant la même déclaration d'évolution rénale ; en mode inconnu, aigu,
  KDIGO-AKI ou dialyse, Cockcroft–Gault peut rester informatif mais aucune posologie n'est affichée.
  Les valeurs historiques à 48 h/7 j et la diurèse alimentent le repérage KDIGO.
- Les anciennes posologies des autres médicaments ont été supprimées. Les noms restent visibles comme
  couverture à compléter, sans dose ; seules gabapentine et prégabaline ont une grille active, liée
  à leurs RCP individuels ANSM, limitée ici à l'adulte stable non dialysé sans critère KDIGO et au
  poids saisi. Le choix d'un poids idéal bloque le dosage. Les RCP français ne valent pas validation
  tunisienne ; vérifier la spécialité et le RCP local.

## 9. Sources consultées pour les corrections rénales (2026-10-24)

- **KDIGO AKI 2012**, définition et tableau 2 de stadification : [guide officiel KDIGO (PDF)](https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf). Il distingue la diurèse <0,5 mL/kg/h sur 6–12 h (stade 1 ; à exactement 12 h, le critère de stade 2 ≥12 h prévaut), ≥12 h (stade 2), <0,3 sur ≥24 h ou anurie ≥12 h (stade 3) ; l'initiation d'une épuration extrarénale pendant l'épisode aigu est aussi un critère de stade 3 (une dialyse chronique ne suffit pas). Cela soutient le repérage logiciel, pas un diagnostic ni une décision de dose.
- **AMIKACINE PANPHARMA 250 mg/mL — RCP ANSM**, mis à jour le 30/07/2024 : [fiche officielle](https://base-donnees-publique.medicaments.gouv.fr/medicament/63408093/extrait). Chez l'adulte et l'adolescent ≥12 ans, le schéma de fonction rénale normale `ClCr ≥50 mL/min` est `15 mg/kg/j`, maximum `1,5 g/j`. Le RCP demande pour l'obésité un poids de calcul `poids idéal + 0,4 × (poids actuel − poids idéal)` ; la page « dose sûre » ne calcule pas ce poids et bloque donc le preset si IMC ≥30. Ce schéma de RCP est distinct du tableau OMEDIT et de CA-SFM 2025.
- **CA-SFM/SPILF/SFPT 2025**, tableau des doses d'antibiotiques : [PDF de référence](https://www.infectiologie.com/UserFiles/File/spilf/recos/doses-spilf-sfpt-casfm-2025.pdf). Pour amikacine, `25–30 mg/kg/j` concerne l'adulte non obèse sans insuffisance rénale ou hépatique ; ce schéma n'est pas fusionné avec le RCP Panpharma `15 mg/kg/j`, ni avec la ligne historique OMEDIT.
- **Limite d'adoption :** ces RCP/recommandations françaises ne sont pas des protocoles tunisiens. L'audit vérifie l'attribution et le comportement de l'outil ; il ne prouve ni disponibilité du produit, ni validation clinique, ni adoption locale en Tunisie.

## 10. Évolutions possibles

- Export PDF mis en page (le texte du plan est déjà prêt à imprimer).
- Enregistrement du plan dans le « résumé de cas » (`lib/casesummary.ts`).

## 11. Seuils continus — audit technique préparatoire (2026-10-25)

Le nouveau script `data/issues/tools-atb-threshold-audit.py` compare les bords internes des cellules
PDF aux graduations numériques DFG imprimées sur les 12 pages. Sur la copie archivée, **60/60
coordonnées de frontière internes** correspondent à une graduation visible ; les graduations
rencontrées sont 90, 70, 60, 50, 45, 40, 30, 25, 20, 15 et 10 mL/min/1,73 m². Rejouer avec
PyMuPDF :

```bash
python data/issues/tools-atb-threshold-audit.py
```

**Portée strictement géométrique :** cela confirme la lecture d'une graduation au bord d'une
cellule, mais ne valide ni le sens inclusif/exclusif à l'égalité, ni la transcription des doses, ni
le contexte clinique, ni l'usage d'une équation rénale. Les coordonnées et les cellules doivent
encore être rapprochées ligne par ligne de la source avant migration ; toute ambiguïté reste visible.

`data/issues/tools-export-atb-continuous-cells.py` produit l'archive candidate
`data/issues/OMEDIT-ATB-IR-V2.3.continuous-cells.candidate.json` : 93 médicaments, 129 lignes et
327 cellules avec texte source et graduations géométriques. Les indications ne sont pas séparées,
les textes restent non classés et l'inclusion aux frontières reste « non vérifiée » ; le fichier
est explicitement non clinique et ne doit pas être importé dans l'application. Vérifier sa
reproductibilité avec `python data/issues/tools-export-atb-continuous-cells.py --check`.

`lib/atb-renal-dose.ts` prépare un sélecteur pur de cellules source par indication et voie, avec
provenance, types distincts pour dose/note/absence de donnée/surveillance, et une règle explicite
pour l'égalité de chaque seuil. Une égalité non vérifiée bloque la sélection. Ce moteur n'est pas
relié à `data/atb-renal.ts` ni à l'interface : le calculateur de production conserve les 5 stades,
les cellules ambiguës restent bloquées, et les protections contre AKI, dialyse et pédiatrie restent
en place. **Aucune posologie ni borne clinique n'a été migrée par cette étape.**
La sélection de colonne du tableau OMEDIT reste fondée sur le DFG CKD-EPI ; Cockcroft–Gault est
séparé et ne devient pas le sélecteur par défaut.

La comparaison de l'Annexe 1 du brief avec le JSON et le PDF source a été revue : 17 écarts textuels
sur 123 comparaisons, dont plusieurs dus au regroupement de notes et d'indications dans les cellules.
Le détail et les cas qui doivent rester bloqués avant migration sont consignés dans
[`docs/AUDIT-ATB-ANNEX1-DIFFS-2026-10-25.md`](./AUDIT-ATB-ANNEX1-DIFFS-2026-10-25.md).

Une relecture visuelle de la ligne Ceftobiprole (PDF p.5) a confirmé une seule ligne de tableau : la
cellule de référence juxtapose 500 mg/8h en 2 h et une variante « infection sévère » à 1 g/8h en 4 h.
Les cellules rénales n'explicitent pas cette variante. Le modèle historique à cinq stades conserve
les valeurs rénales sur une ligne de base distincte, marque la variante sévère comme non attribuée
en IRC et désactive « Retenir » tant que l'indication n'est pas confirmée. C'est une correction de
structure/sécurité du modèle existant ; ce n'est ni une nouvelle posologie ni une migration vers le
sélecteur continu.
