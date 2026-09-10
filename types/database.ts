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
      restaurant_memberships: {
        Row: {
          created_at: string;
          id: string;
          restaurant_id: string;
          role: Database["public"]["Enums"]["restaurant_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          restaurant_id: string;
          role: Database["public"]["Enums"]["restaurant_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          restaurant_id?: string;
          role?: Database["public"]["Enums"]["restaurant_role"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_memberships_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      restaurants: {
        Row: {
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          country: string;
          created_at: string;
          id: string;
          name: string;
          phone: string;
          postal_code: string;
          region: string;
          trial_ends_at: string;
          trial_started_at: string;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          country: string;
          created_at?: string;
          id?: string;
          name: string;
          phone: string;
          postal_code: string;
          region: string;
          trial_ends_at: string;
          trial_started_at: string;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          country?: string;
          created_at?: string;
          id?: string;
          name?: string;
          phone?: string;
          postal_code?: string;
          region?: string;
          trial_ends_at?: string;
          trial_started_at?: string;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_restaurant_account: {
        Args: {
          p_address_line_1: string;
          p_address_line_2: string | null;
          p_city: string;
          p_country: string;
          p_name: string;
          p_phone: string;
          p_postal_code: string;
          p_region: string;
          p_trial_duration_days: number;
          p_user_id: string;
          p_website: string | null;
        };
        Returns: {
          restaurant_id: string;
        }[];
      };
    };
    Enums: {
      restaurant_role: "owner" | "admin" | "staff";
    };
    CompositeTypes: Record<string, never>;
  };
};
