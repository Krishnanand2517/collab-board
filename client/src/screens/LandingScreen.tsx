import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Zap, Globe, ArrowRight, Play } from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { features, testimonials } from "../data";
import Footer from "../components/Footer";
import collabLogo from "/collab-logo.svg";

const LandingScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [navigate, user]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-neutral-200 overflow-y-auto overflow-x-hidden">
      {/* Grain Texture Overlay */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-700"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, transparent 70%, #0a0a0a 95%),
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)
          `,
        }}
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.5) 0.5px, transparent 0.5px), 
        linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0.5px, transparent 0.5px)
      `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-10 flex items-center justify-between py-8 px-6 md:px-20 lg:px-52 2xl:px-80 transition-all duration-1000 border-b border-neutral-800/50 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center transition-transform duration-300">
            <img src={collabLogo} alt="CollabBoard Logo" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            CollabBoard
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/login"
            className="text-neutral-400 hover:text-white font-medium transition-colors duration-200 tracking-tight"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-black px-5 py-2.5 font-medium hover:bg-neutral-200 transition-all duration-200 transform hover:translate-y-[-1px] shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={`relative z-10 text-center py-24 px-6 md:px-20 lg:px-52 2xl:px-80 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-[0.95] tracking-tighter">
          Collaborate
          <br />
          <span className="text-emerald-500">Without Limits</span>
        </h1>

        <p className="text-xl text-neutral-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
          The next-generation collaboration platform that brings teams together
          in real-time. Create, share, and innovate with the power of
          synchronized teamwork.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link
            to="/signup"
            className="bg-emerald-500 text-white px-9 py-4 font-semibold text-base hover:bg-emerald-600 transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:translate-y-[-2px] group"
          >
            Start Collaborating
            <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="https://youtu.be/TFns7vs7eS4"
            target="_blank"
            className="border border-neutral-700 text-white px-9 py-4 font-semibold text-base hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer group"
          >
            <Play className="w-5 h-5 mr-2 inline-block" />
            Watch Demo
          </a>
        </div>

        {/* Floating Cards Animation */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-7 flex flex-col items-center justify-center transform transition-all duration-700 hover:border-neutral-600 hover:bg-neutral-900/70 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 mb-5 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  {i === 1 && <Users className="w-7 h-7 text-white" />}
                  {i === 2 && <Zap className="w-7 h-7 text-white" />}
                  {i === 3 && <Globe className="w-7 h-7 text-white" />}
                </div>
                <h3 className="font-semibold text-white mb-3 tracking-tight">
                  {i === 1 && "Team Sync"}
                  {i === 2 && "Instant Updates"}
                  {i === 3 && "Global Access"}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {i === 1 && "Real-time collaboration across all devices"}
                  {i === 2 && "Lightning-fast synchronization"}
                  {i === 3 && "Access from anywhere in the world"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 py-24 px-6 md:px-20 lg:px-52 2xl:px-80 border-t border-neutral-800/50"
      >
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-5 text-white tracking-tighter">
            Powerful Features
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-light">
            Everything you need to supercharge your team's collaboration and
            productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 p-9 flex flex-col items-center justify-start text-center hover:border-emerald-500/30 hover:bg-neutral-900/50 transition-all duration-300 h-full min-h-[280px]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 mb-7 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 flex-shrink-0 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-neutral-400 leading-relaxed flex-grow font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6 md:px-20 lg:px-52 2xl:px-80 border-t border-neutral-800/50">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-5 text-white tracking-tighter">
            Loved by Teams and Individuals
          </h2>
          <p className="text-neutral-400 text-lg font-light">
            See what the users are saying about CollabBoard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 p-8 hover:border-neutral-700 hover:bg-neutral-900/50 transition-all duration-300 flex flex-col justify-between h-full min-h-[200px]"
            >
              <p className="text-neutral-300 mb-7 font-light leading-relaxed flex-grow">
                "{testimonial.content}"
              </p>
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold tracking-tight">
                    {testimonial.name}
                  </h4>
                  {/* <p className="text-neutral-400 text-sm font-light">
                    {testimonial.role}
                  </p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 md:px-20 lg:px-52 2xl:px-80 text-center border-t border-neutral-800/50">
        <div className="bg-neutral-900/40 border border-neutral-800 p-14 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-7 text-white tracking-tighter">
            Ready to Transform Your Team?
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto font-light">
            Start collaborating more effectively with CollabBoard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/signup"
              className="bg-emerald-500 text-white px-9 py-4 font-semibold text-base hover:bg-emerald-600 transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:translate-y-[-2px] group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="https://youtu.be/TFns7vs7eS4"
              target="_blank"
              className="border border-neutral-700 text-white px-9 py-4 font-semibold text-base hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingScreen;
