"use client";

import { useState, useEffect } from "react";
import {
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image";

export default function AuthHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-200/70 animate-pulse dark:bg-white/10 shadow-lg"></div>
          <div>
            <div className="h-5 w-40 rounded bg-slate-200/70 animate-pulse dark:bg-white/10 mb-1"></div>
            <div className="hidden h-3 w-32 rounded bg-slate-200/70 animate-pulse dark:bg-white/10 sm:block"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
          <div className="h-9 w-20 rounded-lg bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
          <div className="h-9 w-20 rounded-lg bg-slate-200/70 animate-pulse dark:bg-white/10"></div>
        </div>
      </div>
    </header>
  );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/Logobg.png"
              alt="UOL GPA Calculator Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm font-black gradient-text font-display sm:text-lg leading-tight">
              UOL GPA Calculator
            </h1>
            <p className="hidden text-xs text-slate-500 font-semibold dark:text-slate-400 sm:block">
              SGPA & CGPA Made Easy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 rounded-full border-2 border-emerald-400 shadow-lg",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
