export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessment_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      cv_drafts: {
        Row: {
          data: Json
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          data?: Json
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          data?: Json
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_notes: {
        Row: {
          id: string
          note: string
          question: string
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          note?: string
          question: string
          question_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          note?: string
          question?: string
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          deadline: string | null
          follow_up: string | null
          id: string
          kind: string
          link: string
          notes: string
          organisation: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          follow_up?: string | null
          id?: string
          kind?: string
          link?: string
          notes?: string
          organisation?: string
          status?: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          follow_up?: string | null
          id?: string
          kind?: string
          link?: string
          notes?: string
          organisation?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          onboarded: boolean
          onboarding: Json
          programme: string
          status: string
          study_year: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          onboarded?: boolean
          onboarding?: Json
          programme?: string
          status?: string
          study_year?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          onboarded?: boolean
          onboarding?: Json
          programme?: string
          status?: string
          study_year?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          id: string
          milestones: Json
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          milestones?: Json
          project_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          milestones?: Json
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          category: string
          created_at: string
          id: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers: Json
          category: string
          created_at?: string
          id?: string
          score: number
          total: number
          user_id?: string
        }
        Update: {
          answers?: Json
          category?: string
          created_at?: string
          id?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          created_at: string
          done: boolean
          id: string
          is_custom: boolean
          position: number
          stage: number
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          is_custom?: boolean
          position?: number
          stage: number
          target_date?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          is_custom?: boolean
          position?: number
          stage?: number
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_careers: {
        Row: {
          career_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          career_id: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          career_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
