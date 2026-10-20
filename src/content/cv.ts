export const cvSections = ["Education", "Technical skills", "Employability skills", "Projects", "Work experience", "Internships", "Certifications", "Achievements", "References"] as const;
export type CvSection = typeof cvSections[number];
export type CvEntry = { id: string; title: string; subtitle: string; dates: string; detail: string };
export type CvData = { name: string; email: string; phone: string; location: string; website: string; summary: string; template: "classic" | "compact"; order: CvSection[]; sections: Record<CvSection, CvEntry[]> };
export function emptyCv(name = "", email = ""): CvData {
  return { name, email, phone: "", location: "", website: "", summary: "", template: "classic", order: [...cvSections], sections: { Education: [], "Technical skills": [], "Employability skills": [], Projects: [], "Work experience": [], Internships: [], Certifications: [], Achievements: [], References: [] } };
}
export function parseCv(value: unknown, name = "", email = ""): CvData {
  const base = emptyCv(name, email);
  if (!value || typeof value !== "object") return base;
  const raw = value as Record<string, unknown>;
  for (const key of ["name", "email", "phone", "location", "website", "summary"] as const) if (typeof raw[key] === "string") base[key] = raw[key];
  if (raw['template'] === "compact") base.template = "compact";
  if (Array.isArray(raw['order'])) {
    const valid = raw['order'].filter((x): x is CvSection => cvSections.includes(x));
    base.order = [...new Set([...valid, ...cvSections])];
  }
  if (raw['sections'] && typeof raw['sections'] === "object") for (const s of cvSections) {
    const entries = (raw['sections'] as Record<string, unknown>)[s];
    if (Array.isArray(entries)) base.sections[s] = entries.filter((e): e is CvEntry => e && ["id", "title", "subtitle", "dates", "detail"].every(k => typeof e[k] === "string"));
  }
  return base;
}
export function cvCompletion(cv: CvData) {
  const checks = [!!cv.name.trim(), !!cv.email.trim(), !!cv.summary.trim(), cv.sections.Education.length > 0, cv.sections["Technical skills"].length > 0, cv.sections.Projects.length > 0];
  return Math.round(checks.filter(Boolean).length / checks.length * 100);
}