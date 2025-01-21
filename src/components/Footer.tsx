import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="mt-12 bg-gray-800 border-t border-gray-700 py-8 rounded-lg">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-lg sm:font-medium font-small text-gray-300">
            Made with ❤️ by <strong>Muhammad Raffey</strong> ✨
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://linkedin.com/in/muhammad-raffey"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-all duration-200 hover:scale-110"
            >
              <div className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
                <FaLinkedin size={24} className="text-blue-400" />
              </div>
            </Link>
            <Link
              href="https://github.com/MuhammadRaffey"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-all duration-200 hover:scale-110"
            >
              <div className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
                <FaGithub size={24} className="text-gray-300" />
              </div>
            </Link>
            <Link
              href="https://raffey-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-all duration-200 hover:scale-110"
            >
              <div className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
                <FaGlobe size={24} className="text-emerald-400" />
              </div>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} | UOL CGPA Calculator
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
