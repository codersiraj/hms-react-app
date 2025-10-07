import React, { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onMenuClick: () => void;
  setStatusMessage: (status: { text: string; color: "green" | "red" } | null) => void;
};

const API_BASE_URL =
  (window as any)._env_?.API_BASE_URL
    ? `${(window as any)._env_.API_BASE_URL}/api/patient`
    : "http://localhost:5000/api/patient";

const Header: React.FC<HeaderProps> = ({ onMenuClick, setStatusMessage }) => {
  const [nric, setNRIC] = useState("");
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (nric.trim() === "") {
      setStatusMessage({
        text: "Please enter a valid NRIC/Passport number.",
        color: "red",
      });
      return;
    }

    try {
      navigate("/patient-register");
      // const response = await fetch(`${API_BASE_URL}/check-nric?nric=${nric}`);
      // if (!response.ok) {
      //   throw new Error("API request failed");
      // }

      // const result = await response.json();

      // if (result.exists === true) {
      //   setStatusMessage({ text: "Patient exists.", color: "green" });
      // } else {
      //   setStatusMessage({ text: "Patient not found.", color: "red" });
      // }
    } catch (error) {
      console.error("Check failed:", error);
      setStatusMessage({
        text: "Error checking NRIC/Passport number.",
        color: "red",
      });
    }
  };

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the stored token
    localStorage.removeItem("user");  // if you store user info, clear it too
    navigate("/login"); // redirect to login
  };

  return (
    <header className="bg-cyan-600 text-white flex items-center justify-between px-4 py-2 h-auto sm:h-16 z-30 shadow-md">
      {/* Left: Hamburger */}
      <div className="flex items-center gap-3 sm:gap-2 flex-shrink-0 mr-2 sm:mr-0">
        <button onClick={onMenuClick} className="focus:outline-none">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-2">
        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter NRIC / Passport Number"
            value={nric}
            onChange={(e) => setNRIC(e.target.value)}
            className="flex-1 min-w-0 pl-3 pr-4 py-1.5 border border-gray-300 rounded-md text-black text-sm"
          />
          <button
            onClick={handleCheck}
            className="hidden sm:block bg-cyan-800 hover:bg-cyan-700 text-white text-sm font-medium rounded-md px-4 py-1.5"
          >
            Check
          </button>
          <button
            onClick={handleCheck}
            className="sm:hidden bg-cyan-800 hover:bg-cyan-700 text-white p-2 rounded-md flex items-center justify-center"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pl-2 sm:pl-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* <Bell className="h-5 w-5 text-white" /> */}
          {/* ✅ Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="hover:text-red-300 transition"
          >
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/41.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <span className="text-sm text-white font-semibold hidden sm:inline">
          user@example.com
        </span>
      </div>
    </header>
  );
};

export default Header;
