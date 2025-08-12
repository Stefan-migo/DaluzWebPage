export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_sessions: {
        Row: {
          coach_user_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          follow_up_actions: Json | null
          id: string
          meeting_id: string | null
          meeting_password: string | null
          meeting_url: string | null
          membership_id: string
          preparation_notes: string | null
          recording_url: string | null
          resources: Json | null
          scheduled_at: string
          session_notes: string | null
          session_type: string | null
          status: string | null
          timezone: string | null
          title: string
          updated_at: string
        }
        Insert: {
          coach_user_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          follow_up_actions?: Json | null
          id?: string
          meeting_id?: string | null
          meeting_password?: string | null
          meeting_url?: string | null
          membership_id: string
          preparation_notes?: string | null
          recording_url?: string | null
          resources?: Json | null
          scheduled_at: string
          session_notes?: string | null
          session_type?: string | null
          status?: string | null
          timezone?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          coach_user_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          follow_up_actions?: Json | null
          id?: string
          meeting_id?: string | null
          meeting_password?: string | null
          meeting_url?: string | null
          membership_id?: string
          preparation_notes?: string | null
          recording_url?: string | null
          resources?: Json | null
          scheduled_at?: string
          session_notes?: string | null
          session_type?: string | null
          status?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_sessions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          is_solution: boolean | null
          likes_count: number | null
          parent_reply_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          content: string
          created_at: string
          discussion_type: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_reply_at: string | null
          lesson_id: string | null
          module_id: string | null
          replies_count: number | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          discussion_type?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          lesson_id?: string | null
          module_id?: string | null
          replies_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          discussion_type?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          lesson_id?: string | null
          module_id?: string | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "program_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_downloads: {
        Row: {
          created_at: string
          download_date: string
          file_name: string
          id: string
          ip_address: unknown | null
          kit_id: string
          membership_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          download_date?: string
          file_name: string
          id?: string
          ip_address?: unknown | null
          kit_id: string
          membership_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          download_date?: string
          file_name?: string
          id?: string
          ip_address?: unknown | null
          kit_id?: string
          membership_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kit_downloads_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kit_downloads_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      kits: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          download_count: number | null
          featured_image: string | null
          files: Json | null
          gallery: Json | null
          id: string
          is_active: boolean | null
          kit_type: string | null
          plan_ids: string[] | null
          preview_images: Json | null
          required_week: number | null
          requires_membership: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured_image?: string | null
          files?: Json | null
          gallery?: Json | null
          id?: string
          is_active?: boolean | null
          kit_type?: string | null
          plan_ids?: string[] | null
          preview_images?: Json | null
          required_week?: number | null
          requires_membership?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured_image?: string | null
          files?: Json | null
          gallery?: Json | null
          id?: string
          is_active?: boolean | null
          kit_type?: string | null
          plan_ids?: string[] | null
          preview_images?: Json | null
          required_week?: number | null
          requires_membership?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          exercise_responses: Json | null
          feedback: string | null
          id: string
          last_accessed_at: string | null
          lesson_id: string
          membership_id: string
          notes: string | null
          progress_percentage: number | null
          rating: number | null
          reflection_responses: Json | null
          started_at: string | null
          status: string | null
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exercise_responses?: Json | null
          feedback?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id: string
          membership_id: string
          notes?: string | null
          progress_percentage?: number | null
          rating?: number | null
          reflection_responses?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exercise_responses?: Json | null
          feedback?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string
          membership_id?: string
          notes?: string | null
          progress_percentage?: number | null
          rating?: number | null
          reflection_responses?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          audio_url: string | null
          content: string | null
          content_type: string | null
          created_at: string
          description: string | null
          downloads: Json | null
          duration_minutes: number | null
          estimated_time_minutes: number | null
          exercises: Json | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          lesson_number: number
          module_id: string
          reflection_questions: Json | null
          requires_completion: boolean | null
          resources: Json | null
          slug: string
          sort_order: number | null
          thumbnails: Json | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          downloads?: Json | null
          duration_minutes?: number | null
          estimated_time_minutes?: number | null
          exercises?: Json | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          lesson_number: number
          module_id: string
          reflection_questions?: Json | null
          requires_completion?: boolean | null
          resources?: Json | null
          slug: string
          sort_order?: number | null
          thumbnails?: Json | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          downloads?: Json | null
          duration_minutes?: number | null
          estimated_time_minutes?: number | null
          exercises?: Json | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          module_id?: string
          reflection_questions?: Json | null
          requires_completion?: boolean | null
          resources?: Json | null
          slug?: string
          sort_order?: number | null
          thumbnails?: Json | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "program_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          billing_cycle: string | null
          created_at: string
          currency: string
          description: string | null
          duration_months: number | null
          features: Json | null
          id: string
          includes_coaching: boolean | null
          includes_community: boolean | null
          includes_materials: boolean | null
          is_active: boolean | null
          max_users: number | null
          name: string
          price: number
          slug: string
          sort_order: number | null
          trial_days: number | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_months?: number | null
          features?: Json | null
          id?: string
          includes_coaching?: boolean | null
          includes_community?: boolean | null
          includes_materials?: boolean | null
          is_active?: boolean | null
          max_users?: number | null
          name: string
          price: number
          slug: string
          sort_order?: number | null
          trial_days?: number | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration_months?: number | null
          features?: Json | null
          id?: string
          includes_coaching?: boolean | null
          includes_community?: boolean | null
          includes_materials?: boolean | null
          is_active?: boolean | null
          max_users?: number | null
          name?: string
          price?: number
          slug?: string
          sort_order?: number | null
          trial_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          cancelled_at: string | null
          coach_notes: string | null
          completed_lessons: number | null
          created_at: string
          current_week: number | null
          end_date: string | null
          id: string
          member_goals: string | null
          member_notes: string | null
          mp_subscription_id: string | null
          next_billing_date: string | null
          pause_end: string | null
          pause_start: string | null
          payment_method: string | null
          plan_id: string
          progress_percentage: number | null
          start_date: string
          status: string | null
          total_lessons: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          coach_notes?: string | null
          completed_lessons?: number | null
          created_at?: string
          current_week?: number | null
          end_date?: string | null
          id?: string
          member_goals?: string | null
          member_notes?: string | null
          mp_subscription_id?: string | null
          next_billing_date?: string | null
          pause_end?: string | null
          pause_start?: string | null
          payment_method?: string | null
          plan_id: string
          progress_percentage?: number | null
          start_date?: string
          status?: string | null
          total_lessons?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          coach_notes?: string | null
          completed_lessons?: number | null
          created_at?: string
          current_week?: number | null
          end_date?: string | null
          id?: string
          member_goals?: string | null
          member_notes?: string | null
          mp_subscription_id?: string | null
          next_billing_date?: string | null
          pause_end?: string | null
          pause_start?: string | null
          payment_method?: string | null
          plan_id?: string
          progress_percentage?: number | null
          start_date?: string
          status?: string | null
          total_lessons?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          sku: string | null
          total_price: number
          unit_price: number
          variant_id: string | null
          variant_title: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          sku?: string | null
          total_price: number
          unit_price: number
          variant_id?: string | null
          variant_title?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          sku?: string | null
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          variant_title?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_1: string | null
          billing_address_2: string | null
          billing_city: string | null
          billing_company: string | null
          billing_country: string | null
          billing_first_name: string | null
          billing_last_name: string | null
          billing_phone: string | null
          billing_postal_code: string | null
          billing_state: string | null
          carrier: string | null
          created_at: string
          currency: string
          customer_notes: string | null
          delivered_at: string | null
          discount_amount: number | null
          email: string
          fulfillment_status: string | null
          id: string
          mp_payment_id: string | null
          mp_payment_method: string | null
          mp_payment_type: string | null
          mp_preference_id: string | null
          mp_status: string | null
          mp_status_detail: string | null
          order_number: string
          payment_status: string | null
          shipped_at: string | null
          shipping_address_1: string | null
          shipping_address_2: string | null
          shipping_amount: number | null
          shipping_city: string | null
          shipping_company: string | null
          shipping_country: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address_1?: string | null
          billing_address_2?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_phone?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          carrier?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          email: string
          fulfillment_status?: string | null
          id?: string
          mp_payment_id?: string | null
          mp_payment_method?: string | null
          mp_payment_type?: string | null
          mp_preference_id?: string | null
          mp_status?: string | null
          mp_status_detail?: string | null
          order_number: string
          payment_status?: string | null
          shipped_at?: string | null
          shipping_address_1?: string | null
          shipping_address_2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address_1?: string | null
          billing_address_2?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_phone?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          carrier?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          email?: string
          fulfillment_status?: string | null
          id?: string
          mp_payment_id?: string | null
          mp_payment_method?: string | null
          mp_payment_type?: string | null
          mp_preference_id?: string | null
          mp_status?: string | null
          mp_status_detail?: string | null
          order_number?: string
          payment_status?: string | null
          shipped_at?: string | null
          shipping_address_1?: string | null
          shipping_address_2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          barcode: string | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          id: string
          image_url: string | null
          inventory_quantity: number | null
          is_default: boolean | null
          option1: string | null
          option2: string | null
          option3: string | null
          position: number | null
          price: number
          product_id: string
          sku: string | null
          title: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          inventory_quantity?: number | null
          is_default?: boolean | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          position?: number | null
          price: number
          product_id: string
          sku?: string | null
          title: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          inventory_quantity?: number | null
          is_default?: boolean | null
          option1?: string | null
          option2?: string | null
          option3?: string | null
          position?: number | null
          price?: number
          product_id?: string
          sku?: string | null
          title?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          benefits: string[] | null
          category_id: string | null
          certifications: string[] | null
          collections: string[] | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          currency: string
          description: string | null
          dimensions: Json | null
          featured_image: string | null
          gallery: Json | null
          id: string
          ingredients: Json | null
          inventory_policy: string | null
          inventory_quantity: number | null
          is_digital: boolean | null
          is_featured: boolean | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          precautions: string | null
          price: number
          published_at: string | null
          requires_shipping: boolean | null
          search_keywords: string[] | null
          shelf_life_months: number | null
          short_description: string | null
          skin_type: string[] | null
          sku: string | null
          slug: string
          status: string | null
          tags: string[] | null
          track_inventory: boolean | null
          updated_at: string
          usage_instructions: string | null
          vendor: string | null
          video_url: string | null
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          benefits?: string[] | null
          category_id?: string | null
          certifications?: string[] | null
          collections?: string[] | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          dimensions?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          ingredients?: Json | null
          inventory_policy?: string | null
          inventory_quantity?: number | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          precautions?: string | null
          price: number
          published_at?: string | null
          requires_shipping?: boolean | null
          search_keywords?: string[] | null
          shelf_life_months?: number | null
          short_description?: string | null
          skin_type?: string[] | null
          sku?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          usage_instructions?: string | null
          vendor?: string | null
          video_url?: string | null
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          benefits?: string[] | null
          category_id?: string | null
          certifications?: string[] | null
          collections?: string[] | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          dimensions?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          ingredients?: Json | null
          inventory_policy?: string | null
          inventory_quantity?: number | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          precautions?: string | null
          price?: number
          published_at?: string | null
          requires_shipping?: boolean | null
          search_keywords?: string[] | null
          shelf_life_months?: number | null
          short_description?: string | null
          skin_type?: string[] | null
          sku?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          usage_instructions?: string | null
          vendor?: string | null
          video_url?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          is_member: boolean | null
          language: string | null
          last_name: string | null
          membership_end_date: string | null
          membership_start_date: string | null
          membership_tier: string | null
          newsletter_subscribed: boolean | null
          phone: string | null
          postal_code: string | null
          state: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id: string
          is_member?: boolean | null
          language?: string | null
          last_name?: string | null
          membership_end_date?: string | null
          membership_start_date?: string | null
          membership_tier?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_member?: boolean | null
          language?: string | null
          last_name?: string | null
          membership_end_date?: string | null
          membership_start_date?: string | null
          membership_tier?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      program_modules: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number | null
          featured_image: string | null
          id: string
          intro_video_url: string | null
          is_published: boolean | null
          key_concepts: Json | null
          objectives: Json | null
          overview: string | null
          plan_id: string
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
          week_number: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          featured_image?: string | null
          id?: string
          intro_video_url?: string | null
          is_published?: boolean | null
          key_concepts?: Json | null
          objectives?: Json | null
          overview?: string | null
          plan_id: string
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
          week_number: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          featured_image?: string | null
          id?: string
          intro_video_url?: string | null
          is_published?: boolean | null
          key_concepts?: Json | null
          objectives?: Json | null
          overview?: string | null
          plan_id?: string
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_modules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
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