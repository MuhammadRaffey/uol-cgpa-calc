"use client";

import { useState, useEffect } from "react";
import { X, Save, Edit, Calculator } from "lucide-react";

export interface Course {
  name: string;
  credits: number;
  grade: string;
}

interface EditCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (calculation: {
    id: string;
    calculationName: string;
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => void;
  calculation: {
    id: string;
    calculationName: string;
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  } | null;
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

export default function EditCalculationModal({
  isOpen,
  onClose,
  onSave,
  calculation,
}: EditCalculationModalProps) {
  const [name, setName] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usePreviousData, setUsePreviousData] = useState(false);
  const [previousCgpa, setPreviousCgpa] = useState<number | "">("");
  const [previousCredits, setPreviousCredits] = useState<number | "">("");

  // Initialize form when calculation changes
  useEffect(() => {
    if (calculation) {
      setName(calculation.calculationName);
      setCourses([...calculation.courses]);

      // Calculate if there was previous data
      const currentCredits = calculation.courses.reduce(
        (sum, course) => sum + course.credits,
        0
      );
      const currentPoints = calculation.courses.reduce(
        (sum, course) => sum + gradePoints[course.grade] * course.credits,
        0
      );

      if (calculation.totalCredits > currentCredits) {
        const prevCredits = calculation.totalCredits - currentCredits;
        const prevPoints = calculation.totalGradePoints - currentPoints;
        const prevCgpa = prevPoints / prevCredits;

        setUsePreviousData(true);
        setPreviousCgpa(prevCgpa);
        setPreviousCredits(prevCredits);
      } else {
        setUsePreviousData(false);
        setPreviousCgpa("");
        setPreviousCredits("");
      }
    }
  }, [calculation]);

  const calculateCgpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const points = gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
      totalPoints += points;
    });

    // Add previous data if enabled
    if (usePreviousData && previousCgpa && previousCredits) {
      const prevCredits = Number(previousCredits);
      const prevPoints = Number(previousCgpa) * prevCredits;
      totalCredits += prevCredits;
      totalPoints += prevPoints;
    }

    return {
      cgpa: totalPoints / totalCredits,
      totalCredits,
      totalGradePoints: totalPoints,
    };
  };

  const handleCourseChange = (
    index: number,
    field: keyof Course,
    value: string | number
  ) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", credits: 0, grade: "A" }]);
  };

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      const updatedCourses = courses.filter((_, i) => i !== index);
      setCourses(updatedCourses);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a calculation name");
      return;
    }

    if (courses.length === 0) {
      setError("Please add at least one course");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { cgpa, totalCredits, totalGradePoints } = calculateCgpa();

      const updatedCalculation = {
        ...calculation!,
        calculationName: name.trim(),
        courses,
        cgpa,
        totalCredits,
        totalGradePoints,
      };

      const response = await fetch(`/api/calculations/${calculation!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCalculation),
      });

      if (!response.ok) {
        throw new Error("Failed to update calculation");
      }

      onSave(updatedCalculation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update calculation"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !calculation) return null;

  const { cgpa, totalCredits, totalGradePoints } = calculateCgpa();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-2xl bg-emerald-100 p-2 dark:bg-emerald-400/10">
            <Edit className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 font-display dark:text-slate-100">
            Edit Calculation
          </h2>
        </div>

        {/* Calculation Name */}
        <div className="mb-6">
          <label className="block text-slate-500 mb-2 font-medium dark:text-slate-400">
            Calculation Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
            placeholder="e.g. Spring 2024, 3rd Semester"
            disabled={saving}
          />
        </div>

        {/* Previous Data Section */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/60">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              id="usePreviousData"
              checked={usePreviousData}
              onChange={(e) => setUsePreviousData(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 bg-white focus:ring-emerald-200/70 dark:border-white/20 dark:bg-slate-950 dark:focus:ring-emerald-400/20"
            />
            <label
              htmlFor="usePreviousData"
              className="text-slate-900 font-medium cursor-pointer dark:text-slate-100"
            >
              Include Previous CGPA and Credits
            </label>
          </div>

          {usePreviousData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1 dark:text-slate-400">
                  Previous CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={previousCgpa === "" ? "" : previousCgpa}
                  onChange={(e) =>
                    setPreviousCgpa(Number(e.target.value) || "")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
                  placeholder="Enter previous CGPA"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1 dark:text-slate-400">
                  Previous Credits
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={previousCredits === "" ? "" : previousCredits}
                  onChange={(e) =>
                    setPreviousCredits(Number(e.target.value) || "")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
                  placeholder="Enter earned credits"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live CGPA Display */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
              <span className="text-slate-500 font-medium dark:text-slate-400">
                Live CGPA:
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {cgpa.toFixed(2)}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {totalCredits} credits • {totalGradePoints.toFixed(2)} points
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Courses
            </h3>
            <button
              onClick={addCourse}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              aria-label="Add course"
            >
              Add Course
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slate-500 mb-1 dark:text-slate-400">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(index, "name", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
                      placeholder="Course name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1 dark:text-slate-400">
                      Credits
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={course.credits === 0 ? "" : course.credits}
                      onChange={(e) =>
                        handleCourseChange(
                          index,
                          "credits",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
                      placeholder="Credits"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 mb-1 dark:text-slate-400">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(index, "grade", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:ring-emerald-400/20"
                    >
                      {Object.keys(gradePoints).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeCourse(index)}
                      className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                      disabled={courses.length === 1}
                      aria-label="Remove course"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-rose-500 mb-4 text-center dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10"
            disabled={saving}
            aria-label="Cancel editing"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 flex items-center justify-center gap-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            disabled={saving}
            aria-label="Save changes"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
