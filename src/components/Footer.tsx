import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaHeart,
  FaGraduationCap,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3ec] via-white to-[#f4efe6] dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"></div>
      <div className="absolute inset-0 opacity-70">
        <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-emerald-200/50 blur-2xl dark:bg-emerald-500/10"></div>
        <div className="absolute bottom-6 right-10 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-500/10"></div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-amber-300 p-3 shadow-sm">
            <FaGraduationCap className="text-2xl text-slate-900" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 font-display dark:text-slate-100">
              UOL CGPA Studio
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Precision in academic progress
            </p>
          </div>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-6 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          <span>Made with</span>
          <FaHeart className="text-rose-500" />
          <span>by</span>
          <strong className="text-slate-900 dark:text-slate-100">
            Muhammad Raffey
          </strong>
          <span className="text-amber-600 dark:text-amber-300">✨</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://linkedin.com/in/muhammadraffey"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={20} />
          </Link>
          <Link
            href="https://github.com/MuhammadRaffey"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            aria-label="GitHub Profile"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            href="https://raffey-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
            aria-label="Portfolio Website"
          >
            <FaGlobe size={20} />
          </Link>
        </div>

        <div className="w-full border-t border-slate-200/80 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          © {new Date().getFullYear()} UOL CGPA Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
