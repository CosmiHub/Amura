
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<EventInsert>({
    title: "",
    date: "",
    max_participants: 50,
    status: "active",
    description: "",
    location: "",
    image_url: null,
    is_hackathon: false,
    hackathon_type: null,
    team_min_size: 1,
    team_max_size: 5,
    allow_team_registration: false,
    team_leader_preregistration: false,
    tracks: [],
  });
  const [newTrack, setNewTrack] = useState("");

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
        image_url: event.image_url || null,
        is_hackathon: event.is_hackathon || false,
        hackathon_type: event.hackathon_type || null,
        team_min_size: event.team_min_size || 1,
        team_max_size: event.team_max_size || 5,
        allow_team_registration: event.allow_team_registration || false,
        team_leader_preregistration: event.team_leader_preregistration || false,
        tracks: (event as any).tracks || [],
      });
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
      setImageFile(null);
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
        image_url: null,
        is_hackathon: false,
        hackathon_type: null,
        team_min_size: 1,
        team_max_size: 5,
        allow_team_registration: false,
        team_leader_preregistration: false,
        tracks: [],
      });
      setNewTrack("");
      setImageFile(null);
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: 
          name === "max_participants" || name === "team_min_size" || name === "team_max_size"
            ? Number(value)
            : value,
      }));
    }
  };

  const addTrack = () => {
    if (newTrack.trim()) {
      setForm(prev => ({
        ...prev,
        tracks: [...((prev as any).tracks || []), newTrack.trim()]
      }));
      setNewTrack("");
    }
  };

  const removeTrack = (index: number) => {
    setForm(prev => ({
      ...prev,
      tracks: ((prev as any).tracks || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image_url: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image_url;

      // Upload image if a new file was selected
      if (imageFile) {
        const fileName = `event-${Date.now()}-${imageFile.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const submitForm = { ...form, image_url: imageUrl };

      if (isEdit && editingEventId) {
        const { error } = await supabase
          .from("events")
          .update(submitForm as EventUpdate)
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
        const { error } = await supabase.from("events").insert(submitForm);
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

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
          <div className="bg-amura-purple px-6 py-4 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {isEdit ? "Edit Event Details" : "Create New Event"}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <form id="event-form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info Column */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Event Details</label>
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Event Name</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Spark Hackathon 2024"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Status</label>
                        <select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Max Registrations</label>
                        <input
                          type="number"
                          name="max_participants"
                          min={1}
                          value={form.max_participants}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={form.location || ""}
                          onChange={handleChange}
                          placeholder="e.g., Seminar Hall"
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Description</label>
                      <textarea
                        name="description"
                        value={form.description || ""}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell participants what this event is about..."
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Media & Settings Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Visual & Hackathon Settings</label>
                  <div className="pt-1">
                    <label className="block text-xs font-medium mb-2 text-gray-500 uppercase">Event Banner</label>
                    {imagePreview ? (
                      <div className="relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 dark:bg-gray-900/30 group hover:border-amura-purple transition-colors">
                        <Plus className="mb-2 opacity-50 group-hover:text-amura-purple" size={24} />
                        <span className="text-xs uppercase font-semibold">Click to select image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-3 w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amura-purple/10 file:text-amura-purple hover:file:bg-amura-purple/20 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-3 cursor-pointer group mb-4">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="is_hackathon"
                        checked={form.is_hackathon || false}
                        onChange={handleChange}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 transition-all checked:bg-amura-purple checked:border-amura-purple"
                      />
                      <Plus className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-amura-purple transition-colors">Hackathon Event Configuration</span>
                  </label>

                  {form.is_hackathon && (
                    <div className="space-y-5 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Hackathon Type</label>
                        <select
                          name="hackathon_type"
                          value={form.hackathon_type || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-amura-purple"
                        >
                          <option value="">Select Type</option>
                          <option value="competitive">Competitive</option>
                          <option value="learning">Learning</option>
                          <option value="collaborative">Collaborative</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Min Team</label>
                          <input
                            type="number"
                            name="team_min_size"
                            value={form.team_min_size || 1}
                            onChange={handleChange}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-amura-purple"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-500 uppercase">Max Team</label>
                          <input
                            type="number"
                            name="team_max_size"
                            value={form.team_max_size || 5}
                            onChange={handleChange}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-amura-purple"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-medium text-gray-500 uppercase">Problem Statements / Tracks</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTrack}
                            onChange={(e) => setNewTrack(e.target.value)}
                            placeholder="e.g., HealthTech"
                            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-amura-purple"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrack())}
                          />
                          <button 
                            type="button" 
                            onClick={addTrack} 
                            className="bg-amura-purple text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amura-purple-dark transition-colors shadow-sm shadow-amura-purple/20"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {((form as any).tracks || []).map((track: string, index: number) => (
                            <div key={index} className="bg-amura-purple/10 text-amura-purple border border-amura-purple/20 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 group animate-in zoom-in-75 duration-200">
                              {track}
                              <button type="button" onClick={() => removeTrack(index)} className="hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-all">
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-8 mt-4 border-t border-gray-100 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleClose} className="rounded-full px-6 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                Cancel
              </Button>
              <Button type="submit" className="rounded-full px-8 bg-amura-purple text-white hover:bg-amura-purple-dark shadow-lg shadow-amura-purple/30 transition-all transform active:scale-95">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {isEdit ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
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
