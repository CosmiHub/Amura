
import { TimeLine, TimeLineItem } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Users, Code, Lightbulb, Newspaper } from "lucide-react";

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Celebrating our milestones, awards, and notable accomplishments
          </p>
        </div>

        {/* Featured Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-amura-purple to-amura-purple-dark text-white shadow-lg">
            <CardContent className="pt-6 flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white/20">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">5+</h3>
                <p>Awards Won</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amura-blue to-amura-blue-light text-white shadow-lg">
            <CardContent className="pt-6 flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">500+</h3>
                <p>Students Engaged</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-700 to-purple-500 text-white shadow-lg">
            <CardContent className="pt-6 flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white/20">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">6+</h3>
                <p>Projects Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Our Journey</h2>

          <TimeLine className="max-w-3xl mx-auto">
            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">April, 2026</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Luminus Tech Fest 2026</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Helped in successful conduction of Reverse Image Prompting, Turing Test and Solaris-x in Luminus tech fest 2026.
                </p>
                {/* <div className="mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                    alt="Hackathon Win"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div> */}
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">Aug, 2025</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Idea-Forge 2025, Summer Internship Hackathon</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Organized Idea-Forge 2025, a hackathon that brought together students to showcase their innovative ideas.
                </p>
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">Dec, 2025</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">AI Celerate 2.0</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Organized AI Celerate 2.0, Workshop on Image Processing/prompting that gave insights to the students about the latest trends in AI.
                </p>
                <div className="mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                    alt="Open Source Recognition"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">Aug, 2025</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Flutter and Dart Hackathon</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Organized Flutter and Dart Hackathon, a hackathon that gave insights to the students about the latest trends in Flutter and Dart.
                </p>
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">April, 2025</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">MERN workshop</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Organized MERN workshop, a workshop that gave insights to the students about the latest trends in MERN.
                </p>
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">Dec, 2024</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">AI-CELERATE 1.0</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Organized AI-CELERATE 1.0, 2-Day Skill Development Programme on Python, Image Processing and Prompt engineering.
                </p>
              </div>
            </TimeLineItem>

            <TimeLineItem>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card ml-6">
                <div className="flex items-center mb-2">
                  <Badge className="bg-amura-purple text-white">2024</Badge>
                  <h3 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">AMURA Club Founded</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  AMURA Technical Club was established with the mission to foster technological innovation and collaboration among students.
                </p>
                <div className="mt-4">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                    alt="Club Founding"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              </div>
            </TimeLineItem>
          </TimeLine>
        </div>

        {/* 
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Notable Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amura-purple-light mr-3">
                    <Lightbulb className="h-5 w-5 text-amura-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Campus App</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  A mobile application that helps students navigate campus, check class schedules, and receive important notifications.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">React Native</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">Firebase</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">Node.js</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amura-purple-light mr-3">
                    <Lightbulb className="h-5 w-5 text-amura-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Study Assistant</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  An AI-powered web application that helps students organize study materials and generate practice questions.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">Python</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">TensorFlow</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">React</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amura-purple-light mr-3">
                    <Lightbulb className="h-5 w-5 text-amura-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Eco-Tracking System</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  An IoT-based system to monitor and optimize energy usage across campus buildings, reducing carbon footprint.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">Arduino</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">IoT</Badge>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">Cloud</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        */}

        {/* 
        <div>
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Media Coverage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amura-purple-light mr-3">
                    <Newspaper className="h-5 w-5 text-amura-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tech Chronicle</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "AMURA's innovative approach to technical education is setting new standards for university clubs across the country."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Featured in April 2024 Edition
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amura-purple-light mr-3">
                    <Newspaper className="h-5 w-5 text-amura-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Digital Innovators Magazine</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "The student-led projects coming out of AMURA are tackling real-world problems with sophisticated technical solutions."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  March 2024 Special Feature
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
