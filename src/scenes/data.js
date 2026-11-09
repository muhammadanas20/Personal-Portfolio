/**
 * Structured content for Muhammad Anas's swarm-built cinema portfolio.
 * All identity, projects, honors, education and contact details belong to Muhammad Anas.
 */

export const IDENTITY = {
  logo: "ANAS/BUILD",
  ghostAbout: "ANAS",
  first: "Muhammad",
  last: "Anas",
  tagline: "[ Full-Stack Developer / AI Automation Engineer ]",
  intro:
    "Open to internships and engineering roles worldwide. Passionate about building intelligent, tactile, and high-craft digital systems that leave a mark.",
  locationSide: "Karachi, PK - 24.86°N 67.00°E",
  aboutPhoto: "/about-studio.jpg",
  aboutPhotoCaption: "AI & Systems Studio — Karachi",
  cv: "/Muhammad_Anas_Resume.pdf",
  email: "muhammadanasashfaq2006@gmail.com",
  phone: "+92 319 2658206",
  github: "https://github.com/muhammadanas20",
  linkedin: "https://www.linkedin.com/in/muhammadanas20/",
  instagram: "https://www.instagram.com/_m._.anas_/",
  paperHref: "/atelier",
};

export const LANGUAGES_AND_STACK = [
  ["Urdu", "01", "Native"],
  ["English", "02", "Fluent"],
  ["C / C++", "03", "Systems"],
  ["Python", "04", "AI & RAG"],
  ["TypeScript / JS", "05", "Full-Stack"],
];

export const BACKGROUND = [
  {
    label: "Degree",
    emblem: "/uni/fast_nuces.png",
    alt: "FAST NUCES Official Seal",
    tag: "(degree) - FAST NUCES",
    title: "National University of Computer & Emerging Sciences",
    sub: "Bachelor's Degree in Computer Science (2025 — Present)",
  },
  {
    label: "College",
    emblem: "/uni/bahria_college.jpg",
    alt: "Bahria College Karsaz Official Crest",
    tag: "(pre-eng) - BCK",
    title: "Bahria College Karsaz, Karachi",
    sub: "Higher Secondary in Pre-Engineering & Mathematics (2023 — 2025)",
  },
];

export const TICKER_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "NodeJS",
  "Python",
  "C/C++",
  "LangChain",
  "RAG / BM25",
  "Groq",
  "MongoDB",
  "PostgreSQL",
  "SQL",
  "Docker",
  "Git",
  "GitHub Actions",
  "Vercel",
  "Figma",
  "LaTeX",
];

export const TICKER_CRAFT = [
  "AI Automation",
  "WhatsApp Agents",
  "Classroom Pipelines",
  "Competitive Programming",
  "System Design",
  "LuminaDocs",
  "SolveSphere",
  "Quizly Vision",
  "FAST NUCES",
  "Editorial UI",
];

export const KNOWLEDGE_SLIDES = [
  [
    "Frontend",
    "UI/UX & Frontend",
    "Design is more than looks — it's about clarity and connection. Clean, responsive React and TypeScript interfaces that feel intentional across every screen.",
  ],
  [
    "Backend",
    "Backend & APIs",
    "Solid foundations for real products: scalable Node.js and Python services, clean database schemas, and dependable contracts between systems.",
  ],
  [
    "AI & RAG",
    "RAG & Grounded AI",
    "BM25 and vector retrieval wired into Groq and LangChain pipelines so answers stay strictly grounded inside your actual source documents.",
  ],
  [
    "Agents",
    "Autonomous Channels",
    "WhatsApp, Google Classroom and Gmail automations that pick tasks up unattended, generate polished PDF/DOCX deliverables, and report back.",
  ],
  [
    "Systems",
    "C / C++ & Architecture",
    "Pointer discipline, object-oriented simulations, heuristic engines and custom file protocols — strong foundations beneath every high-level abstraction.",
  ],
  [
    "Algorithms",
    "DSA & Contests",
    "Data structures, algorithmic complexity and competitive programming under clock pressure — proving a solution works before trusting it in production.",
  ],
  [
    "DevOps",
    "Tooling & Cloud",
    "Git workflows, GitHub Actions CI, Docker containers and zero-downtime Vercel deployments engineered for lean bundles and sub-second loads.",
  ],
];

export const PROJECTS = [
  [
    "luminadocs",
    "https://github.com/muhammadanas20/LuminaDocs-AI",
    "LuminaDocs AI",
    "WhatsApp study assistant powered by BM25 RAG indexing over course PDFs & slides, generating exam-ready DOCX notes via Groq.",
    ["Python", "RAG / BM25", "WhatsApp", "Groq"],
  ],
  [
    "solvesphere",
    "https://github.com/muhammadanas20/SolveSphere-AI",
    "SolveSphere",
    "Autonomous Google Classroom watcher that extracts PDF/Word tasks, solves them with Groq, and emails finished PDF + DOCX reports.",
    ["Python", "Classroom API", "Gmail API", "AI"],
  ],
  [
    "ai-detector",
    "https://github.com/muhammadanas20/AI-Image-Detector",
    "AI Detector",
    "Five-engine C++ heuristic analyzer scoring metadata, frequency, watermark and pixel artifacts for image authenticity verdicts.",
    ["C++", "Heuristics", "Forensics", "CLI"],
  ],
  [
    "quizly",
    "https://github.com/muhammadanas20/Quizly-Bot",
    "Quizly Bot",
    "Rate-limited WhatsApp vision bot triggered on tagged quiz photos, running step-by-step multimodal reasoning through Groq Vision.",
    ["Node.js", "Groq Vision", "WhatsApp", "Bot"],
  ],
  [
    "military-command",
    "https://github.com/muhammadanas20/Millitary-Base-Managment-System",
    "Base Command",
    "End-to-end OOP command & control simulation handling personnel, logistics, inventory and tamper-evident audit logs in C++.",
    ["C++", "OOP", "Audit Logs", "Systems"],
  ],
  [
    "election-system",
    "https://github.com/muhammadanas20/pf-project-election-system",
    "Vote Engine",
    "Digital election architecture in C featuring candidate administration, voter authentication and persistent fault-tolerant tallying.",
    ["C", "File I/O", "Security", "Systems"],
  ],
];

