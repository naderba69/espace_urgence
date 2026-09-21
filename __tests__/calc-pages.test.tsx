// @vitest-environment jsdom
// v6.9 — فحص شامل: كل صفحات الحاسبات تُعرض وتنتج محتوى دون انهيار.
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import Providers from "@/components/Providers";

const pages = import.meta.glob("../app/calculateurs/*/page.tsx");

describe("صفحات الحاسبات ال66 تُعرض", () => {
  for (const [p, loader] of Object.entries(pages)) {
    it(p.split("/")[3], async () => {
      const M = (await loader()) as { default: ComponentType };
      const { container } = render(<Providers><M.default /></Providers>);
      expect(container.textContent!.length).toBeGreaterThan(20);
    });
  }
});
