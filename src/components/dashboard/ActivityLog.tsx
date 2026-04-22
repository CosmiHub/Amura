import { useState, useEffect } from "react";
import { FilePlus, UserPlus, Upload, History, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const ActivityLog = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "event_registration":
        return <UserPlus size={14} className="text-green-600 dark:text-green-400" />;
      case "event_creation":
        return <FilePlus size={14} className="text-blue-600 dark:text-blue-400" />;
      case "certificate_issue":
        return <Upload size={14} className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Info size={14} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "event_registration":
        return "bg-green-100 dark:bg-green-900";
      case "event_creation":
        return "bg-blue-100 dark:bg-blue-900";
      case "certificate_issue":
        return "bg-purple-100 dark:bg-purple-900";
      default:
        return "bg-gray-100 dark:bg-gray-900";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading activities...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activities found.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex">
                <div className="mr-4">
                  <div className={`h-8 w-8 rounded-full ${getBgColor(log.activity_type)} flex items-center justify-center`}>
                    {getIcon(log.activity_type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">{log.activity_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-gray-500">{log.description}</p>
                  <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
