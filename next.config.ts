import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : l'app entière devient des fichiers HTML/JS/CSS (dossier out/)
  // => hébergement gratuit, fonctionnement hors-ligne via service worker, pas de backend.
  output: "export",
  images: { unoptimized: true },
  // Dev derrière le proxy de prévisualisation (sandbox e2b)
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
