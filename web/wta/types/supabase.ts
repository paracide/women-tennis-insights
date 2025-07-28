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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      player: {
        Row: {
          dob: string | null
          hand: string | null
          height: string | null
          ioc: string | null
          name_first: string | null
          name_last: string | null
          player_id: number
          wikidata_id: string | null
        }
        Insert: {
          dob?: string | null
          hand?: string | null
          height?: string | null
          ioc?: string | null
          name_first?: string | null
          name_last?: string | null
          player_id: number
          wikidata_id?: string | null
        }
        Update: {
          dob?: string | null
          hand?: string | null
          height?: string | null
          ioc?: string | null
          name_first?: string | null
          name_last?: string | null
          player_id?: number
          wikidata_id?: string | null
        }
        Relationships: []
      }
      rankings_current: {
        Row: {
          player: number | null
          points: number | null
          rank: number | null
          ranking_date: number | null
          tours: string | null
        }
        Insert: {
          player?: number | null
          points?: number | null
          rank?: number | null
          ranking_date?: number | null
          tours?: string | null
        }
        Update: {
          player?: number | null
          points?: number | null
          rank?: number | null
          ranking_date?: number | null
          tours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rankings_current_player_fkey"
            columns: ["player"]
            isOneToOne: false
            referencedRelation: "player"
            referencedColumns: ["player_id"]
          },
        ]
      }
      wta: {
        Row: {
          best_of: string | null
          data_from: string | null
          draw_size: string | null
          id: number
          l_1stin: string | null
          l_1stwon: string | null
          l_2ndwon: string | null
          l_ace: string | null
          l_bpfaced: string | null
          l_bpsaved: string | null
          l_df: string | null
          l_svgms: string | null
          l_svpt: string | null
          loser_age: string | null
          loser_entry: string | null
          loser_hand: string | null
          loser_ht: string | null
          loser_id: number | null
          loser_ioc: string | null
          loser_name: string | null
          loser_rank: string | null
          loser_rank_points: string | null
          loser_seed: string | null
          match_num: string | null
          minutes: string | null
          round: string | null
          score: string | null
          surface: string | null
          tourney_date: string | null
          tourney_id: string | null
          tourney_level: string | null
          tourney_name: string | null
          w_1stin: string | null
          w_1stwon: string | null
          w_2ndwon: string | null
          w_ace: string | null
          w_bpfaced: string | null
          w_bpsaved: string | null
          w_df: string | null
          w_svgms: string | null
          w_svpt: string | null
          winner_age: string | null
          winner_entry: string | null
          winner_hand: string | null
          winner_ht: string | null
          winner_id: number | null
          winner_ioc: string | null
          winner_name: string | null
          winner_rank: string | null
          winner_rank_points: string | null
          winner_seed: string | null
          year: string | null
        }
        Insert: {
          best_of?: string | null
          data_from?: string | null
          draw_size?: string | null
          id: number
          l_1stin?: string | null
          l_1stwon?: string | null
          l_2ndwon?: string | null
          l_ace?: string | null
          l_bpfaced?: string | null
          l_bpsaved?: string | null
          l_df?: string | null
          l_svgms?: string | null
          l_svpt?: string | null
          loser_age?: string | null
          loser_entry?: string | null
          loser_hand?: string | null
          loser_ht?: string | null
          loser_id?: number | null
          loser_ioc?: string | null
          loser_name?: string | null
          loser_rank?: string | null
          loser_rank_points?: string | null
          loser_seed?: string | null
          match_num?: string | null
          minutes?: string | null
          round?: string | null
          score?: string | null
          surface?: string | null
          tourney_date?: string | null
          tourney_id?: string | null
          tourney_level?: string | null
          tourney_name?: string | null
          w_1stin?: string | null
          w_1stwon?: string | null
          w_2ndwon?: string | null
          w_ace?: string | null
          w_bpfaced?: string | null
          w_bpsaved?: string | null
          w_df?: string | null
          w_svgms?: string | null
          w_svpt?: string | null
          winner_age?: string | null
          winner_entry?: string | null
          winner_hand?: string | null
          winner_ht?: string | null
          winner_id?: number | null
          winner_ioc?: string | null
          winner_name?: string | null
          winner_rank?: string | null
          winner_rank_points?: string | null
          winner_seed?: string | null
          year?: string | null
        }
        Update: {
          best_of?: string | null
          data_from?: string | null
          draw_size?: string | null
          id?: number
          l_1stin?: string | null
          l_1stwon?: string | null
          l_2ndwon?: string | null
          l_ace?: string | null
          l_bpfaced?: string | null
          l_bpsaved?: string | null
          l_df?: string | null
          l_svgms?: string | null
          l_svpt?: string | null
          loser_age?: string | null
          loser_entry?: string | null
          loser_hand?: string | null
          loser_ht?: string | null
          loser_id?: number | null
          loser_ioc?: string | null
          loser_name?: string | null
          loser_rank?: string | null
          loser_rank_points?: string | null
          loser_seed?: string | null
          match_num?: string | null
          minutes?: string | null
          round?: string | null
          score?: string | null
          surface?: string | null
          tourney_date?: string | null
          tourney_id?: string | null
          tourney_level?: string | null
          tourney_name?: string | null
          w_1stin?: string | null
          w_1stwon?: string | null
          w_2ndwon?: string | null
          w_ace?: string | null
          w_bpfaced?: string | null
          w_bpsaved?: string | null
          w_df?: string | null
          w_svgms?: string | null
          w_svpt?: string | null
          winner_age?: string | null
          winner_entry?: string | null
          winner_hand?: string | null
          winner_ht?: string | null
          winner_id?: number | null
          winner_ioc?: string | null
          winner_name?: string | null
          winner_rank?: string | null
          winner_rank_points?: string | null
          winner_seed?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wta_loser_id_fkey"
            columns: ["loser_id"]
            isOneToOne: false
            referencedRelation: "player"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "wta_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "player"
            referencedColumns: ["player_id"]
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
