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

  // Effect to fetch details for Player 1 when selected
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

  // Effect to fetch details for Player 2 when selected
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

  // Helper function to calculate age from date of birth
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
    <Card className="flex-1 min-w-[300px]">
      <CardHeader></CardHeader>
      <CardBody>
        {player ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold">
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
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Player Comparison</h1>

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
        <div className="text-center text-muted-foreground mb-8">
          Loading player details...
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {renderPlayerCard(player1Details, "Player 1 Details")}
        {renderPlayerCard(player2Details, "Player 2 Details")}
      </div>

      {player1Details && player2Details && (
        <Card>
          <CardHeader>Comparison</CardHeader>
          <CardBody>
            <Table aria-label="Player Comparison Table">
              <TableHeader>
                <TableColumn>Attribute</TableColumn>
                <TableColumn className="text-center">
                  {player1Details.name_first} {player1Details.name_last}
                </TableColumn>
                <TableColumn className="text-center">
                  {player2Details.name_first} {player2Details.name_last}
                </TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="hand">
                  <TableCell>Hand</TableCell>
                  <TableCell className="text-center">
                    {player1Details.hand || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.hand || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key="height">
                  <TableCell>Height</TableCell>
                  <TableCell className="text-center">
                    {player1Details.height
                      ? `${player1Details.height} cm`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.height
                      ? `${player2Details.height} cm`
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key="age">
                  <TableCell>Age</TableCell>
                  <TableCell className="text-center">
                    {calculateAge(player1Details.dob)}
                  </TableCell>
                  <TableCell className="text-center">
                    {calculateAge(player2Details.dob)}
                  </TableCell>
                </TableRow>
                <TableRow key="ioc">
                  <TableCell>Country (IOC)</TableCell>
                  <TableCell className="text-center">
                    {player1Details.ioc || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.ioc || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key="rank">
                  <TableCell>Latest Rank</TableCell>
                  <TableCell className="text-center">
                    {player1Details.latest_rank !== null
                      ? player1Details.latest_rank
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.latest_rank !== null
                      ? player2Details.latest_rank
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key="points">
                  <TableCell>Latest Points</TableCell>
                  <TableCell className="text-center">
                    {player1Details.latest_points !== null
                      ? player1Details.latest_points
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.latest_points !== null
                      ? player2Details.latest_points
                      : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow key="rankDate">
                  <TableCell>Latest Rank Date</TableCell>
                  <TableCell className="text-center">
                    {player1Details.latest_rank_date
                      ? format(new Date(player1Details.latest_rank_date), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {player2Details.latest_rank_date
                      ? format(new Date(player2Details.latest_rank_date), "PPP")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
