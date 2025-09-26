import { useState, useRef } from "react";

interface OtpInputPropTypes {
  length?: number;
  onComplete: (otp: string) => void;
}

const OtpInput = ({ length = 6, onComplete }: OtpInputPropTypes) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, idx: number) => {
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          ref={(el) => {
            inputs.current[idx] = el;
          }}
          className="w-12 h-14 text-center text-xl font-medium rounded-lg bg-white/5 border border-white/20 text-amber-400 focus:border-amber-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
        />
      ))}
    </div>
  );
};

export default OtpInput;
