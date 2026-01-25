"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Shield, TrendingUp } from "lucide-react";
import type { SessionStats } from "./types";

const insightCards = [
  {
    title: "Momentum",
    description: "Target the next milestone with confidence.",
    icon: TrendingUp,
    getValue: (stats: SessionStats) => stats.cgpaDisplay,
  },
  {
    title: "Coverage",
    description: "Credits tracked for every term.",
    icon: CheckCircle2,
    getValue: (stats: SessionStats) => stats.creditsDisplay,
  },
  {
    title: "Protection",
    description: "Auto-save keeps every change safe.",
    icon: Shield,
    getValue: () => "Auto-save",
  },
  {
    title: "Speed",
    description: "Instant recalculation on every edit.",
    icon: Clock,
    getValue: () => "Real-time",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
    },
  }),
};

type InsightsSectionProps = {
  stats: SessionStats;
};

export default function InsightsSection({ stats }: InsightsSectionProps) {
  return (
    <motion.section
      id="insights"
      className="relative py-12 lg:py-16"
      aria-labelledby="insights-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div className="space-y-5" variants={containerVariants}>
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm dark:border-blue-400/30 dark:from-blue-400/10 dark:to-cyan-400/10 dark:text-blue-200"
            >
              <TrendingUp className="h-4 w-4" />
              Insights
            </motion.div>
            <motion.h2
              variants={itemVariants}
              id="insights-title"
              className="text-4xl font-bold text-slate-900 sm:text-5xl font-display dark:text-slate-100"
            >
              Know exactly
              <span className="gradient-text"> where you stand.</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-slate-600 leading-relaxed dark:text-slate-300"
            >
              Your CGPA summary updates in real time, so you can adjust strategy
              before grades are locked in. Stay ahead with instant insights.
            </motion.p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2">
            {insightCards.map((item, index) => (
              <motion.div
                key={item.title}
                className="group relative"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-25 blur transition-opacity duration-500"></div>
                <div className="relative rounded-3xl border-2 border-slate-200/80 glass p-7 shadow-custom-md dark:border-white/10">
                  <motion.div
                    className="inline-flex p-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 font-display dark:text-slate-100">
                    {item.title}
                  </h3>
                  <motion.p
                    className="mt-3 text-3xl font-black gradient-text"
                    key={item.getValue(stats)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.getValue(stats)}
                  </motion.p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
