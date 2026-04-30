import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { registerAsTeamMember, getTeamByJoinCode } from "@/utils/hackathonUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface TeamMemberRegistrationProps {
  eventId: string;
  onSuccess?: (registrationData: any) => void;
  onCancel?: () => void;
  initialData?: {
    name?: string;
    usn?: string;
    department?: string;
    year?: string;
  };
}


export function TeamMemberRegistration({
  eventId,
  onSuccess,
  onCancel,
  initialData,
}: TeamMemberRegistrationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"code" | "form">("code");
  const [teamCode, setTeamCode] = useState("");
  const [teamData, setTeamData] = useState<any>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    usn: initialData?.usn || "",
    email: "",
    department: initialData?.department || "",
    year: initialData?.year || "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || user.email || "",
        name: prev.name || (('username' in user ? (user.username || "") : (user.user_metadata?.full_name || "")))
      }));

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
            name: prev.name || data.name || "",
            usn: prev.usn || data.usn || "",
            department: prev.department || data.department || "",
            year: prev.year || data.year || "",
          }));
        }
      };

      fetchLastRegistration();
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateCode = async () => {
    if (!teamCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team join code",
        variant: "destructive",
      });
      return;
    }

    setValidatingCode(true);

    try {
      const team = await getTeamByJoinCode(teamCode.toUpperCase(), eventId);

      if (team.current_members >= team.max_members) {
        toast({
          title: "Team Full",
          description: "This team has reached its maximum member capacity",
          variant: "destructive",
        });
        setValidatingCode(false);
        return;
      }

      if (team.status !== "forming") {
        toast({
          title: "Team Not Accepting Members",
          description: "This team is no longer accepting new members",
          variant: "destructive",
        });
        setValidatingCode(false);
        return;
      }

      setTeamData(team);
      setStep("form");
      toast({
        title: "Code Valid!",
        description: `Found team: ${team.team_name}`,
      });
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "Team join code not found. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setValidatingCode(false);
    }
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
      const result = await registerAsTeamMember(
        eventId,
        formData.name,
        formData.usn,
        formData.email,
        formData.department,
        formData.year,
        user.id,
        teamCode.toUpperCase()
      );

      toast({
        title: "Success!",
        description: `You've joined team: ${result.team.team_name}`,
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join a Team</CardTitle>
      </CardHeader>
      <CardContent>
        {step === "code" ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Got a Team Join Code?
                  </h3>
                  <p className="text-sm text-blue-800 mt-1">
                    Your team leader should have provided you with an 8-character code to join the team.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="teamCode">Team Join Code *</Label>
                <Input
                  id="teamCode"
                  placeholder="Enter 8-character code (e.g., AB12CD34)"
                  value={teamCode}
                  onChange={(e) =>
                    setTeamCode(e.target.value.toUpperCase())
                  }
                  maxLength={8}
                  disabled={validatingCode}
                  className="font-mono text-center text-lg tracking-widest"
                />
              </div>

              <Button
                onClick={handleValidateCode}
                disabled={validatingCode || !teamCode}
                className="w-full"
              >
                {validatingCode ? "Validating Code..." : "Continue"}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={validatingCode}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    {teamData?.team_name}
                  </h3>
                  <p className="text-sm text-green-800 mt-1">
                    Members: {teamData?.current_members}/{teamData?.max_members}
                  </p>
                </div>
              </div>
            </div>

            {teamData?.team_idea && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Project Idea:</p>
                <p className="text-sm">{teamData.team_idea}</p>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Information</h3>
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

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Joining Team..." : "Join Team"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("code");
                  setTeamCode("");
                  setTeamData(null);
                  setFormData({
                    name: initialData?.name || "",
                    usn: initialData?.usn || "",
                    email: user?.email || "",
                    department: initialData?.department || "",
                    year: initialData?.year || "",
                  });
                }}
                disabled={loading}
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              * Required fields
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
