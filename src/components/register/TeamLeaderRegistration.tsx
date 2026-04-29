import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { registerAsTeamLeader } from "@/utils/hackathonUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { departments as DEPARTMENTS, years as YEARS } from "./constants";

interface TeamLeaderRegistrationProps {
  eventId: string;
  teamMinSize: number;
  teamMaxSize: number;
  onSuccess?: (teamData: any) => void;
  onCancel?: () => void;
}


export function TeamLeaderRegistration({
  eventId,
  teamMinSize,
  teamMaxSize,
  onSuccess,
  onCancel,
}: TeamLeaderRegistrationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTeamCode, setShowTeamCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [eventTracks, setEventTracks] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    department: "",
    year: "",
    teamName: "",
    teamDescription: "",
    teamIdea: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: 'username' in user ? (user.username || "") : (user.user_metadata?.full_name || "")
      }));

      // Try to fetch existing registration data to pre-fill other fields
      const fetchLastRegistration = async () => {
        const { data, error } = await supabase
          .from("registrations")
          .select("name, usn, department, year")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            usn: data.usn || "",
            department: data.department || "",
            year: data.year || "",
          }));
        }
      };

      // Fetch event tracks
      const fetchEventTracks = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("tracks")
          .eq("id", eventId)
          .single();

        if (data && !error && data.tracks) {
          setEventTracks(data.tracks);
          // Auto-select first track if only one exists
          if (data.tracks.length === 1) {
            setFormData(prev => ({ ...prev, teamIdea: data.tracks[0] }));
          }
        }
      };

      fetchLastRegistration();
      fetchEventTracks();
    }
  }, [user, eventId]);

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'usn', label: 'USN' },
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'year', label: 'Year' },
      { key: 'teamName', label: 'Team Name' },
    ];

    const missingFields = requiredFields
      .filter(f => !formData[f.key as keyof typeof formData])
      .map(f => f.label);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await registerAsTeamLeader(
        eventId,
        formData.name,
        formData.usn,
        formData.email,
        formData.department,
        formData.year,
        user.id,
        formData.teamName,
        formData.teamDescription,
        formData.teamIdea
      );

      setGeneratedCode(result.team.join_code);
      setShowTeamCode(true);

      toast({
        title: "Success!",
        description: "Team created successfully. Share the code with members!",
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMsg = error.message || error.details || "Registration failed.";
      
      if (errorMsg.includes("registrations_event_id_usn_key")) {
        errorMsg = "This USN is already registered for this event. Please check 'My Teams' or use a different USN.";
      } else if (!error.message && !error.details) {
        errorMsg = "Registration failed. You might already be registered for this event.";
      }

      toast({
        title: "Registration Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showTeamCode) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Team Created Successfully! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Team Details</h3>
            <div className="space-y-2 bg-muted p-4 rounded-lg">
              <p>
                <strong>Team Name:</strong> {formData.teamName}
              </p>
              <p>
                <strong>Team Leader:</strong> {formData.name}
              </p>
              <p>
                <strong>Max Members:</strong> {teamMaxSize}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Share This Code</h3>
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Team Join Code</p>
              <p className="text-4xl font-bold font-mono tracking-widest text-primary">
                {generatedCode}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Share this code with your team members. They can use it to join your team during registration.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm">
              <strong>📌 Note:</strong> Team members must enter this code during their registration to join your team.
              Make sure they register for the same event.
            </p>
          </div>

          <Button
            onClick={() => {
              setShowTeamCode(false);
              onCancel?.();
            }}
            className="w-full"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register as Team Leader</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="usn">University Seat Number (USN) *</Label>
                <Input
                  id="usn"
                  placeholder="e.g., 1AB21CS001"
                  value={formData.usn}
                  onChange={(e) => handleInputChange("usn", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Year of Study *</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) =>
                      handleInputChange("year", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((yr) => (
                        <SelectItem key={yr} value={yr}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Team Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  placeholder="Enter your team name"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange("teamName", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="teamDescription">Team Description</Label>
                <Textarea
                  id="teamDescription"
                  placeholder="Brief description about your team"
                  rows={3}
                  value={formData.teamDescription}
                  onChange={(e) =>
                    handleInputChange("teamDescription", e.target.value)
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="teamIdea">Select Hackathon Track / Problem Statement *</Label>
                {eventTracks.length > 0 ? (
                  <Select
                    value={formData.teamIdea}
                    onValueChange={(value) => handleInputChange("teamIdea", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="teamIdea" className="w-full">
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTracks.map((track) => (
                        <SelectItem key={track} value={track}>
                          {track}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Textarea
                    id="teamIdea"
                    placeholder="Describe your project idea or what you plan to build"
                    rows={3}
                    value={formData.teamIdea}
                    onChange={(e) => handleInputChange("teamIdea", e.target.value)}
                    disabled={loading}
                  />
                )}
                {eventTracks.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Please select the track you want to compete in.
                  </p>
                )}
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Team Size:</strong> {teamMinSize} - {teamMaxSize} members
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating Team..." : "Create Team"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            * Required fields
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
