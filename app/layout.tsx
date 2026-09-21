import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { BASEPATH } from "@/lib/base";
import Header from "@/components/Header";
import BottomTabs from "@/components/BottomTabs";
import NavRail from "@/components/NavRail";
import SearchFab from "@/components/SearchFab";
import Footer from "@/components/Footer";
import EmergencyMode from "@/components/EmergencyMode";
import DisclaimerGate from "@/components/DisclaimerGate";
import CommandPalette from "@/components/CommandPalette";
import UpdateBanner from "@/components/UpdateBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// v9.0 — IBM Plex Sans Arabic : typographie professionnelle FR+AR unifiée (autorisée par l'utilisateur).
const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espace Urgence TN — Protocoles, médicaments & outils SMU",
  description:
    "Références et outils pour les urgences et le SAMU en Tunisie : protocoles, médicaments, calculateurs, bilingue FR/AR, hors-ligne.",
  manifest: `${BASEPATH}/manifest.webmanifest`,
  icons: { icon: `${BASEPATH}/icons/icon-192.png`, apple: `${BASEPATH}/icons/apple-touch-icon.png` },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",       // edge-to-edge : l'app dessine sous la barre d'état
};

/* Anti-FOUC : applique langue/direction/thème/taille AVANT le premier rendu,
   à partir des préférences localStorage. v9.0 : thème « auto » par défaut = suit le système. */
const INIT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("eutn:prefs")||"{}");var el=document.documentElement;var th=p.theme||"auto";var dark=th==="auto"?!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches):th!=="light";el.classList.toggle("dark",dark);el.classList.toggle("amoled",th==="amoled");var l=p.lang==="ar"?"ar":"fr";el.lang=l;el.dir=l==="ar"?"rtl":"ltr";el.style.fontSize=(p.fontSize||16)+"px";}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr" className={`dark ${inter.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        <meta name="deploy-base" content={BASEPATH} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Urgence TN" />
        <link rel="apple-touch-icon" href={`${BASEPATH}/icons/apple-touch-icon.png`} />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden bg-bg text-fg antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-[70] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu — إلى المحتوى
        </a>
        <Providers>
          <Header />
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1">
            {/* v10.0 — bureau : Navigation Rail permanent (charte M3) ; liste complète via « Plus » */}
            <NavRail />
            <main
              id="contenu"
              className="no-appbounch min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-4 lg:pb-8"
            >
              {children}
              <Footer />
            </main>
          </div>
          <BottomTabs />
          <SearchFab />
          <CommandPalette />
          <UpdateBanner />
          <EmergencyMode />
          <DisclaimerGate />

        </Providers>
      </body>
    </html>
  );
}
