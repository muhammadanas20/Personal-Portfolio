// src/App.jsx
import { Navbar } from "@/lay/navbar";       
import { Hero } from "@/sections/hero";      
import { About } from "@/sections/about";    
import { Projects } from "@/sections/projects"; 
import { Education } from "@/sections/education"; 
import { Contact } from "@/sections/contact"; 

const App = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Education />
        <Contact />
      </main>
    </div>
  );
};

export default App;
