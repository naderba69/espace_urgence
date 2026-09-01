// Liste des protocoles, regroupés par catégorie.
import Link from "next/link";
import { protocolCategories, protocols } from "@/data/protocols";
import ProtocolCard from "@/components/cards/ProtocolCard";

export default function ProtocolsPage() {
  return (
    <div className="flex flex-col gap-8">
      {protocolCategories.map((cat) => {
        const list = protocols.filter((p) => p.category === cat.id);
        if (list.length === 0) return null;
        return (
          <section key={cat.id} aria-label={cat.label.fr}>
            <h2 className="mb-3 text-xl font-bold border-s-4 border-teal-600 ps-3">
              {/* Libellé bilingue résolu côté client par ProtocolCard group header */}
              <CategoryLabel fr={cat.label.fr} ar={cat.label.ar} />
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <li key={p.id}>
                  <Link href={`/protocoles/${p.id}`} className="block rounded-2xl">
                    <ProtocolCard protocol={p} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// Petit composant client inline pour le libellé de catégorie
import T from "@/components/T";
function CategoryLabel({ fr, ar }: { fr: string; ar: string }) {
  return <T fr={fr} ar={ar} />;
}
