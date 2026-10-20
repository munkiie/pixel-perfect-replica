export const opportunityStatuses = ["Interested", "Preparing", "Applied", "Interviewing", "Offer", "Closed"] as const;
export const opportunityKinds = ["Internship", "Graduate programme", "Entry-level role", "Other"] as const;
export function safeOpportunityUrl(value: string) {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; } catch { return null; }
}