import { describe, expect, it } from "vitest";
import { emptyCv, parseCv } from "@/content/cv";
import { safeOpportunityUrl } from "@/content/opportunities";

describe("Student-provided CV facts", () => {
  it("does not fabricate experience or qualifications in a new CV", () => {
    const cv = emptyCv("Student", "student@school.edu");
    expect(cv.sections["Work experience"]).toEqual([]);
    expect(cv.sections.Education).toEqual([]);
    expect(cv.sections.Certifications).toEqual([]);
  });
  it("preserves the student's entered experience", () => {
    const cv = emptyCv();
    cv.sections.Projects = [{ id: "1", title: "My project", subtitle: "Course assignment", dates: "2026", detail: "I tested the form." }];
    expect(parseCv(cv).sections.Projects).toEqual(cv.sections.Projects);
  });
});
describe("Original opportunity links", () => {
  it("rejects executable links", () => {
    expect(safeOpportunityUrl("javascript:alert(1)")).toBeNull();
    expect(safeOpportunityUrl("https://careers.example.org/job")).toBe("https://careers.example.org/job");
  });
});