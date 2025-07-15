// src/components/Headline.tsx
import React from 'react';

export const Headline = ({ text }: { text: string }) => (
  <h2 className="text-2xl font-semibold text-cyan-700 text-center mb-6 font-heading">
    {text}
  </h2>
);
