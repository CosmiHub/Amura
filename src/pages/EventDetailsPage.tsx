
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
    }
  }, [id]);

  const fetchEventDetails = async (eventId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setEvent(data);

      const { count, error: countError } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);

      if (!countError) {
        setRegistrationCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <Loader2 className="h-10 w-10 animate-spin text-amura-purple" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Event not found</h2>
        <Link to="/events" className="inline-flex items-center bg-amura-purple text-white px-4 py-2 rounded-md hover:bg-amura-purple-dark transition-colors">
          <ArrowLeft className="mr-2" size={18} /> Back to Events
        </Link>
      </div>
    );
  }

  const isFull = event.max_participants ? registrationCount >= event.max_participants : false;
  const eventDate = new Date(event.date);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="inline-flex items-center text-amura-purple hover:text-amura-purple-dark mb-6 font-medium transition-colors">
          <ArrowLeft className="mr-2" size={18} /> Back to Events
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in transition-all">
          {event.image_url && (
            <div className="h-64 md:h-96 w-full overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-amura-purple text-white px-3 py-1">
                {eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </Badge>
              <Badge variant="outline" className={event.status === 'active' ? 'text-green-600 border-green-600 bg-green-50' : 'text-gray-600 border-gray-600 bg-gray-50'}>
                {event.status === 'active' ? 'Upcoming' : 'Past'}
              </Badge>
              {isFull && <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">Full</Badge>}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-amura-purple" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date & Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {eventDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-amura-blue" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.location || "Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Capacity</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {registrationCount} / {event.max_participants || 50} filled
                  </p>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Event</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided for this event."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {isFull ? (
                <Button disabled className="w-full sm:w-auto px-10 py-6 text-lg rounded-xl opacity-60">
                  Registration Full
                </Button>
              ) : (
                <Link to={`/register?event=${event.id}`} className="w-full sm:w-auto">
                  <Button className="w-full bg-amura-purple hover:bg-amura-purple-dark text-white px-10 py-6 text-lg rounded-xl transition-all">
                    Register for Event
                  </Button>
                </Link>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registration is free for all members
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
