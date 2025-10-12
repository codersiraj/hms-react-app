import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onMenuClick: () => void;
  setStatusMessage: (status: { text: string; color: "green" | "red" } | null) => void;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick, setStatusMessage }) => {
  const [nric, setNRIC] = useState("");
  const [inputError, setInputError] = useState(false);
  const navigate = useNavigate();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // 🔒 Auto logout after 15 minutes (900,000 ms)
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleAutoLogout();
    }, INACTIVITY_LIMIT);
  };

  const handleAutoLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setStatusMessage({
      text: "Session expired due to inactivity. Please log in again.",
      color: "red",
    });
    navigate("/login");
  };

  // ✅ Watch for user activity to reset timer
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // start timer on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  const handleCheck = async () => {
    if (nric.trim() === "") {
      setInputError(true);
      setNRIC("");
      setTimeout(() => setInputError(false), 3000);
      return;
    }

    try {
      setInputError(false);
      // ✅ Navigate to patient register with NRIC + focus instruction
      navigate("/patient-register", { state: { nric, focusField: "fullName" } });
      setTimeout(() => setNRIC(""), 200);
    } catch (error) {
      console.error("Check failed:", error);
      setStatusMessage({
        text: "Error checking NRIC/Passport number.",
        color: "red",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-cyan-600 text-white flex items-center justify-between px-3 sm:px-6 py-2 sm:h-16 z-30 shadow-md space-x-2">
      {/* Left: Hamburger */}
      <div className="flex items-center flex-shrink-0">
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

      {/* Center: Search box */}
      <div className="flex-1 flex justify-center px-2">
        <div className="flex items-center gap-2 w-full max-w-md relative">
          <input
            type="text"
            placeholder={
              inputError
                ? "⚠️ Please enter NRIC or Passport number"
                : "Enter NRIC / Passport Number"
            }
            value={nric}
            onChange={(e) => setNRIC(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-0 pl-3 pr-4 py-1.5 border rounded-md text-black text-sm outline-none transition-all duration-300 placeholder:text-gray-400 ${
              inputError
                ? "border-red-500 text-red-600 placeholder:text-red-500 focus:ring-1 focus:ring-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-cyan-600"
            }`}
          />

          {/* Check button */}
          <button
            onClick={handleCheck}
            className="bg-cyan-800 hover:bg-cyan-700 text-white p-2 sm:px-4 sm:py-1.5 rounded-md flex items-center justify-center"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white sm:hidden"
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
            <span className="hidden sm:inline text-sm font-medium">Check</span>
          </button>
        </div>
      </div>

      {/* Right: Logout + profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          title="Sign out"
          className="hover:text-red-300 transition"
        >
          <LogOut className="h-5 w-5 text-white" />
        </button>

        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/41.jpg"
            alt="Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
