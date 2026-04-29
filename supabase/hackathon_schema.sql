-- ============================================================
-- HACKATHON MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Execute this SQL in Supabase SQL Editor
-- ============================================================

-- 1. Alter events table to add hackathon-specific fields
ALTER TABLE events
ADD COLUMN IF NOT EXISTS is_hackathon BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hackathon_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS team_min_size INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS team_max_size INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS allow_team_registration BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS team_leader_preregistration BOOLEAN DEFAULT FALSE;

-- 2. Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  team_description TEXT,
  team_idea TEXT,
  team_leader_id UUID NOT NULL,
  join_code VARCHAR(8) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'forming' CHECK (status IN ('forming', 'complete', 'approved', 'rejected')),
  max_members INTEGER DEFAULT 5,
  current_members INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_team_size CHECK (current_members <= max_members)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id);
CREATE INDEX IF NOT EXISTS idx_teams_join_code ON teams(join_code);
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(team_leader_id);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  member_status VARCHAR(50) DEFAULT 'approved' CHECK (member_status IN ('pending', 'approved', 'rejected')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  
  UNIQUE(team_id, registration_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_registration_id ON team_members(registration_id);

-- 4. Alter registrations table to add hackathon fields
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS registration_mode VARCHAR(50) DEFAULT 'individual' CHECK (registration_mode IN ('individual', 'team_leader', 'team_member')),
ADD COLUMN IF NOT EXISTS hackathon_role VARCHAR(50),
ADD COLUMN IF NOT EXISTS team_join_code_used VARCHAR(8);

-- Create index
CREATE INDEX IF NOT EXISTS idx_registrations_team_id ON registrations(team_id);

-- 5. Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to generate unique join codes
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  code VARCHAR(8);
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8-character alphanumeric code
    code := UPPER(
      CONCAT(
        CHR(65 + FLOOR(RANDOM() * 26)),
        CHR(65 + FLOOR(RANDOM() * 26)),
        FLOOR(RANDOM() * 10),
        FLOOR(RANDOM() * 10),
        CHR(65 + FLOOR(RANDOM() * 26)),
        CHR(65 + FLOOR(RANDOM() * 26)),
        FLOOR(RANDOM() * 10),
        FLOOR(RANDOM() * 10)
      )
    );
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM teams WHERE join_code = code) INTO code_exists;
    
    -- If code doesn't exist, return it
    IF NOT code_exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to auto-generate join_code
CREATE OR REPLACE FUNCTION trigger_set_join_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := generate_join_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for join_code
DROP TRIGGER IF EXISTS set_join_code_trigger ON teams;

CREATE TRIGGER set_join_code_trigger
BEFORE INSERT ON teams
FOR EACH ROW
EXECUTE FUNCTION trigger_set_join_code();

-- 9. Create trigger to update team updated_at
DROP TRIGGER IF EXISTS update_teams_timestamp ON teams;

CREATE TRIGGER update_teams_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 10. Enable RLS (Row Level Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS Policies for teams
CREATE POLICY "Anyone can view teams" 
  ON teams FOR SELECT USING (true);

CREATE POLICY "Team leader can update their team" 
  ON teams FOR UPDATE 
  USING (auth.uid() = team_leader_id)
  WITH CHECK (auth.uid() = team_leader_id);

CREATE POLICY "Admins can manage all teams" 
  ON teams FOR ALL 
  USING (auth.jwt() ->> 'user_role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');

-- 12. Create RLS Policies for team_members
CREATE POLICY "Team members can view their team members" 
  ON team_members FOR SELECT 
  USING (
    team_id IN (
      SELECT id FROM teams WHERE team_leader_id = auth.uid()
    )
    OR registration_id IN (
      SELECT id FROM registrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage team members" 
  ON team_members FOR ALL 
  USING (auth.jwt() ->> 'user_role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');

-- 13. Create helper functions

-- Function to get team with member count
CREATE OR REPLACE FUNCTION get_team_with_details(team_id UUID)
RETURNS TABLE (
  id UUID,
  event_id UUID,
  team_name VARCHAR,
  team_leader_id UUID,
  join_code VARCHAR,
  status VARCHAR,
  max_members INTEGER,
  current_members INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  member_count BIGINT
) AS $$
SELECT 
  t.id,
  t.event_id,
  t.team_name,
  t.team_leader_id,
  t.join_code,
  t.status,
  t.max_members,
  t.current_members,
  t.created_at,
  COUNT(tm.id) as member_count
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
WHERE t.id = team_id
GROUP BY t.id, t.event_id, t.team_name, t.team_leader_id, t.join_code, t.status, t.max_members, t.current_members, t.created_at;
$$ LANGUAGE sql STABLE;

-- Function to validate team join code
CREATE OR REPLACE FUNCTION validate_join_code(code VARCHAR, event_id UUID)
RETURNS TABLE (
  is_valid BOOLEAN,
  team_id UUID,
  team_name VARCHAR,
  current_members INTEGER,
  max_members INTEGER,
  can_join BOOLEAN
) AS $$
SELECT 
  (t.id IS NOT NULL) as is_valid,
  t.id,
  t.team_name,
  t.current_members,
  t.max_members,
  (t.current_members < t.max_members AND t.status = 'forming') as can_join
FROM teams t
WHERE t.join_code = code 
  AND t.event_id = event_id
LIMIT 1;
$$ LANGUAGE sql STABLE;

-- 14. Add comments for documentation
COMMENT ON TABLE teams IS 'Stores hackathon team information';
COMMENT ON TABLE team_members IS 'Maps registrations to teams with role information';
COMMENT ON COLUMN teams.join_code IS 'Unique 8-character code for team members to join';
COMMENT ON COLUMN teams.status IS 'Team lifecycle: forming -> complete -> approved';
COMMENT ON COLUMN registrations.registration_mode IS 'Individual or team-based registration';

-- ============================================================
-- HACKATHON SCHEMA COMPLETE
-- ============================================================
