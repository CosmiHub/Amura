
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for events
const upcomingEvents = [
  // {
  //   id: 1,
  //   title: "Web Development Workshop",
  //   date: "April 25, 2025",
  //   time: "10:00 AM - 4:00 PM",
  //   location: "Tech Building, Room 101",
  //   image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  //   description: "Learn the fundamentals of modern web development with hands-on coding exercises. This workshop will cover HTML5, CSS3, and JavaScript.",
  //   tags: ["Web Dev", "Beginner"]
  // },
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
  // {
  //   id: 3,
  //   title: "Mobile App Development Series",
  //   date: "May 15-16, 2025",
  //   time: "2:00 PM - 5:00 PM",
  //   location: "Tech Building, Room 203",
  //   image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  //   description: "A two-day workshop on building cross-platform mobile applications. Learn React Native from industry experts.",
  //   tags: ["Mobile Dev", "React Native", "Intermediate"]
  // },
  // {
  //   id: 4,
  //   title: "Cybersecurity Workshop",
  //   date: "May 22, 2025",
  //   time: "11:00 AM - 3:00 PM",
  //   location: "Virtual Event",
  //   image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  //   description: "Learn about common security threats and how to protect against them. Includes hands-on exercises in a safe environment.",
  //   tags: ["Security", "Intermediate"]
  // }
];

const pastEvents = [
  {
    id: 5,
    title: "MERN Stack Development Workshop",
    date: "March 10, 2025",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description: "One-day intensive workshop on building full-stack applications using MongoDB, Express.js, React, and Node.js.",
    tags: ["Full StacK Dev", "Intermediate"]
  },
  {
    id: 6,
    title: "Mobile App Development Bootcamp",
    date: "August 08-18, 2025",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    description: "A comprehensive bootcamp covering the essentials of mobile app development using Flutter and Dart.",
    tags: ["Flutter", "Dart", "Intermediate"]
  },
  // {
  //   id: 7,
  //   title: "Blockchain Technology Workshop",
  //   date: "January 25, 2025",
  //   image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  //   description: "Learn about blockchain technology, cryptocurrencies, and develop a simple blockchain application.",
  //   tags: ["Blockchain", "Advanced"]
  // },
  // {
  //   id: 8,
  //   title: "UX/UI Design Fundamentals",
  //   date: "January 10, 2025",
  //   image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  //   description: "Introduction to user experience and interface design principles with practical Figma exercises.",
  //   tags: ["Design", "Beginner"]
  // }
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="bg-amura-purple text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Events & Workshops</h1>
          <p className="mt-2 text-xl">Discover our upcoming and past technical events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card card-hover">
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-amura-purple-light text-amura-purple dark:bg-amura-purple-dark dark:text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span className="font-medium">Date:</span> {event.date}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span className="font-medium">Time:</span> {event.time}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                    <div className="flex justify-between">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-amura-purple hover:text-amura-purple-dark font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/register?event=${event.id}`}
                        className="btn-primary py-2 px-4"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card card-hover">
                  <div className="h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-amura-purple-light text-amura-purple dark:bg-amura-purple-dark dark:text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="font-medium">Date:</span> {event.date}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-amura-purple hover:text-amura-purple-dark font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
