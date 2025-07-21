import { Bell, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export default function Header({
  onMenuClick,
  onSettingsClick,
}: {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}) {
  const [nric, setNRIC] = useState("");

  const handleCheck = () => {
    console.log("Checking NRIC:", nric);
  };

  return (
    <header className="bg-[#3d6188] text-white flex flex-wrap items-center justify-between gap-2 px-4 py-2 h-auto sm:h-16 z-30 shadow-md">
      {/* Left: Hamburger */}
      <button onClick={onMenuClick} className="focus:outline-none">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Middle: Input + Button */}
      <div className="flex flex-1 justify-center">
        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter NRIC / Passport Number"
            value={nric}
            onChange={(e) => setNRIC(e.target.value)}
            className="flex-1 min-w-0 pl-3 pr-4 py-1.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
          />
          <button
            onClick={handleCheck}
            className="bg-[#003366] hover:bg-cyan-600 text-white text-sm font-medium rounded-md px-4 py-1.5"
          >
            Check
          </button>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <button onClick={onSettingsClick}>
          <Settings className="h-5 w-5 text-white" />
        </button>
        <Bell className="h-5 w-5 text-white" />
        <LogOut className="h-5 w-5 text-white" />
      </div>
    </header>
  );
}
