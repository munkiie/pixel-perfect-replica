import { describe, expect, it } from "vitest";
import { applyTheme, storedTheme } from "@/lib/theme";

describe("theme preference", () => {
  it("defaults to dark when nothing is stored", () => {
    expect(storedTheme()).toBe("dark");
  });

  it("remembers a stored light choice", () => {
    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(storedTheme()).toBe("light");
  });

  it("switches back to dark", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(storedTheme()).toBe("dark");
  });
});
