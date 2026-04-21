"use client";
import { motion } from "framer-motion";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      transition={{ 
        ease: [0.22, 1, 0.36, 1], // Custom bouncy cubic bezier curve
        duration: 0.6 
      }}
      className="flex-1 w-full h-full"
    >
      {children}
    </motion.div>
  );
}
