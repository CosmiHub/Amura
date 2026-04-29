import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getTeamWithDetails, updateTeam, deleteTeam } from "@/utils/hackathonUtils";
import { Users, Copy, CheckCircle2, Trash2 } from "lucide-react";

interface TeamDashboardProps {
  teamId: string;
  isTeamLeader: boolean;
}

export function TeamDashboard({ teamId, isTeamLeader }: TeamDashboardProps) {
  const { toast } = useToast();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const teamData = await getTeamWithDetails(teamId);
      setTeam(teamData);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load team details";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(team.join_code);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCompleteTeam = async () => {
    if (
      !confirm(
        "Mark team as complete? You won't be able to add more members after this."
      )
    )
      return;

    try {
      await updateTeam(teamId, { status: "complete" });
      await fetchTeamDetails();
      toast({
        title: "Success",
        description: "Team marked as complete",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this team? All registrations will be removed and this cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      await deleteTeam(teamId);
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      // Force refresh to clear state
      window.location.href = "/my-teams";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!team) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Team not found
          </div>
        </CardContent>
      </Card>
    );
  }

  const members = team.team_members || [];
  const isFull = team.current_members >= team.max_members;

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {team.team_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Status: <Badge variant="outline">{team.status}</Badge>
              </p>
            </div>
            {isTeamLeader && team.status === "forming" && !isFull && (
              <Button
                size="sm"
                onClick={handleCompleteTeam}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark as Complete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {team.team_idea && (
            <div>
              <h4 className="font-semibold text-sm">Project Idea</h4>
              <p className="text-sm text-muted-foreground">{team.team_idea}</p>
            </div>
          )}

          {team.team_description && (
            <div>
              <h4 className="font-semibold text-sm">Team Description</h4>
              <p className="text-sm text-muted-foreground">
                {team.team_description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold">Members</p>
              <p className="text-2xl font-bold">
                {team.current_members}/{team.max_members}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Status</p>
              <p
                className={`text-lg font-bold ${
                  team.status === "forming"
                    ? "text-amber-600"
                    : team.status === "complete"
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              >
                {team.status.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Verified</p>
              <p>
                {team.is_verified ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Code Section (for Team Leader) */}
      {isTeamLeader && (
        <Card>
          <CardHeader>
            <CardTitle>Share Join Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Share this code with your team members so they can join your
                team.
              </p>
              <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md">
                    <span className="text-sm font-mono font-medium">{team.join_code}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={copyJoinCode}
                    >
                      {copiedCode ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  
                  {team.status === "forming" && (
                    <Button size="sm" onClick={handleCompleteTeam}>
                      Mark as Complete
                    </Button>
                  )}
                </div>

                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleDeleteTeam}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No members yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.registrations?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {member.registrations?.usn || "-"}
                      </TableCell>
                      <TableCell>
                        {member.registrations?.email || "-"}
                      </TableCell>
                      <TableCell>
                        {member.registrations?.department || "-"}
                      </TableCell>
                      <TableCell>
                        {member.registrations?.year || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === "leader"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {member.role === "leader"
                            ? "Leader"
                            : "Member"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.member_status === "approved"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {member.member_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Messages */}
      {isFull && team.status === "forming" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your team is now full. Consider marking it as complete to stop
              accepting new members.
            </p>
            {isTeamLeader && (
              <Button
                onClick={handleCompleteTeam}
                size="sm"
                className="mt-3 bg-yellow-600 hover:bg-yellow-700"
              >
                Mark as Complete
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
