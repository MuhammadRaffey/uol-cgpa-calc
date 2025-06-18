"use client";

import { useState, useEffect } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function AuthHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="border-b border-gray-700 bg-gray-800 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-100">
            UOL CGPA Calculator
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-9 w-16 bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-9 w-16 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-700 bg-gray-800 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-100">
          UOL CGPA Calculator
        </h1>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="redirect">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "text-gray-200",
                  userButtonTrigger:
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
