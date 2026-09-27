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
      activity_log: {
        Row: {
          action: string
          actor: string
          created_at: string
          details: string | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor?: string
          created_at?: string
          details?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          details?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          client: string
          contact: string
          created_at: string
          date: string
          id: string
          notes: string | null
          service: string
          status: string
        }
        Insert: {
          client: string
          contact: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          service: string
          status?: string
        }
        Update: {
          client?: string
          contact?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          service?: string
          status?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          discord: string | null
          id: string
          name: string
          service: string
          status: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          discord?: string | null
          id?: string
          name: string
          service?: string
          status?: string
          whatsapp?: string
        }
        Update: {
          created_at?: string
          discord?: string | null
          id?: string
          name?: string
          service?: string
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          allow_publish: boolean
          client_name: string
          created_at: string
          id: string
          project_id: string | null
          project_name: string
          rating: number | null
          status: string
          submitted_at: string | null
          testimonial: string | null
          token: string
          updated_at: string
        }
        Insert: {
          allow_publish?: boolean
          client_name?: string
          created_at?: string
          id?: string
          project_id?: string | null
          project_name?: string
          rating?: number | null
          status?: string
          submitted_at?: string | null
          testimonial?: string | null
          token?: string
          updated_at?: string
        }
        Update: {
          allow_publish?: boolean
          client_name?: string
          created_at?: string
          id?: string
          project_id?: string | null
          project_name?: string
          rating?: number | null
          status?: string
          submitted_at?: string | null
          testimonial?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string
          id: string
          published: boolean
          sort_order: number
          status: string
          tech: string[]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          status?: string
          tech?: string[]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          sort_order?: number
          status?: string
          tech?: string[]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client: string
          created_at: string
          deadline: string | null
          id: string
          name: string
          stage: string
          type: string
        }
        Insert: {
          client?: string
          created_at?: string
          deadline?: string | null
          id?: string
          name: string
          stage?: string
          type?: string
        }
        Update: {
          client?: string
          created_at?: string
          deadline?: string | null
          id?: string
          name?: string
          stage?: string
          type?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          name: string
          price: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          name: string
          price?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          accepting_projects: boolean
          author_name: string
          availability_note: string
          discord_link: string
          footer_text: string
          id: string
          maintenance_eta: string | null
          maintenance_message: string | null
          maintenance_mode: boolean
          site_name: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          accepting_projects?: boolean
          author_name?: string
          availability_note?: string
          discord_link?: string
          footer_text?: string
          id?: string
          maintenance_eta?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          site_name?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          accepting_projects?: boolean
          author_name?: string
          availability_note?: string
          discord_link?: string
          footer_text?: string
          id?: string
          maintenance_eta?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          site_name?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          sender: string
          ticket_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          sender?: string
          ticket_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          sender?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          admin_unread: number
          client_token: string
          created_at: string
          email: string
          id: string
          last_message_at: string
          name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_unread?: number
          client_token?: string
          created_at?: string
          email?: string
          id?: string
          last_message_at?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Update: {
          admin_unread?: number
          client_token?: string
          created_at?: string
          email?: string
          id?: string
          last_message_at?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      whia_conversations: {
        Row: {
          archived: boolean
          created_at: string
          id: string
          mode: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          id?: string
          mode?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          id?: string
          mode?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whia_files: {
        Row: {
          conversation_id: string | null
          created_at: string
          file_name: string
          id: string
          mime_type: string
          size_bytes: number
          status: string
          storage_path: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          file_name: string
          id?: string
          mime_type: string
          size_bytes: number
          status?: string
          storage_path: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string
          size_bytes?: number
          status?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whia_files_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whia_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whia_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json
          rating: number | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json
          rating?: number | null
          role: string
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          rating?: number | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whia_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whia_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whia_plans: {
        Row: {
          created_at: string
          description: string
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          max_file_bytes: number
          monthly_credits: number
          name: string
          price_cents: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_file_bytes: number
          monthly_credits: number
          name: string
          price_cents?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_file_bytes?: number
          monthly_credits?: number
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      whia_profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          full_name: string
          id: string
          language: string
          notification_sound: boolean
          send_with_enter: boolean
          theme: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          full_name?: string
          id: string
          language?: string
          notification_sound?: boolean
          send_with_enter?: boolean
          theme?: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          full_name?: string
          id?: string
          language?: string
          notification_sound?: boolean
          send_with_enter?: boolean
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      whia_subscriptions: {
        Row: {
          created_at: string
          credits_used: number
          period_ends_at: string
          period_started_at: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          period_ends_at?: string
          period_started_at?: string
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          period_ends_at?: string
          period_started_at?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whia_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "whia_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      whia_usage_logs: {
        Row: {
          conversation_id: string | null
          created_at: string
          credits: number
          id: string
          metadata: Json
          usage_type: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          credits: number
          id?: string
          metadata?: Json
          usage_type: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          credits?: number
          id?: string
          metadata?: Json
          usage_type?: string
          user_id?: string
        }
        Relationships: []
      }
      whia_user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_ticket: {
        Args: {
          _email: string
          _message: string
          _name: string
          _subject: string
        }
        Returns: string
      }
      ensure_whia_account: {
        Args: { _full_name?: string }
        Returns: {
          credits_limit: number
          credits_used: number
          plan_slug: string
          profile_id: string
        }[]
      }
      get_feedback_by_token: {
        Args: { _token: string }
        Returns: {
          client_name: string
          id: string
          project_name: string
        }[]
      }
      get_public_settings: {
        Args: never
        Returns: {
          accepting_projects: boolean
          author_name: string
          availability_note: string
          discord_link: string
          footer_text: string
          maintenance_eta: string
          maintenance_message: string
          maintenance_mode: boolean
          site_name: string
          whatsapp: string
        }[]
      }
      get_published_feedbacks: {
        Args: { _limit?: number }
        Returns: {
          client_name: string
          id: string
          project_name: string
          rating: number
          testimonial: string
        }[]
      }
      get_ticket_by_token: {
        Args: { _token: string }
        Returns: {
          created_at: string
          email: string
          id: string
          last_message_at: string
          name: string
          status: string
          subject: string
        }[]
      }
      get_ticket_messages: {
        Args: { _token: string }
        Returns: {
          body: string
          created_at: string
          id: string
          sender: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      post_ticket_message: {
        Args: { _body: string; _token: string }
        Returns: boolean
      }
      submit_feedback: {
        Args: {
          _allow_publish: boolean
          _client_name: string
          _rating: number
          _testimonial: string
          _token: string
        }
        Returns: boolean
      }
      whia_create_conversation: {
        Args: { _mode?: string; _title: string }
        Returns: string
      }
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
