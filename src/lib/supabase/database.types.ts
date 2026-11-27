export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "17.1";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          name_en: string | null;
          name_id: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name_en?: string | null;
          name_id: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name_en?: string | null;
          name_id?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          created_at: string;
          credential_url: string | null;
          id: string;
          issued_at: string | null;
          issuer: string | null;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          credential_url?: string | null;
          id?: string;
          issued_at?: string | null;
          issuer?: string | null;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          credential_url?: string | null;
          id?: string;
          issued_at?: string | null;
          issuer?: string | null;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      educations: {
        Row: {
          created_at: string;
          end_date: string | null;
          id: string;
          institution: string;
          program_en: string | null;
          program_id: string;
          sort_order: number;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          institution: string;
          program_en?: string | null;
          program_id: string;
          sort_order?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          institution?: string;
          program_en?: string | null;
          program_id?: string;
          sort_order?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          company: string;
          created_at: string;
          end_date: string | null;
          highlights_en: string[] | null;
          highlights_id: string[];
          id: string;
          location_en: string | null;
          location_id: string | null;
          position_en: string | null;
          position_id: string;
          sort_order: number;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          end_date?: string | null;
          highlights_en?: string[] | null;
          highlights_id?: string[];
          id?: string;
          location_en?: string | null;
          location_id?: string | null;
          position_en?: string | null;
          position_id: string;
          sort_order?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          end_date?: string | null;
          highlights_en?: string[] | null;
          highlights_id?: string[];
          id?: string;
          location_en?: string | null;
          location_id?: string | null;
          position_en?: string | null;
          position_id?: string;
          sort_order?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_hash: string | null;
          is_read: boolean;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_hash?: string | null;
          is_read?: boolean;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string | null;
          is_read?: boolean;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content_en: string | null;
          content_id: string;
          cover_url: string | null;
          created_at: string;
          excerpt_en: string | null;
          excerpt_id: string | null;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          title_en: string | null;
          title_id: string;
          updated_at: string;
        };
        Insert: {
          content_en?: string | null;
          content_id?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt_en?: string | null;
          excerpt_id?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          title_en?: string | null;
          title_id: string;
          updated_at?: string;
        };
        Update: {
          content_en?: string | null;
          content_id?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt_en?: string | null;
          excerpt_id?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          title_en?: string | null;
          title_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          about_en: string | null;
          about_id: string | null;
          bio_en: string | null;
          bio_id: string;
          created_at: string;
          cv_url: string | null;
          email: string | null;
          github_url: string | null;
          hero_photo_url: string | null;
          id: string;
          instagram_url: string | null;
          linkedin_url: string | null;
          location_en: string | null;
          location_id: string | null;
          name: string;
          role_titles_en: string[] | null;
          role_titles_id: string[];
          singleton: boolean;
          updated_at: string;
        };
        Insert: {
          about_en?: string | null;
          about_id?: string | null;
          bio_en?: string | null;
          bio_id: string;
          created_at?: string;
          cv_url?: string | null;
          email?: string | null;
          github_url?: string | null;
          hero_photo_url?: string | null;
          id?: string;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          location_en?: string | null;
          location_id?: string | null;
          name: string;
          role_titles_en?: string[] | null;
          role_titles_id?: string[];
          singleton?: boolean;
          updated_at?: string;
        };
        Update: {
          about_en?: string | null;
          about_id?: string | null;
          bio_en?: string | null;
          bio_id?: string;
          created_at?: string;
          cv_url?: string | null;
          email?: string | null;
          github_url?: string | null;
          hero_photo_url?: string | null;
          id?: string;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          location_en?: string | null;
          location_id?: string | null;
          name?: string;
          role_titles_en?: string[] | null;
          role_titles_id?: string[];
          singleton?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category_id: string | null;
          created_at: string;
          demo_url: string | null;
          featured: boolean;
          gallery: string[];
          github_url: string | null;
          id: string;
          problem_en: string | null;
          problem_id: string | null;
          published: boolean;
          role_en: string | null;
          role_id: string | null;
          slug: string;
          solution_en: string | null;
          solution_id: string | null;
          sort_order: number;
          summary_en: string | null;
          summary_id: string;
          tech_stack: string[];
          thumbnail_url: string | null;
          title_en: string | null;
          title_id: string;
          updated_at: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          demo_url?: string | null;
          featured?: boolean;
          gallery?: string[];
          github_url?: string | null;
          id?: string;
          problem_en?: string | null;
          problem_id?: string | null;
          published?: boolean;
          role_en?: string | null;
          role_id?: string | null;
          slug: string;
          solution_en?: string | null;
          solution_id?: string | null;
          sort_order?: number;
          summary_en?: string | null;
          summary_id: string;
          tech_stack?: string[];
          thumbnail_url?: string | null;
          title_en?: string | null;
          title_id: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          demo_url?: string | null;
          featured?: boolean;
          gallery?: string[];
          github_url?: string | null;
          id?: string;
          problem_en?: string | null;
          problem_id?: string | null;
          published?: boolean;
          role_en?: string | null;
          role_id?: string | null;
          slug?: string;
          solution_en?: string | null;
          solution_id?: string | null;
          sort_order?: number;
          summary_en?: string | null;
          summary_id?: string;
          tech_stack?: string[];
          thumbnail_url?: string | null;
          title_en?: string | null;
          title_id?: string;
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
          created_at: string;
          description_en: string | null;
          description_id: string;
          icon: string | null;
          id: string;
          sort_order: number;
          title_en: string | null;
          title_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_id: string;
          icon?: string | null;
          id?: string;
          sort_order?: number;
          title_en?: string | null;
          title_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_id?: string;
          icon?: string | null;
          id?: string;
          sort_order?: number;
          title_en?: string | null;
          title_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          created_at: string;
          group_name: string;
          icon: string | null;
          id: string;
          name_en: string | null;
          name_id: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          group_name?: string;
          icon?: string | null;
          id?: string;
          name_en?: string | null;
          name_id: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          group_name?: string;
          icon?: string | null;
          id?: string;
          name_en?: string | null;
          name_id?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          photo_url: string | null;
          quote_en: string | null;
          quote_id: string;
          role: string | null;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          photo_url?: string | null;
          quote_en?: string | null;
          quote_id: string;
          role?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          photo_url?: string | null;
          quote_en?: string | null;
          quote_id?: string;
          role?: string | null;
          sort_order?: number;
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
      submit_message: {
        Args: {
          p_email: string;
          p_ip_hash?: string;
          p_message: string;
          p_name: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
