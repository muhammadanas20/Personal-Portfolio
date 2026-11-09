/**
 * Content for the Scene portfolio.
 * All copy is Anas's own — the reference site's text, images and identity
 * are not reproduced, only its scene-based design language.
 */

export const IDENTITY = {
  first: "MUHAMMAD",
  last: "ANAS",
  role: "FULL-STACK DEVELOPER · AI AUTOMATION",
  status: "OPEN TO INTERNSHIPS — 2026",
  location: "KARACHI, PK",
  coords: "24.86° N / 67.00° E",
  email: "muhammadanasashfaq2006@gmail.com",
  phone: "+92 319 2658206",
  cv: "/Muhammad_Anas_Resume.pdf",
  github: "https://github.com/muhammadanas20",
  linkedin: "https://www.linkedin.com/in/muhammadanas20/",
  instagram: "https://www.instagram.com/_m._.anas_/",
  atelier: "/atelier",
};

export const SCENES = [
  { n: "01", key: "origin", name: "ORIGIN" },
  { n: "02", key: "about", name: "ABOUT" },
  { n: "03", key: "skills", name: "SKILLS" },
  { n: "04", key: "works", name: "SELECTED WORKS" },
  { n: "05", key: "statement", name: "INTENT" },
  { n: "06", key: "track", name: "TRACK RECORD" },
  { n: "07", key: "life", name: "OFF-SCREEN" },
  { n: "08", key: "deepdive", name: "DEEP DIVE" },
  { n: "09", key: "connect", name: "CONNECT" },
];

export const FACTS = [
  ["BASED IN", "Karachi, Pakistan"],
  ["STUDYING", "BS CS — FAST NUCES, 2nd year"],
  ["FOCUS", "AI automation · full-stack web"],
  ["OFF-KEYBOARD", "LeetCode · chess · chai"],
];

export const DISCIPLINES = [
  {
    n: "01",
    tag: "FRONTEND",
    title: "Interfaces with a point of view",
    body: "React and TypeScript frontends that hold up under real content — editorial typography, motion that explains itself, accessibility that isn't an afterthought.",
  },
  {
    n: "02",
    tag: "AI / RAG",
    title: "Retrieval that respects the source",
    body: "BM25 and vector retrieval, grounded prompts and Groq-served models. Answers stay inside the documents you actually gave the system.",
  },
  {
    n: "03",
    tag: "AUTOMATION",
    title: "Agents wired into real channels",
    body: "WhatsApp, Classroom and Gmail pipelines that pick work up, do it end to end and report back — no dashboard babysitting required.",
  },
  {
    n: "04",
    tag: "SYSTEMS",
    title: "Foundations before frameworks",
    body: "C, C++, OOP and data structures: the reason the abstractions above them can be trusted, and the reason performance work is possible at all.",
  },
  {
    n: "05",
    tag: "CRAFT",
    title: "Speed is a feature",
    body: "Lean bundles, query budgets and latency you can feel. If a page needs a spinner to apologise for itself, it isn't finished.",
  },
];

export const SKILLS = [
  {
    n: "01",
    tag: "FRONTEND",
    title: "UI / UX & Frontend",
    body: "Clean, responsive interfaces that feel intentional on every screen size — type, grid and motion treated as one system.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma"],
  },
  {
    n: "02",
    tag: "BACKEND & AI",
    title: "Backend, RAG & APIs",
    body: "Scalable Node.js and Python services, retrieval pipelines over your own documents, and contracts that stay boring in production.",
    items: ["Node.js", "Python", "LangChain", "RAG / BM25", "Groq", "MongoDB", "SQL"],
  },
  {
    n: "03",
    tag: "AUTOMATION",
    title: "Agents & Integrations",
    body: "Bots and schedulers wired into the tools people already use — WhatsApp, Classroom, Gmail — with guardrails and rate limits.",
    items: ["WhatsApp API", "Classroom API", "Gmail API", "EmailJS", "Cron", "Webhooks"],
  },
  {
    n: "04",
    tag: "LANGUAGES",
    title: "Languages",
    body: "From pointer arithmetic to prompt construction — the right level of abstraction for the problem in front of me.",
    items: ["C", "C++ / OOP", "JavaScript", "Python", "SQL", "LaTeX"],
  },
  {
    n: "05",
    tag: "TOOLS",
    title: "Tools & Cloud",
    body: "Ship, observe, repeat. Version control, CI and hosting that keep deploys uneventful.",
    items: ["Git", "GitHub Actions", "Vercel", "Docker basics", "REST APIs"],
  },
  {
    n: "06",
    tag: "FOUNDATIONS",
    title: "CS Foundations",
    body: "Data structures, algorithms and database design — plus the competitive-programming habit of proving a solution before trusting it.",
    items: ["DSA", "OOP", "DB design", "Competitive programming"],
  },
  {
    n: "07",
    tag: "CURRENTLY",
    title: "Currently exploring",
    body: "Where the next projects are coming from: agent protocols, retrieval internals and rendering that leaves the DOM behind.",
    items: ["Agentic workflows (MCP)", "Vector DB internals", "WebGL / shaders", "System design"],
  },
];

