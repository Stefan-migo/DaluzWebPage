"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedEntryProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedEntry({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimatedEntryProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 20, opacity: 0 };
      case "down":
        return { y: -20, opacity: 0 };
      case "left":
        return { x: 20, opacity: 0 };
      case "right":
        return { x: -20, opacity: 0 };
      case "none":
        return { opacity: 0 };
      default:
        return { y: 20, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ y: 0, x: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggeredContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggeredItem({
  children,
  className = "",
}: StaggeredItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 15, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
