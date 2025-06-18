"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [mounted, isLoaded, isSignedIn, router]);

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
