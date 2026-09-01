// Grille des calculateurs disponibles.
import { calculators } from "@/data/calculators";
import CalculatorCard, { type LucideName } from "@/components/cards/CalculatorCard";

export default function CalculatorsPage() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calculators.map((c) => (
        <li key={c.id}>
          <CalculatorCard id={c.id} href={c.href} title={c.title} description={c.description} icon={c.icon as LucideName} />
        </li>
      ))}
    </ul>
  );
}
