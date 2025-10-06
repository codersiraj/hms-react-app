import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPageImage from "../assets/img/login-screen-side-image.jpg";
import Logo from "../assets/img/HMS_TITLE.png";
import { loginUser, LoginRequest } from "../api/auth";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      localStorage.setItem("token", response.success);
      navigate("/patient-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#eaf2f4]">
      {/* Left side - form */}
      <div className="flex flex-1 justify-center items-center px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={Logo}
              alt="HMS Logo"
              className="w-48 max-w-full sm:w-56 md:w-80 h-auto mb-5 object-contain"
            />
            <h2 className="text-2xl font-semibold text-cyan-700 text-center">
              Sign In
            </h2>
          </div>


          {/* Error */}
          {error && (
            <div className="mb-4 text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="flex justify-end text-sm">
              <a href="#" className="text-cyan-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-cyan-400" : "bg-cyan-600 hover:bg-cyan-700"
                } text-white font-semibold py-3 rounded-lg shadow-md transition`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side (desktop only) */}
      <div className="hidden xl:flex xl:w-1/2">
        <img
          src={LoginPageImage}
          alt="Doctor illustration"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
