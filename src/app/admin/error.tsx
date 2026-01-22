"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-16 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-slate-200/80 bg-white/80 p-10 text-center shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Admin Error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          aria-label="Retry loading admin page"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
