import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import Footer from "../components/Footer";
import OtpInput from "../components/OtpInput";

const SignupVerify = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const { verifyOtpSignup, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email;

  useEffect(() => {
    if (countdown <= 0) return;

    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const handleVerify = async () => {
    if (!token || token.length !== 6) return;
    setIsLoading(true);
    setError("");

    try {
      const { error } = await verifyOtpSignup(email, token);

      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setCountdown(30); // reset countdown timer optimistically
    setError("");

    try {
      const { error } = await resendOtp(email);

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white/90 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-20 lg:px-52 2xl:px-80">
        <div className="max-w-md w-full bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <h2 className="text-center text-2xl font-bold mb-4">
            Verify your Email
          </h2>
          <p className="text-center font-semibold mb-8 text-neutral-300">
            We sent a 6-digit code to <b className="text-amber-400">{email}</b>
          </p>

          <OtpInput length={6} onComplete={(value) => setToken(value)} />

          {/* Error message */}
          {error && (
            <div className="text-center text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleVerify}
              disabled={isLoading || token.length !== 6}
              className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300
              ${
                token.length === 6 && !isLoading
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/25"
                  : "bg-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResend}
              disabled={isLoading || countdown > 0}
              className={`w-full py-2 font-medium transition-colors duration-300
                    ${
                      countdown > 0
                        ? "text-neutral-500 cursor-not-allowed"
                        : "text-amber-400 hover:text-amber-300"
                    }`}
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupVerify;
