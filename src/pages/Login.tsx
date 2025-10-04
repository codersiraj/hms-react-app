import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPageImage from "../assets/img/login-screen-side-image.jpg"; // doctor image
import Logo from "../assets/img/HMS.png"; // logo
import { loginUser, LoginRequest } from "../api/auth"; // adjust path

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: LoginRequest = { userId, password };
      const response = await loginUser(credentials);

      // ✅ Save session info
      localStorage.setItem("token", response.success);

      // redirect to dashboard
      navigate("/patient-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Form Section */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 bg-[#eaf2f4] px-8 md:px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-6">
            <img src={Logo} alt="Hospital Logo" className="h-24 mb-2" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Sign In
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID */}
            <div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                required
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end text-sm">
              <a href="#" className="text-cyan-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-cyan-400" : "bg-cyan-600 hover:bg-cyan-700"
              } text-white font-semibold py-2 rounded-lg shadow-md transition`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2">
        <img src={LoginPageImage} alt="Doctor" className="w-full h-full" />
      </div>
    </div>
  );
}