export const PROJECTS = [
  {
    id: "PRJ_001",
    n: "01",
    title: "LuminaDocs AI",
    kind: "AI automation · Python",
    year: "2026",
    body: "A WhatsApp study assistant. /quiz triggers a RAG backend that indexes your own course PDFs and slides with BM25, Groq drafts an exam-focused .docx from only those sources, and the bot replies in chat.",
    tags: ["Python", "RAG", "WhatsApp", "BM25", "Groq"],
    image: "/projects/luminadocs.jpg",
    alt: "Risograph illustration of an open book flowing into chat bubbles",
    href: "https://github.com/muhammadanas20/LuminaDocs-AI",
  },
  {
    id: "PRJ_002",
    n: "02",
    title: "SolveSphere AI",
    kind: "AI automation · Python",
    year: "2026",
    body: "A Google Classroom watcher that polls new assignments, extracts text from attached PDFs, Docs and Word files, solves them with Groq, emails back finished PDF + DOCX — and never solves the same task twice.",
    tags: ["Python", "Classroom API", "Gmail API", "Automation"],
    image: "/projects/solvesphere.jpg",
    alt: "Risograph illustration of documents flowing through an automation funnel",
    href: "https://github.com/muhammadanas20/SolveSphere-AI",
  },
  {
    id: "PRJ_003",
    n: "03",
    title: "AI Image Detector",
    kind: "Semester build · C++",
    year: "2026",
    body: "Five heuristic engines — metadata, artifacts, frequency, watermark and hybrid-deep — score an image, then a weighted verdict returns an authenticity confidence with search, filtering and report export.",
    tags: ["C++", "Heuristics", "CLI", "System design"],
    image: "/projects/ai_detector.jpg",
    alt: "Risograph illustration of a magnifying glass scanning a pixelating photo",
    href: "https://github.com/muhammadanas20/AI-Image-Detector",
  },
  {
    id: "PRJ_004",
    n: "04",
    title: "Quizly Bot",
    kind: "AI automation · Node.js",
    year: "2026",
    body: "A WhatsApp group bot that wakes only when a message pairs the word “quiz” with a photo — downloads it, runs Groq vision reasoning, answers step by step in chat and rate-limits itself to stay polite.",
    tags: ["Node.js", "WhatsApp API", "Groq Vision"],
    image: "/projects/quizly.jpg",
    alt: "Risograph illustration of a chat bubble with an eye examining a photo",
    href: "https://github.com/muhammadanas20/Quizly-Bot",
  },
  {
    id: "PRJ_005",
    n: "05",
    title: "Military Base Management",
    kind: "Semester build · C++",
    year: "2025",
    body: "Command & control simulation for military bases, modelled end to end with OOP: personnel, logistics, weapons inventory, operations and tamper-evident audit logs with custom exception handling.",
    tags: ["C++", "OOP", "File handling", "System design"],
    image: "/projects/military_command.jpg",
    alt: "Risograph illustration of a radar command screen and insignia",
    href: "https://github.com/muhammadanas20/Millitary-Base-Managment-System",
  },
  {
    id: "PRJ_006",
    n: "06",
    title: "Election Voting System",
    kind: "Semester build · C",
    year: "2025",
    body: "A complete digital election simulation: candidate administration, secure voter authentication and automated vote counting over persistent file storage — integrity first, edge cases included.",
    tags: ["C", "File I/O", "Logic building"],
    image: "/projects/election_system.jpg",
    alt: "Risograph illustration of a ballot box with a verification stamp",
    href: "https://github.com/muhammadanas20/pf-project-election-system",
  },
];

