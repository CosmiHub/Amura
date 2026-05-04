import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Registration = Database["public"]["Tables"]["registrations"]["Insert"];

interface EventRegistrationProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  eventTitle,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<Database["public"]["Tables"]["events"]["Row"] | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [form, setForm] = useState<Registration>({
    name: "",
    email: "",
    usn: "",
    department: "",
    year: "",
    event_id: eventId,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Electrical",
    "Civil",
    "Information Science",
    "Other",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleOpen = async () => {
    setOpen(true);
    setMessage(null);
    setLoading(true);
    
    // Fetch latest event data and registration count
    try {
      const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
        
      if (event) setEventData(event);
      
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);
        
      setCurrentCount(count || 0);
    } catch (err) {
      console.error("Error fetching event status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setForm({
      name: "",
      email: "",
      usn: "",
      department: "",
      year: "",
      event_id: eventId,
    });
    setMessage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Final capacity check
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);
      
      if (eventData?.max_participants && (count || 0) >= eventData.max_participants) {
        setMessage({ type: "error", text: "Sorry, this event is already full!" });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("registrations").insert(form);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Successfully registered for the event!",
        });
        setTimeout(() => {
          handleClose();
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while registering. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="bg-amura-purple text-white hover:bg-amura-purple-dark"
      >
        Register Now
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for {eventTitle}</DialogTitle>
          </DialogHeader>
          
          <div className="py-2">
            {eventData?.max_participants && currentCount >= eventData.max_participants && !message && (
              <div className="p-3 rounded mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                This event has reached its maximum capacity. You can no longer register.
              </div>
            )}

            {eventData?.status !== "active" && !message && (
              <div className="p-3 rounded mb-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Registrations for this event are currently closed.
              </div>
            )}

            {message && (
              <div
                className={`p-3 rounded mb-4 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form id="registration-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  USN (University Serial Number)
                </label>
                <input
                  type="text"
                  name="usn"
                  value={form.usn}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1RN21CS001"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amura-purple focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="registration-form"
              className="bg-amura-purple text-white hover:bg-amura-purple-dark"
              disabled={loading || (!!eventData?.max_participants && currentCount >= eventData.max_participants) || eventData?.status !== "active"}
            >
              {loading ? "Processing..." : (eventData?.status !== "active" ? "Registrations Closed" : (eventData?.max_participants && currentCount >= eventData.max_participants ? "Registration Full" : "Submit Registration"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
