// Page de repli hors-ligne (précachée par le service worker).
// Statique volontairement bilingue — servie sans JavaScript si besoin.
export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-6xl" aria-hidden>📡</p>
      <h1 className="text-2xl font-extrabold">
        Vous êtes hors-ligne
        <br />
        <span lang="ar" dir="rtl" className="block">أنت غير متصل بالشبكة</span>
      </h1>
      <p className="opacity-70">
        Les pages déjà visitées restent accessibles. Revenez à l&apos;accueil.
        <br />
        <span lang="ar" dir="rtl" className="block">الصفحات التي زرتها تبقى متاحة. عد إلى الرئيسية.</span>
      </p>
      <a href="/" className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white">
        Accueil — الرئيسية
      </a>
    </div>
  );
}
