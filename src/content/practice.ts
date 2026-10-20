import { careers } from "@/content/careers";

export const projectIdeas = careers.flatMap(c => c.projects.map((title, i) => ({
  id: `${c.id}-${i}`, careerId: c.id, title, difficulty: i === 0 ? "Beginner" : "Intermediate",
  objective: `Create a working ${title.toLowerCase()} to practise ${c.learning.slice(0, 2).join(" and ").toLowerCase()}.`,
  skills: c.technical.slice(0, 3), tools: c.tools,
  milestones: ["Define the problem and scope", "Design and plan the solution", "Build a working prototype", "Test and improve", "Publish portfolio documentation"],
  deliverables: ["Working prototype or documented design", "Test evidence and screenshots", "README explaining decisions, limitations and next steps"],
})));

export const interviewQuestions = [
  { id: "g1", mode: "General", question: "Tell me about yourself and your interest in this ICT career.", guidance: "Connect your studies, one relevant project and what you want to learn. Keep it focused on the role.", example: "Example only: I am an ICT student interested in web development. In a course project I built a small site and learned how to test it. I would like to develop these skills in a team." },
  { id: "g2", mode: "General", question: "Explain a portfolio project you are proud of.", guidance: "Cover the problem, your own contribution, tools, one decision and an honest outcome. Distinguish team work from your work.", example: "Example only: Our team built a study planner. I implemented input validation. I tested empty and invalid inputs, then documented what still needed improvement." },
  { id: "t1", mode: "Technical", question: "How would you troubleshoot a system that suddenly stopped working?", guidance: "Clarify symptoms, reproduce safely, check recent changes and logs, isolate causes, test a fix and document it.", example: "Example only: I would ask what changed, reproduce the issue in a safe environment, inspect logs and test one hypothesis at a time. I would verify the fix before closing the issue." },
  { id: "t2", mode: "Technical", question: "How would you test a feature before releasing it?", guidance: "Discuss normal inputs, edge cases, invalid inputs, security and regression checks. Relate your answer to your chosen career.", example: "Example only: For a login form, I would check valid input, missing fields and incorrect credentials, and confirm errors do not reveal private information." },
  { id: "b1", mode: "Behavioural", question: "Describe a time you worked through a team disagreement.", guidance: "Use STAR: Situation, Task, Action, Result. Focus on your actions and what you learned, without blaming colleagues.", example: "Example only: Our project team disagreed on priorities (S). I needed to help us meet a deadline (T). I proposed ranking tasks together (A). We agreed on a smaller scope and finished it (R)." },
  { id: "b2", mode: "Behavioural", question: "Tell me about a time you had to learn an unfamiliar technology.", guidance: "Use STAR. Explain how you chose resources, practised, asked for help and checked your understanding.", example: "Example only: I needed SQL for an assignment (S/T). I studied documentation, tried sample queries and asked for feedback (A). I completed the task and identified joins as my next learning area (R)." },
];

export const resources = [
  { title: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", careers: ["web", "uiux", "mobile"], topic: "HTML, CSS, JavaScript and accessibility", activity: "Build a page with accessible forms and test it on different screens." },
  { title: "Python tutorial", url: "https://docs.python.org/3/tutorial/", careers: ["software", "data", "ai"], topic: "Programming foundations", activity: "Write a small program using conditions, loops and functions." },
  { title: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html", careers: ["database", "data", "analyst"], topic: "Relational databases and SQL", activity: "Create sample tables and practise SELECT, JOIN and GROUP BY." },
  { title: "Cisco Skills for All", url: "https://skillsforall.com/", careers: ["networking", "support", "cyber"], topic: "Networking and defensive security", activity: "Document a small network and practise troubleshooting in an authorised lab." },
  { title: "Microsoft Learn", url: "https://learn.microsoft.com/training/", careers: ["cloud", "support", "data", "ai"], topic: "Cloud, data and platform learning", activity: "Choose a beginner learning path; check any lab costs before starting." },
  { title: "Git documentation", url: "https://git-scm.com/doc", careers: ["software", "web", "mobile", "cloud"], topic: "Version control", activity: "Create a repository, make a branch and document your changes." },
  { title: "Figma learning", url: "https://help.figma.com/", careers: ["uiux", "analyst"], topic: "Prototyping and design", activity: "Prototype a student-support screen and gather feedback from two users." },
  { title: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", careers: ["cyber", "software", "web"], topic: "Application security awareness", activity: "Review a sample app for defensive improvements, only in an authorised environment." },
];