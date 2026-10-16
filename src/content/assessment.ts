// Interest & confidence self-assessment. Responses are self-reported, not proof of competence.
export type AssessmentItem = { id: string; text: string; type: "interest" | "confidence"; careers: string[] };

export const scaleLabels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
export const confidenceLabels = ["Not confident", "Slightly", "Somewhat", "Confident", "Very confident"];

export const assessmentItems: AssessmentItem[] = [
  { id: "i1", type: "interest", text: "I enjoy writing code to make something work.", careers: ["software", "web", "mobile", "ai"] },
  { id: "i2", type: "interest", text: "I enjoy building things people use in a web browser.", careers: ["web", "uiux"] },
  { id: "i3", type: "interest", text: "I like the idea of creating apps for phones.", careers: ["mobile"] },
  { id: "i4", type: "interest", text: "I enjoy organising information into tables and structures.", careers: ["database", "data"] },
  { id: "i5", type: "interest", text: "I enjoy figuring out why a network or computer is not working.", careers: ["networking", "support"] },
  { id: "i6", type: "interest", text: "I am interested in protecting systems from attacks.", careers: ["cyber"] },
  { id: "i7", type: "interest", text: "I enjoy finding patterns and insights in numbers.", careers: ["data", "ai"] },
  { id: "i8", type: "interest", text: "I am curious about how apps are deployed and run on servers or the cloud.", careers: ["cloud", "networking"] },
  { id: "i9", type: "interest", text: "I care about how things look and how easy they are to use.", careers: ["uiux", "web"] },
  { id: "i10", type: "interest", text: "I enjoy helping people solve their technical problems.", careers: ["support"] },
  { id: "i11", type: "interest", text: "I enjoy understanding how a business works and what it needs.", careers: ["analyst"] },
  { id: "i12", type: "interest", text: "I am excited by machines that can learn from data.", careers: ["ai"] },
  { id: "i13", type: "interest", text: "I enjoy automating repetitive tasks.", careers: ["cloud", "software"] },
  { id: "i14", type: "interest", text: "I am willing to learn unfamiliar technologies on my own.", careers: ["software", "web", "mobile", "database", "networking", "cyber", "data", "cloud", "uiux", "support", "analyst", "ai"] },
  { id: "c1", type: "confidence", text: "Writing a small program using loops and conditions.", careers: ["software", "web", "mobile", "ai"] },
  { id: "c2", type: "confidence", text: "Building a simple web page with HTML and CSS.", careers: ["web", "uiux"] },
  { id: "c3", type: "confidence", text: "Writing SQL queries to retrieve data.", careers: ["database", "data", "analyst"] },
  { id: "c4", type: "confidence", text: "Configuring IP addresses and basic network settings.", careers: ["networking", "support", "cloud"] },
  { id: "c5", type: "confidence", text: "Explaining basic security practices like strong passwords and MFA.", careers: ["cyber", "support"] },
  { id: "c6", type: "confidence", text: "Creating charts and summaries from a dataset.", careers: ["data", "ai"] },
  { id: "c7", type: "confidence", text: "Using the Linux command line.", careers: ["cloud", "networking", "cyber"] },
  { id: "c8", type: "confidence", text: "Sketching a wireframe or prototype of an app screen.", careers: ["uiux", "mobile"] },
  { id: "c9", type: "confidence", text: "Writing down requirements for a system from a user's description.", careers: ["analyst", "software"] },
  { id: "c10", type: "confidence", text: "Explaining a technical problem to a non-technical person.", careers: ["support", "analyst", "data"] },
];

export type CareerScore = { careerId: string; interest: number | null; confidence: number | null };

/** Average 1-5 per career, kept SEPARATE for interest and confidence. */
export function scoreAssessment(answers: Record<string, number>, careerIds: string[]): CareerScore[] {
  return careerIds.map((id) => {
    const avg = (type: AssessmentItem["type"]) => {
      const vals = assessmentItems.filter((q) => q.type === type && q.careers.includes(id) && answers[q.id]).map((q) => answers[q.id]);
      return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
    };
    return { careerId: id, interest: avg("interest"), confidence: avg("confidence") };
  });
}
