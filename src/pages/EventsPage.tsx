
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data: upcoming, error: upcomingError } = await supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true });

    const { data: past, error: pastError } = await supabase
      .from("events")
      .select("*")
      .lt("date", today)
      .order("date", { ascending: false });

    if (upcomingError || pastError) {
      console.error("Error fetching events:", upcomingError || pastError);
    }

    if (upcoming) {
      setUpcomingEvents(upcoming);
      fetchRegistrationCounts(upcoming);
    }
    if (past) setPastEvents(past);
    setLoading(false);
  };

  const fetchRegistrationCounts = async (eventsList: Event[]) => {
    const counts: Record<string, number> = {};
    for (const event of eventsList) {
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event.id);
      counts[event.id] = count || 0;
    }
    setRegistrationCounts((prev) => ({ ...prev, ...counts }));
  };

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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No upcoming events at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card card-hover">
                    {event.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.location && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="font-medium">Location:</span> {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-amura-purple hover:text-amura-purple-dark font-medium"
                        >
                          View Details
                        </Link>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[10px] text-gray-500">
                            {registrationCounts[event.id] || 0} / {event.max_participants || 50} filled
                          </div>
                          {event.max_participants && (registrationCounts[event.id] || 0) >= event.max_participants ? (
                            <Badge variant="outline" className="text-red-500 border-red-500 bg-red-50 py-0 h-6">Full</Badge>
                          ) : (
                            <Link
                              to={`/register?event=${event.id}`}
                              className="bg-amura-purple text-white hover:bg-amura-purple-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              Register Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No past events</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card card-hover">
                    {event.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                      )}
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
