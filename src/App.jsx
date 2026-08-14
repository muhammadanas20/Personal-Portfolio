// src/App.jsx
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/preloader";
import { Navbar } from "@/lay/navbar";
import { Hero } from "@/sections/hero";
import { About } from "@/sections/about";
import { Projects } from "@/sections/projects";
import { Education } from "@/sections/education";
import { Achievements } from "@/sections/achievements";
import { Contact } from "@/sections/contact";
import { Footer } from "@/lay/footer";
import ClickSpark from "@/components/clickspark";
import { CreativeCursor } from "@/components/creative-cursor";
import { AnasMascot } from "@/components/anas-mascot";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <ClickSpark
            key="main-content"
            sparkColor="#FFFFFF"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={500}
          >
            <CreativeCursor />
            <AnasMascot />
            <Navbar />
            <main>
              <Hero />
              <About />
              <Projects />
              <Education />
              <Achievements />
              <Contact />
            </main>
            <Footer />
          </ClickSpark>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
