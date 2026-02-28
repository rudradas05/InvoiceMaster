import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const EmailVerify = () => {
  const { backendurl, token, userData, isLoggedin, isVerified } =
    useContext(AppContext);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isOtpInvalid, setIsOtpInvalid] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const { value } = e.target;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
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

  const sendVerificationOtp = async () => {
    try {
      if (!userData || !userData._id) {
        toast.error(
          "User data not loaded. Please refresh and try again.",
          toastConfig,
        );
        return;
      }
      const userId = userData._id;
      const { data } = await axios.post(
        `${backendurl}/api/user/send-verify-otp`,
        { userId },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Verification OTP sent successfully", toastConfig);
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message, toastConfig);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", toastConfig);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const enteredOtp = otpArray.join("");

    if (enteredOtp.length !== 6) {
      setIsOtpInvalid(true);
      toast.error("Please enter a valid 6-digit OTP.", toastConfig);
      return;
    }

    try {
      if (!userData || !userData._id) {
        toast.error(
          "User data not loaded. Please refresh and try again.",
          toastConfig,
        );
        return;
      }
      const userId = userData._id;
      const { data } = await axios.post(
        `${backendurl}/api/user/verify-account`,
        { userId, otp: enteredOtp },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Email verified successfully!", toastConfig);
        navigate("/");
      } else {
        setIsOtpInvalid(true);
        toast.error(data.message, toastConfig);
      }
    } catch (error) {
      toast.error(error.message || "Verification failed", toastConfig);
    }
  };

  const inputClass = (index) =>
    `w-12 h-12 bg-[#0b0f1a] border border-white/10 text-white text-center text-xl rounded-lg focus:outline-none focus:border-cyan-400 ${
      isOtpInvalid && inputRefs.current[index]?.value === ""
        ? "border-red-500"
        : ""
    }`;

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1424]/80 backdrop-blur-xl p-8 animate-scale-in relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-semibold text-white tracking-tight mb-2">
            Email Verification
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            Verify your email to activate your account and access all features.
          </p>

          {!isOtpSubmitted ? (
            <button
              onClick={sendVerificationOtp}
              className="rounded-lg bg-cyan-500 px-8 py-3 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 btn-press"
            >
              Send Verification OTP
            </button>
          ) : (
            <form onSubmit={verifyOtp} className="w-full space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Enter OTP
                </h2>
                <p className="text-sm text-gray-400">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {Array(6)
                  .fill("")
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className={inputClass(index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 btn-press"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
