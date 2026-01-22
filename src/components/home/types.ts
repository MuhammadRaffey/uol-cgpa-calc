import type { KeyboardEvent, MouseEvent } from "react";
import type { Course } from "@/components/SavedCalculations";

export type ScrollHandler = (
  targetId: string
) => (event?: MouseEvent<HTMLButtonElement>) => void;

export type ScrollKeyHandler = (
  targetId: string
) => (event: KeyboardEvent<HTMLButtonElement>) => void;

export type SessionStats = {
  cgpaDisplay: string;
  creditsDisplay: string;
  gradePointsDisplay: string;
  coursesDisplay: number | string;
};

export type AutoSaveStatus = {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
};

export type CalculationState = {
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courses: Course[];
};
