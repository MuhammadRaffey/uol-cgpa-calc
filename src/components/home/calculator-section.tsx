"use client";

import { Save, Sparkles, TrendingUp } from "lucide-react";
import CgpaCalculatorComponent from "@/components/Main";
import type {
  AutoSaveStatus,
  CalculationState,
  ScrollKeyHandler,
  SessionStats,
} from "./types";

type CalculatorSectionProps = {
  stats: SessionStats;
  autoSaveStatus: AutoSaveStatus;
  loadSavedCalculation: CalculationState | null;
  onCalculationUpdate: (calculation: CalculationState) => void;
  onOpenSaveModal: () => void;
  onScrollKeyDown: ScrollKeyHandler;
};

const autoSaveBadgeStyles = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200",
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200",
  info:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200",
} as const;

export default function CalculatorSection({
  stats,
  autoSaveStatus,
  loadSavedCalculation,
  onCalculationUpdate,
  onOpenSaveModal,
  onScrollKeyDown,
}: CalculatorSectionProps) {
  const statusClasses = autoSaveBadgeStyles[autoSaveStatus.type];

  return (
    <section
      id="calculator"
      className="relative min-h-screen py-20"
      aria-labelledby="calculator-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Calculator
            </p>
            <h2
              id="calculator-title"
              className="text-3xl font-semibold text-slate-900 sm:text-4xl font-display dark:text-slate-100"
            >
              Build your semester in minutes.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Add courses, adjust credits, and see your CGPA update instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
              <Save className="h-4 w-4" />
              Auto-save active
            </div>
            {autoSaveStatus.visible && (
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm ${statusClasses}`}
              >
                <Save className="h-4 w-4" />
                {autoSaveStatus.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-1 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
            <CgpaCalculatorComponent
              onCalculationUpdate={onCalculationUpdate}
              loadSavedCalculation={loadSavedCalculation}
            />
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Session summary
                </h3>
              </div>
              <div className="mt-4 grid gap-4">
                {[
                  { label: "Current CGPA", value: stats.cgpaDisplay },
                  { label: "Total Credits", value: stats.creditsDisplay },
                  { label: "Grade Points", value: stats.gradePointsDisplay },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {stat.label}
                    </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={onOpenSaveModal}
                onKeyDown={onScrollKeyDown("calculator")}
                className="mt-6 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                aria-label="Save calculation"
              >
                Save this session
              </button>
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 text-slate-600 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Study tip
              </p>
              <p className="mt-3 text-lg text-slate-900 dark:text-slate-100">
                Add previous semesters to get a true cumulative CGPA.
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your inputs are stored locally and backed up automatically.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                <Sparkles className="h-4 w-4" />
                Keeps your progress safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
