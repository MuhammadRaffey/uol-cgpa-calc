"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export default function AdminNavbar() {
  return (
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
            <Link href="/" className="flex items-center gap-3">
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
                  Admin Console
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/"
                className="group flex items-center gap-2 rounded-full border-2 border-transparent px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Theme Toggle & User Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 rounded-full border-2 border-emerald-400 shadow-lg",
                },
              }}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
