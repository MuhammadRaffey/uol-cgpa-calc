"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";
import type { ScrollHandler, ScrollKeyHandler } from "./home/types";

const navItems = [
  { id: "calculator", label: "Calculator" },
  { id: "insights", label: "Insights" },
  { id: "saved", label: "Saved" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CTA" },
];

type NavbarProps = {
  onScrollTo: ScrollHandler;
  onScrollKeyDown: ScrollKeyHandler;
};

const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function Navbar({ onScrollTo, onScrollKeyDown }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    return (event?: React.MouseEvent<HTMLButtonElement>) => {
      onScrollTo(id)(event);
      setIsMobileMenuOpen(false);
    };
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b-2 border-slate-200/80 glass-strong backdrop-blur-xl dark:border-white/10"
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/Logobg.png"
                  alt="UOL GPA Calculator Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <div>
                <h1 className="text-sm font-black gradient-text font-display sm:text-lg leading-tight">
                  UOL GPA Calculator
                </h1>
                <p className="hidden text-xs text-slate-500 font-semibold dark:text-slate-400 sm:block">
                  SGPA & CGPA Made Easy
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={onScrollTo(item.id)}
                  onKeyDown={onScrollKeyDown(item.id)}
                  className="group relative overflow-hidden rounded-full border-2 border-transparent px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                  aria-label={`Jump to ${item.label}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Right side - Theme Toggle, User Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 rounded-full border-2 border-emerald-400 shadow-lg",
                  },
                }}
              />
              
              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border-2 border-slate-200/80 bg-white/80 text-slate-700 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/10"
                aria-label="Toggle mobile menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-slate-950/80"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Sidebar */}
            <motion.div
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] glass-strong border-l-2 border-slate-200/80 shadow-custom-2xl dark:border-white/10"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Image
                      src="/Logobg.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-black gradient-text font-display">
                      Menu
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">
                      Navigate
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl border-2 border-slate-200/80 bg-white/80 text-slate-700 transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-rose-400/30 dark:hover:bg-rose-400/10"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="p-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={handleNavClick(item.id)}
                    onKeyDown={onScrollKeyDown(item.id)}
                    className="group relative w-full overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white/80 px-6 py-4 text-left transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/10"
                    aria-label={`Jump to ${item.label}`}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ x: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-between">
                      <span className="text-base font-bold text-slate-700 uppercase tracking-wider group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-300">
                        {item.label}
                      </span>
                      <motion.div
                        className="h-2 w-2 rounded-full bg-emerald-500"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Sidebar Footer */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-slate-200/80 dark:border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-400/30 dark:from-emerald-400/10 dark:to-teal-400/10 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-emerald-500"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Quick navigation at your fingertips
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
