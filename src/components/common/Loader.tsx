import React from "react";
import HMS_LOGO from "../../assets/img/HMS_LOGO.png";

interface LoaderProps {
  fullscreen?: boolean; // true for full-page splash, false for in-body loading
}

export default function Loader({ fullscreen = false }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullscreen
          ? "fixed inset-0 bg-white z-[9999]"
          : "absolute inset-0 bg-white/70 z-50 rounded-lg"
      }`}
    >
      <img
        src={HMS_LOGO}
        alt="Loading..."
        className="h-20 w-auto animate-pulse drop-shadow-lg"
      />
    </div>
  );
}
