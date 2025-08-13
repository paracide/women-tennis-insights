"use client";

import { useEffect, useState } from "react";
import { PlayerSearchInput } from "@/components/players/player-search-input";
import { PlayerProfileCard } from "@/components/players/player-profile-card";
import { PlayerRankingSection } from "@/components/players/player-ranking-section";
import { HeadToHeadSection } from "@/components/players/head-to-head-section";
import { PlayerStatsComparisonPieCharts } from "@/components/players/player-stats-comparison-pie-charts";
import { fetchData } from "@/utils/api";

// Hook：获取玩家详情
function usePlayerDetails(playerId: number | null) {
  const [details, setDetails] = useState<PlayerDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) {
      setDetails(null);
      return;
    }
    setLoading(true);
    fetchData<PlayerDetails>(`/api/wta/player?id=${playerId}`).then((data) => {
      setDetails(data);
      setLoading(false);
    });
  }, [playerId]);

  return { details, loading };
}

// Hook：获取玩家排名历史
function useRankingHistory(playerId: number | null) {
  const [history, setHistory] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) {
      setHistory([]);
      return;
    }
    setLoading(true);
    fetchData<RankingData[]>(
      `/api/wta/player?historyPlayerId=${playerId}`,
    ).then((data) => {
      setHistory(data ?? []);
      setLoading(false);
    });
  }, [playerId]);

  return { history, loading };
}

// Hook：获取双方比赛记录
function useMatchHistory(player1Id: number | null, player2Id: number | null) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player1Id || !player2Id) {
      setMatches([]);
      return;
    }
    setLoading(true);
    fetchData<Match[]>(
      `/api/wta/player?player1Id=${player1Id}&player2Id=${player2Id}`,
    ).then((data) => {
      setMatches(data ?? []);
      setLoading(false);
    });
  }, [player1Id, player2Id]);

  return { matches, loading };
}

export default function PlayerComparisonPage() {
  const [player1, setPlayer1] = useState<PlayerBasicInfo | null>(null);
  const [player2, setPlayer2] = useState<PlayerBasicInfo | null>(null);

  // 初始化 top players
  useEffect(() => {
    fetchData<PlayerDetails[]>(`/api/wta/player?topPlayers=true`).then(
      (data) => {
        if (data && data.length) {
          setPlayer1({
            player_id: data[0].player_id,
            name_first: data[0].name_first,
            name_last: data[0].name_last,
            ioc: data[0].ioc,
          });
          if (data.length >= 2) {
            setPlayer2({
              player_id: data[1].player_id,
              name_first: data[1].name_first,
              name_last: data[1].name_last,
              ioc: data[1].ioc,
            });
          }
        }
      },
    );
  }, []);

  const { details: player1Details, loading: loadingP1 } = usePlayerDetails(
    player1?.player_id ?? null,
  );
  const { details: player2Details, loading: loadingP2 } = usePlayerDetails(
    player2?.player_id ?? null,
  );

  const { history: player1RankingHistory, loading: loadingRank1 } =
    useRankingHistory(player1?.player_id ?? null);
  const { history: player2RankingHistory, loading: loadingRank2 } =
    useRankingHistory(player2?.player_id ?? null);

  const { matches: matchHistory, loading: loadingMatches } = useMatchHistory(
    player1?.player_id ?? null,
    player2?.player_id ?? null,
  );

  // 计算 head-to-head
  const calculateHeadToHeadStats = (): HeadToHeadStats | null => {
    if (!player1Details || !player2Details || matchHistory.length === 0)
      return null;

    const p1FullName = `${player1Details.name_first} ${player1Details.name_last}`;
    const p2FullName = `${player2Details.name_first} ${player2Details.name_last}`;

    let p1Wins = 0,
      p2Wins = 0;
    const surfaceStats: Record<
      string,
      { p1Wins: number; p2Wins: number; total: number }
    > = {};

    matchHistory.forEach((match) => {
      const surface = match.surface || "Unknown";
      surfaceStats[surface] ??= { p1Wins: 0, p2Wins: 0, total: 0 };
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
    const p1WinRate = totalMatches
      ? ((p1Wins / totalMatches) * 100).toFixed(1)
      : "N/A";
    const p2WinRate = totalMatches
      ? ((p2Wins / totalMatches) * 100).toFixed(1)
      : "N/A";

    const formattedSurfaceStats = Object.entries(surfaceStats).map(
      ([surface, stats]) => {
        const surfaceTotal = stats.p1Wins + stats.p2Wins;
        return {
          surface,
          p1Wins: stats.p1Wins,
          p2Wins: stats.p2Wins,
          p1SurfaceWinRate: surfaceTotal
            ? ((stats.p1Wins / surfaceTotal) * 100).toFixed(1)
            : "N/A",
          p2SurfaceWinRate: surfaceTotal
            ? ((stats.p2Wins / surfaceTotal) * 100).toFixed(1)
            : "N/A",
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
  const loadingRankingHistory = loadingRank1 || loadingRank2;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen font-sans text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center">
        Tennis Player Data Analysis
      </h1>

      {/* Player selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { title: "Player 1", player: player1, set: setPlayer1 },
          { title: "Player 2", player: player2, set: setPlayer2 },
        ].map(({ title, player, set }, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold mb-3 text-center">{title}</h2>
            <PlayerSearchInput
              onSelectPlayer={set}
              selectedPlayer={player}
              placeholder={`Search for ${title}`}
            />
          </div>
        ))}
      </div>

      {/* Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <PlayerProfileCard player={player1Details} title="Player 1 Profile" />
        <PlayerProfileCard player={player2Details} title="Player 2 Profile" />
      </div>

      {/* Stats */}
      <PlayerStatsComparisonPieCharts
        player1Details={player1Details}
        player2Details={player2Details}
      />

      {/* Ranking */}
      {(player1Details || player2Details) &&
        (player1RankingHistory.length || player2RankingHistory.length) > 0 && (
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

      {/* Head-to-head */}
      <HeadToHeadSection
        player1Details={player1Details}
        player2Details={player2Details}
        matchHistory={matchHistory}
        loading={loadingMatches}
        headToHeadStats={headToHeadStats}
      />
    </div>
  );
}
