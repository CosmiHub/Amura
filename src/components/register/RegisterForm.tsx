
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInputs } from "./FormInputs";
import { HackathonRegistration } from "./HackathonRegistration";
import { User } from "@supabase/supabase-js";

type FormData = {
  name: string;
  usn: string;
  email: string;
  department: string;
  year: string;
  eventId: string;
};

type FormErrors = {
  name: string;
  usn: string;
  email: string;
  department: string;
  year: string;
  eventId: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  [key: string]: unknown;
};

interface RegisterFormProps {
  user: User | null;
  authenticated: boolean;
  userIsAdmin: boolean;
  events: Event[];
  eventsLoading: boolean;
}

export function RegisterForm({ user, authenticated, userIsAdmin, events, eventsLoading }: RegisterFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get("event") || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    usn: "",
    email: user?.email || "",
    department: "",
    year: "",
    eventId: initialEventId,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    usn: "",
    email: "",
    department: "",
    year: "",
    eventId: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState<Event | null>(null);
  const [selectedEventCount, setSelectedEventCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const [isHackathonEvent, setIsHackathonEvent] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    if (formData.eventId) {
      fetchEventDetails(formData.eventId);
    }
  }, [formData.eventId]);

  const fetchEventDetails = async (id: string) => {
    setCountLoading(true);
    try {
      const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (event) {
        setSelectedEventData(event as any);
        setIsHackathonEvent(event.is_hackathon || false);
      }

      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", id);

      setSelectedEventCount(count || 0);

      // Check if user is already registered
      if (user?.id) {
        const { data: existingReg } = await supabase
          .from("registrations")
          .select("id")
          .eq("event_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        setAlreadyRegistered(!!existingReg);
      } else {
        setAlreadyRegistered(false);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setCountLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.usn.trim()) {
      newErrors.usn = "USN is required";
      valid = false;
    } else if (
      !/^\d{1}\w{2}\d{2}\w{2}\d{3}$/i.test(formData.usn.trim())
    ) {
      newErrors.usn = "USN format not valid";
      valid = false;
    } else {
      newErrors.usn = "";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Email format not valid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
      valid = false;
    } else {
      newErrors.department = "";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
      valid = false;
    } else {
      newErrors.year = "";
    }

    if (!formData.eventId) {
      newErrors.eventId = "Event selection is required";
      valid = false;
    } else {
      newErrors.eventId = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formLoading) return;
    if (!validateForm()) return;

    // Check authentication
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in before registering for events.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setFormLoading(true);

    try {
      // Check capacity again
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", formData.eventId);

      if (selectedEventData?.max_participants && (count || 0) >= (selectedEventData.max_participants as number)) {
        toast({
          title: "Registration Failed",
          description: "Sorry, this event has reached its maximum capacity.",
          variant: "destructive",
        });
        setFormLoading(false);
        return;
      }

      const userId = user?.id;

      console.log("Submitting registration with user ID:", userId);

      // Insert registration in Supabase
      const { error } = await supabase.from("registrations").insert([
        {
          event_id: formData.eventId,
          user_id: userId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          usn: formData.usn.trim().toUpperCase(),
          department: formData.department,
          year: formData.year,
          registration_mode: "individual",
        },
      ]);

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }

      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the event.",
      });

      // Log this activity
      await supabase.from("activity_logs").insert([
        {
          user_id: userId,
          activity_type: "event_registration",
          description: `Registered for event`,
        },
      ]);

      setFormData({
        name: "",
        usn: "",
        email: user?.email || "",
        department: "",
        year: "",
        eventId: "",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error.message ??
          "Could not register. You may already be registered or there is a server error.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {!authenticated && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please <Button variant="link" onClick={() => navigate("/auth")} className="p-0">log in</Button> to register for events.
          </AlertDescription>
        </Alert>
      )}
      {/* Show Hackathon Registration if event is hackathon */}
      {isHackathonEvent && selectedEventData && !alreadyRegistered && (
        <HackathonRegistration
          eventId={formData.eventId}
          teamMinSize={selectedEventData.team_min_size}
          teamMaxSize={selectedEventData.team_max_size}
          initialData={{
            name: formData.name,
            usn: formData.usn,
            department: formData.department,
            year: formData.year,
          }}
          onSuccess={() => {
            toast({
              title: "Success!",
              description: "Your hackathon registration is complete.",
            });
            // Reset to event selection
            setFormData({
              name: "",
              usn: "",
              email: user?.email || "",
              department: "",
              year: "",
              eventId: "",
            });
            setIsHackathonEvent(false);
          }}
          onCancel={() => {
            setFormData({
              name: "",
              usn: "",
              email: user?.email || "",
              department: "",
              year: "",
              eventId: "",
            });
            setIsHackathonEvent(false);
          }}
        />
      )}

      {alreadyRegistered && (
        <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 shadow-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div className="ml-2">
            <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold">Already Registered!</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              You have already registered for <strong>{selectedEventData?.title}</strong>.
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/my-teams")}
                  className="bg-white border-amber-200 hover:bg-amber-100 text-amber-800"
                >
                  View My Teams
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, eventId: "" }))}
                  className="text-amber-600"
                >
                  Select Another Event
                </Button>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Show Regular Registration if event is not hackathon */}
      {!isHackathonEvent && !alreadyRegistered && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>
              {formData.eventId && selectedEventData && (
                <span className={`text-sm font-medium ${selectedEventData.max_participants && selectedEventCount >= (selectedEventData.max_participants as number) ? "text-red-500" : "text-gray-500"}`}>
                  Capacity: {selectedEventCount} / {selectedEventData.max_participants || 50} filled
                  {selectedEventData.max_participants && selectedEventCount >= (selectedEventData.max_participants as number) && " (FULL)"}
                </span>
              )}
              {!formData.eventId && "Please fill in all the required fields."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInputs
                formData={formData}
                errors={errors}
                events={events}
                eventsLoading={eventsLoading}
                authenticated={authenticated}
                user={user}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full btn-primary"
              disabled={formLoading || !authenticated || countLoading || (!!selectedEventData?.max_participants && selectedEventCount >= (selectedEventData.max_participants as number))}
              onClick={handleSubmit}
            >
              {formLoading ? "Registering..." :
                (selectedEventData?.max_participants && selectedEventCount >= (selectedEventData.max_participants as number) ? "Registration Full" : "Register Now")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
