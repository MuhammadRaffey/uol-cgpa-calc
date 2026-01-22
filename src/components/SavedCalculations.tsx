"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Calculator,
  Trash2,
  Download,
  Clock,
  TrendingUp,
  Edit,
  RotateCcw,
  Save,
} from "lucide-react";
import EditCalculationModal from "./EditCalculationModal";

export interface Course {
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  A: 4.0,
  "A-": 3.75,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
};

interface Calculation {
  id: string;
  calculationName: string;
  totalCredits: number;
  totalGradePoints: number;
  cgpa: number;
  courses: Course[];
  createdAt: string;
  updatedAt: string;
}

interface SavedCalculationsProps {
  onLoadCalculation: (calculation: {
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => void;
}

export default function SavedCalculations({
  onLoadCalculation,
}: SavedCalculationsProps) {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCalculation, setEditingCalculation] =
    useState<Calculation | null>(null);

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/calculations");
      if (!response.ok) {
        throw new Error("Failed to fetch calculations");
      }
      const data = await response.json();
      setCalculations(data);
    } catch (err) {
      setError("Failed to load saved calculations");
      console.error("Error fetching calculations:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCalculation = async (id: string) => {
    try {
      const response = await fetch(`/api/calculations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete calculation");
      }
      setCalculations(calculations.filter((calc) => calc.id !== id));
    } catch (err) {
      console.error("Error deleting calculation:", err);
    }
  };

  const startEditing = (calculation: Calculation) => {
    setEditingCalculation(calculation);
    setShowEditModal(true);
  };

  const handleEditSave = async (updatedCalculation: {
    id: string;
    calculationName: string;
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => {
    try {
      const response = await fetch(
        `/api/calculations/${updatedCalculation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calculationName: updatedCalculation.calculationName,
            totalCredits: updatedCalculation.totalCredits,
            totalGradePoints: updatedCalculation.totalGradePoints,
            cgpa: updatedCalculation.cgpa,
            courses: updatedCalculation.courses,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update calculation");
      }

      // Update the local state
      setCalculations(
        calculations.map((calc) =>
          calc.id === updatedCalculation.id
            ? {
                ...calc,
                calculationName: updatedCalculation.calculationName,
                totalCredits: updatedCalculation.totalCredits,
                totalGradePoints: updatedCalculation.totalGradePoints,
                cgpa: updatedCalculation.cgpa,
                courses: updatedCalculation.courses,
              }
            : calc
        )
      );

      setShowEditModal(false);
      setEditingCalculation(null);
    } catch (err) {
      console.error("Error updating calculation:", err);
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAutoSaved = (calculation: Calculation) => {
    return calculation.calculationName === "Auto-saved";
  };

  const getAutoSaveTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-2xl bg-emerald-100 p-2 dark:bg-emerald-400/10">
            <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Saved Calculations
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-100/80 p-4 animate-pulse dark:bg-white/5"
            >
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 dark:bg-white/10"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 dark:bg-white/10"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p>{error}</p>
          <button
            onClick={fetchCalculations}
            className="mt-2 text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-200"
            aria-label="Retry loading saved calculations"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
          <p className="text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">
            No saved calculations
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Save your first CGPA calculation to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-2 dark:bg-emerald-400/10">
              <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Saved Calculations
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {calculations.length} calculation
                {calculations.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Calculations List */}
      <div className="divide-y divide-slate-200/80 dark:divide-white/10">
        {calculations.map((calculation) => {
          const isAuto = isAutoSaved(calculation);
          const containerClass = isAuto
            ? "bg-emerald-50/70 border-l-4 border-emerald-400 dark:bg-emerald-500/10"
            : "bg-white/80 dark:bg-slate-900/70";
          const titleClass = isAuto
            ? "text-emerald-700 dark:text-emerald-200"
            : "text-slate-900 dark:text-slate-100";
          const valueClass = isAuto
            ? "text-emerald-700 dark:text-emerald-200"
            : "text-slate-900 dark:text-slate-100";
          const badgeClass = isAuto
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
            : "";
          const primaryButtonClass = isAuto
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100";

          return (
            <div
              key={calculation.id}
              className={`p-6 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${containerClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                    className={`text-lg font-medium ${titleClass}`}
                  >
                    {calculation.calculationName}
                  </h4>
                  {isAuto && (
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-1 ${badgeClass}`}
                    >
                      <Save className="w-3 h-3" />
                      <span className="text-xs font-medium">Auto-saved</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {isAuto
                      ? getAutoSaveTimeAgo(calculation.updatedAt)
                      : formatDate(calculation.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {calculation.courses.length} courses
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${valueClass}`}
                  >
                    {Number(calculation.cgpa).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    CGPA
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-500 dark:text-slate-400">
                    Credits
                  </span>
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {Number(calculation.totalCredits)}
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-slate-500 dark:text-slate-400">
                    Grade Points
                  </span>
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {Number(calculation.totalGradePoints).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isAuto ? (
                // Auto-saved calculation - show restore button
                <button
                  onClick={() => {
                    // Load the auto-saved calculation with all its courses
                    onLoadCalculation({
                      cgpa: calculation.cgpa,
                      totalCredits: calculation.totalCredits,
                      totalGradePoints: calculation.totalGradePoints,
                      courses: calculation.courses,
                    });
                  }}
                  className={`flex-1 rounded-full px-4 py-2 transition flex items-center justify-center gap-2 font-medium ${primaryButtonClass}`}
                  aria-label="Restore auto-saved calculation"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              ) : (
                // Regular calculation - show load button
                <button
                  onClick={() => {
                    // Calculate previous data from the saved calculation
                    const currentCredits = calculation.courses.reduce(
                      (sum, course) => sum + course.credits,
                      0
                    );
                    const currentPoints = calculation.courses.reduce(
                      (sum, course) =>
                        sum + gradePoints[course.grade] * course.credits,
                      0
                    );

                    // If there's previous data (total credits > current credits)
                    if (calculation.totalCredits > currentCredits) {
                      const prevCredits =
                        calculation.totalCredits - currentCredits;
                      const prevPoints =
                        calculation.totalGradePoints - currentPoints;
                      const prevCgpa = prevPoints / prevCredits;

                      onLoadCalculation({
                        cgpa: prevCgpa,
                        totalCredits: prevCredits,
                        totalGradePoints: prevPoints,
                        courses: [], // Empty courses array - user will add new ones
                      });
                    } else {
                      // No previous data, just load with empty state
                      onLoadCalculation({
                        cgpa: 0,
                        totalCredits: 0,
                        totalGradePoints: 0,
                        courses: [],
                      });
                    }
                  }}
                  className={`flex-1 rounded-full px-4 py-2 transition flex items-center justify-center gap-2 font-medium ${primaryButtonClass}`}
                  aria-label="Load saved calculation"
                >
                  <Download className="w-4 h-4" />
                  Load
                </button>
              )}

              {!isAuto && (
                <button
                  onClick={() => startEditing(calculation)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10"
                  title="Edit calculation"
                  aria-label="Edit calculation"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => deleteCalculation(calculation.id)}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                title={
                  isAuto
                    ? "Delete auto-saved calculation"
                    : "Delete calculation"
                }
                aria-label="Delete calculation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
        })}
      </div>

      {/* Edit Modal */}
      <EditCalculationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCalculation(null);
        }}
        onSave={handleEditSave}
        calculation={editingCalculation}
      />
    </div>
  );
}
