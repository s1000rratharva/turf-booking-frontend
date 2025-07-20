"use client";

import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success(" Registration Successful");
        router.push("/");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success(" Login Successful");
        router.push("/");
      }
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("⚠️ You are already registered. Try logging in instead.");
          break;
        case "auth/user-not-found":
          setError("❌ No account found with this email. Please register.");
          break;
        case "auth/wrong-password":
          setError(
            '🔐 Incorrect password. If you registered with Google, please use "Sign in with Google".'
          );
          break;
        case "auth/invalid-email":
          setError("❌ Invalid email format.");
          break;
        case "auth/too-many-requests":
          setError("⏳ Too many failed attempts. Please wait and try again.");
          break;
        default:
          setError(`Something went wrong: ${err.message}`);
          break;
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(" Google Sign-In Successful");
      router.push("/");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Popup closed. Please try again.");
      } else if (err?.code === "auth/cancelled-popup-request") {
        setError("Google Sign-In was interrupted. Try again.");
      } else {
        setError(err?.message || "Google Sign-In failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsRegister(false)}
            className={`px-4 py-2 rounded-l-full ${
              !isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`px-4 py-2 rounded-r-full ${
              isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow hover:shadow-md transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 262"
              className="h-6 w-6"
              preserveAspectRatio="xMidYMid"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              />
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-2">
          If you signed up with Google, please use the Google Sign-In button.
        </p>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}
