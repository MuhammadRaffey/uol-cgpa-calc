"use client";
import Footer from "@/components/Footer";
import CgpaCalculatorComponent from "@/components/Main";

const CgpaCalculator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          UOL CGPA Calculator
        </h1>
        <p className="text-lg text-center text-gray-300 mb-8">
          University of Lahore CGPA calculator
        </p>

        <CgpaCalculatorComponent />

        <Footer />
      </div>
    </div>
  );
};

export default CgpaCalculator;
