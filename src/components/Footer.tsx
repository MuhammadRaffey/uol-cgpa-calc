import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaHeart,
  FaGraduationCap,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-500 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <FaGraduationCap className="text-2xl text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                UOL CGPA Calculator
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Precision in Academic Progress
              </p>
            </div>
          </div>

          {/* Made with love */}
          <div className="flex items-center justify-center gap-2 text-lg font-medium bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50">
            <span className="text-gray-300">Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span className="text-gray-300">by</span>
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 font-semibold">
              Muhammad Raffey
            </strong>
            <span className="text-yellow-400 animate-bounce">✨</span>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://linkedin.com/in/muhammadraffey"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="LinkedIn Profile"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 transform transition-all duration-300 group-hover:bg-gray-700/50 group-hover:scale-110 group-hover:shadow-xl group-hover:border-blue-500/50">
                <FaLinkedin
                  size={24}
                  className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                LinkedIn
              </span>
            </Link>

            <Link
              href="https://github.com/MuhammadRaffey"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="GitHub Profile"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 transform transition-all duration-300 group-hover:bg-gray-700/50 group-hover:scale-110 group-hover:shadow-xl group-hover:border-gray-500/50">
                <FaGithub
                  size={24}
                  className="text-gray-300 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                GitHub
              </span>
            </Link>

            <Link
              href="https://raffey-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="Portfolio Website"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 transform transition-all duration-300 group-hover:bg-gray-700/50 group-hover:scale-110 group-hover:shadow-xl group-hover:border-emerald-500/50">
                <FaGlobe
                  size={24}
                  className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Portfolio
              </span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-700/50 w-full text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} UOL CGPA Calculator. All rights
              reserved.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
