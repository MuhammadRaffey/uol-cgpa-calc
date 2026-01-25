"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

// Container for staggered children
export function AnimatedContainer({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Fade in up animation
export function AnimatedFadeInUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// Scale in animation for cards
export function AnimatedCard({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stat card with number animation
export function AnimatedStatCard({
  label,
  value,
  gradient,
  index = 0,
}: {
  label: string;
  value: number;
  gradient: string;
  index?: number;
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
      }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-25 blur transition-opacity duration-500`}
      />
      <div className="relative rounded-3xl border-2 border-slate-200/80 glass p-8 shadow-custom-md dark:border-white/10">
        <motion.p
          className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.2 }}
        >
          {label}
        </motion.p>
        <motion.p
          className="mt-4 text-5xl font-black gradient-text"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.15 + 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Panel slide animation
export function AnimatedPanel({
  children,
  className,
  direction = "right",
}: {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={direction === "left" ? slideInLeft : slideInRight}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// User detail content animation
export function AnimatedUserDetail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Staggered list item
export function AnimatedListItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

// Header animation
export function AnimatedHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
      }}
    >
      {children}
    </motion.div>
  );
}

// Badge with pop animation
export function AnimatedBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}