export const CURRENTLY_WORKING = [
  "Agentic MCP",
  "Hybrid RAG",
  "Groq Vision",
  "Vector Internals",
  "WebGL / GSAP",
  "C++20 Systems",
  "Next.js Apps",
];

export const EXPERIENCE_JOBS = [
  {
    label: "Freelance",
    role: "Full-Stack Developer",
    org: "Freelance & Client Builds",
    kind: "Client",
    self: false,
  },
  {
    label: "AI Systems",
    role: "AI Automation Engineer",
    org: "LuminaDocs & SolveSphere",
    kind: "Self",
    self: true,
  },
  {
    label: "ACM NUCES",
    role: "Competitive Programmer",
    org: "ACM NUCES Karachi — Team Furious 3",
    kind: "Chapter",
    self: false,
  },
  {
    label: "Open Source",
    role: "Systems & Tooling Builder",
    org: "GitHub · @muhammadanas20",
    kind: "Self",
    self: true,
  },
];

export const SOFT_SKILLS = [
  "RAG Architecture",
  "System Design",
  "API Contracts",
  "Fast Prototyping",
  "Team Contests",
  "Clean Documentation",
];

export const CERTIFICATIONS = [
  "Dean's List of Honors (Fall '25)",
  "ACM Coders Cup '25 Finalist",
  "Developers' Day '26 Contestant",
  "FAST NUCES BS CS",
  "ACM Student Chapter",
  "Competitive C++ Track",
  "Full-Stack & AI Portfolio",
];

export const LIFE_ITEMS = [
  ["/about-studio.jpg", "Engineering Setup", "Software / AI", "4/3"],
  ["/portrait.webp", "Studio Portrait", "Personal / Karachi", "4/5"],
  ["/projects/luminadocs.jpg", "LuminaDocs AI", "RAG / WhatsApp", "4/3"],
  ["/achievements/deans_list_2025.jpg", "Dean's List Honors", "Academic / FAST NUCES", "4/3"],
  ["/monogram.png", "Anastrix Monogram", "Identity / Print", "1/1"],
  ["/projects/solvesphere.jpg", "SolveSphere Pipeline", "Automation / Cloud", "4/3"],
  ["/achievements/coders_cup_2025.jpg", "ACM Coders Cup '25", "Competitive / Finalist", "4/3"],
  ["/projects/ai_detector.jpg", "Heuristic Forensics", "Systems / C++", "4/3"],
  ["/projects/military_command.jpg", "Command Simulation", "OOP / Architecture", "4/3"],
  ["/achievements/dev_day_2026.jpg", "Developers' Day '26", "Algorithms / Contest", "4/3"],
  ["/projects/quizly.jpg", "Quizly Vision", "Multimodal / Node.js", "4/3"],
  ["/projects/election_system.jpg", "Election Core", "C / File Systems", "4/3"],
];

export const BOOKS = [
  {
    label: "Resume PDF",
    kicker: "Curriculum Vitae",
    version: "PDF v2026 — 1 Page",
    title: "Engineering Résumé & Track Record",
    desc: "Condensed engineering profile covering full-stack React/Node/Python architectures, unattended RAG & WhatsApp automations, FAST NUCES academic honors, and competitive programming.",
    tags: ["Full-Stack", "AI & RAG", "FAST NUCES"],
    href: "/Muhammad_Anas_Resume.pdf",
    cta: "View full résumé (PDF) ↗",
    cover: "/books/resume_cover.svg",
    p1: "/books/resume_p1.svg",
    p2: "/books/resume_p2.svg",
    p3: "/books/resume_p3.svg",
  },
  {
    label: "LuminaDocs spec",
    kicker: "LuminaDocs AI",
    version: "Spec v1.0 — System Architecture",
    title: "Grounded RAG & WhatsApp Pipeline",
    desc: "Technical breakdown of how LuminaDocs ingests course slides and PDFs, ranks passages with BM25 lexical precision, constrains LLM synthesis to verified citations, and delivers formatted DOCX study guides.",
    tags: ["Python", "BM25 / RAG", "Groq LLM"],
    href: "https://github.com/muhammadanas20/LuminaDocs-AI",
    cta: "Explore architecture & source ↗",
    cover: "/books/lumina_cover.svg",
    p1: "/books/lumina_p1.svg",
    p2: "/books/lumina_p2.svg",
    p3: "/books/lumina_p3.svg",
  },
];

export const CONTACT_LINKS = [
  ["GitHub", "@muhammadanas20 ↗", "https://github.com/muhammadanas20"],
  ["LinkedIn", "muhammadanas20 ↗", "https://www.linkedin.com/in/muhammadanas20/"],
  ["Instagram", "@_m._.anas_ ↗", "https://www.instagram.com/_m._.anas_/"],
  ["Direct Call", "+92 319 2658206 ↗", "tel:+923192658206"],
];

export const HOBBIES = [
  "Competitive Programming",
  "LeetCode",
  "Chess",
  "AI Agents",
  "UI/UX & Motion",
  "Risograph Art",
  "System Architecture",
  "Hackathons",
  "Open Source",
  "Chai",
];
