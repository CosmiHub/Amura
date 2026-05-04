import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm } from "@/components/register/RegisterForm";
import { toast } from "@/components/ui/use-toast";

type Event = {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  [key: string]: unknown;
};

export default function RegisterPage() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Check if the user is authenticated
  const authenticated = !!user;
  // Check if the user is an admin
  const userIsAdmin = isAdmin();

  useEffect(() => {
    console.log("User auth state:", { authenticated, userIsAdmin });
  }, [user, authenticated, userIsAdmin]);

  useEffect(() => {
    // Fetch events from Supabase
    async function fetchEvents() {
      setEventsLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, date, description, status")
          .eq("status", "active")
          .order("date", { ascending: false });

        if (error) {
          throw error;
        }

        setEvents(data ?? []);
      } catch (error: any) {
        console.error("Error fetching events:", error);
        toast({
          title: "Failed to Load Events",
          description: "Please refresh the page or try again later.",
          variant: "destructive",
        });
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Register for an Event
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            Join our workshops and events by filling out the form below
          </p>
        </div>

        <RegisterForm
          user={user}
          authenticated={authenticated}
          userIsAdmin={userIsAdmin}
          events={events}
          eventsLoading={eventsLoading}
        />
      </div>
      <Toaster />
    </div>
  );
}
