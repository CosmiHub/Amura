
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Search, Eye, CheckCircle, XCircle, Loader2, Users } from "lucide-react";

export function TeamManagement() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          events (title),
          team_members (
            *,
            registrations:registration_id (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTeam = async (teamId: string, verified: boolean) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("teams")
        .update({ is_verified: verified })
        .eq("id", teamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Team ${verified ? "verified" : "unverified"} successfully`,
      });

      // Update local state
      setTeams(teams.map(t => t.id === teamId ? { ...t, is_verified: verified } : t));
      if (selectedTeam?.id === teamId) {
        setSelectedTeam({ ...selectedTeam, is_verified: verified });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update team status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.events?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.join_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hackathon Teams</h3>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search teams, events, or codes..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-sm border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-sm text-gray-500">Loading teams...</p>
                </TableCell>
              </TableRow>
            ) : filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  No teams found
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.team_name}</TableCell>
                  <TableCell>{team.events?.title}</TableCell>
                  <TableCell>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                      {team.join_code}
                    </code>
                  </TableCell>
                  <TableCell>
                    {team.current_members} / {team.max_members}
                  </TableCell>
                  <TableCell>
                    <Badge variant={team.status === "complete" ? "default" : "outline"}>
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {team.is_verified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Team Details: {selectedTeam?.team_name}</DialogTitle>
          </DialogHeader>
          
          {selectedTeam && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Event</h4>
                  <p className="text-lg font-medium">{selectedTeam.events?.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Join Code</h4>
                  <p className="text-lg font-mono">{selectedTeam.join_code}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500">Selected Track / Project Idea</h4>
                <p className="text-sm bg-muted p-3 rounded-md mt-1">
                  {selectedTeam.team_idea || "No track/idea provided"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Team Members</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>USN</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTeam.team_members && selectedTeam.team_members.length > 0 ? (
                        selectedTeam.team_members.map((member: any) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">
                              {member.registrations?.name || "N/A"}
                            </TableCell>
                            <TableCell>{member.registrations?.usn || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={member.role === "leader" ? "default" : "secondary"}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{member.registrations?.department || "N/A"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No members found in this team
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {!selectedTeam?.is_verified ? (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleVerifyTeam(selectedTeam.id, true)}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Verify Team
              </Button>
            ) : (
              <Button 
                variant="destructive"
                onClick={() => handleVerifyTeam(selectedTeam.id, false)}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Unverify Team
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
