"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Footer from "@/components/Footer";
import CgpaCalculatorComponent from "@/components/Main";
import SaveCalculationModal from "@/components/SaveCalculationModal";
import SavedCalculations from "@/components/SavedCalculations";
import { Save, BookOpen, Calculator, Sparkles } from "lucide-react";
import type { Course } from "@/components/SavedCalculations";

const CgpaCalculator: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedCalculations, setShowSavedCalculations] = useState(false);
  const [currentCalculation, setCurrentCalculation] = useState({
    cgpa: 0,
    totalCredits: 0,
    totalGradePoints: 0,
    courses: [] as Course[],
  });
  const [loadSavedCalculation, setLoadSavedCalculation] = useState<{
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  } | null>(null);

  // Auto-save refs and state
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAutoSavedRef = useRef<string>("");
  const isAutoSavingRef = useRef(false);
  const hasLoadedAutoSaveRef = useRef(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [mounted, isLoaded, isSignedIn, router]);

  // Load auto-saved calculation on mount
  useEffect(() => {
    if (mounted && isLoaded && isSignedIn && !hasLoadedAutoSaveRef.current) {
      loadAutoSavedCalculation();
      hasLoadedAutoSaveRef.current = true;
    }
  }, [mounted, isLoaded, isSignedIn]);

  const loadAutoSavedCalculation = async () => {
    try {
      const response = await fetch("/api/calculations");
      if (!response.ok) {
        throw new Error("Failed to fetch calculations");
      }

      const calculations = await response.json();
      const autoSavedCalculation = calculations.find(
        (calc: any) => calc.calculationName === "Auto-saved"
      );

      if (autoSavedCalculation) {
        // Load the auto-saved calculation
        setLoadSavedCalculation({
          cgpa: autoSavedCalculation.cgpa,
          totalCredits: autoSavedCalculation.totalCredits,
          totalGradePoints: autoSavedCalculation.totalGradePoints,
          courses: autoSavedCalculation.courses,
        });

        // Update current calculation to match auto-saved
        setCurrentCalculation({
          cgpa: autoSavedCalculation.cgpa,
          totalCredits: autoSavedCalculation.totalCredits,
          totalGradePoints: autoSavedCalculation.totalGradePoints,
          courses: autoSavedCalculation.courses,
        });

        // Update the last auto-saved reference to prevent immediate re-save
        lastAutoSavedRef.current = JSON.stringify({
          cgpa: autoSavedCalculation.cgpa,
          totalCredits: autoSavedCalculation.totalCredits,
          totalGradePoints: autoSavedCalculation.totalGradePoints,
          courses: autoSavedCalculation.courses,
        });

        console.log("Auto-saved calculation loaded");
        showAutoSaveStatus("Auto-saved calculation restored", "success");
      }
    } catch (error) {
      console.error("Error loading auto-saved calculation:", error);
    }
  };

  const showAutoSaveStatus = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setAutoSaveStatus({ message, type, visible: true });
    setTimeout(() => {
      setAutoSaveStatus((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Auto-save function
  const autoSaveCalculation = useCallback(async () => {
    // Don't auto-save if already saving or if no meaningful data
    if (
      isAutoSavingRef.current ||
      (currentCalculation.totalCredits === 0 &&
        currentCalculation.courses.length === 0)
    ) {
      return;
    }

    // Create a hash of current calculation to avoid unnecessary saves
    const currentState = JSON.stringify({
      cgpa: currentCalculation.cgpa,
      totalCredits: currentCalculation.totalCredits,
      totalGradePoints: currentCalculation.totalGradePoints,
      courses: currentCalculation.courses,
    });

    // Only save if state has changed since last auto-save
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
        console.log("Auto-save successful");
        showAutoSaveStatus("Progress auto-saved", "success");
      } else {
        console.error("Auto-save failed:", response.statusText);
        showAutoSaveStatus("Auto-save failed", "error");
      }
    } catch (error) {
      console.error("Error during auto-save:", error);
      showAutoSaveStatus("Auto-save failed", "error");
    } finally {
      isAutoSavingRef.current = false;
    }
  }, [currentCalculation]);

  // Debounced auto-save
  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(autoSaveCalculation, 2000); // 2 second delay
  }, [autoSaveCalculation]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, save immediately
        autoSaveCalculation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoSaveCalculation]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save immediately when user is leaving
      autoSaveCalculation();
    };

    const handleUnload = () => {
      // Use sendBeacon for more reliable unload saving
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          totalCredits: currentCalculation.totalCredits,
          totalGradePoints: currentCalculation.totalGradePoints,
          cgpa: currentCalculation.cgpa,
          courses: currentCalculation.courses,
        });

        // Create a Blob with proper content type
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      // Final auto-save on component unmount
      autoSaveCalculation();
    };
  }, [autoSaveCalculation]);

  const handleSaveCalculation = async (name: string) => {
    try {
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

      // Refresh saved calculations if the panel is open
      if (showSavedCalculations) {
        // You could add a refresh function here if needed
      }
    } catch (error) {
      console.error("Error saving calculation:", error);
      throw error;
    }
  };

  const handleLoadCalculation = (calculation: {
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => {
    setLoadSavedCalculation(calculation);
    setShowSavedCalculations(false);
  };

  // Clear loadSavedCalculation after it's been processed
  useEffect(() => {
    if (loadSavedCalculation) {
      // Clear the loadSavedCalculation after a short delay to allow the Main component to process it
      const timer = setTimeout(() => {
        setLoadSavedCalculation(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loadSavedCalculation]);

  const updateCurrentCalculation = (calculation: {
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => {
    setCurrentCalculation(calculation);
    // Trigger debounced auto-save when calculation updates
    debouncedAutoSave();
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-300 text-lg">
            Loading your calculator...
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Calculator className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          </div>
          <div className="text-gray-300 text-lg">Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              UOL CGPA Calculator
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Calculate your CGPA with precision and save your academic progress
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => setShowSaveModal(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <Save className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Save Calculation</span>
          </button>
          <button
            onClick={() => setShowSavedCalculations(!showSavedCalculations)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-gray-600 hover:border-gray-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <BookOpen className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {showSavedCalculations ? "Hide Saved" : "View Saved"}
            </span>
          </button>
        </div>

        {/* Auto-save Status Indicator */}
        {autoSaveStatus.visible && (
          <div className="flex justify-center mb-6">
            <div
              className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
                autoSaveStatus.type === "success"
                  ? "bg-green-600/20 border border-green-500/30 text-green-300"
                  : autoSaveStatus.type === "error"
                  ? "bg-red-600/20 border border-red-500/30 text-red-300"
                  : "bg-blue-600/20 border border-blue-500/30 text-blue-300"
              }`}
            >
              <Save
                className={`w-4 h-4 ${
                  autoSaveStatus.type === "success"
                    ? "text-green-400"
                    : autoSaveStatus.type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              />
              <span className="text-sm font-medium">
                {autoSaveStatus.message}
              </span>
            </div>
          </div>
        )}

        {/* Auto-save Info */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
            <Save className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              Auto-save enabled
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your progress is automatically saved every 2 seconds and when you
            leave the page
          </p>
        </div>

        {/* Calculator and Saved Panel */}
        <div
          className={`grid gap-8 ${
            showSavedCalculations ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {/* Calculator */}
          <div className={showSavedCalculations ? "lg:col-span-2" : "w-full"}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
              <div className="relative">
                <CgpaCalculatorComponent
                  onCalculationUpdate={updateCurrentCalculation}
                  loadSavedCalculation={loadSavedCalculation}
                />
              </div>
            </div>
          </div>

          {/* Saved Calculations Panel */}
          {showSavedCalculations && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <SavedCalculations onLoadCalculation={handleLoadCalculation} />
              </div>
            </div>
          )}
        </div>

        {/* Save Modal */}
        <SaveCalculationModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveCalculation}
          cgpa={currentCalculation.cgpa}
          totalCredits={currentCalculation.totalCredits}
          courses={currentCalculation.courses}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CgpaCalculator;
