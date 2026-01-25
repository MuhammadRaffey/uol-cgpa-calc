"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPlus, FaTrash, FaGraduationCap, FaCalculator, FaChartLine } from "react-icons/fa";
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
  const [showResult, setShowResult] = useState(false);

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
    setShowResult(true);

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
      setShowResult(false);
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
    <Card className="relative overflow-hidden glass-strong shadow-custom-2xl border-2 border-white/30 dark:border-white/10">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <CardHeader className="relative space-y-3 pb-8">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-50 animate-pulse-glow"></div>
            <div className="relative p-4 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl shadow-lg">
              <FaGraduationCap className="text-3xl text-white" />
            </div>
          </div>
        </div>
        <CardTitle className="text-4xl font-bold text-center gradient-text font-display">
          CGPA Studio
        </CardTitle>
        <p className="text-center text-slate-600 text-base max-w-2xl mx-auto dark:text-slate-400">
          Add courses, include prior semesters, and get an instant CGPA readout with our premium calculator.
        </p>
      </CardHeader>

      <CardContent className="relative space-y-10">
        {/* Previous Data Section */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
          <div className="relative rounded-3xl border-2 border-slate-200/80 glass p-8 transition-all duration-300 dark:border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <Checkbox
                id="usePreviousData"
                checked={usePreviousData}
                onCheckedChange={(checked) => setUsePreviousData(!!checked)}
                className="h-6 w-6 border-2 border-slate-300 bg-white data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 transition-all duration-200 dark:border-white/20 dark:bg-slate-950 dark:data-[state=checked]:border-emerald-400 dark:data-[state=checked]:bg-emerald-400"
              />
              <label
                htmlFor="usePreviousData"
                className="text-slate-900 text-xl font-semibold cursor-pointer font-display dark:text-slate-100"
              >
                Include Previous CGPA and Credits
              </label>
            </div>

            {usePreviousData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-up">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-slate-400">
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
                    className="input-enhanced text-lg font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider dark:text-slate-400">
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
                    className="input-enhanced text-lg font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl">
                <FaChartLine className="text-xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-display dark:text-slate-100">
                Course Details
              </h3>
            </div>
            <button
              onClick={addCourse}
              className="btn-gradient group"
              aria-label="Add course"
            >
              <FaPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Course
            </button>
          </div>

          <div className="space-y-5">
            {courses.map((course, index) => (
              <div
                key={index}
                className="group relative card-hover"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500"></div>
                <div className="relative rounded-3xl border-2 border-slate-200/80 glass p-6 shadow-custom-md dark:border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 items-end">
                    <div className="space-y-3 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                        Course Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures"
                        value={course.name}
                        onChange={(e) =>
                          handleCourseChange(index, "name", e.target.value)
                        }
                        className="input-enhanced font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                        Credits
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="3.0"
                        value={course.credits === 0 ? "" : course.credits}
                        onChange={(e) =>
                          handleCourseChange(
                            index,
                            "credits",
                            Number(e.target.value)
                          )
                        }
                        className="input-enhanced font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400">
                        Grade
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          value={course.grade}
                          onChange={(e) =>
                            handleCourseChange(index, "grade", e.target.value)
                          }
                          className="flex-1 input-enhanced font-semibold"
                        >
                          {Object.keys(gradePoints).map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setConfirmationIndex(index)}
                              className="group/delete rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-rose-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-100 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                              disabled={courses.length === 1}
                              aria-label="Delete course"
                            >
                              <FaTrash size={16} className="group-hover/delete:scale-110 transition-transform" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-strong border-2 border-white/30 text-slate-900 dark:border-white/10 dark:text-slate-100 rounded-3xl">
                            <AlertDialogTitle className="text-2xl font-bold text-slate-900 font-display dark:text-slate-100">
                              Delete Course
                            </AlertDialogTitle>
                            <p className="text-slate-600 mt-3 text-base dark:text-slate-400">
                              Are you sure you want to delete this course? This action
                              cannot be undone.
                            </p>
                            <AlertDialogFooter className="mt-8 gap-3">
                              <AlertDialogCancel className="btn-secondary">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-full bg-rose-600 text-white hover:bg-rose-700 px-6 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={calculateCgpa}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-12 py-5 text-lg font-bold text-white shadow-custom-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-custom-2xl active:translate-y-0"
            aria-label="Calculate CGPA"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <FaCalculator className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Calculate CGPA</span>
            </div>
          </button>
        </div>

        {/* Result Display */}
        {cgpa !== null && showResult && (
          <div className="relative animate-scale-in">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse-glow"></div>
            
            {/* Result card */}
            <div className="relative rounded-[2.5rem] border-2 border-white/40 glass-strong p-10 text-center shadow-custom-2xl dark:border-white/20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl shadow-lg">
                  <FaCalculator className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text font-display">
                  Your CGPA
                </h2>
              </div>
              <div className="relative inline-block">
                <div className="text-7xl font-black text-slate-900 mb-3 font-display dark:text-slate-100">
                  {cgpa.toFixed(2)}
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-xl opacity-20"></div>
              </div>
              <p className="text-slate-600 text-lg font-medium dark:text-slate-400">
                Cumulative Grade Point Average
              </p>
              
              {/* Performance indicator */}
              <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {cgpa >= 3.5 ? "🎉 Excellent Performance!" : cgpa >= 3.0 ? "✨ Great Work!" : cgpa >= 2.5 ? "👍 Good Progress!" : "💪 Keep Going!"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CgpaCalculatorComponent;
