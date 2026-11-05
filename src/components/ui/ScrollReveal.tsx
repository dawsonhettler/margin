"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  width?: "full" | "fit";
}

export const ScrollReveal: React.FC<Props> = ({
  children,
  className = "",
  delay = 0,
  width = "full",
}) => {
  return (
    <div className={width === "full" ? "w-full" : "w-fit"}>
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 1.4, // Slow, majestic glide
          delay: delay,
          ease: [0.22, 1, 0.36, 1], // Luxurious smooth deceleration curve
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
