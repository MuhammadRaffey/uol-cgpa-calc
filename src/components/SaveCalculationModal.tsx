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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center font-display dark:text-slate-100">
          Save Calculation
        </h2>
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
        <div className="mb-6 grid gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              CGPA:
            </span>{" "}
            {cgpa.toFixed(2)}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Total Credits:
            </span>{" "}
            {totalCredits}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/60">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Courses:
            </span>{" "}
            {courses.length}
          </div>
        </div>
        {error && (
          <div className="text-rose-500 mb-4 text-center dark:text-rose-300">
            {error}
          </div>
        )}
        <button
          onClick={handleSave}
          className="w-full rounded-full bg-slate-900 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          disabled={saving}
          aria-label="Save calculation"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
