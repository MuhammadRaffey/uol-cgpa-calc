"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPlus, FaTrash, FaGraduationCap, FaCalculator } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Course {
  name: string;
  credits: number;
  grade: string;
}

interface CgpaCalculatorComponentProps {
  onCalculationUpdate?: (calculation: {
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    courses: Course[];
  }) => void;
  loadSavedCalculation?: {
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

const CgpaCalculatorComponent: React.FC<CgpaCalculatorComponentProps> = ({
  onCalculationUpdate,
  loadSavedCalculation,
}) => {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", credits: 0, grade: "A" },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [, setConfirmationIndex] = useState<number | null>(null);
  const [previousCgpa, setPreviousCgpa] = useState<number | "">("");
  const [previousCredits, setPreviousCredits] = useState<number | "">("");
  const [usePreviousData, setUsePreviousData] = useState<boolean>(false);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<string>("");
  const onCalculationUpdateRef = useRef(onCalculationUpdate);

  // Update ref when prop changes
  useEffect(() => {
    onCalculationUpdateRef.current = onCalculationUpdate;
  }, [onCalculationUpdate]);

  // Load saved calculation
  useEffect(() => {
    if (loadSavedCalculation) {
      // If there are courses, load them
      if (loadSavedCalculation.courses.length > 0) {
        setCourses(loadSavedCalculation.courses);
      } else {
        // If no courses, clear the courses array (for loading previous data only)
        setCourses([{ name: "", credits: 0, grade: "A" }]);
      }

      // Calculate what should go in previous data
      const currentCredits = loadSavedCalculation.courses.reduce(
        (sum: number, course: Course) => sum + course.credits,
        0
      );
      const currentPoints = loadSavedCalculation.courses.reduce(
        (sum: number, course: Course) =>
          sum + gradePoints[course.grade] * course.credits,
        0
      );

      // If there's a difference between current and saved totals, it means there was previous data
      if (loadSavedCalculation.totalCredits > currentCredits) {
        const prevCredits = loadSavedCalculation.totalCredits - currentCredits;
        const prevPoints =
          loadSavedCalculation.totalGradePoints - currentPoints;
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
  }, [loadSavedCalculation]);

  const calculateCgpa = useCallback(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const points = gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
      totalPoints += points;
    });

    if (usePreviousData && previousCgpa && previousCredits) {
      const prevCredits = Number(previousCredits);
      const prevPoints = Number(previousCgpa) * prevCredits;
      totalCredits += prevCredits;
      totalPoints += prevPoints;
    }

    const calculatedCgpa = totalPoints / totalCredits;
    setCgpa(calculatedCgpa);

    // Create a hash of the current calculation state
    const currentState = JSON.stringify({
      cgpa: calculatedCgpa,
      totalCredits,
      totalGradePoints: totalPoints,
      courses: courses.map((c) => ({
        name: c.name,
        credits: c.credits,
        grade: c.grade,
      })),
      usePreviousData,
      previousCgpa,
      previousCredits,
    });

    // Only update parent if state actually changed
    if (
      currentState !== lastUpdateRef.current &&
      onCalculationUpdateRef.current
    ) {
      lastUpdateRef.current = currentState;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the update to prevent rapid API calls
      debounceTimerRef.current = setTimeout(() => {
        onCalculationUpdateRef.current?.({
          cgpa: calculatedCgpa,
          totalCredits,
          totalGradePoints: totalPoints,
          courses,
        });
      }, 300); // 300ms debounce
    }
  }, [courses, previousCgpa, previousCredits, usePreviousData]);

  // Update calculation whenever courses or previous data changes
  useEffect(() => {
    // Only calculate if there are meaningful courses
    const hasValidCourses = courses.some(
      (course) => course.name && course.credits > 0
    );
    const hasValidPreviousData =
      usePreviousData && previousCgpa && previousCredits;

    if (hasValidCourses || hasValidPreviousData) {
      calculateCgpa();
    } else {
      // Reset CGPA if no valid data
      setCgpa(null);
      if (onCalculationUpdateRef.current) {
        onCalculationUpdateRef.current({
          cgpa: 0,
          totalCredits: 0,
          totalGradePoints: 0,
          courses: [],
        });
      }
    }
  }, [courses, previousCgpa, previousCredits, usePreviousData, calculateCgpa]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
      setConfirmationIndex(null);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] border border-slate-200/80 dark:bg-slate-900/70 dark:border-white/10">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-semibold text-center flex items-center justify-center gap-3 text-slate-900 font-display dark:text-slate-100">
          <div className="p-2 bg-gradient-to-br from-emerald-400 via-emerald-300 to-amber-300 rounded-2xl shadow-sm">
            <FaGraduationCap className="text-2xl text-slate-900" />
          </div>
          CGPA Studio
        </CardTitle>
        <p className="text-center text-slate-500 text-sm dark:text-slate-400">
          Add courses, include prior semesters, and get an instant CGPA readout.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Previous Data Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-4 mb-4">
            <Checkbox
              id="usePreviousData"
              checked={usePreviousData}
              onCheckedChange={(checked) => setUsePreviousData(!!checked)}
              className="border-slate-300 bg-white data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 dark:border-white/20 dark:bg-slate-950 dark:data-[state=checked]:border-emerald-400 dark:data-[state=checked]:bg-emerald-400"
            />
            <label
              htmlFor="usePreviousData"
              className="text-slate-900 text-lg font-medium cursor-pointer dark:text-slate-100"
            >
              Include Previous CGPA and Credits
            </label>
          </div>

          {usePreviousData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Previous CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="Enter previous CGPA"
                  value={previousCgpa === "" ? "" : previousCgpa}
                  onChange={(e) =>
                    setPreviousCgpa(Number(e.target.value) || "")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 text-lg p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Previous Credits
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="Enter earned credits"
                  value={previousCredits === "" ? "" : previousCredits}
                  onChange={(e) =>
                    setPreviousCredits(Number(e.target.value) || "")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 text-lg p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Course Details
            </h3>
            <button
              onClick={addCourse}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              aria-label="Add course"
            >
              <FaPlus size={14} />
              Add Course
            </button>
          </div>

          {courses.map((course, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-slate-950/60"
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course name"
                    value={course.name}
                    onChange={(e) =>
                      handleCourseChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 text-lg p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Credits
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Credit hours"
                    value={course.credits === 0 ? "" : course.credits}
                    onChange={(e) =>
                      handleCourseChange(
                        index,
                        "credits",
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 text-lg p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Grade
                  </label>
                  <select
                    value={course.grade}
                    onChange={(e) =>
                      handleCourseChange(index, "grade", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 text-lg p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
                  >
                    {Object.keys(gradePoints).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setConfirmationIndex(index)}
                        className="rounded-full border border-rose-200 bg-rose-50 p-3 text-rose-600 transition-all duration-200 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                        disabled={courses.length === 1}
                        aria-label="Delete course"
                      >
                        <FaTrash size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-white/10 dark:text-slate-100">
                      <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Delete Course
                      </AlertDialogTitle>
                      <p className="text-slate-500 mt-2 dark:text-slate-400">
                        Are you sure you want to delete this course? This action
                        cannot be undone.
                      </p>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
                          onClick={() => removeCourse(index)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={calculateCgpa}
            className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-12 py-4 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            aria-label="Calculate CGPA"
          >
            <FaCalculator className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Calculate CGPA</span>
          </button>
        </div>

        {/* Result Display */}
        {cgpa !== null && (
          <div className="mt-8 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-200/50 via-sky-200/40 to-amber-200/40 blur-2xl opacity-80"></div>
            <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCalculator className="w-8 h-8 text-emerald-500 dark:text-emerald-300" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Your CGPA
                </h2>
              </div>
              <div className="text-6xl font-semibold text-slate-900 mb-2 font-display dark:text-slate-100">
                {cgpa.toFixed(2)}
              </div>
              <p className="text-slate-500 text-lg dark:text-slate-400">
                Cumulative Grade Point Average
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CgpaCalculatorComponent;
