import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock,
  CheckCircle,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "../auth/useAuth";
import collabLogo from "/collab-logo.svg";

const SignupScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { user, signUp, signInWithProvider } = useAuth();
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

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Passwords must match");
      return;
    }

    try {
      const { error } = await signUp(
        formData.fullname,
        formData.email,
        formData.password,
      );

      if (error) {
        setError(error.message);
      } else {
        navigate("/signup-verify", { state: { email: formData.email } });
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    setError("");

    try {
      const { error } = await signInWithProvider(provider);

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setSocialLoading(null);
    }
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;
  const isFormValid = formData.fullname && formData.email && passwordsMatch;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-neutral-200 overflow-y-auto overflow-x-hidden">
      {/* Grain Texture Overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-50"
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
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center transition-transform duration-300">
            <img src={collabLogo} alt="CollabBoard Logo" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            CollabBoard
          </span>
        </Link>

        <div className="text-neutral-400 font-light">
          Existing user?
          <Link
            to="/login"
            className="text-emerald-500 hover:text-emerald-400 ml-1 font-medium transition-colors duration-200 tracking-tight"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-20">
        <div
          className={`w-full max-w-md transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-white tracking-tighter">
              Welcome
            </h1>
            <p className="text-neutral-400 text-lg font-light">
              Sign up to collaborate with your team
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 p-8 hover:border-neutral-700 transition-all duration-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-neutral-300 tracking-tight"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900/50 border border-neutral-700 px-12 py-4 text-white placeholder-neutral-500 focus:border-emerald-500 focus:bg-neutral-900 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-300 tracking-tight"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900/50 border border-neutral-700 px-12 py-4 text-white placeholder-neutral-500 focus:border-emerald-500 focus:bg-neutral-900 focus:outline-none transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-300 tracking-tight"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900/50 border border-neutral-700 px-12 py-4 pr-12 text-white placeholder-neutral-500 focus:border-emerald-500 focus:bg-neutral-900 focus:outline-none transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-300 tracking-tight"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full border px-12 py-4 pr-12 text-white placeholder-neutral-500 focus:outline-none transition-all duration-200
                      ${
                        passwordsMatch
                          ? "border-emerald-500 focus:border-emerald-500"
                          : formData.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700 focus:border-emerald-500"
                      }
                      bg-neutral-900/50 focus:bg-neutral-900
                    `}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-center text-sm text-red-400 font-medium">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full px-8 py-4 font-semibold text-base transition-all duration-200 transform
                  ${
                    isFormValid && !isLoading
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                      : "bg-neutral-700 cursor-not-allowed opacity-50 text-neutral-400"
                  }
                `}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm text-center font-light text-neutral-500">
                  <span className="bg-neutral-900 px-3">
                    or
                    <br /> continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin("github")}
                disabled={socialLoading !== null}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer group"
              >
                <FaGithub size={32} />
                <span className="text-neutral-400 group-hover:text-white transition-colors duration-200 font-medium">
                  {socialLoading === "github" ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-neutral-500"></div>
                  ) : (
                    "GitHub"
                  )}
                </span>
              </button>

              <button
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer group"
              >
                <FcGoogle size={32} />
                <span className="text-neutral-400 group-hover:text-white transition-colors duration-200 font-medium">
                  {socialLoading === "google" ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-neutral-500"></div>
                  ) : (
                    "Google"
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-neutral-500 text-sm font-light">
              By signing up, you agree to our{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                className="text-emerald-500 hover:text-emerald-400 transition-colors duration-200"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-emerald-500 hover:text-emerald-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Decoration Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-600/10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-600/5 blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-gradient-to-br from-emerald-500/15 to-green-600/8 blur-lg animate-pulse delay-500"></div>
    </div>
  );
};

export default SignupScreen;
