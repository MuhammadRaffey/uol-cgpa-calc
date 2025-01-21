"use client";
import { useState } from "react";
import { FaPlus, FaTrash, FaGraduationCap } from "react-icons/fa";
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

const CgpaCalculatorComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", credits: 0, grade: "A" },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [, setConfirmationIndex] = useState<number | null>(null);
  const [previousCgpa, setPreviousCgpa] = useState<number | "">("");
  const [previousCredits, setPreviousCredits] = useState<number | "">("");
  const [usePreviousData, setUsePreviousData] = useState<boolean>(false);

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

  const calculateCgpa = () => {
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
  };

  return (
    <Card className="bg-gray-900 shadow-2xl border-gray-800">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-emerald-400">
          <FaGraduationCap className="text-3xl" />
          CGPA Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-800 pb-4 transition-all duration-200 hover:border-gray-700">
          <Checkbox
            id="usePreviousData"
            checked={usePreviousData}
            onCheckedChange={(checked) => setUsePreviousData(!!checked)}
            className="bg-gray-800 border-gray-700 data-[state=checked]:bg-emerald-500"
          />
          <label
            htmlFor="usePreviousData"
            className="text-gray-200 text-sm font-medium cursor-pointer"
          >
            Include Previous CGPA and Credits
          </label>
        </div>

        {usePreviousData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-800 pb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Previous CGPA
              </label>
              <input
                type="number"
                placeholder="Enter previous CGPA"
                value={previousCgpa === "" ? "" : previousCgpa}
                onChange={(e) => setPreviousCgpa(Number(e.target.value) || "")}
                className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 transition-colors duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Previous Credits
              </label>
              <input
                type="number"
                placeholder="Enter earned credits"
                value={previousCredits === "" ? "" : previousCredits}
                onChange={(e) =>
                  setPreviousCredits(Number(e.target.value) || "")
                }
                className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 transition-colors duration-200"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200"
            >
              <div className="space-y-2">
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
                  className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Credits
                </label>
                <input
                  type="number"
                  placeholder="Credit hours"
                  value={course.credits === 0 ? "" : course.credits}
                  onChange={(e) =>
                    handleCourseChange(index, "credits", Number(e.target.value))
                  }
                  className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Grade
                </label>
                <select
                  value={course.grade}
                  onChange={(e) =>
                    handleCourseChange(index, "grade", e.target.value)
                  }
                  className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 transition-colors duration-200"
                >
                  {Object.keys(gradePoints).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 justify-center sm:justify-end">
                <button
                  onClick={() => addCourse()}
                  className="p-2 rounded-full bg-gray-800 text-emerald-400 hover:bg-gray-700 hover:text-emerald-300 transition-colors duration-200"
                >
                  <FaPlus size={16} />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setConfirmationIndex(index)}
                      className="p-2 rounded-full bg-gray-800 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      disabled={courses.length === 1}
                    >
                      <FaTrash size={16} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-800">
                    <AlertDialogTitle className="text-lg font-semibold text-gray-100">
                      Delete Course
                    </AlertDialogTitle>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-gray-100 hover:bg-gray-700 border-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => removeCourse(index)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <button
            onClick={calculateCgpa}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
          >
            Calculate CGPA
          </button>
        </div>

        {cgpa !== null && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 text-center shadow-xl border border-emerald-600/20">
            <h2 className="text-3xl font-bold text-emerald-400">
              {cgpa.toFixed(2)}
            </h2>
            <p className="text-gray-400 mt-2">Your Current CGPA</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CgpaCalculatorComponent;
