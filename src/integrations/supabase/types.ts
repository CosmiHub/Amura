export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          achievement_date: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          achievement_date?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          event_id: string
          id: string
          issued_at: string
          student_name: string
          user_id: string | null
          usn: string
        }
        Insert: {
          certificate_url?: string | null
          event_id: string
          id?: string
          issued_at?: string
          student_name: string
          user_id?: string | null
          usn: string
        }
        Update: {
          certificate_url?: string | null
          event_id?: string
          id?: string
          issued_at?: string
          student_name?: string
          user_id?: string | null
          usn?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          allow_team_registration: boolean
          created_at: string
          creator_id: string | null
          date: string
          description: string | null
          hackathon_type: string | null
          id: string
          image_url: string | null
          is_hackathon: boolean
          location: string | null
          max_participants: number | null
          status: string | null
          team_leader_preregistration: boolean
          team_max_size: number
          team_min_size: number
          title: string
        }
        Insert: {
          allow_team_registration?: boolean
          created_at?: string
          creator_id?: string | null
          date: string
          description?: string | null
          hackathon_type?: string | null
          id?: string
          image_url?: string | null
          is_hackathon?: boolean
          location?: string | null
          max_participants?: number | null
          status?: string | null
          team_leader_preregistration?: boolean
          team_max_size?: number
          team_min_size?: number
          title: string
        }
        Update: {
          allow_team_registration?: boolean
          created_at?: string
          creator_id?: string | null
          date?: string
          description?: string | null
          hackathon_type?: string | null
          id?: string
          image_url?: string | null
          is_hackathon?: boolean
          location?: string | null
          max_participants?: number | null
          status?: string | null
          team_leader_preregistration?: boolean
          team_max_size?: number
          team_min_size?: number
          title?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          id: string
          joined_at: string
          member_status: string
          registration_id: string
          role: string
          team_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          joined_at?: string
          member_status?: string
          registration_id: string
          role?: string
          team_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          joined_at?: string
          member_status?: string
          registration_id?: string
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          current_members: number
          event_id: string
          id: string
          is_verified: boolean
          join_code: string
          max_members: number
          status: string
          team_description: string | null
          team_idea: string | null
          team_leader_id: string
          team_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_members?: number
          event_id: string
          id?: string
          is_verified?: boolean
          join_code?: string
          max_members?: number
          status?: string
          team_description?: string | null
          team_idea?: string | null
          team_leader_id: string
          team_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_members?: number
          event_id?: string
          id?: string
          is_verified?: boolean
          join_code?: string
          max_members?: number
          status?: string
          team_description?: string | null
          team_idea?: string | null
          team_leader_id?: string
          team_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string
          department: string
          email: string
          event_id: string
          hackathon_role: string | null
          id: string
          name: string
          registration_mode: string
          team_id: string | null
          team_join_code_used: string | null
          user_id: string
          usn: string
          year: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          event_id: string
          hackathon_role?: string | null
          id?: string
          name: string
          registration_mode?: string
          team_id?: string | null
          team_join_code_used?: string | null
          user_id?: string
          usn: string
          year: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          event_id?: string
          hackathon_role?: string | null
          id?: string
          name?: string
          registration_mode?: string
          team_id?: string | null
          team_join_code_used?: string | null
          user_id?: string
          usn?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
