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
          created_at: string | null
          id: string
          name: string
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          name: string
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          name?: string
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          paypal_customer_id: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          paypal_customer_id?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          paypal_customer_id?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_submissions: {
        Row: {
          id: string
          email: string
          ip_address: string
          current_url: string
          created_at: string | null // Assuming you want to track when the submission was made
        }
        Insert: {
          email: string
          ip_address: string
          current_url: string
          created_at?: string | null // Optional for insert
        }
        Update: {
          id?: string
          email?: string
          ip_address?: string
          current_url?: string
          created_at?: string | null // Optional for update
        }
        Relationships: [
          {
            foreignKeyName: "user_submissions_user_id_fkey" // Adjust the foreign key name as needed
            columns: ["id"] // Assuming this is the foreign key
            isOneToOne: true // Change to false if it’s a one-to-many relationship
            referencedRelation: "users" // The referenced table
            referencedColumns: ["id"] // The primary key in the referenced table
          }
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
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
          id?: string
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
          id?: string
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
          id: string
          status: Database["public"]["Enums"]["action"] | null
          title: string | null
          type: Database["public"]["Enums"]["form_type"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          form?: string | null
          id?: string
          status?: Database["public"]["Enums"]["action"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          form?: string | null
          id?: string
          status?: Database["public"]["Enums"]["action"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          updated_at?: string
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
      node_relationships: {
        Row: {
          child_node_id: number | null
          id: number
          parent_node_id: number | null
        }
        Insert: {
          child_node_id?: number | null
          id?: number
          parent_node_id?: number | null
        }
        Update: {
          child_node_id?: number | null
          id?: number
          parent_node_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "node_relationships_child_node_id_fkey"
            columns: ["child_node_id"]
            isOneToOne: false
            referencedRelation: "node_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "node_relationships_parent_node_id_fkey"
            columns: ["parent_node_id"]
            isOneToOne: false
            referencedRelation: "node_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      node_templates: {
        Row: {
          context_info: Json | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          order_sequence: number | null
          parent_id: number | null
          process_item_level: boolean | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          context_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          order_sequence?: number | null
          parent_id?: number | null
          process_item_level?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          context_info?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          order_sequence?: number | null
          parent_id?: number | null
          process_item_level?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_parent"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "node_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          event_id: string
          id: string
          note: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          note: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          note?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_notes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "scheduled_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      old_customers: {
        Row: {
          id: string
          paypal_id: string | null
          stripe_customer_id: string | null
          user_id: number | null
        }
        Insert: {
          id?: string
          paypal_id?: string | null
          stripe_customer_id?: string | null
          user_id?: number | null
        }
        Update: {
          id?: string
          paypal_id?: string | null
          stripe_customer_id?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      old_purchases: {
        Row: {
          amount: number | null
          id: number
          package_id: string | null
          purchase_date: string | null
          user_id: number | null
        }
        Insert: {
          amount?: number | null
          id: number
          package_id?: number | null
          purchase_date?: string | null
          user_id?: number | null
        }
        Update: {
          amount?: number | null
          id?: number
          package_id?: number | null
          purchase_date?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      old_user_courses: {
        Row: {
          course_id: string | null
          id: string
          user_id: number | null
          watched_videos: Json | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          user_id?: number | null
          watched_videos?: Json | null
        }
        Update: {
          course_id?: string | null
          id?: string
          user_id?: number | null
          watched_videos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "test_user_courses_duplicate_test1_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      purchases: {
        Row: {
          amount: number
          id: number
          package_id: string
          purchase_date: string
          refund_amount: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          id?: number
          package_id: string
          purchase_date: string
          refund_amount?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          id?: number
          package_id?: string
          purchase_date?: string
          refund_amount?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          report: string | null
          status: Database["public"]["Enums"]["action"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report?: string | null
          status?: Database["public"]["Enums"]["action"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report?: string | null
          status?: Database["public"]["Enums"]["action"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_events: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          start_time: string | null
          status: Database["public"]["Enums"]["action"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["action"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["action"]
          updated_at?: string
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
      strapi_backups: {
        Row: {
          created_at: string
          id: number
          key: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          key?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          key?: string | null
        }
        Relationships: []
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
            foreignKeyName: "swarm_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          created_at: string
          id: number
          last_run: string
          last_run_output: string | null
          name: Json
          task: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          last_run: string
          last_run_output?: string | null
          name: Json
          task?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          last_run?: string
          last_run_output?: string | null
          name?: Json
          task?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      temp_user_emails: {
        Row: {
          email: string | null
          user_id: number | null
        }
        Insert: {
          email?: string | null
          user_id?: number | null
        }
        Update: {
          email?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      test_user_courses: {
        Row: {
          course_id: string | null
          id: string
          user_id: string | null
          watched_videos: Json | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          user_id?: string | null
          watched_videos?: Json | null
        }
        Update: {
          course_id?: string | null
          id?: string
          user_id?: string | null
          watched_videos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "test_user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "test_users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_users: {
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
          old_user_id: number | null
          order_count: number | null
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
          id?: string
          last_logged_in?: string | null
          last_notified?: string | null
          old_user_id?: number | null
          order_count?: number | null
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
          old_user_id?: number | null
          order_count?: number | null
          payment_method?: Json | null
          pending?: boolean | null
          preferences?: Json | null
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          course_id: string
          id: string
          user_id: string
          watched_videos: Json | null
        }
        Insert: {
          course_id: string
          id?: string
          user_id: string
          watched_videos?: Json | null
        }
        Update: {
          course_id?: string
          id?: string
          user_id?: string
          watched_videos?: Json | null
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
      user_courses_duplicate: {
        Row: {
          course_id: string
          id: string
          user_id: string
          watched_videos: Json | null
        }
        Insert: {
          course_id: string
          id?: string
          user_id: string
          watched_videos?: Json | null
        }
        Update: {
          course_id?: string
          id?: string
          user_id?: string
          watched_videos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_duplicate_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_duplicate_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_meta: {
        Row: {
          created_at: string
          meta_key: string
          meta_value: string
          umeta_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          meta_key: string
          meta_value: string
          umeta_id?: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          meta_key?: string
          meta_value?: string
          umeta_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          old_user_id: number | null
          order_count: number | null
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
          id?: string
          last_logged_in?: string | null
          last_notified?: string | null
          old_user_id?: number | null
          order_count?: number | null
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
          old_user_id?: number | null
          order_count?: number | null
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
          id?: string
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
          id: string | null
          status: Database["public"]["Enums"]["action"] | null
          title: string | null
          type: Database["public"]["Enums"]["form_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_form?: never
          form?: string | null
          id?: string | null
          status?: Database["public"]["Enums"]["action"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_form?: never
          form?: string | null
          id?: string | null
          status?: Database["public"]["Enums"]["action"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["form_type"] | null
          updated_at?: string | null
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
      decrypted_notes: {
        Row: {
          created_at: string | null
          decrypted_note: string | null
          event_id: string | null
          id: string | null
          note: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_note?: never
          event_id?: string | null
          id?: string | null
          note?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_note?: never
          event_id?: string | null
          id?: string | null
          note?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_notes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "scheduled_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      decrypted_reports: {
        Row: {
          created_at: string | null
          decrypted_report: string | null
          id: string | null
          report: string | null
          status: Database["public"]["Enums"]["action"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_report?: never
          id?: string | null
          report?: string | null
          status?: Database["public"]["Enums"]["action"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_report?: never
          id?: string | null
          report?: string | null
          status?: Database["public"]["Enums"]["action"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      delete_course: {
        Args: {
          p_id: string
        }
        Returns: undefined
      }
      delete_node_template: {
        Args: {
          p_id: number
        }
        Returns: undefined
      }
      delete_nodes:
      | {
        Args: {
          p_id: string
        }
        Returns: undefined
      }
      | {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user: {
        Args: {
          p_id: string
        }
        Returns: undefined
      }
      delete_user_courses: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_events: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_form: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_meta: {
        Args: {
          p_id: string
        }
        Returns: undefined
      }
      delete_user_meta_by_user_id_and_id: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_notes: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_purchases: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_report: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_subscriptions: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      delete_user_videos: {
        Args: {
          p_user_id: string
          p_id: string
        }
        Returns: undefined
      }
      extract_phone: {
        Args: {
          billing_address: Json
        }
        Returns: string
      }
      get_all_user_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          umeta_id: string
          user_id: string
          meta_key: string
          meta_value: string
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          username: string
          email: string
          form_state: Json
          course_state: Json
          last_notified: string
          last_logged_in: string
          pending: boolean
          preferences: Json
          order_count: number
          old_user_id: string
        }[]
      }
      get_child_nodes_by_parent_name: {
        Args: {
          p_name: string
        }
        Returns: {
          id: number
          name: string
          type: string
          description: string
          context_info: Json
          process_item_level: boolean
          created_at: string
          updated_at: string
          order_sequence: number
          parent_id: number
        }[]
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_courses:
      | {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          content: Json
          product_id: string
          created_at: string
          updated_at: string
        }[]
      }
      | {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          course_id: string
          status: Database["public"]["Enums"]["action"]
          progress: number
          started_at: string
          completed_at: string
        }[]
      }
      get_customer_count_by_search: {
        Args: {
          search_text: string
        }
        Returns: number
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_node_template_with_children: {
        Args: {
          p_name: string
        }
        Returns: {
          id: number
          name: string
          type: string
          description: string
          context_info: Json
          process_item_level: boolean
          created_at: string
          updated_at: string
          order_sequence: number
          parent_id: number
          collection: Json
        }[]
      }
      get_node_templates: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          type: string
          description: string
          context_info: Json
          process_item_level: boolean
          created_at: string
          updated_at: string
          order_sequence: number
          parent_id: number
        }[]
      }
      get_node_with_child_nodes: {
        Args: {
          p_name: string
        }
        Returns: {
          parent_node_id: number
          parent_node_name: string
          parent_node_type: string
          parent_node_description: string
          child_node_id: number
          child_node_name: string
          child_node_type: string
          child_node_description: string
        }[]
      }
      get_nodes: {
        Args: {
          p_id: string
        }
        Returns: {
          id: string
          name: string
          type: string
          description: string
          context_info: Json
          process_item_level: boolean
          created_at: string
          updated_at: string
          order_sequence: number
          parent_id: number
        }[]
      }
      get_nodes_by_name: {
        Args: {
          p_name: string
        }
        Returns: {
          id: number
          name: string
          type: string
          description: string
          context_info: Json
          process_item_level: boolean
          created_at: string
          updated_at: string
          order_sequence: number
          parent_id: number
        }[]
      }
      get_user_by_id: {
        Args: {
          p_id: string
        }
        Returns: {
          id: string
          username: string
          email: string
          form_state: Json
          course_state: Json
          last_notified: string
          last_logged_in: string
          pending: boolean
          preferences: Json
          order_count: number
          old_user_id: string
        }[]
      }
      get_user_events: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          name: string
          type: string
          ref_id: string
          description: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }[]
      }
      get_user_forms: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          title: string
          status: Database["public"]["Enums"]["action"]
          type: Database["public"]["Enums"]["form_type"]
          decrypted_form: string
          created_at: string
          updated_at: string
        }[]
      }
      get_user_id: {
        Args: {
          email: string
        }
        Returns: string
      }
      get_user_meta: {
        Args: {
          p_user_id: string
        }
        Returns: {
          umeta_id: string
          user_id: string
          meta_key: string
          meta_value: string
        }[]
      }
      get_user_meta_by_id: {
        Args: {
          id: string
        }
        Returns: {
          umeta_id: string
          user_id: string
          meta_key: string
          meta_value: string
        }[]
      }
      get_user_notes: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          decrypted_note: string
          created_at: string
          updated_at: string
          event_id: string
        }[]
      }
      get_user_purchases: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          product_id: string
          amount: number
          status: Database["public"]["Enums"]["action"]
          created_at: string
        }[]
      }
      get_user_reports: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          decrypted_report: string
          created_at: string
          status: Database["public"]["Enums"]["action"]
          updated_at: string
        }[]
      }
      get_user_subscriptions: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          price_id: string
          quantity: number
          cancel_at_period_end: boolean
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string
          cancel_at: string
          canceled_at: string
          trial_start: string
          trial_end: string
          delivery_status: Database["public"]["Enums"]["delivery_status"]
        }[]
      }
      get_user_videos: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          title: string
          description: string
          transcript: string
          change_log: string
          created_at: string
          updated_at: string
        }[]
      }
      insert_user: {
        Args: {
          p_user_data: Json
        }
        Returns: string
      }
      insert_user_meta:
      | {
        Args: {
          p_user_id: string
          p_meta_key: string
          p_meta_value: Json
        }
        Returns: string
      }
      | {
        Args: {
          p_user_id: string
          p_meta_key: string
          p_meta_value: string
        }
        Returns: string
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      update_user: {
        Args: {
          p_id: string
          p_user_data: Json
        }
        Returns: string
      }
      update_user_meta:
      | {
        Args: {
          p_id: string
          p_meta_key: string
          p_meta_value: Json
        }
        Returns: undefined
      }
      | {
        Args: {
          p_id: string
          p_meta_key: string
          p_meta_value: string
        }
        Returns: undefined
      }
      upsert_course: {
        Args: {
          p_id: string
          p_name: string
          p_content: Json
          p_product_id: string
        }
        Returns: string
      }
      upsert_node_template: {
        Args: {
          p_id: number
          p_name: string
          p_type: string
          p_description: string
          p_context_info: Json
          p_process_item_level: boolean
          p_order_sequence: number
          p_parent_id: number
        }
        Returns: number
      }
      upsert_nodes:
      | {
        Args: {
          p_id: string
          p_name: string
          p_type: string
          p_description: string
          p_context_info: Json
          p_process_item_level: string
          p_created_at: string
        }
        Returns: string
      }
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_name: string
          p_type: Database["public"]["Enums"]["form_type"]
          p_description: string
          p_context_info: Json
          p_process_item_level: string
          p_created_at: string
        }
        Returns: string
      }
      upsert_user_courses: {
        Args: {
          p_id: string
          p_user_id: string
          p_course_id: string
          p_status: Database["public"]["Enums"]["action"]
          p_progress: number
          p_started_at: string
          p_completed_at: string
        }
        Returns: string
      }
      upsert_user_events:
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_name: string
          p_type: string
          p_ref_id: string
          p_description: string
          p_start_date: string
          p_end_date: string
        }
        Returns: string
      }
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_description: string
          p_start_time: string
          p_end_time: string
          p_created_at: string
          p_updated_at: string
        }
        Returns: string
      }
      upsert_user_forms:
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_form: Json
          p_status: string
          p_type: string
        }
        Returns: string
      }
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_status: Database["public"]["Enums"]["action"]
          p_type: Database["public"]["Enums"]["form_type"]
          p_form: string
        }
        Returns: string
      }
      upsert_user_meta:
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_meta_key: string
          p_meta_value: Json
        }
        Returns: undefined
      }
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_meta_key: string
          p_meta_value: string
        }
        Returns: string
      }
      upsert_user_notes: {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_content: string
          p_created_at: string
          p_updated_at: string
        }
        Returns: string
      }
      upsert_user_purchases: {
        Args: {
          p_id: string
          p_user_id: string
          p_product_id: string
          p_amount: number
          p_status: Database["public"]["Enums"]["action"]
        }
        Returns: string
      }
      upsert_user_reports: {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_content: string
          p_created_at: string
          p_updated_at: string
        }
        Returns: string
      }
      upsert_user_subscriptions: {
        Args: {
          p_id: string
          p_user_id: string
          p_status: Database["public"]["Enums"]["subscription_status"]
          p_price_id: string
          p_quantity: number
          p_cancel_at_period_end: boolean
          p_current_period_start: string
          p_current_period_end: string
          p_ended_at: string
          p_cancel_at: string
          p_canceled_at: string
          p_trial_start: string
          p_trial_end: string
          p_delivery_status: Database["public"]["Enums"]["delivery_status"]
        }
        Returns: string
      }
      upsert_user_videos:
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_description: string
          p_created_at: string
          p_updated_at: string
        }
        Returns: string
      }
      | {
        Args: {
          p_id: string
          p_user_id: string
          p_title: string
          p_description: string
          p_transcript: string
          p_change_log: string
        }
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      action:
      | "created"
      | "questions_approved"
      | "submitted"
      | "customer_contacted"
      | "submission_approved"
      code_challenge_method: "s256" | "plain"
      delivery_status: "not_delivered" | "reviewing" | "delivered"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn"
      form_type: "intake" | "supplemental" | "additional"
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
