// src/components/common/PageLoader.tsx
import React from "react";
import HMS_LOGO from "../../assets/img/HMS_LOGO.png"; // adjust path

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <img
        src={HMS_LOGO}
        alt="Loading..."
        className="h-24 w-auto animate-pulse"
      />
    </div>
  );
}
