import { Navbar } from "@/lay/navbar";
import { Footer } from "@/lay/footer";
import { Hero } from "@/sections/hero";
import { About } from "@/sections/about";
import { Toolkit } from "@/sections/toolkit";
import { Projects } from "@/sections/projects";
import { Education } from "@/sections/education";
import { Achievements } from "@/sections/achievements";
import { Contact } from "@/sections/contact";
import { Marquee } from "@/components/marquee";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";

const tickerItems = [
  "Full-Stack Development",
  "RAG Pipelines",
  "AI Automation",
  "Competitive Programming",
  "React & Node.js",
  "LangChain Agents",
  "Editorial Interfaces",
  "Open to Work",
];

const App = () => (
  <div className="relative">
    {/* film grain over everything */}
    <div className="grain-overlay" aria-hidden="true" />

    <ScrollProgress />
    <Cursor />
    <Navbar />

    <main id="main">
      <Hero />
      <Marquee items={tickerItems} />
      <About />
      <Toolkit />
      <Projects />
      <Education />
      <Achievements />
      <Contact />
    </main>

    <Footer />
  </div>
);

export default App;
