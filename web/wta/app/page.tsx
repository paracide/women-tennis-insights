import { title } from "@/components/primitives";
import { supabase } from "@/lib/supabase";
import { Card, CardBody, CardHeader } from "@heroui/card";

import type { Database } from "@/types/supabase";
import WtaRaceChart from "@/components/dashboard/WtaRaceChart";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart"; // Your generated types

type Player = Database["public"]["Tables"]["player"]["Row"];
type RankingCurrent = Database["public"]["Tables"]["rankings_current"]["Row"];

type RankingWithPlayer = Omit<RankingCurrent, "player"> & {
  player: Player | null;
};

type Match = Database["public"]["Tables"]["wta"]["Row"];

export default async function Home() {
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
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Analyze and visualize</span>
        <br />
        <span className={title()}>the performance of </span>
        <br />
        <span className={title({ color: "violet" })}>
          Women's Tennis Players
        </span>
        <br />
      </div>


      {/* Stats Cards */}
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

      <AgeDistributionChart></AgeDistributionChart>

      <WtaRaceChart></WtaRaceChart>
    </section>
  );
}
