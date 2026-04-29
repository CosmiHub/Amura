import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

/**
 * Generate a random 6-character alphanumeric join code
 */
function generateJoinCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking chars like I, 1, O, 0
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Delete a team and all associated registrations
 */
export async function deleteTeam(teamId: string) {
  // First get all registrations associated with this team
  const { data: registrations, error: fetchError } = await supabase
    .from("registrations")
    .select("id")
    .eq("team_id", teamId);

  if (fetchError) throw fetchError;

  // Delete all team members from the team_members table
  const { error: membersError } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId);

  if (membersError) throw membersError;

  // Delete all registrations for this team
  const { error: regsError } = await supabase
    .from("registrations")
    .delete()
    .eq("team_id", teamId);

  if (regsError) throw regsError;

  // Finally delete the team itself
  const { error: teamError } = await supabase
    .from("teams")
    .delete()
    .eq("id", teamId);

  if (teamError) throw teamError;

  return true;
}

/**
 * Create a new team for a hackathon event
 */
export async function createTeam(
  eventId: string,
  teamName: string,
  teamLeaderId: string,
  teamDescription?: string,
  teamIdea?: string
) {
  const { data, error } = await supabase
    .from("teams")
    .insert([
      {
        event_id: eventId,
        team_name: teamName,
        team_leader_id: teamLeaderId,
        team_description: teamDescription || null,
        team_idea: teamIdea || null,
        join_code: generateJoinCode(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get team by join code
 */
export async function getTeamByJoinCode(joinCode: string, eventId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("join_code", joinCode)
    .eq("event_id", eventId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add a member to a team
 */
export async function addTeamMember(
  teamId: string,
  registrationId: string,
  role: "leader" | "member" = "member"
) {
  const { data, error } = await supabase
    .from("team_members")
    .insert([
      {
        team_id: teamId,
        registration_id: registrationId,
        role: role,
        member_status: "approved",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all members of a team
 */
export async function getTeamMembers(teamId: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select(
      `
      *,
      registrations (
        id,
        name,
        email,
        usn,
        department,
        year
      )
    `
    )
    .eq("team_id", teamId);

  if (error) throw error;
  return data;
}

/**
 * Get team with details
 */
export async function getTeamWithDetails(teamId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      *,
      team_members (
        *,
        registrations (
          id,
          name,
          email,
          usn,
          department,
          year
        )
      )
    `
    )
    .eq("id", teamId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all teams for an event
 */
export async function getEventTeams(eventId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      *,
      team_members (count)
    `
    )
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
}

/**
 * Update team info
 */
export async function updateTeam(
  teamId: string,
  updates: Partial<Tables<"teams">>
) {
  const { data, error } = await supabase
    .from("teams")
    .update(updates)
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if user is team leader
 */
export async function isTeamLeader(
  teamId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("teams")
    .select("id")
    .eq("id", teamId)
    .eq("team_leader_id", userId)
    .single();

  if (error) return false;
  return !!data;
}

/**
 * Get user's registration with team info
 */
export async function getUserTeamInfo(userId: string, eventId: string) {
  const { data, error } = await supabase
    .from("registrations")
    .select(
      `
      *,
      teams (
        id,
        team_name,
        join_code,
        status,
        current_members,
        max_members
      )
    `
    )
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Register user as team leader
 */
export async function registerAsTeamLeader(
  eventId: string,
  name: string,
  usn: string,
  email: string,
  department: string,
  year: string,
  userId: string,
  teamName: string,
  teamDescription?: string,
  teamIdea?: string
) {
  // Create registration
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .insert([
      {
        event_id: eventId,
        name,
        usn,
        email,
        department,
        year,
        user_id: userId,
        registration_mode: "team_leader",
      },
    ])
    .select()
    .single();

  if (regError) throw regError;

    // Create team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert([
        {
          event_id: eventId,
          team_name: teamName,
          team_leader_id: userId,
          team_description: teamDescription || null,
          team_idea: teamIdea || null,
          join_code: generateJoinCode(),
        },
      ])
      .select()
      .single();

  if (teamError) throw teamError;

  // Add leader as team member
  const { error: memberError } = await supabase
    .from("team_members")
    .insert([
      {
        team_id: team.id,
        registration_id: registration.id,
        role: "leader",
        member_status: "approved",
      },
    ]);

  if (memberError) throw memberError;

  // Update registration with team_id
  await supabase
    .from("registrations")
    .update({ team_id: team.id })
    .eq("id", registration.id);

  return { registration, team };
}

/**
 * Register user as team member using join code
 */
export async function registerAsTeamMember(
  eventId: string,
  name: string,
  usn: string,
  email: string,
  department: string,
  year: string,
  userId: string,
  joinCode: string
) {
  // Validate join code
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("join_code", joinCode)
    .eq("event_id", eventId)
    .single();

  if (teamError) throw new Error("Invalid join code");

  if (team.current_members >= team.max_members) {
    throw new Error("Team is full");
  }

  if (team.status !== "forming") {
    throw new Error("Team is not accepting new members");
  }

  // Create registration
  const { data: registration, error: regError } = await supabase
    .from("registrations")
    .insert([
      {
        event_id: eventId,
        name,
        usn,
        email,
        department,
        year,
        user_id: userId,
        registration_mode: "team_member",
        team_id: team.id,
        team_join_code_used: joinCode,
      },
    ])
    .select()
    .single();

  if (regError) throw regError;

  // Add user as team member
  const { error: memberError } = await supabase
    .from("team_members")
    .insert([
      {
        team_id: team.id,
        registration_id: registration.id,
        role: "member",
        member_status: "approved",
      },
    ]);

  if (memberError) throw memberError;

  // Increment team member count
  await supabase
    .from("teams")
    .update({ current_members: team.current_members + 1 })
    .eq("id", team.id);

  return { registration, team };
}

/**
 * Validate if event is a hackathon
 */
export async function isHackathonEvent(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("events")
    .select("is_hackathon")
    .eq("id", eventId)
    .single();

  if (error) return false;
  return data?.is_hackathon || false;
}

/**
 * Get hackathon event details
 */
export async function getHackathonEventDetails(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      date,
      location,
      description,
      is_hackathon,
      hackathon_type,
      team_min_size,
      team_max_size,
      allow_team_registration,
      team_leader_preregistration
    `
    )
    .eq("id", eventId)
    .single();

  if (error) throw error;
  return data;
}
