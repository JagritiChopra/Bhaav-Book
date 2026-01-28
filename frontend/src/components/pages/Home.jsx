// src/components/Home.jsx
import Navbar from '../Navbar/Navbar';
import Features from '../home/Features';
import Hero from '../home/Hero';
import Impact from '../home/Impact';
import Testimonials from '../home/Testimonials';

function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Unified seamless background for the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
      
      {/* Common background decorative elements that float across the entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large blurred circles that provide subtle background interest */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800/30 dark:to-indigo-700/20 blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(148,163,184,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.05)_0%,rgba(148,163,184,0)_70%)]"></div>
      </div>

      {/* Content sections with relative positioning and higher z-index */}
      <div className="relative z-10">
        {/* <Navbar /> */}
        <Hero />
        <Features />
        <Impact />
        <Testimonials />
      </div>
    </div>
  );
}

export default Home;