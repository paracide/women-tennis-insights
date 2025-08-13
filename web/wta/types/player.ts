interface PlayerBasicInfo {
  player_id: number;
  name_first: string;
  name_last: string;
  ioc: string;
}

interface RankingData {
  ranking_date: string | null;
  rank: number | null;
  points: number | null;
}

interface PlayerDetails extends PlayerBasicInfo {
  hand: string;
  dob: string;
  height: number;
  latest_rank: number | null;
  latest_points: number | null;
  latest_rank_date: string | null;
  ace_avg_last_10_matches: number | null;
  df_avg_last_10_matches: number | null;
  first_in_avg_last_10_matches: number | null;
  first_won_avg_last_10_matches: number | null;
  svpt_avg_last_10_matches: number | null;
  bp_faced_avg_last_10_matches: number | null;
  bp_saved_avg_last_10_matches: number | null;
  win_rate_last_10_matches: number | null;
}

interface Match {
  tourney_id: string;
  tourney_name: string;
  surface: string;
  tourney_level: string;
  tourney_date: string;
  winner_name: string;
  loser_name: string;
  score: string;
  round: string;
}

interface HeadToHeadStats {
  totalMatches: number;
  p1Wins: number;
  p2Wins: number;
  p1WinRate: string;
  p2WinRate: string;
  surfaceStats: {
    surface: string;
    p1Wins: number;
    p2Wins: number;
    p1SurfaceWinRate: string;
    p2SurfaceWinRate: string;
    surfaceTotal: number;
  }[];
}
