"use client";

import Link from "next/link";
import { AlertTriangle, BookOpenCheck } from "lucide-react";

/**
 * L'ancien calculateur mélangeait des posologies sans indication explicitée à des intervalles
 * rénaux dont la provenance n'était pas liée ligne par ligne. Il reste suspendu jusqu'à revue.
 * Ne pas réactiver une dose ni un intervalle depuis ce composant.
 */
export default function AntibiotiquesPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">Antibiotiques : calculateur suspendu</h1>
        <p className="mt-2 text-sm opacity-70">
          Calcul de dose et choix d’intervalle temporairement désactivés.
        </p>
      </header>

      <section role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5">
        <h2 className="flex items-center gap-2 font-black text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          Aucune posologie n’est calculée par cet ancien outil.
        </h2>
        <p className="mt-3 leading-relaxed">
          La version précédente associait des doses générales et des intervalles rénaux sans indication thérapeutique ni référence spécifique vérifiée pour chaque ligne. Ces résultats ne doivent pas guider une prescription. Le calcul ne sera réactivé qu’après vérification des sources, des populations, des unités, des seuils et des indications.
        </p>
      </section>

      <section className="card rounded-2xl border border-line bg-surface p-5">
        <h2 className="flex items-center gap-2 font-bold">
          <BookOpenCheck className="h-5 w-5" aria-hidden />
          Tableau d’adaptation rénale documenté
        </h2>
        <p className="mt-2 text-sm leading-relaxed opacity-80">
          Le tableau OMEDIT archivé présente ses propres limites et avertissements. Il ne choisit pas l’antibiotique empirique, ne remplace pas un protocole tunisien ni l’avis du prescripteur, et distingue le DFG de la ClCr Cockcroft–Gault.
        </p>
        <Link
          href="/calculateurs/antibio-renal"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-blue-500 px-4 py-2 font-bold text-blue-600 dark:text-blue-400"
        >
          Consulter le tableau et ses sources
        </Link>
      </section>
    </div>
  );
}
