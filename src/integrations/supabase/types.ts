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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          company_id: string
          created_at: string
          documents: Json
          id: string
          sent_to_email: string | null
          snapshot: Json
          status: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          documents?: Json
          id?: string
          sent_to_email?: string | null
          snapshot: Json
          status?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          documents?: Json
          id?: string
          sent_to_email?: string | null
          snapshot?: Json
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string
          applications_enabled: boolean
          business_district: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          instructions: string | null
          internship_email: string | null
          internship_position: string | null
          is_active: boolean
          lga: string | null
          logo_url: string | null
          name: string
          slots: number | null
          state: string
          updated_at: string
        }
        Insert: {
          address: string
          applications_enabled?: boolean
          business_district?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          internship_email?: string | null
          internship_position?: string | null
          is_active?: boolean
          lga?: string | null
          logo_url?: string | null
          name: string
          slots?: number | null
          state: string
          updated_at?: string
        }
        Update: {
          address?: string
          applications_enabled?: boolean
          business_district?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          internship_email?: string | null
          internship_position?: string | null
          is_active?: boolean
          lga?: string | null
          logo_url?: string | null
          name?: string
          slots?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_departments: {
        Row: {
          company_id: string
          department_id: string
        }
        Insert: {
          company_id: string
          department_id: string
        }
        Update: {
          company_id?: string
          department_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      company_requirements: {
        Row: {
          company_id: string
          created_at: string
          field_key: string
          id: string
          kind: Database["public"]["Enums"]["field_kind"]
          label: string
          requirement: Database["public"]["Enums"]["field_requirement"]
          sort_order: number
        }
        Insert: {
          company_id: string
          created_at?: string
          field_key: string
          id?: string
          kind: Database["public"]["Enums"]["field_kind"]
          label: string
          requirement?: Database["public"]["Enums"]["field_requirement"]
          sort_order?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          field_key?: string
          id?: string
          kind?: Database["public"]["Enums"]["field_kind"]
          label?: string
          requirement?: Database["public"]["Enums"]["field_requirement"]
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_requirements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      placement_access: {
        Row: {
          amount_naira: number
          city: string
          id: string
          paid_at: string
          paystack_reference: string
          state: string
          user_id: string
        }
        Insert: {
          amount_naira: number
          city: string
          id?: string
          paid_at?: string
          paystack_reference: string
          state: string
          user_id: string
        }
        Update: {
          amount_naira?: number
          city?: string
          id?: string
          paid_at?: string
          paystack_reference?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          documents: Json
          expected_end_date: string | null
          full_name: string | null
          id: string
          institution: string | null
          internship_duration: string | null
          internship_type: string | null
          level: string | null
          matric_number: string | null
          phone: string | null
          preferred_start_date: string | null
          university: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          documents?: Json
          expected_end_date?: string | null
          full_name?: string | null
          id: string
          institution?: string | null
          internship_duration?: string | null
          internship_type?: string | null
          level?: string | null
          matric_number?: string | null
          phone?: string | null
          preferred_start_date?: string | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          documents?: Json
          expected_end_date?: string | null
          full_name?: string | null
          id?: string
          institution?: string | null
          internship_duration?: string | null
          internship_type?: string | null
          level?: string | null
          matric_number?: string | null
          phone?: string | null
          preferred_start_date?: string | null
          university?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      get_available_cities: {
        Args: { _state: string }
        Returns: {
          city: string
          placement_count: number
        }[]
      }
      get_available_states: {
        Args: never
        Returns: {
          placement_count: number
          state: string
        }[]
      }
      get_company_requirements: {
        Args: { _company_id: string }
        Returns: {
          field_key: string
          kind: Database["public"]["Enums"]["field_kind"]
          label: string
          requirement: Database["public"]["Enums"]["field_requirement"]
          sort_order: number
        }[]
      }
      get_location_count: {
        Args: { _city: string; _state: string }
        Returns: number
      }
      get_my_unlocked_locations: {
        Args: never
        Returns: {
          city: string
          company_count: number
          paid_at: string
          state: string
        }[]
      }
      get_unlocked_companies: {
        Args: { _city: string; _state: string }
        Returns: {
          address: string
          business_district: string
          city: string
          contact_email: string
          contact_phone: string
          description: string
          id: string
          lga: string
          logo_url: string
          name: string
          state: string
        }[]
      }
      get_unlocked_company: {
        Args: { _company_id: string }
        Returns: {
          address: string
          applications_enabled: boolean
          business_district: string
          city: string
          contact_email: string
          contact_phone: string
          description: string
          id: string
          instructions: string
          internship_email: string
          internship_position: string
          lga: string
          logo_url: string
          name: string
          state: string
        }[]
      }
      has_paid_for: {
        Args: { _city: string; _state: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      field_kind: "document" | "info" | "custom"
      field_requirement: "required" | "optional" | "hidden"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      field_kind: ["document", "info", "custom"],
      field_requirement: ["required", "optional", "hidden"],
    },
  },
} as const
