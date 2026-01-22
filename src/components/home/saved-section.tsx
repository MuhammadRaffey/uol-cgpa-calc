"use client";

import SavedCalculations from "@/components/SavedCalculations";
import type { CalculationState, ScrollKeyHandler } from "./types";

type SavedSectionProps = {
  onOpenSaveModal: () => void;
  onLoadCalculation: (calculation: CalculationState) => void;
  onScrollKeyDown: ScrollKeyHandler;
};

export default function SavedSection({
  onOpenSaveModal,
  onLoadCalculation,
  onScrollKeyDown,
}: SavedSectionProps) {
  return (
    <section
      id="saved"
      className="relative min-h-screen py-20"
      aria-labelledby="saved-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Saved
            </p>
            <h2
              id="saved-title"
              className="text-3xl font-semibold text-slate-900 sm:text-4xl font-display dark:text-slate-100"
            >
              Every semester, archived.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Restore previous calculations, compare semesters, and keep a clean
              academic record.
            </p>
          </div>
          <button
            onClick={onOpenSaveModal}
            onKeyDown={onScrollKeyDown("saved")}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            aria-label="Save current calculation"
          >
            Save current session
          </button>
        </div>
        <div className="mt-10">
          <SavedCalculations onLoadCalculation={onLoadCalculation} />
        </div>
      </div>
    </section>
  );
}
