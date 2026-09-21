import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

// v2.2 — même alias « @ » que tsconfig, pour les tests de composants.
export default defineConfig({
  resolve: { alias: { "@": path.dirname(fileURLToPath(import.meta.url)) } },
  test: { environment: "node" },
});
