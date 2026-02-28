import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendurl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const toastConfig = {
    position: "top-right",
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      toast.info("Sending OTP...", toastConfig); // Indicate process start
      const { data } = await axios.post(
        `${backendurl}/api/user/send-reset-otp`,
        { email },
      );

      if (data.success) {
        toast.success(data.message, toastConfig);
        setIsEmailSent(true);
      } else {
        toast.error(
          data.message || "Failed to send OTP. Please try again.",
          toastConfig,
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network error. Please try again.";
      toast.error(errorMessage, toastConfig);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      toast.info("Resetting password...", toastConfig);
      const { data } = await axios.post(
        `${backendurl}/api/user/reset-password`,
        { email, otp, newPassword },
      );

      if (data.success) {
        toast.success(
          "Password reset successful! Redirecting to login...",
          toastConfig,
        );
        navigate("/login");
      } else {
        toast.error(
          data.message || "Failed to reset password. Please try again.",
          toastConfig,
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network error. Please try again.";
      toast.error(errorMessage, toastConfig);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      {!isEmailSent && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1424]/80 backdrop-blur-xl p-8 animate-scale-in relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter your registered email to receive an OTP
            </p>
          </div>

          <form onSubmit={onSubmitEmail} className="space-y-4">
            <input
              className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email address"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition"
            >
              Send Reset OTP
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer text-cyan-400 hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1424]/80 backdrop-blur-xl p-8 animate-scale-in relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Enter OTP
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={onSubmitOtp} className="space-y-6">
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    className="w-12 h-12 bg-[#0b0f1a] border border-white/10 text-white text-center text-xl rounded-lg focus:outline-none focus:border-cyan-400"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition"
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}

      {isOtpSubmitted && isEmailSent && (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1424]/80 backdrop-blur-xl p-8 animate-scale-in relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              New Password
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter your new password
            </p>
          </div>

          <form onSubmit={onSubmitPassword} className="space-y-4">
            <input
              className="w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              type="password"
              placeholder="New password"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 transition"
            >
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
