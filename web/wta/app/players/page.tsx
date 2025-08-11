"use client";

import { useEffect, useState } from "react";
import { PlayerSearchInput } from "@/components/player-search-input";
import { format } from "date-fns";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { PlayerRankingChart } from "@/components/player-ranking-chart";

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

  const calculateAge = (dob: string | null) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderPlayerCard = (player: PlayerDetails | null, title: string) => (
    <Card className="flex-1 min-w-[300px] shadow-lg">
      <CardHeader>{title}</CardHeader>
      <CardBody className="p-6">
        {player ? (
          <div className="space-y-3 text-sm text-white">
            <p className="text-lg font-semibold text-white">
              {player.name_first} {player.name_last} ({player.ioc})
            </p>
            <p>
              <strong>Hand:</strong> {player.hand || "N/A"}
            </p>
            <p>
              <strong>Height:</strong>{" "}
              {player.height ? `${player.height} cm` : "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {player.dob ? format(new Date(player.dob), "PPP") : "N/A"} (
              {calculateAge(player.dob)} years old)
            </p>
            <p>
              <strong>Latest Rank:</strong>{" "}
              {player.latest_rank !== null ? player.latest_rank : "N/A"}
            </p>
            <p>
              <strong>Latest Points:</strong>{" "}
              {player.latest_points !== null ? player.latest_points : "N/A"}
            </p>
            <p>
              <strong>Rank Date:</strong>{" "}
              {player.latest_rank_date
                ? format(new Date(player.latest_rank_date), "PPP")
                : "N/A"}
            </p>
            <p>
              <strong>Ace Avg Last 10 Matches:</strong>{" "}
              {player.ace_avg_last_10_matches !== null
                ? player.ace_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>DF Avg Last 10 Matches:</strong>{" "}
              {player.df_avg_last_10_matches !== null
                ? player.df_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>First In Avg Last 10 Matches:</strong>{" "}
              {player.first_in_avg_last_10_matches !== null
                ? player.first_in_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>First Won Avg Last 10 Matches:</strong>{" "}
              {player.first_won_avg_last_10_matches !== null
                ? player.first_won_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>SVPT Avg Last 10 Matches:</strong>{" "}
              {player.svpt_avg_last_10_matches !== null
                ? player.svpt_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>BP Faced Avg Last 10 Matches:</strong>{" "}
              {player.bp_faced_avg_last_10_matches !== null
                ? player.bp_faced_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>BP Saved Avg Last 10 Matches:</strong>{" "}
              {player.bp_saved_avg_last_10_matches !== null
                ? player.bp_saved_avg_last_10_matches
                : "N/A"}
            </p>

            <p>
              <strong>Win Rate Last 10 Matches:</strong>{" "}
              {player.win_rate_last_10_matches !== null
                ? player.win_rate_last_10_matches
                : "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select a player to see details.
          </p>
        )}
      </CardBody>
    </Card>
  );

  const calculateHeadToHeadStats = () => {
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
          <h2 className="text-xl font-semibold mb-3">Player 1</h2>
          <PlayerSearchInput
            onSelectPlayer={setPlayer1}
            selectedPlayer={player1}
            placeholder="Search for Player 1"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Player 2</h2>
          <PlayerSearchInput
            onSelectPlayer={setPlayer2}
            selectedPlayer={player2}
            placeholder="Search for Player 2"
          />
        </div>
      </div>
      {loadingDetails && (player1 || player2) && (
        <div className="text-center text-lg text-blue-600 mb-8 animate-pulse">
          Loading player details...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {renderPlayerCard(player1Details, "Player 1 Profile")}
        {renderPlayerCard(player2Details, "Player 2 Profile")}
      </div>
      {(player1Details || player2Details) &&
        (player1RankingHistory.length > 0 ||
          player2RankingHistory.length > 0) && (
          <Card className="mb-10">
            <CardHeader className="text-white">
              Historical Ranking Trend
            </CardHeader>
            <CardBody className="p-6">
              {loadingRankingHistory ? (
                <div className="text-center text-lg text-blue-600 animate-pulse">
                  Loading ranking history...
                </div>
              ) : (
                <PlayerRankingChart
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
                />
              )}
            </CardBody>
          </Card>
        )}
      {player1Details && player2Details && (
        <Card className="shadow-lg">
          <CardBody className="p-6 flex gap-8">
            {loadingMatches ? (
              <div className="text-center text-lg text-blue-600 animate-pulse">
                Loading match history...
              </div>
            ) : matchHistory.length > 0 ? (
              <>
                {headToHeadStats && (
                  <div className="mb-6 p-4">
                    <h3 className="font-bold text-base mb-2 text-center">
                      Overall Head-to-Head:
                    </h3>
                    <p className="mb-2">
                      Total Matches:{" "}
                      <span className="font-semibold">
                        {headToHeadStats.totalMatches}
                      </span>
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="font-semibold">
                          {player1Details.name_first} {player1Details.name_last}
                          :
                        </p>
                        <p>
                          Wins:{" "}
                          <span className="font-bold text-green-700">
                            {headToHeadStats.p1Wins}
                          </span>
                        </p>
                        <p>
                          Win Rate:{" "}
                          <span className="font-bold">
                            {headToHeadStats.p1WinRate}%
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {player2Details.name_first} {player2Details.name_last}
                          :
                        </p>
                        <p>
                          Wins:{" "}
                          <span className="font-bold text-green-700">
                            {headToHeadStats.p2Wins}
                          </span>
                        </p>
                        <p>
                          Win Rate:{" "}
                          <span className="font-bold">
                            {headToHeadStats.p2WinRate}%
                          </span>
                        </p>
                      </div>
                    </div>

                    {headToHeadStats.surfaceStats.length > 0 && (
                      <>
                        <h3 className="font-bold text-base mb-2 text-center">
                          Win Rate by Surface:
                        </h3>
                        <Table className="w-full text-sm">
                          <TableHeader>
                            <TableColumn className="font-semibold">
                              Surface
                            </TableColumn>
                            <TableColumn className="text-center font-semibold">
                              Matches
                            </TableColumn>
                            <TableColumn className="text-center font-semibold">
                              {player1Details.name_last} Win %
                            </TableColumn>
                            <TableColumn className="text-center font-semibold">
                              {player2Details.name_last} Win %
                            </TableColumn>
                          </TableHeader>
                          <TableBody>
                            {headToHeadStats.surfaceStats.map((stats, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">
                                  {stats.surface}
                                </TableCell>
                                <TableCell className="text-center">
                                  {stats.surfaceTotal}
                                </TableCell>
                                <TableCell className="text-center">
                                  {stats.p1SurfaceWinRate}%
                                </TableCell>
                                <TableCell className="text-center">
                                  {stats.p2SurfaceWinRate}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableColumn className="text-gray-600 font-semibold">
                      Date
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Tournament
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Level
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Surface
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Winner
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Loser
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Score
                    </TableColumn>
                    <TableColumn className="text-gray-600 font-semibold">
                      Round
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {matchHistory.map((match, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {format(new Date(match.tourney_date), "PPP")}
                        </TableCell>
                        <TableCell>{match.tourney_name}</TableCell>
                        <TableCell>{match.tourney_level}</TableCell>
                        <TableCell>{match.surface}</TableCell>
                        <TableCell
                          className={
                            match.winner_name ===
                              `${player1Details.name_first} ${player1Details.name_last}` ||
                            match.winner_name ===
                              `${player2Details.name_first} ${player2Details.name_last}`
                              ? "font-semibold text-green-700"
                              : ""
                          }
                        >
                          {match.winner_name}
                        </TableCell>
                        <TableCell
                          className={
                            match.loser_name ===
                              `${player1Details.name_first} ${player1Details.name_last}` ||
                            match.loser_name ===
                              `${player2Details.name_first} ${player2Details.name_last}`
                              ? "font-semibold text-red-700"
                              : ""
                          }
                        >
                          {match.loser_name}
                        </TableCell>
                        <TableCell>{match.score}</TableCell>
                        <TableCell>{match.round}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No head-to-head matches found between these players.
              </p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
