import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

// Polices auto-hébergées : le build statique ne dépend pas d'un accès à Google Fonts.
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Espace Urgence TN — Protocoles, médicaments & outils SMU",
  description:
    "Références et outils en français pour les urgences et le SAMU en Tunisie : protocoles, médicaments, calculateurs et accès hors ligne.",
  manifest: `${BASEPATH}/manifest.webmanifest`,
  icons: { icon: `${BASEPATH}/icons/icon-192.png`, apple: `${BASEPATH}/icons/apple-touch-icon.png` },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",       // edge-to-edge : l'app dessine sous la barre d'état
};

/* Anti-FOUC : applique thème et taille AVANT le premier rendu. La langue de l'interface est le français. */
const INIT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("eutn:prefs")||"{}");var el=document.documentElement;var th=["auto","dark","light","amoled"].indexOf(p.theme)>=0?p.theme:"auto";var dark=th==="auto"?!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches):th!=="light";el.classList.toggle("dark",dark);el.classList.toggle("amoled",th==="amoled");el.lang="fr";el.dir="ltr";var fs=[16,18,20].indexOf(p.fontSize)>=0?p.fontSize:16;el.style.fontSize=fs+"px";}catch(e){document.documentElement.classList.add("dark");document.documentElement.lang="fr";document.documentElement.dir="ltr";}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr" className={`dark ${inter.variable}`} suppressHydrationWarning>
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
          Aller au contenu
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
