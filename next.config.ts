import type { NextConfig } from "next";
import { BASEPATH } from "./lib/base";

const nextConfig: NextConfig = {
  // Export statique : l'app entière devient des fichiers HTML/JS/CSS (dossier out/)
  // => hébergement gratuit, fonctionnement hors-ligne via service worker, pas de backend.
  output: "export",
  // URLs à barre oblique finale (guidage/index.html) : indispensable pour GitHub Pages
  // qui ne réécrit pas les chemins sans extension.
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath déduit de l'environnement (voir lib/base.ts) : vide sur Vercel/domaine racine,
  // "/espace_urgence" quand NEXT_PUBLIC_BASE_PATH est défini (workflow GitHub Pages).
  ...(BASEPATH ? { basePath: BASEPATH } : {}),
  // Dev derrière le proxy de prévisualisation (sandbox e2b)
  allowedDevOrigins: ["*.e2b.app"],
  // Pas de pastille flottante en dev : elle recouvre la barre d'onglets mobile
  devIndicators: false,
};

export default nextConfig;
