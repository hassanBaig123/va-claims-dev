export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      courses: {
        Row: {
          content: Json
          id: string
          name: string
        }
        Insert: {
          content: Json
          id: string
          name: string
        }
        Update: {
          content?: Json
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_users_id_fk"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string | null
          name: string | null
          ref_id: string | null
          start_date: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          name?: string | null
          ref_id?: string | null
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          name?: string | null
          ref_id?: string | null
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forms: {
        Row: {
          created_at: string
          form: string | null
          id: number
          status: Database["public"]["Enums"]["form_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["form_type"] | null
          user_email: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          form?: string | null
          id?: number
          status?: Database["public"]["Enums"]["form_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          user_email: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          form?: string | null
          id?: number
          status?: Database["public"]["Enums"]["form_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      old_user_meta: {
        Row: {
          meta_key: string | null
          meta_value: string | null
          umeta_id: number
          user_id: number | null
        }
        Insert: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: number
          user_id?: number | null
        }
        Update: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: number
          user_id?: number | null
        }
        Relationships: []
      }
      old_user_meta_duplicate: {
        Row: {
          meta_key: string | null
          meta_value: string | null
          umeta_id: number
          user_id: number
        }
        Insert: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: number
          user_id?: number
        }
        Update: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: number
          user_id?: number
        }
        Relationships: []
      }
      old_users: {
        Row: {
          display_name: string | null
          id: number
          user_activation_key: string | null
          user_email: string | null
          user_login: string | null
          user_nicename: string | null
          user_pass: string | null
          user_registered: string | null
          user_status: number | null
          user_url: string | null
        }
        Insert: {
          display_name?: string | null
          id?: number
          user_activation_key?: string | null
          user_email?: string | null
          user_login?: string | null
          user_nicename?: string | null
          user_pass?: string | null
          user_registered?: string | null
          user_status?: number | null
          user_url?: string | null
        }
        Update: {
          display_name?: string | null
          id?: number
          user_activation_key?: string | null
          user_email?: string | null
          user_login?: string | null
          user_nicename?: string | null
          user_pass?: string | null
          user_registered?: string | null
          user_status?: number | null
          user_url?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          report: Json | null
        }
        Insert: {
          id?: string
          report?: Json | null
        }
        Update: {
          id?: string
          report?: Json | null
        }
        Relationships: []
      }
      scheduled_events: {
        Row: {
          created_at: string
          id: string
          start_time: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          start_time?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          start_time?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_scheduled_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          delivery_id: string[] | null
          delivery_status: Database["public"]["Enums"]["delivery_status"] | null
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          delivery_id?: string[] | null
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          delivery_id?: string[] | null
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_prices_id_fk"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      swarm_sessions: {
        Row: {
          created_at: string | null
          id: string
          sessions: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sessions: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sessions?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swarm_sessions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          course_id: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_meta: {
        Row: {
          meta_key: string | null
          meta_value: string | null
          umeta_id: string
          user_id: string | null
        }
        Insert: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: string
          user_id?: string | null
        }
        Update: {
          meta_key?: string | null
          meta_value?: string | null
          umeta_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          course_state: string | null
          email: string
          form_state: string | null
          full_name: string | null
          id: string
          last_logged_in: string | null
          last_notified: string | null
          payment_method: Json | null
          pending: boolean | null
          preferences: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          course_state?: string | null
          email: string
          form_state?: string | null
          full_name?: string | null
          id: string
          last_logged_in?: string | null
          last_notified?: string | null
          payment_method?: Json | null
          pending?: boolean | null
          preferences?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          course_state?: string | null
          email?: string
          form_state?: string | null
          full_name?: string | null
          id?: string
          last_logged_in?: string | null
          last_notified?: string | null
          payment_method?: Json | null
          pending?: boolean | null
          preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          change_log: string | null
          description: string | null
          id: string
          title: string
          transcript: string | null
        }
        Insert: {
          change_log?: string | null
          description?: string | null
          id: string
          title: string
          transcript?: string | null
        }
        Update: {
          change_log?: string | null
          description?: string | null
          id?: string
          title?: string
          transcript?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      decrypted_forms: {
        Row: {
          created_at: string | null
          decrypted_form: string | null
          form: string | null
          id: number | null
          status: Database["public"]["Enums"]["form_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["form_type"] | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_form?: never
          form?: string | null
          id?: number | null
          status?: Database["public"]["Enums"]["form_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_form?: never
          form?: string | null
          id?: number | null
          status?: Database["public"]["Enums"]["form_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      delivery_status: "not_delivered" | "reviewing" | "delivered"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn"
      form_status:
        | "created"
        | "questions_approved"
        | "submitted"
        | "submission_approved"
      form_type: "intake" | "supplemental"
      key_status: "default" | "valid" | "invalid" | "expired"
      key_type:
        | "aead-ietf"
        | "aead-det"
        | "hmacsha512"
        | "hmacsha256"
        | "auth"
        | "shorthash"
        | "generichash"
        | "kdf"
        | "secretbox"
        | "secretstream"
        | "stream_xchacha20"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

