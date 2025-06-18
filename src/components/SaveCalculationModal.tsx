"use client";

import { useState } from "react";

export interface Course {
  name: string;
  credits: number;
  grade: string;
}

interface SaveCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  cgpa: number;
  totalCredits: number;
  courses: Course[];
}

export default function SaveCalculationModal({
  isOpen,
  onClose,
  onSave,
  cgpa,
  totalCredits,
  courses,
}: SaveCalculationModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your calculation.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(name);
      setName("");
      onClose();
    } catch {
      setError("Failed to save calculation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
          Save Calculation
        </h2>
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
        <div className="mb-6 flex flex-col gap-2 text-gray-300 text-sm">
          <div>
            <span className="font-semibold">CGPA:</span> {cgpa.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">Total Credits:</span> {totalCredits}
          </div>
          <div>
            <span className="font-semibold">Courses:</span> {courses.length}
          </div>
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
