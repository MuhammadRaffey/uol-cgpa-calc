"use client";

import { motion } from "framer-motion";
import { BookOpen, Calculator, Sparkles, Target } from "lucide-react";
import type { ScrollHandler, ScrollKeyHandler, SessionStats } from "./types";

type HeroSectionProps = {
  stats: SessionStats;
  onScrollTo: ScrollHandler;
  onScrollKeyDown: ScrollKeyHandler;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3 },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.5 + i * 0.1,
    },
  }),
};

export default function HeroSection({
  stats,
  onScrollTo,
  onScrollKeyDown,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] py-16 lg:py-20 flex flex-col justify-center"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:from-emerald-400/10 dark:to-teal-400/10 dark:text-emerald-200"
            >
              <Sparkles className="h-5 w-5" />
              Calm by Design
            </motion.div>
            <motion.h1
              variants={itemVariants}
              id="hero-title"
              className="text-5xl font-black text-slate-900 sm:text-6xl lg:text-7xl font-display dark:text-slate-100"
            >
              A premium CGPA studio for
              <span className="gradient-text"> focused progress.</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 leading-relaxed max-w-2xl dark:text-slate-300"
            >
              Organize semesters, calculate instantly, and keep every milestone
              in a polished academic workspace designed for excellence.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                onClick={onScrollTo("calculator")}
                onKeyDown={onScrollKeyDown("calculator")}
                className="btn-gradient group/calc"
                aria-label="Jump to calculator"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calculator className="h-5 w-5 group-hover/calc:rotate-12 transition-transform duration-300" />
                Start Calculating
              </motion.button>
              <motion.button
                onClick={onScrollTo("saved")}
                onKeyDown={onScrollKeyDown("saved")}
                className="btn-secondary group/saved"
                aria-label="Jump to saved calculations"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="h-5 w-5 group-hover/saved:scale-110 transition-transform duration-300" />
                Review Saved Sessions
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="group relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-[2.5rem] opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            <motion.div
              className="relative rounded-[2.5rem] border-2 border-white/40 glass-strong p-8 shadow-custom-2xl dark:border-white/20"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50 animate-pulse-glow"></div>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg">
                    <Target className="h-7 w-7" />
                  </div>
                </motion.div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-bold dark:text-slate-400">
                    Live Session
                  </p>
                  <motion.p
                    className="text-2xl font-black gradient-text font-display"
                    key={stats.cgpaDisplay}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {stats.cgpaDisplay} CGPA
                  </motion.p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Credits", value: stats.creditsDisplay },
                  { label: "Courses", value: stats.coursesDisplay },
                  { label: "Grade Points", value: stats.gradePointsDisplay },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="group/stat relative"
                    custom={index}
                    variants={statCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover/stat:opacity-20 blur transition-opacity duration-300"></div>
                    <div className="relative rounded-2xl border-2 border-slate-200/80 bg-white/70 p-5 text-center transition-all duration-300 group-hover/stat:border-emerald-200 dark:border-white/10 dark:bg-slate-950/60 dark:group-hover/stat:border-emerald-400/30">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold dark:text-slate-400">
                        {stat.label}
                      </p>
                      <motion.p
                        className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100"
                        key={stat.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:from-emerald-400/10 dark:to-teal-400/10 dark:text-emerald-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Auto-save is active, so every change is protected.
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
