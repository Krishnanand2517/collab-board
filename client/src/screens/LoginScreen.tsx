import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock } from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "../auth/useAuth";

const LoginScreen = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [forgotPassword, setForgotPassword] = useState(false);

  const { user, signIn, signInWithProvider, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from: { pathname: string } })?.from?.pathname ||
    "/dashboard";

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

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        navigate(from, { replace: true });
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

  const handleForgotPassword = async () => {
    setIsLoading(true);

    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        setError(error.message);
      } else {
        navigate("/reset-password", { state: { email: formData.email } });
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

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

        <div className="text-white/70">
          Don't have an account?
          <a
            href="/signup"
            className="text-amber-400 hover:text-amber-300 ml-1 font-medium transition-colors duration-300"
          >
            Sign up
          </a>
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-white/60 text-lg">
              Log in to continue collaborating with your team
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-500">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:border-amber-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              {!forgotPassword && (
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 pr-12 text-white placeholder-white/40 focus:border-amber-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password */}
              <div className="w-full text-right">
                <button
                  type="button"
                  onClick={() => setForgotPassword(!forgotPassword)}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors duration-300 cursor-pointer"
                >
                  {forgotPassword
                    ? "I will enter the password"
                    : "Forgot password?"}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-center text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              {/* Log In or Reset Button */}
              {forgotPassword ? (
                <button
                  type="button"
                  disabled={isLoading || !formData.email}
                  onClick={() => handleForgotPassword()}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300
                  ${
                    formData.email && !isLoading
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 cursor-pointer hover:shadow-amber-500/25"
                      : "bg-gray-500 cursor-not-allowed opacity-50"
                  }
                `}
                >
                  Reset Password
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
                  ${
                    isFormValid && !isLoading
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/25"
                      : "bg-gray-500 cursor-not-allowed opacity-50"
                  }
                `}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                  <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm text-center font-medium text-white/40">
                  <span>
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
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/20 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                <FaGithub size={32} />
                <span className="text-white/70 group-hover:text-white transition-colors duration-300">
                  {socialLoading === "github" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    "GitHub"
                  )}
                </span>
              </button>

              <button
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/20 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                <FcGoogle size={32} />
                <span className="text-white/70 group-hover:text-white transition-colors duration-300">
                  {socialLoading === "google" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    "Google"
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              By signing in, you agree to our{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Decoration Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-full blur-lg animate-pulse delay-500"></div>
    </div>
  );
};

export default LoginScreen;
