// Tipe database Supabase (skema public).
// Regenerasi setelah skema berubah: npm run db:types
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
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name_id: string;
          name_en: string | null;
          slug: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_id: string;
          name_en?: string | null;
          slug: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_id?: string;
          name_en?: string | null;
          slug?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          issuer: string | null;
          issued_at: string | null;
          credential_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          issuer?: string | null;
          issued_at?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          issuer?: string | null;
          issued_at?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      educations: {
        Row: {
          id: string;
          institution: string;
          program_id: string;
          program_en: string | null;
          start_date: string;
          end_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          program_id: string;
          program_en?: string | null;
          start_date: string;
          end_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          program_id?: string;
          program_en?: string | null;
          start_date?: string;
          end_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          company: string;
          position_id: string;
          position_en: string | null;
          location_id: string | null;
          location_en: string | null;
          start_date: string;
          end_date: string | null;
          highlights_id: string[];
          highlights_en: string[] | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position_id: string;
          position_en?: string | null;
          location_id?: string | null;
          location_en?: string | null;
          start_date: string;
          end_date?: string | null;
          highlights_id?: string[];
          highlights_en?: string[] | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position_id?: string;
          position_en?: string | null;
          location_id?: string | null;
          location_en?: string | null;
          start_date?: string;
          end_date?: string | null;
          highlights_id?: string[];
          highlights_en?: string[] | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title_id: string;
          title_en: string | null;
          slug: string;
          excerpt_id: string | null;
          excerpt_en: string | null;
          content_id: string;
          content_en: string | null;
          cover_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_id: string;
          title_en?: string | null;
          slug: string;
          excerpt_id?: string | null;
          excerpt_en?: string | null;
          content_id?: string;
          content_en?: string | null;
          cover_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_id?: string;
          title_en?: string | null;
          slug?: string;
          excerpt_id?: string | null;
          excerpt_en?: string | null;
          content_id?: string;
          content_en?: string | null;
          cover_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          id: string;
          singleton: boolean;
          name: string;
          role_titles_id: string[];
          role_titles_en: string[] | null;
          bio_id: string;
          bio_en: string | null;
          about_id: string | null;
          about_en: string | null;
          location_id: string | null;
          location_en: string | null;
          hero_photo_url: string | null;
          cv_url: string | null;
          email: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          instagram_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          singleton?: boolean;
          name: string;
          role_titles_id?: string[];
          role_titles_en?: string[] | null;
          bio_id: string;
          bio_en?: string | null;
          about_id?: string | null;
          about_en?: string | null;
          location_id?: string | null;
          location_en?: string | null;
          hero_photo_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          singleton?: boolean;
          name?: string;
          role_titles_id?: string[];
          role_titles_en?: string[] | null;
          bio_id?: string;
          bio_en?: string | null;
          about_id?: string | null;
          about_en?: string | null;
          location_id?: string | null;
          location_en?: string | null;
          hero_photo_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title_id: string;
          title_en: string | null;
          slug: string;
          summary_id: string;
          summary_en: string | null;
          problem_id: string | null;
          problem_en: string | null;
          solution_id: string | null;
          solution_en: string | null;
          role_id: string | null;
          role_en: string | null;
          thumbnail_url: string | null;
          gallery: string[];
          tech_stack: string[];
          demo_url: string | null;
          github_url: string | null;
          category_id: string | null;
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_id: string;
          title_en?: string | null;
          slug: string;
          summary_id: string;
          summary_en?: string | null;
          problem_id?: string | null;
          problem_en?: string | null;
          solution_id?: string | null;
          solution_en?: string | null;
          role_id?: string | null;
          role_en?: string | null;
          thumbnail_url?: string | null;
          gallery?: string[];
          tech_stack?: string[];
          demo_url?: string | null;
          github_url?: string | null;
          category_id?: string | null;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_id?: string;
          title_en?: string | null;
          slug?: string;
          summary_id?: string;
          summary_en?: string | null;
          problem_id?: string | null;
          problem_en?: string | null;
          solution_id?: string | null;
          solution_en?: string | null;
          role_id?: string | null;
          role_en?: string | null;
          thumbnail_url?: string | null;
          gallery?: string[];
          tech_stack?: string[];
          demo_url?: string | null;
          github_url?: string | null;
          category_id?: string | null;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          title_id: string;
          title_en: string | null;
          icon: string | null;
          description_id: string;
          description_en: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_id: string;
          title_en?: string | null;
          icon?: string | null;
          description_id: string;
          description_en?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_id?: string;
          title_en?: string | null;
          icon?: string | null;
          description_id?: string;
          description_en?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name_id: string;
          name_en: string | null;
          icon: string | null;
          group_name: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_id: string;
          name_en?: string | null;
          icon?: string | null;
          group_name?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_id?: string;
          name_en?: string | null;
          icon?: string | null;
          group_name?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          photo_url: string | null;
          quote_id: string;
          quote_en: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          photo_url?: string | null;
          quote_id: string;
          quote_en?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          photo_url?: string | null;
          quote_id?: string;
          quote_en?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
