import { useState } from "react";
import { TeamLeaderRegistration } from "./TeamLeaderRegistration";
import { TeamMemberRegistration } from "./TeamMemberRegistration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User } from "lucide-react";

interface HackathonRegistrationProps {
  eventId: string;
  teamMinSize: number;
  teamMaxSize: number;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    name?: string;
    usn?: string;
    department?: string;
    year?: string;
  };
}

export function HackathonRegistration({
  eventId,
  teamMinSize,
  teamMaxSize,
  onSuccess,
  onCancel,
  initialData,
}: HackathonRegistrationProps) {
  const [mode, setMode] = useState<
    "choice" | "team-leader" | "team-member"
  >("choice");

  if (mode === "team-leader") {
    return (
      <TeamLeaderRegistration
        eventId={eventId}
        teamMinSize={teamMinSize}
        teamMaxSize={teamMaxSize}
        onSuccess={(data) => {
          onSuccess?.(data);
          setMode("choice");
        }}
        onCancel={() => setMode("choice")}
        initialData={initialData}
      />
    );
  }

  if (mode === "team-member") {
    return (
      <TeamMemberRegistration
        eventId={eventId}
        onSuccess={(data) => {
          onSuccess?.(data);
          setMode("choice");
        }}
        onCancel={() => setMode("choice")}
        initialData={initialData}
      />
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Hackathon Registration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Are you creating a new team or joining an existing team?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team Leader Option */}
          <button
            onClick={() => setMode("team-leader")}
            className="group relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary transition-colors p-6 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create a Team</h3>
                <p className="text-sm text-muted-foreground">
                  Be the team leader. Create your team and invite members.
                </p>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground pt-2">
                <li>✓ Create your team</li>
                <li>✓ Get a unique join code</li>
                <li>✓ Invite {teamMinSize}-{teamMaxSize} members</li>
              </ul>
            </div>
          </button>

          {/* Team Member Option */}
          <button
            onClick={() => setMode("team-member")}
            className="group relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary transition-colors p-6 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Join a Team</h3>
                <p className="text-sm text-muted-foreground">
                  Join an existing team using a join code.
                </p>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground pt-2">
                <li>✓ Enter team join code</li>
                <li>✓ View team details</li>
                <li>✓ Register as team member</li>
              </ul>
            </div>
          </button>
        </div>

        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
