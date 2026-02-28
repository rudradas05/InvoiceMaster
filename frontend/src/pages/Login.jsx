import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  theme: "colored",
};

const Login = () => {
  const [state, setState] = useState("Login");
  const [signUpStep, setSignUpStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendurl, token, setToken, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  const REGISTER_URL = `${backendurl}/api/user/register`;
  const LOGIN_URL = `${backendurl}/api/user/login`;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (token) {
      toast.error("You are already logged in.", toastConfig);
      return;
    }

    if (state === "Sign Up" && signUpStep === 1) {
      if (!name || !email || !password) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }
      setSignUpStep(2);
      return;
    }

    if (state === "Sign Up" && signUpStep === 2) {
      if (!phoneNumber || !address || !companyName) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post(REGISTER_URL, {
          name,
          email,
          password,
          phoneNumber,
          address,
          companyName,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/email-verify");
          toast.success("Account created successfully!", toastConfig);
        } else {
          toast.error(data.message, toastConfig);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Signup failed",
          toastConfig,
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (state === "Login") {
      if (!email || !password) {
        toast.error("Please fill all required fields.", toastConfig);
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post(LOGIN_URL, { email, password });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setIsLoggedin(true);
          navigate("/");
          toast.success("Login successful!", toastConfig);
        } else {
          toast.error(data.message, toastConfig);
        }
      } catch {
        toast.error("Login failed. Try again.", toastConfig);
      } finally {
        setLoading(false);
      }
    }
  };

  const inputBase =
    "w-full rounded-lg bg-[#0b0f1a] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1424]/80 backdrop-blur-xl p-8 animate-scale-in relative z-10 gradient-border">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {state === "Sign Up" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {state === "Sign Up"
              ? "Start managing billing and inventory"
              : "Sign in to continue"}
          </p>

          {state === "Sign Up" && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <div
                className={`h-1.5 w-10 rounded-full transition-all duration-500 ${signUpStep >= 1 ? "bg-cyan-400" : "bg-white/10"}`}
              />
              <div
                className={`h-1.5 w-10 rounded-full transition-all duration-500 ${signUpStep >= 2 ? "bg-cyan-400" : "bg-white/10"}`}
              />
            </div>
          )}
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && signUpStep === 1 && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
                placeholder="Full name"
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                type="email"
                placeholder="Email address"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {state === "Sign Up" && signUpStep === 2 && (
            <>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputBase}
                placeholder="Phone number"
                required
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputBase}
                placeholder="Business address"
                required
              />
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputBase}
                placeholder="Company name"
                required
              />
            </>
          )}

          {state === "Login" && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                type="email"
                placeholder="Email address"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="text-xs text-gray-400 cursor-pointer hover:text-white"
            >
              Forgot password?
            </p>
          )}

          <div className="flex gap-3 pt-2">
            {state === "Sign Up" && signUpStep === 2 && (
              <button
                type="button"
                onClick={() => setSignUpStep(1)}
                className="w-full rounded-lg border border-white/10 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 btn-press"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-60 btn-press"
            >
              {loading
                ? "Processing..."
                : state === "Sign Up"
                  ? signUpStep === 1
                    ? "Continue"
                    : "Create account"
                  : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <span
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
              setSignUpStep(1);
            }}
            className="cursor-pointer text-cyan-400 hover:underline"
          >
            {state === "Sign Up" ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
