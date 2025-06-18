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
    <Card className="bg-gray-800/50 backdrop-blur-sm shadow-2xl border-gray-700/50">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          CGPA Calculator
        </CardTitle>
        <p className="text-center text-gray-400 text-sm">
          Add your courses and calculate your cumulative grade point average
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Previous Data Section */}
        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
          <div className="flex items-center gap-4 mb-4">
            <Checkbox
              id="usePreviousData"
              checked={usePreviousData}
              onCheckedChange={(checked) => setUsePreviousData(!!checked)}
              className="bg-gray-600 border-gray-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-blue-500"
            />
            <label
              htmlFor="usePreviousData"
              className="text-gray-200 text-lg font-medium cursor-pointer"
            >
              Include Previous CGPA and Credits
            </label>
          </div>

          {usePreviousData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
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
                  className="w-full rounded-xl bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-4 transition-all duration-200 hover:border-gray-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
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
                  className="w-full rounded-xl bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-4 transition-all duration-200 hover:border-gray-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-200">
              Course Details
            </h3>
            <button
              onClick={addCourse}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              <FaPlus size={14} />
              Add Course
            </button>
          </div>

          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course name"
                    value={course.name}
                    onChange={(e) =>
                      handleCourseChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-xl bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-4 transition-all duration-200 hover:border-gray-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
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
                    className="w-full rounded-xl bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-4 transition-all duration-200 hover:border-gray-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Grade
                  </label>
                  <select
                    value={course.grade}
                    onChange={(e) =>
                      handleCourseChange(index, "grade", e.target.value)
                    }
                    className="w-full rounded-xl bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-4 transition-all duration-200 hover:border-gray-500"
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
                        className="p-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-200 border border-red-500/30"
                        disabled={courses.length === 1}
                      >
                        <FaTrash size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogTitle className="text-xl font-semibold text-gray-100">
                        Delete Course
                      </AlertDialogTitle>
                      <p className="text-gray-400 mt-2">
                        Are you sure you want to delete this course? This action
                        cannot be undone.
                      </p>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-600 rounded-lg">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700 rounded-lg"
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
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <FaCalculator className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Calculate CGPA</span>
          </button>
        </div>

        {/* Result Display */}
        {cgpa !== null && (
          <div className="mt-8 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-emerald-500/20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCalculator className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-bold text-gray-200">Your CGPA</h2>
              </div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                {cgpa.toFixed(2)}
              </div>
              <p className="text-gray-400 text-lg">
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
