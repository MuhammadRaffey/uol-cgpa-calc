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

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">
            Saved Calculations
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-center text-gray-400">
          <p>{error}</p>
          <button
            onClick={fetchCalculations}
            className="mt-2 text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-lg font-medium mb-2">No saved calculations</p>
          <p className="text-sm">
            Save your first CGPA calculation to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                Saved Calculations
              </h3>
              <p className="text-sm text-gray-400">
                {calculations.length} calculation
                {calculations.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Calculations List */}
      <div className="divide-y divide-gray-700">
        {calculations.map((calculation) => (
          <div
            key={calculation.id}
            className="p-6 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-100 mb-1">
                  {calculation.calculationName}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(calculation.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {calculation.courses.length} courses
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {Number(calculation.cgpa).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">CGPA</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Credits</span>
                </div>
                <div className="text-lg font-semibold text-gray-100">
                  {Number(calculation.totalCredits)}
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Grade Points</span>
                </div>
                <div className="text-lg font-semibold text-gray-100">
                  {Number(calculation.totalGradePoints).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Load
              </button>
              <button
                onClick={() => startEditing(calculation)}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                title="Edit calculation"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteCalculation(calculation.id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                title="Delete calculation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
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
