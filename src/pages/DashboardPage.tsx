
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Calendar, Users, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { EventManagement } from "@/components/dashboard/EventManagement";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { useState } from "react";

export default function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Strict check for admin access
    if (!user) {
      console.log("Access denied to dashboard: no user found");
      toast({
        title: "Access Denied",
        description: "You need to log in with administrator privileges to access this page.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!isAdmin()) {
      console.log("Access denied to dashboard: user not admin", { user });
      toast({
        title: "Access Denied",
        description: "You need administrator privileges to access this page.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    console.log("Admin access granted to dashboard");
  }, [user, isAdmin, navigate]);

  // If not admin, show nothing during redirect
  if (!user || !isAdmin()) {
    return null;
  }

  const handleLogout = () => {
    signOut().then(() => {
      navigate("/auth");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        <div className="w-64 h-screen sticky top-0 bg-white dark:bg-gray-800 shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-xl font-bold text-amura-purple">AMURA Admin</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Logged in as {('username' in user) ? user.username : user.email}
            </p>
          </div>
          
          <div className="mt-4">
            <nav className="px-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "overview"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard Overview
              </button>
              
              <button
                onClick={() => setActiveTab("events")}
                className={`w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "events"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Events Management
              </button>
              
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "users"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                User Management
              </button>
              
              <button
                onClick={() => setActiveTab("teams")}
                className={`w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "teams"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Hackathon Teams
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "settings"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </button>
              
              <div className="mt-8 px-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        </div>
        
        <div className="flex-1 p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with AMURA Technical Club.
            </p>
          </div>
          
          <div className="md:hidden mb-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview">
                  <LayoutDashboard className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="teams">
                  <Users className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <DashboardStats />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Registration Trend</CardTitle>
                      <CardDescription>New registrations over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <BarChart3 size={120} className="text-gray-300" />
                        <p className="text-sm text-gray-500">Chart visualization goes here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <ActivityLog />
                </div>
              </>
            )}
            
            {activeTab === "events" && <EventManagement />}
            
            {activeTab === "users" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Welcome, {('username' in user) ? user.username : 'Administrator'}</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    This is your administration dashboard. Here you can manage events, users, and site content.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Events Management</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage upcoming and past events, registrations, and certificates.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">User Management</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage user accounts, permissions, and access control.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "teams" && <TeamManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
