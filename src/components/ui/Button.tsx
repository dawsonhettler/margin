"use client";
import React, { useState, useRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    if (onClick) onClick(e);
  };

  const base =
    "relative overflow-hidden inline-flex items-center justify-center uppercase font-sans tracking-[0.2em] transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed apple-press";

  const variants = {
    primary:
      "bg-white text-black hover:bg-neutral-100 font-medium shadow-[0_4px_20px_rgba(255,255,255,0.25)] border border-white",
    secondary:
      "bg-black text-white hover:bg-neutral-900/90 border border-[#2a2a2a] hover:border-white/60 font-light backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]",
    glass:
      "bg-white/[0.05] hover:bg-white/[0.12] text-white border border-white/15 hover:border-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] font-light",
    danger:
      "bg-red-950/40 text-red-200 border border-red-900/80 hover:bg-red-900/60 font-light",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-[11px]",
    lg: "px-8 py-3.5 text-xs",
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Liquid Ripple Wave */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 12,
            top: ripple.y - 12,
            width: 24,
            height: 24,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};
