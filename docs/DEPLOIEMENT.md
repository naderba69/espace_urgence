# Déploiement — Espace Urgence TN

**Guide technique, état du dépôt au 28 octobre 2026.** L’application est construite en export statique Next.js (`output: "export"`) dans `out/`. Il n’y a pas de serveur applicatif ni de base de données centrale. Les appels IA, lorsqu’ils sont activés, partent toutefois directement du navigateur vers le fournisseur configuré.

> **Important — état de validation :** un build réussi ne valide pas le contenu clinique, la conformité des données de santé, la disponibilité des produits en Tunisie ni l’aptitude à une mise en service clinique. Les protocoles locaux manquants et les validations requises sont inventoriés dans [`LOCAL-PROTOCOLS-REQUIRED-2026-10-28.md`](./LOCAL-PROTOCOLS-REQUIRED-2026-10-28.md) et [`AUDIT-GLOBAL-2026-10-27.md`](./AUDIT-GLOBAL-2026-10-27.md). Ne pas annoncer une validation médicale ou tunisienne qui n’a pas été effectuée.

## 1. Contrôles locaux avant livraison

Dans une copie de travail propre :

```bash
npm ci
npm test -- --reporter=dot
npx tsc --noEmit
npm run lint
npm run audit:reference-inventory:check
npm audit --omit=dev --audit-level=moderate
npm run build
```

Le build doit créer `out/`. Le générateur de précache vérifie le manifeste hors-ligne pendant le build. La taille et le nombre de fichiers changent selon le contenu; lors du dernier contrôle consigné, le précache contenait environ **1 100 entrées / 16,8 Mo** avant compression.

Pour examiner l’export local après le build :

```bash
node scripts/static-out.mjs
```

Le serveur d’audit sert `out/` sur le port 3000. Il applique les règles présentes dans `public/_headers`; cela vérifie les fichiers exportés, **pas** le navigateur réel, les interactions tactiles, le lecteur d’écran, l’installation PWA ni le fonctionnement hors-ligne d’un appareil. Ces essais doivent être réalisés séparément sur les navigateurs et appareils ciblés.

## 2. Hébergement

### Vercel

1. Importer le dépôt dans Vercel.
2. Utiliser le projet Next.js et la commande `npm run build`.
3. Le dossier produit est `out/`.
4. Vérifier les en-têtes définis dans `vercel.json` après déploiement.

### Netlify ou Cloudflare Pages

Configurer la commande `npm run build` et le dossier de publication `out/`. Le fichier `public/_headers` contient les règles d’en-tête attendues; confirmer dans l’interface de chaque hébergeur qu’elles sont effectivement appliquées.

### GitHub Pages

Le dépôt contient `.github/workflows/deploy.yml`, qui construit et publie sur GitHub Pages lors d’un push vers `main` ou d’un déclenchement manuel du workflow. Le workflow utilise `NEXT_PUBLIC_BASE_PATH=/espace_urgence`. L’URL déclarée dans son commentaire est `https://naderba69.github.io/espace_urgence/`.

Si l’activation Pages échoue, vérifier dans **Settings → Pages → Build and deployment** que la source est **GitHub Actions**. GitHub Pages ne permet pas de configurer librement les en-têtes HTTP : les règles de cache de `public/_headers` ne s’y appliquent donc pas.

Ne pas changer `basePath` au hasard : il est contrôlé par `NEXT_PUBLIC_BASE_PATH` via `lib/base.ts`. Laisser la valeur vide pour un domaine servi à la racine (comme Vercel ou un domaine dédié), et utiliser le chemin du dépôt uniquement pour l’hébergement sous un sous-répertoire.

## 3. En-têtes de cache

| Ressource | En-tête attendu sur les hébergeurs compatibles |
|---|---|
| `/_next/static/**` | `public, max-age=31536000, immutable` |
| `/sw.js` | `public, max-age=0, must-revalidate` |
| `/manifest.webmanifest` | `public, max-age=0, must-revalidate` |
| `/ref-index.json` | `public, max-age=3600` |
| Pages HTML | `public, max-age=0, must-revalidate` |

Vérification indicative après publication (adapter le domaine et le chemin de base) :

```bash
curl -I https://<domaine>/_next/static/chunks/<fichier>.js
curl -I https://<domaine>/sw.js
curl -I https://<domaine>/ref-index.json
```

Les pages HTML de détail ne sont **pas** garanties avec `max-age=3600`; elles doivent être revalidées. GitHub Pages n’applique pas ces en-têtes personnalisés.

## 4. Données, IA et confidentialité

- Aucune clé IA partagée ne doit être intégrée au build ou au dépôt. La clé saisie dans l’application reste en mémoire vive jusqu’au rechargement et n’est pas enregistrée dans `localStorage`.
- Lorsqu’une fonction IA est utilisée, le texte ou l’image concerné peut être envoyé à Google Gemini ou OpenRouter depuis le navigateur. Des confirmations sont affichées par parcours, mais elles ne valent ni autorisation de l’établissement ni avis de conformité.
- Retirer les noms et identifiants avant tout transfert; vérifier les règles de l’établissement, du responsable de la protection des données et du fournisseur. Des coûts et conditions de conservation du fournisseur peuvent s’appliquer.
- L’historique patient et les archives locales ne s’effacent pas automatiquement selon un délai défini. La politique de conservation doit être fixée par l’organisation responsable avant tout usage sur poste partagé.
- Le numéro du Centre antipoison `71 335 500` reste à confirmer directement par une source tunisienne officielle; ne pas le présenter comme vérifié sur la seule base d’annuaires secondaires.
- Les analyses IA, y compris le quiz et les descriptions ECG, ne sont pas une preuve clinique et ne doivent pas guider seules une décision.

## 5. Liste de contrôle avant toute ouverture au public

- [ ] Suite complète, TypeScript, lint, inventaire, audit de dépendances et build passent sur la révision destinée à être publiée.
- [ ] Parcours responsive, clavier et lecteur d’écran testés sur de vrais appareils/navigateurs; installation PWA et scénario hors-ligne vérifiés.
- [ ] Politique de confidentialité, autorisation de l’établissement, conditions du fournisseur IA et règles de conservation locale examinées.
- [ ] Références et protocoles tunisiens applicables joints, versionnés et revus par des cliniciens/pharmaciens compétents.
- [ ] Présentations, voies, notices, disponibilité locale et numéros d’urgence confirmés directement par les sources compétentes.
- [ ] Google Analytics reste désactivé tant que `G-XXXXXXXXXX` n’est pas remplacé par une mesure autorisée et documentée; l’opt-out doit être testé.
- [ ] Les responsables ont confirmé le périmètre et les limites des fonctions IA activées.

Tant qu’un élément requis par le contexte local n’est pas confirmé, il doit rester clairement signalé ou désactivé — ne pas le combler par une supposition.
