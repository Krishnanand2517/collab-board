import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import Footer from "../components/Footer";
import OtpInput from "../components/OtpInput";

const SignupVerify = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { verifyOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email;

  const handleVerify = async () => {
    if (!token || token.length !== 6) return;
    setIsLoading(true);
    setError("");

    try {
      const { error } = await verifyOtp(email, token);

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
    setIsLoading(true);
    setError("");

    try {
      const { error } = await resendOtp(email);

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className="w-full py-2 text-amber-400 font-medium hover:text-amber-300 transition-colors duration-300"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupVerify;
