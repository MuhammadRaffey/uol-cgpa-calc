"use client";

import { BookOpen, Calculator, Sparkles, Target } from "lucide-react";
import type { ScrollHandler, ScrollKeyHandler, SessionStats } from "./types";

const navItems = [
  { id: "calculator", label: "Calculator" },
  { id: "insights", label: "Insights" },
  { id: "saved", label: "Saved" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "CTA" },
];

type HeroSectionProps = {
  stats: SessionStats;
  onScrollTo: ScrollHandler;
  onScrollKeyDown: ScrollKeyHandler;
};

export default function HeroSection({
  stats,
  onScrollTo,
  onScrollKeyDown,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen py-16 lg:py-24 flex flex-col justify-center"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <nav
          className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/70 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-[0_16px_40px_-35px_rgba(15,23,42,0.45)] backdrop-blur animate-in fade-in slide-in-from-top-4 duration-700 motion-reduce:animate-none dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400"
          aria-label="Section navigation"
        >
          <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            Focused workspace
          </span>
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={onScrollTo(item.id)}
                onKeyDown={onScrollKeyDown(item.id)}
                className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/10"
                aria-label={`Jump to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-[0.32em] text-emerald-700 animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Calm by design
            </div>
            <h1
              id="hero-title"
              className="text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl font-display animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 motion-reduce:animate-none dark:text-slate-100"
            >
              A premium CGPA studio for focused progress.
            </h1>
            <p className="mt-4 text-lg text-slate-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 motion-reduce:animate-none dark:text-slate-300">
              Organize semesters, calculate instantly, and keep every milestone
              in a polished academic workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 motion-reduce:animate-none">
              <button
                onClick={onScrollTo("calculator")}
                onKeyDown={onScrollKeyDown("calculator")}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                aria-label="Jump to calculator"
              >
                <Calculator className="h-4 w-4" />
                Start calculating
              </button>
              <button
                onClick={onScrollTo("saved")}
                onKeyDown={onScrollKeyDown("saved")}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10"
                aria-label="Jump to saved calculations"
              >
                <BookOpen className="h-4 w-4" />
                Review saved sessions
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 motion-reduce:animate-none dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Live session
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {stats.cgpaDisplay} CGPA
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Credits", value: stats.creditsDisplay },
                { label: "Courses", value: stats.coursesDisplay },
                { label: "Grade Points", value: stats.gradePointsDisplay },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center dark:border-white/10 dark:bg-slate-950/60"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
              Auto-save is active, so every change is protected.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
