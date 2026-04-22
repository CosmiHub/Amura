import { useState, useEffect } from "react";
import { Users, Calendar, Award, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    certificates: 0,
    registrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch total profiles (members)
      const { count: membersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      // Fetch total active events
      const { count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      
      // Fetch total certificates issued
      const { count: certsCount } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true });
      
      // Fetch total registrations
      const { count: regsCount } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });
      
      setStats({
        members: membersCount || 0,
        events: eventsCount || 0,
        certificates: certsCount || 0,
        registrations: regsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amura-purple-light">
            <Users className="h-6 w-6 text-amura-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "..." : stats.members}</h3>
            <p className="text-xs text-green-600">Registered on platform</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amura-purple-light">
            <Calendar className="h-6 w-6 text-amura-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Events</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "..." : stats.events}</h3>
            <p className="text-xs text-gray-500">Live for registration</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amura-purple-light">
            <Award className="h-6 w-6 text-amura-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates Issued</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "..." : stats.certificates}</h3>
            <p className="text-xs text-gray-500">Total processed</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amura-purple-light">
            <ListChecks className="h-6 w-6 text-amura-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Registrations</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "..." : stats.registrations}</h3>
            <p className="text-xs text-green-600">Across all events</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
