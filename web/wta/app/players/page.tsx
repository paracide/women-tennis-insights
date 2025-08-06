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
import { PlayerChart } from "@/components/player-chart"; // New ECharts component

// Basic player info for search results
interface PlayerBasicInfo {
  player_id: number;
  name_first: string;
  name_last: string;
  ioc: string;
}

// Detailed player info for comparison
interface PlayerDetails extends PlayerBasicInfo {
  hand: string;
  dob: string; // Date string (e.g., "YYYY-MM-DD")
  height: number;
  latest_rank: number | null;
  latest_points: number | null;
  latest_rank_date: string | null; // Date string (e.g., "YYYY-MM-DD")
}

interface Match {
  tourney_id: string;
  tourney_name: string;
  surface: string;
  tourney_level: string;
  tourney_date: string; // Date string
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

  // Initial load: Fetch Top 1 and Top 2 players
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
  }, []); // Run only once on mount

  // Effect to fetch details for Player 1 when selected (existing logic, but ensure it updates player1Details)
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

  // Effect to fetch details for Player 2 when selected (existing logic, but ensure it updates player2Details)
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

  // Effect to fetch head-to-head matches when both players are selected
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

  // Helper function to calculate age from date of birth (remains the same)
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

  // Helper function to render player detail cards (updated to use shadcn Card)
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
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select a player to see details.
          </p>
        )}
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8  min-h-screen font-sans">
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
          <div>
            <h2 className="text-xl font-semibold mb-3">Player 2</h2>
            <PlayerSearchInput
              onSelectPlayer={setPlayer2}
              selectedPlayer={player2}
              placeholder="Search for Player 2"
            />
          </div>
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

      {(player1Details || player2Details) && (
        <Card className="mb-10 shadow-lg  ">
          <CardHeader className="  ">Attribute Comparison Chart</CardHeader>
          <CardBody className="p-6">
            <PlayerChart player1={player1Details} player2={player2Details} />
          </CardBody>
        </Card>
      )}

      {player1Details && player2Details && (
        <Card className="shadow-lg  ">
          <CardHeader className="  ">Head-to-Head Match History</CardHeader>
          <CardBody className="p-6">
            {loadingMatches ? (
              <div className="text-center text-lg text-blue-600 animate-pulse">
                Loading match history...
              </div>
            ) : matchHistory.length > 0 ? (
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
