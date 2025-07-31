import React from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { Card, CardBody, CardHeader } from "@heroui/card";

type Player = Database["public"]["Tables"]["player"]["Row"];
type RankingCurrent = Database["public"]["Tables"]["rankings_current"]["Row"];

type RankingWithPlayer = Omit<RankingCurrent, "player"> & {
  player: Player | null;
};

type Match = Database["public"]["Tables"]["wta"]["Row"];

export default async function StatsCards() {
  const playerCountPromise = supabase
    .from("player")
    .select("*", { count: "exact", head: true });

  const matchesCountPromise = supabase
    .from("wta")
    .select("*", { count: "exact", head: true });

  const topRankedPromise = supabase
    .from("rankings_current")
    .select(
      `
    rank,
    points,
    player:player(name_first, name_last, ioc)
  `,
    )
    .order("rank", { ascending: true })
    .limit(10) as unknown as Promise<{ data: RankingWithPlayer[] }>;

  const [
    { count: totalPlayers = 0 } = {},
    { count: totalMatches = 0 } = {},
    { data: topRankedPlayers = [] } = {},
  ] = await Promise.all([
    playerCountPromise,
    matchesCountPromise,
    topRankedPromise,
  ]);

  const topPlayer = topRankedPlayers[0]?.player;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total Players</p>
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{totalPlayers}</div>
          <p className="text-xs text-muted-foreground">Registered Players</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total Matches</p>
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">{totalMatches}</div>
          <p className="text-xs text-muted-foreground">WTA Match Records</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Current #1 Rank</p>
        </CardHeader>
        <CardBody>
          <div className="text-2xl font-bold">
            {topPlayer
              ? `${topPlayer.name_first ?? "Unknown"} ${topPlayer.name_last ?? ""}`
              : "No Data"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topRankedPlayers[0]?.points ?? 0} points
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