export const TRACK = {
  work: [
    {
      role: "Freelance Full-Stack Developer",
      org: "Self-employed",
      kind: "Client work",
      period: "2025 — NOW",
      body: "Landing pages, dashboards and small full-stack products — React on the front, Node or Python behind, deployed on Vercel.",
    },
    {
      role: "AI Automation Builder",
      org: "Independent",
      kind: "Self",
      period: "2025 — NOW",
      body: "WhatsApp and Classroom agents that run unattended: retrieval over course material, generated deliverables, email hand-off.",
    },
    {
      role: "Competitive Programmer",
      org: "ACM NUCES Karachi",
      kind: "Chapter",
      period: "2025 — NOW",
      body: "Regular contest practice in C++; finalist at ACM Coders Cup 2025 with team “Furious 3”.",
    },
  ],
  education: [
    {
      degree: "BS Computer Science",
      school: "FAST NUCES, Karachi",
      period: "2025 — PRESENT",
      body: "Undergraduate CS in one of the country's most competitive rooms — systems thinking and competitive programming as a sport.",
    },
    {
      degree: "Pre-Engineering",
      school: "Bahria College Karsaz",
      period: "2023 — 2025",
      body: "The mathematical backbone: calculus, physics and analytical logic.",
    },
  ],
  honors: [
    {
      title: "Dean's List of Honors",
      org: "FAST NUCES",
      when: "FALL 2025",
      badge: "HONOR",
      image: "/achievements/deans_list_2025.jpg",
    },
    {
      title: "ACM Coders Cup 2025",
      org: "ACM NUCES Karachi",
      when: "JAN 2026",
      badge: "FINALIST",
      image: "/achievements/coders_cup_2025.jpg",
    },
    {
      title: "Developers' Day 2026",
      org: "ACM NUCES Karachi",
      when: "MAY 2026",
      badge: "CONTESTANT",
      image: "/achievements/dev_day_2026.jpg",
    },
  ],
};

export const GALLERY = [
  { src: "/achievements/deans_list_2025.jpg", title: "Dean's List", meta: "ACADEMIC / HONOR", span: "wide", doc: true },
  { src: "/projects/luminadocs.jpg", title: "LuminaDocs", meta: "RISOGRA PH / AI", span: "" },
  { src: "/projects/ai_detector.jpg", title: "AI Detector", meta: "RISOGRA PH / SYSTEM", span: "" },
  { src: "/achievements/coders_cup_2025.jpg", title: "Coders Cup", meta: "COMPETITIVE / TEAM", span: "tall", doc: true },
  { src: "/projects/solvesphere.jpg", title: "SolveSphere", meta: "RISOGRA PH / AUTOMATION", span: "" },
  { src: "/achievements/dev_day_2026.jpg", title: "Developers' Day", meta: "CONTEST / ALGORITHMS", span: "" },
  { src: "/projects/military_command.jpg", title: "Military Base", meta: "RISOGRA PH / OOP", span: "wide" },
  { src: "/projects/quizly.jpg", title: "Quizly", meta: "RISOGRA PH / VISION", span: "" },
  { src: "/projects/election_system.jpg", title: "Election System", meta: "RISOGRA PH / C", span: "" },
  { src: "/portrait.png", title: "Portrait", meta: "PERSONAL / KARACHI", span: "" },
  { src: "/profile.png", title: "Studio frame", meta: "IDENTITY / PRINT", span: "" },
  { src: "/og-card.jpg", title: "Brand card", meta: "ARCHIVE / 2026", span: "" },
];

export const HOBBIES = [
  "Competitive programming",
  "LeetCode",
  "Chess",
  "Risograph art",
  "Open source",
  "UI experiments",
  "Chai",
  "Long walks",
];

export const MARQUEE_A = [
  "REACT",
  "NEXT.JS",
  "TYPESCRIPT",
  "TAILWIND",
  "NODE.JS",
  "PYTHON",
  "LANGCHAIN",
  "RAG / BM25",
  "GROQ",
  "MONGODB",
  "SQL",
  "C / C++",
];

export const MARQUEE_B = [
  "WHATSAPP API",
  "CLASSROOM API",
  "GMAIL API",
  "GITHUB ACTIONS",
  "VERCEL",
  "DOCKER",
  "FRAMER MOTION",
  "FIGMA",
  "REST",
  "AGENTIC WORKFLOWS",
];
