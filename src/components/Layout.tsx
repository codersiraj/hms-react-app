// src/components/Layout.tsx
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-400 to-teal-300 bg-main-pattern bg-cover bg-center overflow-auto">
      <div className="absolute inset-0 bg-black opacity-10 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">{children}</div>
    </div>
  );
}
