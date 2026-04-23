
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// Team member type
type TeamMember = {
  name: string;
  role: string;
  image: string;
  department: string;
  bio: string;
  skills: string[];
  social: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
};

// Core team data
const coreTeam: TeamMember[] = [
  {
    name: "Prarthana Nagraj",
    role: "Head",
    image: "/assets/prarthana.png",
    department: "CSE(AI & ML)",
    bio: "Prarthana leads the AMURA technical club with a vision to create a vibrant tech community. She specializes in AI and has worked on several research projects.",
    skills: ["AI/ML", "Leadership", "Project Management", "Python"],
    social: {
      linkedin: "https://www.linkedin.com/in/prarthana-nagaraj-150846290?",
      github: "https://github.com/prarthananagraj",
      email: "prarthananagraj23aiml@rnsit.ac.in"
    }
  },
  {
    name: "Karthik K",
    role: "Head",
    image: "/assets/karthik.jpeg",
    department: "CSE(AI & ML)",
    bio: "Karthik  oversees event coordination and member development. He's passionate about web technologies and has led multiple events.",
    skills: ["Frontend Development", "Event Management", "JavaScript", "React"],
    social: {
      linkedin: "https://www.linkedin.com/in/karthik-k-3b4909326?",
      github: "https://github.com/Karthikrishna05",
      email: "karthikk23aiml@rnsit.ac.in"
    }
  },
  {
    name: "Sumit Raj",
    role: "Technical Head",
    image: "/assets/sumit.png",
    department: "CSE(AI & ML)",
    bio: "Sumit manages the technical aspects of all club projects. He's an experienced full-stack developer with expertise in cloud architecture.",
    skills: ["Full Stack", "Cloud Computing", "DevOps", "AI"],
    social: {
      linkedin: "https://www.linkedin.com/in/sumit-raj-7134002a3/",
      github: "https://github.com/sumits-cosmos",
      email: "uvcosmos2@gmail.com"
    }
  },
  {
    name: "Varsheta Ganesh",
    role: "Events Coordinator",
    image: "/assets/varsheta.jpeg",
    department: "CSE(AI & ML)",
    bio: "Varsheta plans and coordinates all club events, workshops and hackathons. She specializes in IoT and web development.",
    skills: ["Event Planning", "IoT", "Web development", "Public Speaking"],
    social: {
      linkedin: "https://www.linkedin.com/in/varsheta-ganesh-5890032a7?",
      github: "https://github.com/varshetaganesh",
      email: "varshetaganesh23aiml@rnsit.ac.in"
    }
  },
  {
    name: "Suhana Vijay ",
    role: "Marketing Lead",
    image: "/assets/suhana.jpeg",
    department: "CSE(AI & ML)",
    bio: "Suhana handles all promotional activities and social media presence for the club. She's also skilled in UI/UX design.",
    skills: ["Digital Marketing", "UI/UX Design", "Content Creation", "Figma"],
    social: {
      linkedin: "https://www.linkedin.com/in/suhana-vijay-109019274?",
      github: "https://github.com/Suhana-Vijay",
      email: "suhanavijay24aiml@rnsit.ac.in"
    }
  },
  {
    name: "S Ujjwal Gowda",
    role: "Technical Lead",
    image: "/assets/ujjwal.png",
    department: "CSE(AI & ML)",
    bio: "Ujjwal manages administrative tasks and documentation. He's passionate about AIML and has organized several workshops.",
    skills: ["AIML", "Web development", "Public speaking", "Python"],
    social: {
      linkedin: "https://www.linkedin.com/in/s-ujjwal-gowda",
      github: "https://github.com/ujjwal1509",
      email: "sujjwalgowda23aiml@rnsit.ac.in"
    }
  }
];

// Faculty advisors
const facultyAdvisors = [
  {
    name: "Dr. Rama Satish K V",
    role: "Faculty Advisor",
    image: "/assets/ramasatish.jpeg",
    department: "CSE(AI & ML)",
    bio: "Dr. Rama Satish K V provides guidance and mentorship to the club. His research interests include AIML and   IoT.",
    skills: ["AIML", "IoT", "Research", "Mentoring"],
    social: {
      linkedin: "https://www.linkedin.com/in/dr-rama-satish-k-v-aiml/",
      email: "ramasatish.kv@rnsit.ac.in"
    }
  },
  {
    name: "Prof. Seema G S",
    role: "Faculty Co-Advisor",
    image: "/assets/seema.png",
    department: "CSE(AI & ML)",
    bio: "Prof. Seema G S assists the club with industry connections and project guidance. She specializes in AI and data science.",
    skills: ["ML", "Python", "C", "Academic Research"],
    social: {
      linkedin: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav",
      email: "seema.gs@rnsit.ac.in"
    }
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">About Us</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the passionate team behind AMURA Technical Club
          </p>
        </div>

        {/* About the club */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Story</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                AMURA Technical Club was founded in 2024 by a group of passionate students who wanted to create a community where technology enthusiasts could learn, collaborate, and innovate together. What began as informal meetups quickly evolved into a structured organization that now hosts workshops, hackathons, and industry talks.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our club's name, AMURA, represents our core values: Ambition, Mastery, Unity, Resilience, and Achievement. We believe that technology is most powerful when it's collaborative, inclusive, and focused on solving real-world problems.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Today, AMURA has grown to over 50 active members. We pride ourselves on bridging the gap between academic learning and industry requirements, giving our members the skills and experiences they need to thrive in the tech industry.
              </p>

              <div className="mt-6">
                <Button className="btn-primary">Join Our Community</Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                alt="AMURA Team"
                className="rounded-lg shadow-md w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Core Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Core Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeam.map((member) => (
              <Card key={member.name} className="shadow-card overflow-hidden card-hover">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-amura-purple font-medium">{member.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{member.department}</p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amura-purple">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amura-purple">
                        <Github size={20} />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="text-gray-500 hover:text-amura-purple">
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Faculty Advisors */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Faculty Advisors</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {facultyAdvisors.map((advisor) => (
              <Card key={advisor.name} className="shadow-card overflow-hidden card-hover">
                <div className="h-64 overflow-hidden">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-fit h-fit object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{advisor.name}</h3>
                  <p className="text-amura-purple font-medium">{advisor.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{advisor.department}</p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{advisor.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {advisor.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {advisor.social.linkedin && (
                      <a href={advisor.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amura-purple">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {advisor.social.email && (
                      <a href={`mailto:${advisor.social.email}`} className="text-gray-500 hover:text-amura-purple">
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}