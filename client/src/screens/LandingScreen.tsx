import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Users,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";

import { useAuth } from "../auth/useAuth";
import { features, testimonials } from "../data";
import Footer from "../components/Footer";

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
    <div className="fixed inset-0 bg-neutral-950 text-white/90 overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, transparent 60%, rgb(10, 10, 10) 90%, rgb(10, 10, 10) 100%),
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)
          `,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(to bottom, transparent 0%, transparent 60%, rgb(10, 10, 10) 90%, rgb(10, 10, 10) 100%),
        linear-gradient(rgba(245, 158, 11, 0.25) 1px, transparent 1px), 
        linear-gradient(90deg, rgba(245, 158, 11, 0.25) 1px, transparent 1px)
      `,
            backgroundSize: "100% 100%, 50px 50px, 50px 50px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-10 flex items-center justify-between py-6 px-6 md:px-20 lg:px-52 2xl:px-80 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            CollabBoard
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/login"
            className="text-white/70 hover:text-amber-400 font-medium transition-colors duration-300"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-lg font-medium hover:from-amber-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={`relative z-10 text-center py-20 px-6 md:px-20 lg:px-52 2xl:px-80 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 mr-2" />
          Now with AI-powered insights
          <ChevronRight className="w-4 h-4 ml-2" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent leading-tight">
          Collaborate
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Without Limits
          </span>
        </h1>

        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          The next-generation collaboration platform that brings teams together
          in real-time. Create, share, and innovate with the power of
          synchronized teamwork.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="/signup"
            className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-amber-500/25 group"
          >
            Start Collaborating
            <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          <button className="border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 cursor-pointer group">
            <Play className="w-5 h-5 mr-2 inline-block" />
            Watch Demo
          </button>
        </div>

        {/* Floating Cards Animation */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center transform transition-all duration-1000 delay-${
                  i * 200
                } hover:scale-105 hover:rotate-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0 rotate-0"
                    : "opacity-0 translate-y-12 rotate-3"
                }`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mb-4 flex items-center justify-center">
                  {i === 1 && <Users className="w-6 h-6 text-white" />}
                  {i === 2 && <Zap className="w-6 h-6 text-white" />}
                  {i === 3 && <Globe className="w-6 h-6 text-white" />}
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {i === 1 && "Team Sync"}
                  {i === 2 && "Instant Updates"}
                  {i === 3 && "Global Access"}
                </h3>
                <p className="text-white/60 text-sm">
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
        className="relative z-10 py-20 px-6 md:px-20 lg:px-52 2xl:px-80"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Everything you need to supercharge your team's collaboration and
            productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-start text-center hover:border-amber-500/30 transition-all duration-500 hover:bg-white/5 h-full min-h-[280px]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 flex-shrink-0">
                {feature.title}
              </h3>
              <p className="text-white/60 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-6 md:px-20 lg:px-52 2xl:px-80">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
            Loved by Teams Worldwide
          </h2>
          <p className="text-white/60 text-lg">
            See what industry leaders are saying about CollabBoard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between h-full min-h-[200px]"
            >
              <p className="text-white/80 mb-6 italic flex-grow">
                "{testimonial.content}"
              </p>
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 md:px-20 lg:px-52 2xl:px-80 text-center">
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
            Ready to Transform Your Team?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams already collaborating more effectively with
            CollabBoard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="/signup"
              className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all duration-300 cursor-pointer group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <button className="border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 cursor-pointer">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingScreen;
