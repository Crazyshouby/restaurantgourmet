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
      admin_settings: {
        Row: {
          auto_sync_enabled: boolean | null
          auto_sync_interval: number | null
          google_connected: boolean
          google_email: string | null
          google_refresh_token: string | null
          id: number
          last_sync_status: string | null
          last_sync_timestamp: string | null
          max_guests_per_day: number | null
          sync_error: string | null
          time_slots: string[] | null
          updated_at: string
        }
        Insert: {
          auto_sync_enabled?: boolean | null
          auto_sync_interval?: number | null
          google_connected?: boolean
          google_email?: string | null
          google_refresh_token?: string | null
          id?: number
          last_sync_status?: string | null
          last_sync_timestamp?: string | null
          max_guests_per_day?: number | null
          sync_error?: string | null
          time_slots?: string[] | null
          updated_at?: string
        }
        Update: {
          auto_sync_enabled?: boolean | null
          auto_sync_interval?: number | null
          google_connected?: boolean
          google_email?: string | null
          google_refresh_token?: string | null
          id?: number
          last_sync_status?: string | null
          last_sync_timestamp?: string | null
          max_guests_per_day?: number | null
          sync_error?: string | null
          time_slots?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          image: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          image: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          image?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean | null
          id: string
          image: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          featured?: boolean | null
          id?: string
          image: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: string
          image?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          date: string
          email: string
          google_event_id: string | null
          guests: number
          id: string
          imported_from_google: boolean | null
          name: string
          notes: string | null
          phone: string
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          email: string
          google_event_id?: string | null
          guests: number
          id?: string
          imported_from_google?: boolean | null
          name: string
          notes?: string | null
          phone: string
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          google_event_id?: string | null
          guests?: number
          id?: string
          imported_from_google?: boolean | null
          name?: string
          notes?: string | null
          phone?: string
          time?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          reservations_synced: number | null
          status: string
          sync_timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          reservations_synced?: number | null
          status: string
          sync_timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          reservations_synced?: number | null
          status?: string
          sync_timestamp?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
