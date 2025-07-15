// src/components/PrimaryButton.tsx
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
};

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`bg-primary text-white py-2 px-6 rounded-md hover:bg-primaryDark transition font-semibold tracking-wide ${className}`}
  >
    {children}
  </button>
);
