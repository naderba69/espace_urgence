import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { BASEPATH } from "@/lib/base";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import BottomTabs from "@/components/BottomTabs";
import Footer from "@/components/Footer";
import EmergencyMode from "@/components/EmergencyMode";
import DisclaimerGate from "@/components/DisclaimerGate";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic", display: "swap" });

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
   à partir des préférences localStorage (sombre + FR par défaut). */
const INIT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("eutn:prefs")||"{}");var el=document.documentElement;el.classList.toggle("dark",p.theme!=="light");var l=p.lang==="ar"?"ar":"fr";el.lang=l;el.dir=l==="ar"?"rtl":"ltr";el.style.fontSize=(p.fontSize||16)+"px";}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr" className={`dark ${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
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
          className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-[70] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu — إلى المحتوى
        </a>
        <Providers>
          <Header />
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1">
            <aside className="no-print hidden w-60 shrink-0 overflow-y-auto overscroll-contain border-e border-line lg:block">
              <Nav />
            </aside>
            <main
              id="contenu"
              className="no-appbounch min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6"
            >
              {children}
              <Footer />
            </main>
          </div>
          <BottomTabs />
          <EmergencyMode />
          <DisclaimerGate />

        </Providers>
      </body>
    </html>
  );
}
