import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import Footer from "../components/Footer";
import OtpInput from "../components/OtpInput";
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, verifyOtpReset, updatePassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email;

  const handleVerify = async () => {
    if (!token || token.length !== 6) return;
    setIsLoading(true);
    setError("");

    try {
      const { error } = await verifyOtpReset(email, token);

      if (error) {
        setError(error.message);
      } else {
        setOtpVerified(true);
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
      const { error } = await resetPassword(email);

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

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await updatePassword(password);

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

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white/90 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-20 lg:px-52 2xl:px-80">
        <div className="max-w-md w-full bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          <h2 className="text-center text-2xl font-bold mb-4">
            {otpVerified ? "Set New Password" : "Reset your Password"}
          </h2>

          {otpVerified ? (
            <>
              {/* Password Input */}
              <div className="space-y-2 mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/80"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Confirm Password Input */}
              <div className="space-y-2 mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white/80"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-xl px-12 py-4 pr-12 text-white placeholder-white/40 focus:outline-none transition-all duration-300
                      ${
                        passwordsMatch
                          ? "border-green-500 focus:border-green-500"
                          : confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/20 focus:border-amber-500/50"
                      }
                      bg-white/5 focus:bg-white/10
                    `}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-300"
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
                <div className="text-center text-sm text-red-700 font-medium mb-6">
                  {error}
                </div>
              )}

              {/* Update Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleUpdatePassword()}
                  disabled={isLoading || !passwordsMatch}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300
              ${
                passwordsMatch && !isLoading
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/25"
                  : "bg-gray-500 cursor-not-allowed opacity-50"
              }`}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-center font-semibold mb-8 text-neutral-300">
                We sent a 6-digit code to{" "}
                <b className="text-amber-400">{email}</b>
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
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
