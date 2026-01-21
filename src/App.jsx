// src/App.jsx
import { Navbar } from "@/lay/navbar";
import { Hero } from "@/sections/hero";
import { About } from "@/sections/about";
import { Projects } from "@/sections/projects";
import { Education } from "@/sections/education";
import { Contact } from "@/sections/contact";
import { Footer } from "@/lay/footer";
import ClickSpark from "@/components/clickspark";

const App = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <ClickSpark
        sparkColor="#FFFFFF"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={500}
      >
        {" "}
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Education />
          <Contact />
        </main>
        <Footer />
      </ClickSpark>
    </div>
  );
};

export default App;
