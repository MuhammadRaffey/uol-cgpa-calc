"use client";

import { ArrowRight } from "lucide-react";
import type { ScrollHandler, ScrollKeyHandler } from "./types";

type CtaSectionProps = {
  onOpenSaveModal: () => void;
  onScrollTo: ScrollHandler;
  onScrollKeyDown: ScrollKeyHandler;
};

export default function CtaSection({
  onOpenSaveModal,
  onScrollTo,
  onScrollKeyDown,
}: CtaSectionProps) {
  return (
    <section
      id="cta"
      className="relative min-h-[70vh] py-20"
      aria-labelledby="cta-title"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-[36px] border border-slate-200/80 bg-slate-900 px-6 py-14 text-center text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] sm:px-10 animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none dark:border-white/10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300 dark:text-slate-300">
          Ready to lock it in?
        </p>
        <h2
          id="cta-title"
          className="text-3xl font-semibold text-white sm:text-4xl font-display"
        >
          Save today, stress less tomorrow.
        </h2>
        <p className="max-w-2xl text-slate-200">
          Keep every semester organized, backed up, and ready whenever you need
          it.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onOpenSaveModal}
            onKeyDown={onScrollKeyDown("cta")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            aria-label="Save calculation"
          >
            Save this session
          </button>
          <button
            onClick={onScrollTo("calculator")}
            onKeyDown={onScrollKeyDown("calculator")}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-label="Return to calculator"
          >
            Back to calculator
            <ArrowRight className="ml-2 inline-block h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
