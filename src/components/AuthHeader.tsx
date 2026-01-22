"use client";

import { useState, useEffect } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-amber-300 shadow-sm"></div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              UOL
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              CGPA Studio
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
          <div className="h-9 w-20 rounded-full bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
          <div className="h-9 w-20 rounded-full bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
        </div>
      </div>
    </header>
  );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-amber-300 shadow-sm">
            <span className="text-sm font-semibold text-slate-900">UOL</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              CGPA
            </p>
            <h1 className="text-xl font-semibold text-slate-900 font-display dark:text-slate-100">
              Progress Studio
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/40 focus:ring-offset-2 focus:ring-offset-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-white/40 dark:focus:ring-offset-slate-950"
                aria-label="Sign in"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 focus:ring-offset-white dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10 dark:focus:ring-white/30 dark:focus:ring-offset-slate-950"
                aria-label="Create account"
              >
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "text-slate-700 dark:text-slate-200",
                  userButtonTrigger:
                    "focus:ring-2 focus:ring-slate-400/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-white/30 dark:focus:ring-offset-slate-950",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
