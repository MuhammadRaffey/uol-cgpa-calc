"use client";

import { Save, Shield, Sparkles, TrendingUp } from "lucide-react";
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
      className="relative py-12 lg:py-16"
      aria-labelledby="calculator-title"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between animate-slide-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:from-emerald-400/10 dark:to-teal-400/10 dark:text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Calculator
            </div>
            <h2
              id="calculator-title"
              className="text-4xl font-bold text-slate-900 sm:text-5xl font-display dark:text-slate-100">
              Build your semester in
              <span className="gradient-text"> minutes.</span>
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl dark:text-slate-300">
              Add courses, adjust credits, and see your CGPA update instantly with our intelligent calculator.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm animate-pulse-glow dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
              <Save className="h-4 w-4" />
              Auto-save active
            </div>
            {autoSaveStatus.visible && (
              <div
                className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-xs font-bold shadow-md animate-slide-up ${statusClasses}`}
              >
                <Save className="h-4 w-4" />
                {autoSaveStatus.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
            <div className="relative">
              <CgpaCalculatorComponent
                onCalculationUpdate={onCalculationUpdate}
                loadSavedCalculation={loadSavedCalculation}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="group relative card-hover">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
              <div className="relative rounded-[2rem] border-2 border-slate-200/80 glass p-8 shadow-custom-lg dark:border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-display dark:text-slate-100">
                    Session Summary
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Current CGPA", value: stats.cgpaDisplay },
                    { label: "Total Credits", value: stats.creditsDisplay },
                    { label: "Grade Points", value: stats.gradePointsDisplay },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-2xl border-2 border-slate-200/70 bg-white/70 px-5 py-4 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-emerald-400/30 dark:hover:bg-emerald-400/5"
                    >
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-slate-300">
                        {stat.label}
                      </span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onOpenSaveModal}
                  onKeyDown={onScrollKeyDown("calculator")}
                  className="mt-8 w-full btn-gradient group/save"
                  aria-label="Save calculation"
                >
                  <Save className="h-4 w-4 group-hover/save:scale-110 transition-transform" />
                  Save this session
                </button>
              </div>
            </div>

            <div className="group relative card-hover">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
              <div className="relative rounded-[2rem] border-2 border-slate-200/80 glass p-8 shadow-custom-lg dark:border-white/10">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:from-amber-400/15 dark:to-orange-400/15 dark:text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  Study Tip
                </div>
                <p className="mt-5 text-xl font-bold text-slate-900 font-display dark:text-slate-100">
                  Add previous semesters to get a true cumulative CGPA.
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                  Your inputs are stored locally and backed up automatically. Every change is protected.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <Shield className="h-4 w-4" />
                  <span>Keeps your progress safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
