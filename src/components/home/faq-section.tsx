"use client";

const faqItems = [
  {
    title: "Does it auto-save?",
    body: "Yes. Every change is saved in real time and on exit.",
  },
  {
    title: "Can I load past semesters?",
    body: "Saved sessions can be restored or used as previous data.",
  },
  {
    title: "Will my data stay private?",
    body: "All sessions are tied to your account and protected.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative min-h-screen py-20"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              FAQ
            </p>
            <h2
              id="faq-title"
              className="text-3xl font-semibold text-slate-900 sm:text-4xl font-display dark:text-slate-100"
            >
              Answers before you ask.
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {faqItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
