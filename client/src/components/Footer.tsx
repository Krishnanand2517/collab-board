import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-12 px-6 md:px-20 lg:px-52 2xl:px-80 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            CollabBoard
          </span>
        </div>

        <div className="flex space-x-8 text-white/60">
          <a
            href="#"
            className="hover:text-amber-400 transition-colors duration-300"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-amber-400 transition-colors duration-300"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-amber-400 transition-colors duration-300"
          >
            Support
          </a>
        </div>
      </div>

      <div className="text-center text-white/40 text-sm mt-8">
        © 2025 CollabBoard. All rights reserved.
        <br />
        <span className="text-white/70">
          Made with 🧡 by{" "}
          <a
            href="https://krishnanand-yadav-portfolio.vercel.app/"
            target="_blank"
            className="text-white/90 hover:underline hover:text-amber-400"
          >
            Krishnanand Yadav
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
