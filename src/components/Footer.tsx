
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About AMURA */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AMURA Tech Club</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Empowering students through technology, innovation, and collaborative learning.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-500 hover:text-amura-purple">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/company/amura-ai-ml-student-club-rnsit/" className="text-gray-500 hover:text-amura-purple">
                <Linkedin size={20} />
              </a>
              <a href="prarthananagraj23aiml@rnsit.ac.in" className="text-gray-500 hover:text-amura-purple">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 dark:text-gray-300 hover:text-amura-purple">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-amura-purple">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="text-gray-600 dark:text-gray-300 hover:text-amura-purple">
                  Certificate Download
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-gray-600 dark:text-gray-300 hover:text-amura-purple">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-amura-purple">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              {/* <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-amura-purple flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-300">
                  123 University Campus, Tech Building, Floor 2
                </span>
              </li> */}
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-amura-purple flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">+91 9731424499</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-amura-purple flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">prarthananagraj23aiml@rnsit.ac.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AMURA Technical Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
