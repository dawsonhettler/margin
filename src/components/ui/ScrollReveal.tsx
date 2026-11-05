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
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.6,
          delay: delay,
          ease: [0.16, 1, 0.3, 1], // Apple / Linear spring curve
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
