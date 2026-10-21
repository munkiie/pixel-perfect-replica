import { describe, expect, it } from "vitest";
import { normalizeProfileName } from "@/content/profile";

describe("normalizeProfileName", () => {
  it("trims and collapses whitespace in a saved name", () => {
    expect(normalizeProfileName("  Sam   Student  ")).toBe("Sam Student");
  });

  it("rejects a name that is empty after trimming", () => {
    expect(normalizeProfileName("   ")).toBeNull();
  });
});