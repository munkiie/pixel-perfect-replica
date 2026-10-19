// Practice quizzes. Scores show practice performance only, not certified competence.
export type QuizQuestion = { q: string; options: string[]; answer: number; explain: string };
export type Quiz = { id: string; title: string; questions: QuizQuestion[] };

export const quizzes: Quiz[] = [
  {
    id: "programming",
    title: "Programming fundamentals",
    questions: [
      { q: "What does a loop do?", options: ["Stores data permanently", "Repeats a block of code", "Connects to a network", "Styles a web page"], answer: 1, explain: "Loops (for, while) repeat code until a condition is met." },
      { q: "Which value is a boolean?", options: ["\"true\"", "42", "true", "3.14"], answer: 2, explain: "true/false without quotes are booleans; in quotes it is a string." },
      { q: "What is a function?", options: ["A reusable named block of code", "A type of database", "A CSS rule", "A network cable"], answer: 0, explain: "Functions group logic so you can reuse it by calling its name." },
      { q: "Array indexes usually start at…", options: ["1", "0", "-1", "Any number"], answer: 1, explain: "Most languages (Java, Python, JS, C#) are zero-indexed." },
      { q: "What is debugging?", options: ["Writing documentation", "Finding and fixing errors", "Deploying to a server", "Designing a logo"], answer: 1, explain: "Debugging means locating and fixing defects in code." },
    ],
  },
  {
    id: "web",
    title: "Web development",
    questions: [
      { q: "HTML is used to…", options: ["Style pages", "Structure page content", "Query databases", "Encrypt data"], answer: 1, explain: "HTML defines structure; CSS styles it; JavaScript adds behaviour." },
      { q: "Which CSS property changes text colour?", options: ["font-color", "text-style", "color", "background"], answer: 2, explain: "The property is simply `color`." },
      { q: "What does HTTP status 404 mean?", options: ["Server error", "Not found", "Success", "Redirect"], answer: 1, explain: "404 means the requested resource was not found." },
      { q: "Responsive design means…", options: ["The site loads fast", "Layout adapts to screen sizes", "It uses animations", "It replies to emails"], answer: 1, explain: "Responsive layouts adapt to phones, tablets and desktops." },
      { q: "Which runs in the browser?", options: ["JavaScript", "SQL", "Bash", "PHP"], answer: 0, explain: "JavaScript is the browser's native scripting language." },
    ],
  },
  {
    id: "databases",
    title: "Databases & SQL",
    questions: [
      { q: "Which SQL keyword retrieves data?", options: ["GET", "SELECT", "FETCH", "READ"], answer: 1, explain: "SELECT columns FROM table retrieves rows." },
      { q: "A primary key must be…", options: ["Unique", "Text only", "Optional", "Encrypted"], answer: 0, explain: "A primary key uniquely identifies each row." },
      { q: "WHERE is used to…", options: ["Sort rows", "Filter rows", "Join tables", "Delete tables"], answer: 1, explain: "WHERE filters rows by a condition; ORDER BY sorts." },
      { q: "A foreign key…", options: ["Links to another table's key", "Encrypts a column", "Is always a number", "Speeds up queries"], answer: 0, explain: "Foreign keys reference a key in another table to relate data." },
      { q: "Normalisation aims to…", options: ["Add duplicate data", "Reduce redundancy", "Remove all keys", "Make tables bigger"], answer: 1, explain: "Normalisation organises data to reduce duplication and anomalies." },
    ],
  },
  {
    id: "networking",
    title: "Networking basics",
    questions: [
      { q: "What does DNS do?", options: ["Assigns IP addresses", "Translates names to IP addresses", "Encrypts traffic", "Blocks viruses"], answer: 1, explain: "DNS maps domain names like wsu.ac.za to IP addresses." },
      { q: "Which device forwards traffic between networks?", options: ["Switch", "Router", "Monitor", "Keyboard"], answer: 1, explain: "Routers connect different networks; switches connect devices within one." },
      { q: "DHCP is used to…", options: ["Automatically assign IP addresses", "Send email", "Store files", "Host websites"], answer: 0, explain: "DHCP gives devices IP settings automatically." },
      { q: "Which is a private IPv4 address?", options: ["8.8.8.8", "192.168.1.10", "1.1.1.1", "41.0.0.1"], answer: 1, explain: "192.168.x.x is a private range used inside local networks." },
      { q: "The `ping` command tests…", options: ["Disk speed", "Reachability of a host", "Password strength", "CPU temperature"], answer: 1, explain: "ping checks whether a host responds and how long it takes." },
    ],
  },
  {
    id: "security",
    title: "Cybersecurity awareness",
    questions: [
      { q: "Phishing is…", options: ["A fishing app", "Tricking people into revealing information", "A type of firewall", "A backup method"], answer: 1, explain: "Phishing uses fake messages to steal credentials or data." },
      { q: "MFA means…", options: ["Multi-factor authentication", "Main firewall access", "Managed file archive", "Mobile feature app"], answer: 0, explain: "MFA requires two or more proofs of identity." },
      { q: "A strong password is…", options: ["Your birthday", "Long and unique", "password123", "Your name"], answer: 1, explain: "Length and uniqueness matter most; use a password manager." },
      { q: "A firewall…", options: ["Filters network traffic", "Cools the CPU", "Backs up files", "Speeds up Wi-Fi"], answer: 0, explain: "Firewalls allow or block traffic based on rules." },
      { q: "Why install updates?", options: ["Only for new looks", "To fix security vulnerabilities", "To slow the device", "They are optional always"], answer: 1, explain: "Patches close known vulnerabilities attackers exploit." },
    ],
  },
  {
    id: "data",
    title: "Data analysis",
    questions: [
      { q: "The mean is…", options: ["The middle value", "The most common value", "The average", "The largest value"], answer: 2, explain: "Mean = sum ÷ count. Median is the middle; mode is most common." },
      { q: "Which chart suits trends over time?", options: ["Pie chart", "Line chart", "Word cloud", "Table only"], answer: 1, explain: "Line charts show change across time clearly." },
      { q: "Data cleaning involves…", options: ["Deleting all data", "Fixing missing or wrong values", "Printing reports", "Buying servers"], answer: 1, explain: "Cleaning handles missing, duplicate and inconsistent values." },
      { q: "An outlier is…", options: ["A typical value", "A value far from the others", "A column name", "A chart title"], answer: 1, explain: "Outliers differ greatly from most data and need checking." },
      { q: "Correlation means…", options: ["One causes the other", "Two variables move together", "Data is missing", "Data is sorted"], answer: 1, explain: "Correlation is not causation — it only shows a relationship." },
    ],
  },
  {
    id: "swdev",
    title: "Software engineering practice",
    questions: [
      { q: "Git is used for…", options: ["Version control", "Graphic design", "Spreadsheets", "Email"], answer: 0, explain: "Git tracks code changes and supports collaboration." },
      { q: "In Agile, a sprint is…", options: ["A short fixed work period", "A bug type", "A server", "A final exam"], answer: 0, explain: "Sprints are short iterations (often 1–4 weeks)." },
      { q: "A unit test checks…", options: ["The whole system at once", "A small piece of code", "The UI colours", "Network speed"], answer: 1, explain: "Unit tests verify individual functions or components." },
      { q: "Requirements describe…", options: ["What the system must do", "The office layout", "Salaries", "Server brand"], answer: 0, explain: "Requirements capture what users need the system to do." },
      { q: "A pull request is…", options: ["A request to merge code changes", "A network packet", "A database backup", "A design file"], answer: 0, explain: "Pull requests let teammates review changes before merging." },
    ],
  },
];

export const quizById = (id: string) => quizzes.find((q) => q.id === id);

export function scoreQuiz(quiz: Quiz, answers: number[]) {
  return quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
}
