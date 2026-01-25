"use client";

import { motion } from "framer-motion";

const faqItems = [
  {
    title: "Does it auto-save?",
    body: "Yes. Every change is saved in real time and on exit.",
  },
  {
    title: "Can I load past semesters?",
    body: "Saved sessions can be restored or used as previous data.",
  },
  {
    title: "Will my data stay private?",
    body: "All sessions are tied to your account and protected.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
    },
  }),
};

export default function FaqSection() {
  return (
    <motion.section
      id="faq"
      className="relative min-h-screen py-20"
      aria-labelledby="faq-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              FAQ
            </p>
            <h2
              id="faq-title"
              className="text-3xl font-semibold text-slate-900 sm:text-4xl font-display dark:text-slate-100"
            >
              Answers before you ask.
            </h2>
          </motion.div>
        </motion.div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
