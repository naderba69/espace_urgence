import { ObstetriquePageClient } from "./HubClient";
import { hubProps } from "@/lib/hub-props";

// v17.2 — la résolution des titres liés se fait ici (build-time) : le composant client
// ne télécharge plus les bases de protocoles et de médicaments.
export default function ObstetriquePage() {
  const linked = hubProps(["eclampsie", "hemorragie-post-partum"], ["sulfate-magnesium", "oxytocine", "acide-tranexamique", "gluconate-calcium"]);
  return <ObstetriquePageClient linked={linked} />;
}
