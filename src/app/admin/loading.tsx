export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="h-28 rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] animate-pulse dark:border-white/10 dark:bg-slate-900/70" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 rounded-[28px] border border-slate-200/80 bg-white/80 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] animate-pulse dark:border-white/10 dark:bg-slate-900/70"
            />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="h-[520px] rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] animate-pulse dark:border-white/10 dark:bg-slate-900/70" />
          <div className="h-[520px] rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] animate-pulse dark:border-white/10 dark:bg-slate-900/70" />
        </div>
      </div>
    </div>
  );
}
