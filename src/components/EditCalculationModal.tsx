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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100">Edit Calculation</h2>
        </div>

        {/* Calculation Name */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">
            Calculation Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Spring 2024, 3rd Semester"
            disabled={saving}
          />
        </div>

        {/* Previous Data Section */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              id="usePreviousData"
              checked={usePreviousData}
              onChange={(e) => setUsePreviousData(e.target.checked)}
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="usePreviousData"
              className="text-gray-200 font-medium cursor-pointer"
            >
              Include Previous CGPA and Credits
            </label>
          </div>

          {usePreviousData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
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
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter previous CGPA"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
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
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter earned credits"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live CGPA Display */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 font-medium">Live CGPA:</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {cgpa.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                {totalCredits} credits • {totalGradePoints.toFixed(2)} points
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Courses</h3>
            <button
              onClick={addCourse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Course
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(index, "name", e.target.value)
                      }
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Course name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
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
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Credits"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(index, "grade", e.target.value)
                      }
                      className="w-full rounded-lg bg-gray-700 border border-gray-600 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      disabled={courses.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
