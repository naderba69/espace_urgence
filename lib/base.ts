// Base path de déploiement — UNE SEULE source de vérité, pilotée par l'environnement de build.
//  - Vercel (racine)   : rien à faire → ""   (défaut)
//  - GitHub Pages       : NEXT_PUBLIC_BASE_PATH=/espace_urgence (défini dans .github/workflows/deploy.yml)
//  - Domaine dédié      : laisser ""
export const BASEPATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
