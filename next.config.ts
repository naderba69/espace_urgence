import type { NextConfig } from "next";
import { BASEPATH } from "./lib/base";

const nextConfig: NextConfig = {
  // Export statique : l'app entière devient des fichiers HTML/JS/CSS (dossier out/)
  // => hébergement gratuit, fonctionnement hors-ligne via service worker, pas de backend.
  output: "export",
  images: { unoptimized: true },
  // basePath déduit de l'environnement (voir lib/base.ts) : vide sur Vercel/domaine racine,
  // "/espace_urgence" quand NEXT_PUBLIC_BASE_PATH est défini (workflow GitHub Pages).
  ...(BASEPATH ? { basePath: BASEPATH } : {}),
  // Dev derrière le proxy de prévisualisation (sandbox e2b)
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
