"use client";

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

type InsightsSectionProps = {
  stats: SessionStats;
};

export default function InsightsSection({ stats }: InsightsSectionProps) {
  return (
    <section
      id="insights"
      className="relative min-h-screen py-20"
      aria-labelledby="insights-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Insights
            </p>
            <h2
              id="insights-title"
              className="text-3xl font-semibold text-slate-900 sm:text-4xl font-display dark:text-slate-100"
            >
              Know exactly where you stand.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Your CGPA summary updates in real time, so you can adjust strategy
              before grades are locked in.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {insightCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70"
              >
                <item.icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {item.getValue(stats)}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
