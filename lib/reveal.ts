// v7.6 — utilitaire commun : toute pression qui dévoile un contenu y fait glisser l'écran.
// Garde-fou : ne fait rien si scrollIntoView est indisponible (tests/jsdom ancien, SSR).
export function reveal(el: Element | null | undefined): void {
  if (!el || typeof el.scrollIntoView !== "function") return;
  requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
}
