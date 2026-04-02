"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn"; // Will adjust

interface HackifyScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

export function HackifyScoreRing({
  score,
  maxScore = 1000,
  size = 120,
  strokeWidth = 8,
  className,
  animate = true,
}: HackifyScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.max(0, Math.min(score / maxScore, 1));
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg className="absolute inset-0" width={size} height={size}>
        <circle
          className="text-surface border-surface"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Foreground Progress */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <motion.circle
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0px 0px 8px rgba(108, 58, 255, 0.5))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          className="font-mono text-xl font-bold text-text-primary"
          initial={animate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}
