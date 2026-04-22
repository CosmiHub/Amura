
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Eye } from "lucide-react";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState<any[]>([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [form, setForm] = useState<EventInsert>({
    title: "",
    date: "",
    max_participants: 50,
    status: "active",
    description: "",
    location: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (!error && data) {
      setEvents(data);
      fetchRegistrationCounts(data);
    }
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
    setRegistrationCounts(counts);
  };

  const handleOpen = (event?: Event) => {
    if (event) {
      setIsEdit(true);
      setEditingEventId(event.id);
      setForm({
        title: event.title,
        date: event.date.split('T')[0], // Ensure date format is YYYY-MM-DD for input
        max_participants: event.max_participants || 50,
        status: event.status || "active",
        description: event.description || "",
        location: event.location || "",
      });
    } else {
      setIsEdit(false);
      setEditingEventId(null);
      setForm({
        title: "",
        date: "",
        max_participants: 50,
        status: "active",
        description: "",
        location: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_participants" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && editingEventId) {
        const { error } = await supabase
          .from("events")
          .update(form as EventUpdate)
          .eq("id", editingEventId);
        
        if (error) throw error;
        toast({
          title: "Event updated",
          description: "The event has been successfully updated.",
        });

        await supabase.from("activity_logs").insert({
          activity_type: "event_update",
          description: `Updated event: ${form.title}`,
        });
      } else {
        const { error } = await supabase.from("events").insert(form);
        if (error) throw error;
        toast({
          title: "Event created",
          description: "New event has been successfully created.",
        });

        await supabase.from("activity_logs").insert({
          activity_type: "event_creation",
          description: `Created new event: ${form.title}`,
        });
      }
      fetchEvents();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also delete all registrations and certificates associated with it.")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Event deleted",
        description: "The event has been deleted.",
      });

      await supabase.from("activity_logs").insert({
        activity_type: "event_deletion",
        description: `Deleted an event`,
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRegistrations = async (event: Event) => {
    setLoading(true);
    setSelectedEventTitle(event.title);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", event.id);
    
    if (!error && data) {
      setViewingRegistrations(data);
      setShowRegistrations(true);
    } else if (error) {
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-amura-purple text-amura-purple hover:bg-amura-purple hover:text-white"
          onClick={() => handleOpen()}
        >
          <Plus size={16} /> Add New Event
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <form id="event-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Event Name</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Max Registrations</label>
              <input
                type="number"
                name="max_participants"
                min={1}
                value={form.max_participants}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} className="border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</Button>
            <Button type="submit" form="event-form" className="bg-amura-purple text-white hover:bg-amura-purple-dark" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              {isEdit ? "Save Changes" : "Save Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRegistrations} onOpenChange={setShowRegistrations}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrations for {selectedEventTitle}</DialogTitle>
          </DialogHeader>
          {viewingRegistrations.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No registrations yet for this event.</p>
          ) : (
            <div className="overflow-auto max-h-[60vh] border rounded-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">USN</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {viewingRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{reg.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{reg.usn}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{reg.department}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{reg.year}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{reg.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowRegistrations(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registrations</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No events found</td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{event.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{registrationCounts[event.id] || 0} / {event.max_participants || 50}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                          {event.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700" onClick={() => handleViewRegistrations(event)}>
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-amura-purple hover:text-amura-purple-dark ml-2" onClick={() => handleOpen(event)}>
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 ml-2" onClick={() => handleDelete(event.id)}>
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
