export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          brand_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          brand_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          brand_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          garment_id: string;
          garment_color: string;
          layers: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          garment_id: string;
          garment_color: string;
          layers: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          garment_id?: string;
          garment_color?: string;
          layers?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      mockups: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          garment_name: string;
          garment_color: string;
          camera_preset: string;
          environment_preset: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          garment_name: string;
          garment_color: string;
          camera_preset: string;
          environment_preset: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          garment_name?: string;
          garment_color?: string;
          camera_preset?: string;
          environment_preset?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          sku: string;
          retail_price: number;
          blank_cost: number;
          print_cost: number;
          shipping_cost: number;
          profit_margin: number;
          sizes: Json;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          sku: string;
          retail_price: number;
          blank_cost: number;
          print_cost: number;
          shipping_cost: number;
          profit_margin: number;
          sizes: Json;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          sku?: string;
          retail_price?: number;
          blank_cost?: number;
          print_cost?: number;
          shipping_cost?: number;
          profit_margin?: number;
          sizes?: Json;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      marketplace_drops: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          garment_id: string;
          garment_color: string;
          layers: Json;
          thumbnail_url: string | null;
          price_usd: number;
          likes_count: number;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          garment_id: string;
          garment_color: string;
          layers: Json;
          thumbnail_url?: string | null;
          price_usd: number;
          likes_count?: number;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          garment_id?: string;
          garment_color?: string;
          layers?: Json;
          thumbnail_url?: string | null;
          price_usd?: number;
          likes_count?: number;
          is_public?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
