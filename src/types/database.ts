export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          date_of_birth: string | null;
          avatar_url: string | null;
          bio: string | null;
          address_line_1: string | null;
          address_line_2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string | null;
          is_member: boolean | null;
          membership_tier: string | null;
          membership_start_date: string | null;
          membership_end_date: string | null;
          newsletter_subscribed: boolean | null;
          language: string | null;
          timezone: string | null;
          created_at: string;
          updated_at: string;
          // From migration 20260323000001 - denormalized treasures for fast queries
          treasures: string[] | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          phone?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          is_member?: boolean | null;
          membership_tier?: string | null;
          membership_start_date?: string | null;
          membership_end_date?: string | null;
          newsletter_subscribed?: boolean | null;
          language?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
          treasures?: string[] | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          phone?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          is_member?: boolean | null;
          membership_tier?: string | null;
          membership_start_date?: string | null;
          membership_end_date?: string | null;
          newsletter_subscribed?: boolean | null;
          language?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
          treasures?: string[] | null;
        };
        Relationships: [];
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_treasures: {
        Row: {
          id: string;
          user_id: string;
          access_id: string;
          granted_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_id: string;
          granted_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          access_id?: string;
          granted_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_treasures_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      system_config: {
        Row: {
          id: string;
          config_key: string;
          config_value: Json;
          description: string | null;
          category: string;
          is_public: boolean | null;
          is_sensitive: boolean | null;
          value_type: string;
          validation_rules: Json | null;
          last_modified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          config_key: string;
          config_value: Json;
          description?: string | null;
          category?: string;
          is_public?: boolean | null;
          is_sensitive?: boolean | null;
          value_type?: string;
          validation_rules?: Json | null;
          last_modified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          config_key?: string;
          config_value?: Json;
          description?: string | null;
          category?: string;
          is_public?: boolean | null;
          is_sensitive?: boolean | null;
          value_type?: string;
          validation_rules?: Json | null;
          last_modified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          short_description: string | null;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          currency: string;
          sku: string | null;
          barcode: string | null;
          weight: number | null;
          dimensions: Json | null;
          track_inventory: boolean | null;
          inventory_quantity: number | null;
          stock_quantity: number | null;
          inventory_policy: string | null;
          low_stock_threshold: number | null;
          featured_image: string | null;
          gallery: Json | null;
          video_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          search_keywords: string[] | null;
          ingredients: Json | null;
          skin_type: string[] | null;
          benefits: string[] | null;
          usage_instructions: string | null;
          precautions: string | null;
          certifications: string[] | null;
          shelf_life_months: number | null;
          category_id: string | null;
          tags: string[] | null;
          collections: string[] | null;
          vendor: string | null;
          status: string | null;
          is_featured: boolean | null;
          is_digital: boolean | null;
          requires_shipping: boolean | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          // Legacy fields (deprecated - use promotional_tag instead)
          is_natural: boolean | null;
          is_new: boolean | null;
          is_on_sale: boolean | null;
          // New fields from migration 20260325000000
          promotional_tag:
            | Database["public"]["Enums"]["promotional_tag_type"]
            | null;
          discount_transfer_percent: number | null;
          discount_cash_percent: number | null;
          // From migration 20260323000001
          access_id: string | null;
          package_characteristics: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          currency?: string;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          dimensions?: Json | null;
          track_inventory?: boolean | null;
          inventory_quantity?: number | null;
          stock_quantity?: number | null;
          inventory_policy?: string | null;
          low_stock_threshold?: number | null;
          featured_image?: string | null;
          gallery?: Json | null;
          video_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          search_keywords?: string[] | null;
          ingredients?: Json | null;
          skin_type?: string[] | null;
          benefits?: string[] | null;
          usage_instructions?: string | null;
          precautions?: string | null;
          certifications?: string[] | null;
          shelf_life_months?: number | null;
          category_id?: string | null;
          tags?: string[] | null;
          collections?: string[] | null;
          vendor?: string | null;
          status?: string | null;
          is_featured?: boolean | null;
          is_digital?: boolean | null;
          requires_shipping?: boolean | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          // Legacy fields
          is_natural?: boolean | null;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          // New fields
          promotional_tag?:
            | Database["public"]["Enums"]["promotional_tag_type"]
            | null;
          discount_transfer_percent?: number | null;
          discount_cash_percent?: number | null;
          access_id?: string | null;
          package_characteristics?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          currency?: string;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          dimensions?: Json | null;
          track_inventory?: boolean | null;
          inventory_quantity?: number | null;
          stock_quantity?: number | null;
          inventory_policy?: string | null;
          low_stock_threshold?: number | null;
          featured_image?: string | null;
          gallery?: Json | null;
          video_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          search_keywords?: string[] | null;
          ingredients?: Json | null;
          skin_type?: string[] | null;
          benefits?: string[] | null;
          usage_instructions?: string | null;
          precautions?: string | null;
          certifications?: string[] | null;
          shelf_life_months?: number | null;
          category_id?: string | null;
          tags?: string[] | null;
          collections?: string[] | null;
          vendor?: string | null;
          status?: string | null;
          is_featured?: boolean | null;
          is_digital?: boolean | null;
          requires_shipping?: boolean | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          // Legacy fields
          is_natural?: boolean | null;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          // New fields
          promotional_tag?:
            | Database["public"]["Enums"]["promotional_tag_type"]
            | null;
          discount_transfer_percent?: number | null;
          discount_cash_percent?: number | null;
          access_id?: string | null;
          package_characteristics?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: string;
          total_amount: number;
          subtotal: number;
          tax_amount: number;
          shipping_amount: number;
          discount_amount: number | null;
          currency: string;
          payment_method: string | null;
          payment_status: string;
          mercadoPago_id: string | null;
          mercadoPago_status: string | null;
          shipping_name: string | null;
          shipping_email: string | null;
          shipping_phone: string | null;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_state: string | null;
          shipping_postal_code: string | null;
          shipping_country: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          status?: string;
          total_amount: number;
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number | null;
          currency?: string;
          payment_method?: string | null;
          payment_status?: string;
          mercadoPago_id?: string | null;
          mercadoPago_status?: string | null;
          shipping_name?: string | null;
          shipping_email?: string | null;
          shipping_phone?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_state?: string | null;
          shipping_postal_code?: string | null;
          shipping_country?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          status?: string;
          total_amount?: number;
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number | null;
          currency?: string;
          payment_method?: string | null;
          payment_status?: string;
          mercadoPago_id?: string | null;
          mercadoPago_status?: string | null;
          shipping_name?: string | null;
          shipping_email?: string | null;
          shipping_phone?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_state?: string | null;
          shipping_postal_code?: string | null;
          shipping_country?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          product_name: string;
          variant_title: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          product_name: string;
          variant_title?: string | null;
          quantity: number;
          unit_price: number;
          total_price?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          product_name?: string;
          variant_title?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          is_verified_purchase: boolean;
          is_approved: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_approved?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_approved?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          permissions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: string;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      webhook_logs: {
        Row: {
          id: string;
          source: string;
          event_type: string | null;
          payload: Json;
          status: string;
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          event_type?: string | null;
          payload?: Json;
          status?: string;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          event_type?: string | null;
          payload?: Json;
          status?: string;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          status: string;
          priority: string | null;
          category: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          status?: string;
          priority?: string | null;
          category?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          status?: string;
          priority?: string | null;
          category?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      support_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string;
          sender_type: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id: string;
          sender_type: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          sender_id?: string;
          sender_type?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "support_tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      support_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      support_templates: {
        Row: {
          id: string;
          category: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          title: string | null;
          price: number | null;
          inventory_quantity: number | null;
          option1: string | null;
          option2: string | null;
          option3: string | null;
          is_default: boolean | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          title?: string | null;
          price?: number | null;
          inventory_quantity?: number | null;
          option1?: string | null;
          option2?: string | null;
          option3?: string | null;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          title?: string | null;
          price?: number | null;
          inventory_quantity?: number | null;
          option1?: string | null;
          option2?: string | null;
          option3?: string | null;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_events: {
        Row: {
          id: string;
          event_name: string;
          event_category: string;
          event_data: Json | null;
          user_id: string | null;
          session_id: string | null;
          device_type: string | null;
          browser: string | null;
          os: string | null;
          country: string | null;
          city: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_term: string | null;
          utm_content: string | null;
          page_url: string | null;
          referrer_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name: string;
          event_category: string;
          event_data?: Json | null;
          user_id?: string | null;
          session_id?: string | null;
          device_type?: string | null;
          browser?: string | null;
          os?: string | null;
          country?: string | null;
          city?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
          page_url?: string | null;
          referrer_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string;
          event_category?: string;
          event_data?: Json | null;
          user_id?: string | null;
          session_id?: string | null;
          device_type?: string | null;
          browser?: string | null;
          os?: string | null;
          country?: string | null;
          city?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
          page_url?: string | null;
          referrer_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      research_metrics: {
        Row: {
          id: string;
          experiment_name: string;
          hypothesis: string | null;
          variant: string;
          control_value: number | null;
          variant_value: number | null;
          sample_size_control: number | null;
          sample_size_variant: number | null;
          conversion_rate_control: number | null;
          conversion_rate_variant: number | null;
          statistical_significance: number | null;
          p_value: number | null;
          confidence_level: number | null;
          status: string | null;
          started_at: string | null;
          ended_at: string | null;
          winner: string | null;
          learnings: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          experiment_name: string;
          hypothesis?: string | null;
          variant: string;
          control_value?: number | null;
          variant_value?: number | null;
          sample_size_control?: number | null;
          sample_size_variant?: number | null;
          conversion_rate_control?: number | null;
          conversion_rate_variant?: number | null;
          statistical_significance?: number | null;
          p_value?: number | null;
          confidence_level?: number | null;
          status?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          winner?: string | null;
          learnings?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          experiment_name?: string;
          hypothesis?: string | null;
          variant?: string;
          control_value?: number | null;
          variant_value?: number | null;
          sample_size_control?: number | null;
          sample_size_variant?: number | null;
          conversion_rate_control?: number | null;
          conversion_rate_variant?: number | null;
          statistical_significance?: number | null;
          p_value?: number | null;
          confidence_level?: number | null;
          status?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          winner?: string | null;
          learnings?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ab_test_configs: {
        Row: {
          id: string;
          experiment_name: string;
          description: string | null;
          hypothesis: string | null;
          status: string | null;
          traffic_percentage: number | null;
          variant_control: Json | null;
          variant_test: Json | null;
          start_date: string | null;
          end_date: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          experiment_name: string;
          description?: string | null;
          hypothesis?: string | null;
          status?: string | null;
          traffic_percentage?: number | null;
          variant_control?: Json | null;
          variant_test?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          experiment_name?: string;
          description?: string | null;
          hypothesis?: string | null;
          status?: string | null;
          traffic_percentage?: number | null;
          variant_control?: Json | null;
          variant_test?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ab_test_assignments: {
        Row: {
          id: string;
          experiment_name: string;
          user_id: string;
          variant: string;
          assigned_at: string;
          converted: boolean | null;
          conversion_goal: string | null;
          converted_at: string | null;
        };
        Insert: {
          id?: string;
          experiment_name: string;
          user_id: string;
          variant: string;
          assigned_at?: string;
          converted?: boolean | null;
          conversion_goal?: string | null;
          converted_at?: string | null;
        };
        Update: {
          id?: string;
          experiment_name?: string;
          user_id?: string;
          variant?: string;
          assigned_at?: string;
          converted?: boolean | null;
          conversion_goal?: string | null;
          converted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ab_test_assignments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      track_event: {
        Args: {
          p_event_name: string;
          p_event_category: string;
          p_event_data?: Json | null;
          p_user_id?: string | null;
          p_session_id?: string | null;
        };
        Returns: string;
      };
      track_ab_experiment: {
        Args: {
          p_experiment_name: string;
          p_variant: string;
          p_event_type?: string;
          p_goal?: string;
        };
        Returns: string;
      };
      assign_user_to_experiment: {
        Args: {
          p_experiment_name: string;
          p_user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      promotional_tag_type:
        | "none"
        | "lanzamiento"
        | "descuento"
        | "ultimas_unidades";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
