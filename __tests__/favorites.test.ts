import { describe, expect, it } from "vitest";
import { moveFavoriteKey } from "@/lib/favorites";

describe("moveFavoriteKey", () => {
  it("moves an item one step in either direction without mutating the input", () => {
    const keys = ["a", "b", "c"];
    expect(moveFavoriteKey(keys, "b", -1)).toEqual(["b", "a", "c"]);
    expect(moveFavoriteKey(keys, "b", 1)).toEqual(["a", "c", "b"]);
    expect(keys).toEqual(["a", "b", "c"]);
  });

  it("keeps the same order at the ends and for an unknown key", () => {
    const keys = ["a", "b"];
    expect(moveFavoriteKey(keys, "a", -1)).toBe(keys);
    expect(moveFavoriteKey(keys, "b", 1)).toBe(keys);
    expect(moveFavoriteKey(keys, "unknown", 1)).toBe(keys);
  });
});
