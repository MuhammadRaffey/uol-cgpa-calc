"use client";
import Footer from "@/components/Footer";
import { useState } from "react";

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

const CgpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", credits: 0, grade: "A" },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);

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
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const calculateCgpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const points = gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
      totalPoints += points;
    });

    const calculatedCgpa = totalPoints / totalCredits;
    setCgpa(calculatedCgpa);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          UOL CGPA Calculator
        </h1>
        <p className="text-lg text-center text-gray-300 mb-8">
          University of Lahore CGPA calculator
        </p>
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 space-y-6 border border-gray-700">
          {courses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center border-b border-gray-700 pb-4 last:border-0 last:pb-0"
            >
              <input
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) =>
                  handleCourseChange(index, "name", e.target.value)
                }
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
              <input
                type="number"
                placeholder="Credit Hours"
                value={course.credits === 0 ? "" : course.credits} // Ensures the placeholder shows initially
                onChange={(e) =>
                  handleCourseChange(index, "credits", Number(e.target.value))
                }
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
              <select
                value={course.grade}
                onChange={(e) =>
                  handleCourseChange(index, "grade", e.target.value)
                }
                className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              >
                {Object.keys(gradePoints).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(index)}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-10 pt-4 justify-center">
            <button
              onClick={addCourse}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Add Course
            </button>
            <button
              onClick={calculateCgpa}
              className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Calculate CGPA
            </button>
          </div>
        </div>

        {cgpa !== null && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6 text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-emerald-400">
              Your CGPA is: {cgpa.toFixed(2)}
            </h2>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default CgpaCalculator;
