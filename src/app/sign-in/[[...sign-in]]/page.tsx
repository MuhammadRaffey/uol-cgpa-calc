import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f3ec] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[140px] dark:bg-emerald-500/15"></div>
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-amber-200/35 blur-[120px] dark:bg-amber-500/10"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-200/30 blur-[140px] dark:bg-sky-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.06),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.12),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_45%)]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl",
                headerTitle: "text-slate-900 dark:text-slate-100 font-bold text-2xl",
                headerSubtitle: "text-slate-500 dark:text-slate-400 text-sm",
                formFieldLabel: "text-slate-700 dark:text-slate-300 text-sm font-medium",
                formFieldInput: 
                  "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500/20",
                formButtonPrimary: 
                  "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
                footerActionLink: "text-emerald-600 hover:text-emerald-500 hover:underline",
                dividerLine: "bg-slate-200 dark:bg-slate-700",
                dividerText: "text-slate-500 dark:text-slate-400",
                socialButtonsBlockButton: 
                  "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
                formFieldInputShowPasswordButton: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                footer: "bg-transparent",
              },
            }}
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}
