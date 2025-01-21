import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-12 bg-gray-900 border-t border-gray-800 py-8 rounded-lg shadow-lg">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            <span className="text-white">Made</span>
            <span className="text-white">with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span className="text-white">by</span>
            <strong className="text-emerald-400 font-semibold">Muhammad</strong>
            <strong className="text-emerald-400 font-semibold">Raffey</strong>
            <span className="text-yellow-400">✨</span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://linkedin.com/in/muhammadraffey"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="LinkedIn Profile"
            >
              <div className="bg-gray-800 p-3 rounded-full transform transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110 group-hover:shadow-lg">
                <FaLinkedin
                  size={24}
                  className="text-blue-400 group-hover:text-blue-300"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              <div className="bg-gray-800 p-3 rounded-full transform transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110 group-hover:shadow-lg">
                <FaGithub
                  size={24}
                  className="text-gray-300 group-hover:text-white"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              <div className="bg-gray-800 p-3 rounded-full transform transition-all duration-300 group-hover:bg-gray-700 group-hover:scale-110 group-hover:shadow-lg">
                <FaGlobe
                  size={24}
                  className="text-emerald-400 group-hover:text-emerald-300"
                />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Portfolio
              </span>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-800 w-full text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} | UOL CGPA Calculator
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
