// Page de repli hors-ligne (précachée par le service worker).
// Page de secours statique en français — servie sans JavaScript si besoin.
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-6xl" aria-hidden>📡</p>
      <h1 className="text-2xl font-extrabold">
        Vous êtes hors-ligne
      </h1>
      <p className="opacity-70">
        Les pages déjà visitées restent accessibles. Revenez à l&apos;accueil.
      </p>
      <Link href="/" className="touch rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">
        Accueil
      </Link>
    </div>
  );
}
