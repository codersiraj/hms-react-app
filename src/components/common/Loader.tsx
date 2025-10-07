import React from "react";
import HMS_LOGO from "../../assets/img/HMS_LOGO.png";

interface LoaderProps {
  fullscreen?: boolean;
}

export default function Loader({ fullscreen = false }: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullscreen
          ? "fixed inset-0 bg-white z-[9999]" // full-screen mode
          : "absolute inset-0 bg-white/70 z-40 rounded-lg" // container-only mode
      }`}
      style={
        fullscreen
          ? {}
          : {
              top: 0, // stay within main content
              bottom: 0,
              left: 0,
              right: 0,
            }
      }
    >
      <img
        src={HMS_LOGO}
        alt="Loading..."
        className="h-20 w-auto animate-pulse drop-shadow-lg"
      />
    </div>
  );
}
