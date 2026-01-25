"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calculator } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveCalculationModal from "@/components/SaveCalculationModal";
import HeroSection from "@/components/home/hero-section";
import CalculatorSection from "@/components/home/calculator-section";
import InsightsSection from "@/components/home/insights-section";
import SavedSection from "@/components/home/saved-section";
import FaqSection from "@/components/home/faq-section";
import CtaSection from "@/components/home/cta-section";
import type {
  AutoSaveStatus,
  CalculationState,
  SessionStats,
} from "@/components/home/types";

const HomeSections = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentCalculation, setCurrentCalculation] =
    useState<CalculationState>({
      cgpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      courses: [],
    });
  const [loadSavedCalculation, setLoadSavedCalculation] =
    useState<CalculationState | null>(null);
  const [authTimeout, setAuthTimeout] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAutoSavedRef = useRef<string>("");
  const isAutoSavingRef = useRef(false);
  const hasLoadedAutoSaveRef = useRef(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>({
    message: "",
    type: "info",
    visible: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthTimeout(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [mounted, isLoaded, isSignedIn, router]);

  const handleScrollTo =
    (targetId: string) =>
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  const handleScrollKeyDown =
    (targetId: string) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleScrollTo(targetId)();
      }
    };

  const showAutoSaveStatus = (
    message: string,
    type: AutoSaveStatus["type"]
  ) => {
    setAutoSaveStatus({ message, type, visible: true });
    setTimeout(() => {
      setAutoSaveStatus((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const loadAutoSavedCalculation = useCallback(async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      const response = await fetch("/api/calculations");
      if (!response.ok) {
        throw new Error("Failed to fetch calculations");
      }

      const calculations = await response.json();
      const autoSavedCalculation = calculations.find(
        (calc: { calculationName: string }) =>
          calc.calculationName === "Auto-saved"
      );

      if (autoSavedCalculation) {
        const loadedCalculation = {
          cgpa: autoSavedCalculation.cgpa,
          totalCredits: autoSavedCalculation.totalCredits,
          totalGradePoints: autoSavedCalculation.totalGradePoints,
          courses: autoSavedCalculation.courses,
        };

        setLoadSavedCalculation(loadedCalculation);
        setCurrentCalculation(loadedCalculation);
        lastAutoSavedRef.current = JSON.stringify(loadedCalculation);
        showAutoSaveStatus("Auto-saved calculation restored", "success");
      }
    } catch (error) {
      console.error("Error loading auto-saved calculation:", error);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (mounted && isLoaded && isSignedIn && !hasLoadedAutoSaveRef.current) {
      loadAutoSavedCalculation();
      hasLoadedAutoSaveRef.current = true;
    }
  }, [mounted, isLoaded, isSignedIn, loadAutoSavedCalculation]);

  const autoSaveCalculation = useCallback(async () => {
    if (
      !isSignedIn ||
      isAutoSavingRef.current ||
      (currentCalculation.totalCredits === 0 &&
        currentCalculation.courses.length === 0)
    ) {
      return;
    }

    const currentState = JSON.stringify({
      cgpa: currentCalculation.cgpa,
      totalCredits: currentCalculation.totalCredits,
      totalGradePoints: currentCalculation.totalGradePoints,
      courses: currentCalculation.courses,
    });

    if (currentState === lastAutoSavedRef.current) {
      return;
    }

    isAutoSavingRef.current = true;

    try {
      const response = await fetch("/api/calculations/auto-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCredits: currentCalculation.totalCredits,
          totalGradePoints: currentCalculation.totalGradePoints,
          cgpa: currentCalculation.cgpa,
          courses: currentCalculation.courses,
        }),
      });

      if (response.ok) {
        lastAutoSavedRef.current = currentState;
        showAutoSaveStatus("Progress auto-saved", "success");
      } else {
        showAutoSaveStatus("Auto-save failed", "error");
      }
    } catch (error) {
      console.error("Error during auto-save:", error);
      showAutoSaveStatus("Auto-save failed", "error");
    } finally {
      isAutoSavingRef.current = false;
    }
  }, [currentCalculation, isSignedIn]);

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(autoSaveCalculation, 2000);
  }, [autoSaveCalculation]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        autoSaveCalculation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoSaveCalculation]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      autoSaveCalculation();
    };

    const handleUnload = () => {
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          totalCredits: currentCalculation.totalCredits,
          totalGradePoints: currentCalculation.totalGradePoints,
          cgpa: currentCalculation.cgpa,
          courses: currentCalculation.courses,
        });

        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon("/api/calculations/auto-save", blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [autoSaveCalculation, currentCalculation]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveCalculation();
    };
  }, [autoSaveCalculation]);

  const handleSaveCalculation = async (name: string) => {
    const response = await fetch("/api/calculations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calculationName: name,
        totalCredits: currentCalculation.totalCredits,
        totalGradePoints: currentCalculation.totalGradePoints,
        cgpa: currentCalculation.cgpa,
        courses: currentCalculation.courses,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save calculation");
    }
  };

  const handleLoadCalculation = (calculation: CalculationState) => {
    setLoadSavedCalculation(calculation);
  };

  useEffect(() => {
    if (loadSavedCalculation) {
      const timer = setTimeout(() => {
        setLoadSavedCalculation(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loadSavedCalculation]);

  const updateCurrentCalculation = (calculation: CalculationState) => {
    setCurrentCalculation(calculation);
    debouncedAutoSave();
  };

  const cgpaValue = Number(currentCalculation.cgpa);
  const cgpaDisplay =
    Number.isFinite(cgpaValue) && cgpaValue > 0 ? cgpaValue.toFixed(2) : "—";
  const creditsValue = Number(currentCalculation.totalCredits);
  const creditsDisplay =
    Number.isFinite(creditsValue) && creditsValue > 0
      ? creditsValue.toFixed(1)
      : "—";
  const gradePointsValue = Number(currentCalculation.totalGradePoints);
  const gradePointsDisplay =
    Number.isFinite(gradePointsValue) && gradePointsValue > 0
      ? gradePointsValue.toFixed(2)
      : "—";
  const coursesDisplay = currentCalculation.courses.length || "—";

  const sessionStats: SessionStats = {
    cgpaDisplay,
    creditsDisplay,
    gradePointsDisplay,
    coursesDisplay,
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f7f3ec] flex items-center justify-center dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-400 mx-auto mb-4 dark:border-white/20 dark:border-t-emerald-300"></div>
          <div className="text-slate-500 text-lg dark:text-slate-400">
            Warming up your workspace...
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f7f3ec] flex items-center justify-center px-4 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-400 mx-auto mb-4 dark:border-white/20 dark:border-t-emerald-300"></div>
          <div className="text-slate-500 text-lg dark:text-slate-400">
            Warming up your workspace...
          </div>
          {authTimeout && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This is taking longer than expected.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.location.reload()}
                  onKeyDown={handleScrollKeyDown("hero")}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  aria-label="Reload the page"
                >
                  Reload
                </button>
                <button
                  onClick={() => router.push("/sign-in")}
                  onKeyDown={handleScrollKeyDown("hero")}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30"
                  aria-label="Go to sign in"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f7f3ec] flex items-center justify-center dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-pulse">
            <Calculator className="w-12 h-12 text-emerald-500 mx-auto mb-4 dark:text-emerald-300" />
          </div>
          <div className="text-slate-500 text-lg dark:text-slate-400">
            Redirecting to sign in...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f3ec] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[140px] dark:bg-emerald-500/15"></div>
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-amber-200/35 blur-[120px] dark:bg-amber-500/10"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-200/30 blur-[140px] dark:bg-sky-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.06),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.12),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_45%)]"></div>
      </div>

      <Navbar
        onScrollTo={handleScrollTo}
        onScrollKeyDown={handleScrollKeyDown}
      />

      <div className="relative pt-20">
        <HeroSection
          stats={sessionStats}
          onScrollTo={handleScrollTo}
          onScrollKeyDown={handleScrollKeyDown}
        />
        <CalculatorSection
          stats={sessionStats}
          autoSaveStatus={autoSaveStatus}
          loadSavedCalculation={loadSavedCalculation}
          onCalculationUpdate={updateCurrentCalculation}
          onOpenSaveModal={() => setShowSaveModal(true)}
          onScrollKeyDown={handleScrollKeyDown}
        />
        <InsightsSection stats={sessionStats} />
        <SavedSection
          onOpenSaveModal={() => setShowSaveModal(true)}
          onLoadCalculation={handleLoadCalculation}
          onScrollKeyDown={handleScrollKeyDown}
        />
        <FaqSection />
        <CtaSection
          onOpenSaveModal={() => setShowSaveModal(true)}
          onScrollTo={handleScrollTo}
          onScrollKeyDown={handleScrollKeyDown}
        />

        <SaveCalculationModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveCalculation}
          cgpa={currentCalculation.cgpa}
          totalCredits={currentCalculation.totalCredits}
          courses={currentCalculation.courses}
        />

        <Footer />
      </div>
    </div>
  );
};

export default HomeSections;
