// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareForAi, thumbnail } from "@/lib/ecg-db";

afterEach(() => vi.unstubAllGlobals());

describe("préparation locale des images ECG", () => {
  it("ne transmet jamais les octets d'origine quand le navigateur ne peut pas décoder l'image", async () => {
    class UndecodableImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      width = 0;
      height = 0;
      set src(_value: string) { queueMicrotask(() => this.onerror?.()); }
    }
    vi.stubGlobal("Image", UndecodableImage);
    const original = "data:image/png;base64,PRIVATE_ORIGINAL_IMAGE";

    await expect(prepareForAi(original)).rejects.toThrow("invalid-image");
    await expect(thumbnail(original)).resolves.toBeNull();
  });
});
