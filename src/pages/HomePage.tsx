
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    console.log("HomePage component mounted");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amura-purple to-amura-purple-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome to AMURA Technical Club
              </h1>
              <p className="text-xl">
                Where innovation meets community. Join us in exploring the frontiers of technology through workshops, projects, and collaborative learning.
              </p>
              <div className="pt-4">
                <Link to="/register" className="inline-flex items-center btn-primary">
                  Join Now <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
                className="rounded-lg shadow-lg max-h-[400px] object-cover animate-fade-in"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              AMURA is dedicated to fostering technological innovation, building a vibrant tech community, and developing the next generation of tech leaders through hands-on learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
            What We Offer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6 card-hover">
              <div className="h-12 w-12 rounded-full bg-amura-purple-light flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amura-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Workshops & Training</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hands-on technical workshops, coding bootcamps, and expert-led training sessions on cutting-edge technologies.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6 card-hover">
              <div className="h-12 w-12 rounded-full bg-amura-purple-light flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amura-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community Projects</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborative real-world projects where students can apply their skills and build impressive portfolio pieces.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6 card-hover">
              <div className="h-12 w-12 rounded-full bg-amura-purple-light flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amura-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Career Development</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Industry connections, mentorship opportunities, and guidance on building a successful career in technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <Link to="/events" className="text-amura-purple hover:text-amura-purple-dark font-medium flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Card 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card">
              <div className="h-48 overflow-hidden">
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-amura-purple font-semibold mb-2">April 25, 2025 • 10:00 AM</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Web Development Workshop</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Learn the fundamentals of modern web development with hands-on coding exercises.</p>
                <Link to="/register" className="btn-secondary inline-block">Register Now</Link>
              </div>
            </div>
            
            {/* Event Card 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card">
              <div className="h-48 overflow-hidden">
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-amura-purple font-semibold mb-2">May 10, 2025 • 9:00 AM</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI & Machine Learning Hackathon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Build innovative solutions using AI and ML technologies in this 24-hour coding challenge.</p>
                <Link to="/register" className="btn-secondary inline-block">Register Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amura-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Tech Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join AMURA Technical Club and be part of a community dedicated to learning, innovation, and growth in technology.
          </p>
          <Link to="/register" className="btn-primary bg-white text-amura-purple hover:bg-gray-100">
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
}
