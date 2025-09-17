import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock events data taken from your EventsPage.tsx
const upcomingEvents = [
  {
    id: 1,
    title: "Web Development Workshop",
    date: "April 25, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Tech Building, Room 101",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Learn the fundamentals of modern web development with hands-on coding exercises. This workshop will cover HTML5, CSS3, and JavaScript.",
    tags: ["Web Dev", "Beginner"]
  },
  {
    id: 2,
    title: "AI & Machine Learning Hackathon",
    date: "May 10, 2025",
    time: "9:00 AM - 9:00 AM (next day)",
    location: "Innovation Center",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    description: "Build innovative solutions using AI and ML technologies in this 24-hour coding challenge. Prizes for top teams!",
    tags: ["AI/ML", "Hackathon", "Advanced"]
  },
  {
    id: 3,
    title: "Mobile App Development Series",
    date: "May 15-16, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Building, Room 203",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "A two-day workshop on building cross-platform mobile applications. Learn React Native from industry experts.",
    tags: ["Mobile Dev", "React Native", "Intermediate"]
  },
  {
    id: 4,
    title: "Cybersecurity Workshop",
    date: "May 22, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "Virtual Event",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "Learn about common security threats and how to protect against them. Includes hands-on exercises in a safe environment.",
    tags: ["Security", "Intermediate"]
  }
];

const pastEvents = [
  {
    id: 5,
    title: "MERN Stack Development Workshop",
    date: "March 10, 2025",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description: `The AMURA Technical Club at RNS Institute of Technology organized a four-day hands-on workshop 
    on Full Stack Web Development using the MERN stack for second-year students. Covering HTML, CSS, JavaScript, 
    Node.js, Express.js, and MongoDB, the workshop provided practical experience in building web applications, 
    creating RESTful APIs, managing databases, and implementing secure user authentication. Students gained essential 
    skills to build real-world web projects and enhance their industry readiness.`,
    tags: ["Full Stack Dev", "Intermediate"],
    
  },
  {
    id: 6,
    title: "Mobile App Development Bootcamp",
    date: "August 08-18, 2025",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    description: "A comprehensive bootcamp covering the essentials of mobile app development using Flutter and Dart.",
    tags: ["Flutter", "Dart", "Intermediate"]
  }
];

// Combine events from both upcoming and past
const allEvents = [...upcomingEvents, ...pastEvents];

export default function EventsDetails() {
  const { event } = useParams();
  const eventId = parseInt(event, 10);
  const selectedEvent = allEvents.find(ev => ev.id === eventId);

  if (!selectedEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <p>No event found with the specified ID.</p>
        <Link to="/events" className="text-amura-purple hover:text-amura-purple-dark">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden">
        <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{selectedEvent.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">Date:</span> {selectedEvent.date}
          </div>
          {selectedEvent.time && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-medium">Time:</span> {selectedEvent.time}
            </div>
          )}
          {selectedEvent.location && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="font-medium">Location:</span> {selectedEvent.location}
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300">{selectedEvent.description}</p>
          
        </div>
      </div>
      <div className="mt-6">
        <Link to="/events" className="text-amura-purple hover:text-amura-purple-dark font-medium">
          Back to Events
        </Link>
      </div>
    </div>
  );
}