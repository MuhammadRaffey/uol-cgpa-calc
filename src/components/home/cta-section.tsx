"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ScrollHandler, ScrollKeyHandler } from "./types";

type CtaSectionProps = {
  onOpenSaveModal: () => void;
  onScrollTo: ScrollHandler;
  onScrollKeyDown: ScrollKeyHandler;
};

const containerVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
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

export default function CtaSection({
  onOpenSaveModal,
  onScrollTo,
  onScrollKeyDown,
}: CtaSectionProps) {
  return (
    <section
      id="cta"
      className="relative min-h-[70vh] py-20"
      aria-labelledby="cta-title"
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-[36px] border border-slate-200/80 bg-slate-900 px-6 py-14 text-center text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] sm:px-10 dark:border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <motion.p
          variants={itemVariants}
          className="text-xs uppercase tracking-[0.3em] text-slate-300 dark:text-slate-300"
        >
          Ready to lock it in?
        </motion.p>
        <motion.h2
          variants={itemVariants}
          id="cta-title"
          className="text-3xl font-semibold text-white sm:text-4xl font-display"
        >
          Save today, stress less tomorrow.
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-slate-200"
        >
          Keep every semester organized, backed up, and ready whenever you need
          it.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            onClick={onOpenSaveModal}
            onKeyDown={onScrollKeyDown("cta")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            aria-label="Save calculation"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Save this session
          </motion.button>
          <motion.button
            onClick={onScrollTo("calculator")}
            onKeyDown={onScrollKeyDown("calculator")}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-label="Return to calculator"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to calculator
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="inline-block h-4 w-4" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
