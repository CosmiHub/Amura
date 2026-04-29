import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeamDashboard } from "@/components/register/TeamDashboard";

interface UserTeam {
  id: string;
  team_name: string;
  event_id: string;
  status: string;
  current_members: number;
  max_members: number;
  team_leader_id: string;
  join_code: string;
  event: {
    title: string;
    date: string;
  };
}

export function MyTeamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchMyTeams();
    }
  }, [user?.id]);

  const fetchMyTeams = async () => {
    try {
      setLoading(true);

      // Get all registrations for the user
      const { data: registrations, error: regError } = await supabase
        .from("registrations")
        .select("team_id")
        .eq("user_id", user?.id);

      if (regError) throw regError;

      const teamIds = registrations
        ?.map((reg) => reg.team_id)
        .filter((id) => id !== null) as string[];

      if (!teamIds || teamIds.length === 0) {
        setTeams([]);
        setLoading(false);
        return;
      }

      // Get team details
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(
          `
          id,
          team_name,
          event_id,
          status,
          current_members,
          max_members,
          team_leader_id,
          join_code,
          events (
            title,
            date
          )
        `
        )
        .in("id", teamIds);

      if (teamsError) throw teamsError;

      setTeams(
        teamsData?.map((team: any) => ({
          ...team,
          event: team.events,
        })) || []
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load teams";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (selectedTeamId) {
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);
    const isTeamLeader = selectedTeam?.team_leader_id === user?.id;

    return (
      <div className="container mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => setSelectedTeamId(null)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teams
        </Button>

        <div className="mb-4">
          <h1 className="text-3xl font-bold">{selectedTeam?.team_name}</h1>
          <p className="text-muted-foreground mt-1">
            {selectedTeam?.event?.title} • {new Date(selectedTeam?.event?.date || "").toLocaleDateString()}
          </p>
        </div>

        <TeamDashboard
          teamId={selectedTeamId}
          isTeamLeader={isTeamLeader}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <p className="text-muted-foreground mt-2">
          Manage your hackathon teams and view team members
        </p>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't joined or created any hackathon teams yet.
              </p>
              <Button onClick={() => navigate("/register")}>
                Register for a Hackathon
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const isTeamLeader = team.team_leader_id === user?.id;
            const isFull = team.current_members >= team.max_members;

            return (
              <Card
                key={team.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="flex-1">{team.team_name}</CardTitle>
                    {isTeamLeader && (
                      <Badge className="bg-blue-600">Leader</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {team.event?.title}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Team Status */}
                  <div>
                    <p className="text-sm font-semibold mb-1">Status</p>
                    <Badge
                      variant={
                        team.status === "forming"
                          ? "outline"
                          : team.status === "complete"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {team.status.charAt(0).toUpperCase() +
                        team.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Team Size */}
                  <div>
                    <p className="text-sm font-semibold mb-1">Team Size</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">
                        {team.current_members}/{team.max_members}
                      </p>
                      {isFull && (
                        <Badge className="bg-green-600">Full</Badge>
                      )}
                    </div>
                  </div>

                  {/* Event Date */}
                  <div>
                    <p className="text-sm font-semibold mb-1">Event Date</p>
                    <p className="text-sm">
                      {new Date(team.event?.date || "").toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* View Button */}
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
