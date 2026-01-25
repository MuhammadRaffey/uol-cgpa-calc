"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaHeart,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const socialLinkVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
    },
  }),
};

const Footer = () => {
  return (
    <motion.footer
      className="relative mt-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100/80 dark:via-slate-950/50 dark:to-slate-900/80"></div>
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-10 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-6 right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 blur-3xl"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-36 w-36 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 text-center">
        {/* Logo and branding */}
        <motion.div
          className="group relative"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-4">
            <motion.div
              className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/Logobg.png"
                alt="UOL GPA Calculator Logo"
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="text-left">
              <h3 className="text-3xl font-black gradient-text font-display">
                UOL GPA Calculator
              </h3>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                SGPA & CGPA Made Easy
              </p>
            </div>
          </div>
        </motion.div>

        {/* Creator badge */}
        <motion.div
          className="group relative"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
          <div className="relative inline-flex flex-wrap items-center justify-center gap-2 rounded-full border-2 border-slate-200/80 glass px-8 py-4 text-base font-semibold text-slate-600 shadow-custom-md dark:border-white/10 dark:text-slate-300">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FaHeart className="text-rose-500" />
            </motion.span>
            <span>by</span>
            <strong className="gradient-text-warm font-display">
              Muhammad Raffey
            </strong>
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </div>
        </motion.div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4">
          {[
            {
              href: "https://linkedin.com/in/muhammadraffey",
              label: "LinkedIn Profile",
              gradient: "from-blue-400 to-cyan-400",
              icon: FaLinkedin,
              hoverColor: "text-blue-600 dark:text-blue-400",
            },
            {
              href: "https://github.com/MuhammadRaffey",
              label: "GitHub Profile",
              gradient: "from-slate-400 to-slate-600",
              icon: FaGithub,
              hoverColor: "text-slate-900 dark:text-white",
            },
            {
              href: "https://raffey-portfolio.vercel.app/",
              label: "Portfolio Website",
              gradient: "from-emerald-400 to-teal-400",
              icon: FaGlobe,
              hoverColor: "text-emerald-600 dark:text-emerald-400",
            },
          ].map((social, index) => (
            <motion.div
              key={social.label}
              custom={index}
              variants={socialLinkVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label={social.label}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${social.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300`}></div>
                <div className="relative rounded-2xl border-2 border-slate-200/80 glass p-4 shadow-custom-sm transition-all duration-300 hover:shadow-custom-lg dark:border-white/10">
                  <social.icon
                    size={24}
                    className={`text-slate-600 transition-colors dark:text-slate-300 group-hover:${social.hoverColor}`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          className="w-full border-t-2 border-slate-200/80 pt-8 text-sm font-medium text-slate-500 dark:border-white/10 dark:text-slate-400"
          variants={itemVariants}
        >
          <p>© {new Date().getFullYear()} UOL CGPA Studio. All rights reserved.</p>
          <p className="mt-2 text-xs">Built with Next.js, TypeScript, and Tailwind CSS</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
