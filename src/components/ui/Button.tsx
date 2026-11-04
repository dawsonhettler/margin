import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center uppercase font-sans tracking-[0.2em] transition-all duration-150 rounded-none cursor-pointer disabled:opacity-40 select-none";

  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 border border-white font-medium",
    secondary: "bg-black text-white hover:bg-neutral-900 border border-[#333333] hover:border-white font-normal",
    danger: "bg-red-950/60 text-red-200 border border-red-800 hover:bg-red-900/80 font-normal",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-[11px]",
    lg: "px-8 py-3.5 text-xs",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
