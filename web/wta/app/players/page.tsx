"use client";

import { useEffect, useState } from "react";
import { PlayerSearchInput } from "@/components/players/player-search-input";
import { PlayerProfileCard } from "@/components/players/player-profile-card";
import { PlayerRankingSection } from "@/components/players/player-ranking-section";
import { HeadToHeadSection } from "@/components/players/head-to-head-section";
import { PlayerStatsComparisonPieCharts } from "@/components/players/player-stats-comparison-pie-charts";

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

export default function PlayerComparisonPage() {
  const [player1, setPlayer1] = useState<PlayerBasicInfo | null>(null);
  const [player2, setPlayer2] = useState<PlayerBasicInfo | null>(null);
  const [player1Details, setPlayer1Details] = useState<PlayerDetails | null>(
    null,
  );
  const [player2Details, setPlayer2Details] = useState<PlayerDetails | null>(
    null,
  );
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [player1RankingHistory, setPlayer1RankingHistory] = useState<
    RankingData[]
  >([]);
  const [player2RankingHistory, setPlayer2RankingHistory] = useState<
    RankingData[]
  >([]);
  const [loadingRankingHistory, setLoadingRankingHistory] = useState(false);

  // Fetch initial top players
  useEffect(() => {
    const fetchTopPlayers = async () => {
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/wta/player?topPlayers=true`);
        if (res.ok) {
          const data: PlayerDetails[] = await res.json();
          if (data.length >= 1) {
            setPlayer1({
              player_id: data[0].player_id,
              name_first: data[0].name_first,
              name_last: data[0].name_last,
              ioc: data[0].ioc,
            });
            setPlayer1Details(data[0]);
          }
          if (data.length >= 2) {
            setPlayer2({
              player_id: data[1].player_id,
              name_first: data[1].name_first,
              name_last: data[1].name_last,
              ioc: data[1].ioc,
            });
            setPlayer2Details(data[1]);
          }
        } else {
          console.error("Failed to fetch top players");
        }
      } catch (error) {
        console.error("Error fetching top players:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchTopPlayers();
  }, []);

  // Fetch details for player 1
  useEffect(() => {
    const fetchDetails = async (
      playerId: number | null,
      setDetails: (details: PlayerDetails | null) => void,
    ) => {
      if (!playerId) {
        setDetails(null);
        return;
      }
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/wta/player?id=${playerId}`);
        if (res.ok) {
          const data: PlayerDetails = await res.json();
          setDetails(data);
        } else {
          console.error(`Failed to fetch details for player ${playerId}`);
          setDetails(null);
        }
      } catch (error) {
        console.error(`Error fetching details for player ${playerId}:`, error);
        setDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails(player1?.player_id || null, setPlayer1Details);
  }, [player1]);

  // Fetch details for player 2
  useEffect(() => {
    const fetchDetails = async (
      playerId: number | null,
      setDetails: (details: PlayerDetails | null) => void,
    ) => {
      if (!playerId) {
        setDetails(null);
        return;
      }
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/wta/player?id=${playerId}`);
        if (res.ok) {
          const data: PlayerDetails = await res.json();
          setDetails(data);
        } else {
          console.error(`Failed to fetch details for player ${playerId}`);
          setDetails(null);
        }
      } catch (error) {
        console.error(`Error fetching details for player ${playerId}:`, error);
        setDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails(player2?.player_id || null, setPlayer2Details);
  }, [player2]);

  // Fetch match history
  useEffect(() => {
    const fetchMatches = async () => {
      if (player1?.player_id && player2?.player_id) {
        setLoadingMatches(true);
        try {
          const res = await fetch(
            `/api/wta/player?player1Id=${player1.player_id}&player2Id=${player2.player_id}`,
          );
          if (res.ok) {
            const data: Match[] = await res.json();
            setMatchHistory(data);
          } else {
            console.error("Failed to fetch match history");
            setMatchHistory([]);
          }
        } catch (error) {
          console.error("Error fetching match history:", error);
          setMatchHistory([]);
        } finally {
          setLoadingMatches(false);
        }
      } else {
        setMatchHistory([]);
      }
    };
    fetchMatches();
  }, [player1, player2]);

  // Fetch ranking history for player 1
  useEffect(() => {
    const fetchRankingHistory = async (
      playerId: number | null,
      setHistory: (history: RankingData[]) => void,
    ) => {
      if (!playerId) {
        setHistory([]);
        return;
      }
      setLoadingRankingHistory(true);
      try {
        const res = await fetch(`/api/wta/player?historyPlayerId=${playerId}`);
        if (res.ok) {
          const data: RankingData[] = await res.json();
          setHistory(data);
        } else {
          console.error(
            `Failed to fetch ranking history for player ${playerId}`,
          );
          setHistory([]);
        }
      } catch (error) {
        console.error(
          `Error fetching ranking history for player ${playerId}:`,
          error,
        );
        setHistory([]);
      } finally {
        setLoadingRankingHistory(false);
      }
    };
    fetchRankingHistory(player1?.player_id || null, setPlayer1RankingHistory);
  }, [player1]);

  // Fetch ranking history for player 2
  useEffect(() => {
    const fetchRankingHistory = async (
      playerId: number | null,
      setHistory: (history: RankingData[]) => void,
    ) => {
      if (!playerId) {
        setHistory([]);
        return;
      }
      setLoadingRankingHistory(true);
      try {
        const res = await fetch(`/api/wta/player?historyPlayerId=${playerId}`);
        if (res.ok) {
          const data: RankingData[] = await res.json();
          setHistory(data);
        } else {
          console.error(
            `Failed to fetch ranking history for player ${playerId}`,
          );
          setHistory([]);
        }
      } catch (error) {
        console.error(
          `Error fetching ranking history for player ${playerId}:`,
          error,
        );
        setHistory([]);
      } finally {
        setLoadingRankingHistory(false);
      }
    };
    fetchRankingHistory(player2?.player_id || null, setPlayer2RankingHistory);
  }, [player2]);

  // Calculate head-to-head stats
  const calculateHeadToHeadStats = (): HeadToHeadStats | null => {
    if (!player1Details || !player2Details || matchHistory.length === 0) {
      return null;
    }

    const p1FullName = `${player1Details.name_first} ${player1Details.name_last}`;
    const p2FullName = `${player2Details.name_first} ${player2Details.name_last}`;

    let p1Wins = 0;
    let p2Wins = 0;
    const surfaceStats: {
      [key: string]: { p1Wins: number; p2Wins: number; total: number };
    } = {};

    matchHistory.forEach((match) => {
      const surface = match.surface || "Unknown";
      if (!surfaceStats[surface]) {
        surfaceStats[surface] = { p1Wins: 0, p2Wins: 0, total: 0 };
      }
      surfaceStats[surface].total++;

      if (match.winner_name === p1FullName) {
        p1Wins++;
        surfaceStats[surface].p1Wins++;
      } else if (match.winner_name === p2FullName) {
        p2Wins++;
        surfaceStats[surface].p2Wins++;
      }
    });

    const totalMatches = p1Wins + p2Wins;
    const p1WinRate =
      totalMatches > 0 ? ((p1Wins / totalMatches) * 100).toFixed(1) : "N/A";
    const p2WinRate =
      totalMatches > 0 ? ((p2Wins / totalMatches) * 100).toFixed(1) : "N/A";

    const formattedSurfaceStats = Object.entries(surfaceStats).map(
      ([surface, stats]) => {
        const surfaceTotal = stats.p1Wins + stats.p2Wins;
        const p1SurfaceWinRate =
          surfaceTotal > 0
            ? ((stats.p1Wins / surfaceTotal) * 100).toFixed(1)
            : "N/A";
        const p2SurfaceWinRate =
          surfaceTotal > 0
            ? ((stats.p2Wins / surfaceTotal) * 100).toFixed(1)
            : "N/A";
        return {
          surface,
          p1Wins: stats.p1Wins,
          p2Wins: stats.p2Wins,
          p1SurfaceWinRate,
          p2SurfaceWinRate,
          surfaceTotal,
        };
      },
    );

    return {
      totalMatches,
      p1Wins,
      p2Wins,
      p1WinRate,
      p2WinRate,
      surfaceStats: formattedSurfaceStats,
    };
  };

  const headToHeadStats = calculateHeadToHeadStats();

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen font-sans text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-white">
        Tennis Player Data Analysis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-3 text-center">Player 1</h2>
          <PlayerSearchInput
            onSelectPlayer={setPlayer1}
            selectedPlayer={player1}
            placeholder="Search for Player 1"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3 text-center">Player 2</h2>
          <PlayerSearchInput
            onSelectPlayer={setPlayer2}
            selectedPlayer={player2}
            placeholder="Search for Player 2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <PlayerProfileCard player={player1Details} title="Player 1 Profile" />
        <PlayerProfileCard player={player2Details} title="Player 2 Profile" />
      </div>

      <PlayerStatsComparisonPieCharts
        player1Details={player1Details}
        player2Details={player2Details}
      />

      {(player1Details || player2Details) &&
        (player1RankingHistory.length > 0 ||
          player2RankingHistory.length > 0) && (
          <PlayerRankingSection
            player1Name={
              player1Details
                ? `${player1Details.name_first} ${player1Details.name_last}`
                : null
            }
            player1RankingHistory={player1RankingHistory}
            player2Name={
              player2Details
                ? `${player2Details.name_first} ${player2Details.name_last}`
                : null
            }
            player2RankingHistory={player2RankingHistory}
            loading={loadingRankingHistory}
          />
        )}

      <HeadToHeadSection
        player1Details={player1Details}
        player2Details={player2Details}
        matchHistory={matchHistory}
        loading={loadingMatches}
        headToHeadStats={headToHeadStats} // Pass the calculated stats
      />
    </div>
  );
}
