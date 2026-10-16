import {
  Code2,
  Users,
  Briefcase,
  FileText,
  RefreshCw,
  Handshake,
  GraduationCap,
  Building2,
  LifeBuoy,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type Component = {
  id: number;
  title: string;
  summary: string;
  skills: string[];
  support: string;
  icon: LucideIcon;
};

export const components: Component[] = [
  {
    id: 1,
    title: "Technical and Digital ICT Skills",
    summary: "Core technical knowledge and hands-on digital capability.",
    icon: Code2,
    skills: [
      "Programming and software development.",
      "Database management.",
      "Networking and cybersecurity.",
      "Digital tools and emerging technologies.",
      "Systems analysis and practical technical problem-solving.",
    ],
    support:
      "Practical assignments, coding projects, technical workshops, portfolio projects and relevant short courses.",
  },
  {
    id: 2,
    title: "Employability and Cognitive Skills",
    summary: "Interpersonal, thinking and professional skills valued at work.",
    icon: Users,
    skills: [
      "Communication.",
      "Teamwork and collaboration.",
      "Problem-solving and critical thinking.",
      "Time management and organisation.",
      "Adaptability, professionalism and leadership.",
    ],
    support:
      "Group projects, presentations, realistic workplace problems, teamwork activities and workplace-readiness workshops.",
  },
  {
    id: 3,
    title: "Practical Workplace Experience",
    summary: "Opportunities to apply classroom knowledge in real settings.",
    icon: Briefcase,
    skills: [
      "Practical laboratory activities.",
      "Real-world ICT projects.",
      "Internships and work-integrated learning.",
      "Industry exposure.",
      "Mentoring and opportunities to apply classroom knowledge.",
    ],
    support:
      "Industry-linked projects, internships where available, workplace visits, job shadowing and ICT professional mentoring.",
  },
  {
    id: 4,
    title: "Career Development and Support",
    summary: "Preparing students to search, apply and present themselves.",
    icon: FileText,
    skills: [
      "CV and cover-letter preparation.",
      "Job searching.",
      "Interview preparation.",
      "Professional portfolios and profiles.",
      "Career guidance, networking and mentoring.",
    ],
    support:
      "CV workshops, mock interviews, career counselling, portfolio reviews and graduate networking activities.",
  },
  {
    id: 5,
    title: "Continuous Learning and Adaptability",
    summary: "Keeping pace with a fast-changing ICT field.",
    icon: RefreshCw,
    skills: [
      "Independent learning.",
      "Identifying skills gaps.",
      "Learning new technologies.",
      "Professional development.",
      "Adapting to changes in ICT and workplace practices.",
    ],
    support:
      "Technology workshops, learning resources, short courses, relevant certifications and personal skills-development plans.",
  },
  {
    id: 6,
    title: "Curriculum–Industry Alignment",
    summary: "Connecting ICT learning with workplace requirements.",
    icon: Handshake,
    skills: [
      "Connecting ICT learning with workplace requirements.",
      "Employer feedback.",
      "Industry participation in learning activities.",
      "Practical learning opportunities.",
      "Continuous improvement of learning and career support.",
    ],
    support:
      "Employer engagement, industry-linked projects, guest presentations, feedback sessions and collaboration with ICT professionals.",
  },
];

export const stakeholders: { name: string; role: string; icon: LucideIcon }[] = [
  {
    name: "WSU ICT Department and Lecturers",
    role: "Provide teaching, learning guidance and relevant development opportunities.",
    icon: GraduationCap,
  },
  {
    name: "ICT Students",
    role: "Participate actively and identify their development needs.",
    icon: UserCheck,
  },
  {
    name: "Employers and ICT Professionals",
    role: "Contribute workplace perspectives and may support practical learning.",
    icon: Building2,
  },
  {
    name: "WSU Career Services and Relevant Support Services",
    role: "Help students prepare for employment and access career-development opportunities.",
    icon: LifeBuoy,
  },
  {
    name: "ICT Alumni",
    role: "Share experiences and advice about transitioning into ICT employment.",
    icon: Users,
  },
];

export const theories = [
  {
    title: "Human Capital Theory",
    text: "Explains the importance of developing students' knowledge, skills and capabilities to prepare them for work.",
  },
  {
    title: "Consensus Theory",
    text: "Supports cooperation among the university, students, employers and other stakeholders towards shared career-readiness goals.",
  },
];

export const feedbackSteps = [
  "Student Needs and Questionnaire Findings",
  "Review Framework Components",
  "Improve Support Activities",
  "Review Again",
];

export const references = [
  "Calitz, A. P., Greyling, J. H., & Cullen, M. D. M. (2014). South African Industry ICT Graduate Skills Requirements.",
  "Misra, R. K., & Khurana, K. (2017). Employability skills among information technology professionals: A literature review.",
  "Perera, M. A., Fernandes, T., & Paniker, P. (2018). Career readiness: A survey on effectiveness of learning employability skills at university level.",
  "Osmani, M., Weerakkody, V., Hindi, N., & Eldabi, T. (2019). Graduates employability skills: A review of literature against market demand.",
  "Pažur Anić, K., & Bušelić, V. (2021). Importance of generic skills of ICT graduates—Employers, teaching staff, and students perspective.",
  "Alam, M. J., & Ogawa, K. (2024). Future-readiness and employable ICT skills of university graduates in Bangladesh: An analysis during the post-COVID era.",
  "Mugogo, M. (2025). The availability of ICT skills in South African business organisations: A literature review.",
  "Naidu et al. (2025). ICT Graduate Perspectives: The Influence of Blended Learning on Employability.",
];
