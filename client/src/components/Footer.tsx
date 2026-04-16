import collabLogo from "/collab-logo.svg";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-neutral-800/50 py-12 px-6 md:px-20 lg:px-52 2xl:px-80 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <img src={collabLogo} alt="CollabBoard Logo" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            CollabBoard
          </span>
        </div>

        <div className="flex space-x-8 text-neutral-400">
          <a
            href="/privacy-policy"
            target="_blank"
            className="hover:text-white transition-colors duration-200 tracking-tight"
          >
            Privacy
          </a>
          <a
            href="/terms-of-service"
            target="_blank"
            className="hover:text-white transition-colors duration-200 tracking-tight"
          >
            Terms
          </a>
        </div>
      </div>

      <div className="text-center text-neutral-500 text-sm mt-8 font-light">
        © 2026 CollabBoard.
        <br />
        <span className="text-neutral-400">
          Made with 🧡 by{" "}
          <a
            href="https://krishnanand.info"
            target="_blank"
            className="text-neutral-300 hover:underline hover:text-white transition-colors duration-200"
          >
            Krishnanand Yadav
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
