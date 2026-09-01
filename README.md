# Espace Urgence TN — فضاء الاستعجالي

Références & outils pour les urgences et le SAMU en Tunisie. Bilingue **français / العربية** (RTL), sombre par défaut, **hors-ligne (PWA)**, sans backend.

> ⚠️ **Avertissement** : le contenu médical est généré à partir de référentiels internationaux (ERC 2021, AHA ACLS/PALS 2025, RCUK, ATLS 10e, ESC…) et comporte pour chaque fiche `sources` + `lastReviewed`. **Il doit être relu et validé par un médecin tunisien** avant tout usage clinique. Toujours vérifier les doses.

## Pile technique

- Next.js 16 (App Router, **export statique** `output: 'export'`), React 19, TypeScript
- Tailwind CSS v4 (variante sombre par classe, propriétés logiques RTL)
- Aucune base de données : contenu = `data/*.ts` bilingue `{ fr, ar }` ; données utilisateur = `localStorage`
- PWA : `public/manifest.webmanifest` + service worker maison `public/sw.js` (pas de next-pwa)
- Audio : Web Audio API (`lib/audio.ts`) — métronome RCP, alarmes
- Analytics : GA4 via `lib/analytics.ts` — **ID placeholder `G-XXXXXXXXXX` à remplacer** ; désactivation possible dans Paramètres

## Démarrage

```bash
npm install
npm run dev      # développement (hors-ligne PWA inactif en dev)
npm run build    # export statique -> dossier out/
npx serve out    # tester la version exportée (ou déployer telle quelle)
```

## Déploiement (Vercel ou tout hébergeur statique)

- **Vercel** : import du repo → framework Next.js détecté → build `npm run build` → sortie automatique (`out/`).
- Autre hébergeur statique (Netlify, GitHub Pages…) : publier le dossier `out/`.
- Remplacer `G-XXXXXXXXXX` dans `lib/analytics.ts` par votre ID de mesure GA4.

## Structure

```
app/               pages (accueil, protocoles, medicaments, calculateurs, parametres, offline)
components/        Providers (langue/thème/favoris/récents/mode urgence), Header, Nav, SearchBar…
data/              contenu médical bilingue + sources + date de revue par fiche
lib/               i18n, storage (localStorage), recherche+synonymes, audio, analytics
public/            manifest PWA, sw.js, icônes
docs/PROMPT-V2.md  cahier des charges complet (phases 2 et 3 : contenu complet + IA)
```

## Feuille de route

- **Phase 1 ✅** — socle : i18n/RTL, thème, recherche avec synonymes, favoris réordonnables, récents, mode urgence, avertissement obligatoire, impression, PWA.
- **Phase 2 ✅** — 20 protocoles, 28 médicaments, 12 calculateurs, 11 rythmes ECG (tracés animés), 8 procédures (checklists RSI), hubs pédiatrie/obstétrique/psychiatrie/traumatologie.
- **Phase 3 ✅** — IA optionnelle (Gemini/OpenRouter, clé locale, modèles libres) orientée terrain « une saisie → un résultat » : **⚡ Flash IA** (une phrase dictée → carte d.intervention chronométrée + doses + liens vérifiés), analyseur ECG photo/caméra (IndexedDB), triage, SBAR, quiz, recherche assistée. Plus de chat flottant.
- **Phase 4 ✅** — `lib/calc.ts` (fonctions dosimétriques pures) + **vitest (25 tests verts, `npm test`)** ; **17 calculateurs** (+NIHSS, +HAS-BLED, +héparine IV, +correction Na⁺ Adrogué-Madias, +insuline ACD avec garde-fou potassium).
- **Phase 5 ✅** — **arbres décisionnels interactifs** (`/arbres`) : moteur `components/trees/TreeRunner.tsx` (décisions OUI/NON tactiles, minuteries avec alarme WebAudio, **journal horodaté imprimable**) + **8 arbres** : ACR adulte, anaphylaxie, état de mal épileptique, choc septique (bundle 1 h), douleur thoracique→SCA, HPP (4T + TXA < 3 h), hyperkaliémie (calcium → déplacement → élimination), polytraumatisme ABCDE (ATLS).
- **Phase 6 (en cours) ✅** — couverture « maladie + évolution + complications » : nouveau champ **`trajectory`** (si aggravation / pas de réponse / complication → conduite) affiché dans chaque fiche protocole ; 7 nouveaux protocoles complets (bradycardie, tachycardie instable, embolie pulmonaire, hypoglycémie sévère, syncope, coup de chaleur, pneumothorax suffocant) + trajectoires enrichies sur ACR/anaphylaxie/AVC. **27 protocoles** + Phase 6(2/2) : envenimation scorpionique (système grades I–III tunisien), intoxication CO, urgence hypertensive, rhabdomyolyse/crush, noyade, hypothermie accidentelle, intoxications médicamenteuses → **34 protocoles** + Phase 6(3/3) : HDH (Blakemore, endoscopie d'urgence), exacerbation BPCO (O₂ contrôlé 88–92 %, VNI), convulsion fébrile simple/complexe, électrocution (arythmie retardée 24 h), pré-éclampsie sévère/éclampsie (MgSO₄ 4 g + antidote Ca) → **39 protocoles**. Complément pharmacopée : héparine HNF, altéplase, glucagon, céfotaxime, amikacine, lévétiracétam → **35 médicaments** ; liens croisés protocoles↔molécules mis à jour (EP : HNF+HBPM+rt-PA ; état de mal : midazolam+LEV ; hypoglycémie : G30+glucagon ; intoxications : naloxone+NAC+flumazénil).

- **Reste possible** — molécules complémentaires selon disponibilité locale, arbres additionnels.

## Déploiement

Voir **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)** — guide pas à pas (Vercel en ~10 min, alternatives Netlify/Pages/Cloudflare).

## Sécurité & limites

- Clé API IA stockée uniquement dans le localStorage du navigateur — n'entrez votre clé que sur votre appareil personnel.
- Images ECG en IndexedDB (miniatures JPEG ≤300 px, max 30 entrées, éviction FIFO — localStorage conservé pour les préférences).
- Les sorties IA sont **indicatives** (photo non calibrée, LLM) : toute interprétation ECG doit être confirmée par un médecin qualifié.
