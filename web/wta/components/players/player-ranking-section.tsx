import { Card, CardBody } from "@heroui/card";
import { PlayerRankingChart } from "@/components/players/player-ranking-chart";

interface RankingData {
  ranking_date: string | null;
  rank: number | null;
  points: number | null;
}

interface PlayerRankingSectionProps {
  player1Name: string | null;
  player1RankingHistory: RankingData[];
  player2Name: string | null;
  player2RankingHistory: RankingData[];
  loading: boolean;
}

export function PlayerRankingSection({
  player1Name,
  player1RankingHistory,
  player2Name,
  player2RankingHistory,
  loading,
}: PlayerRankingSectionProps) {
  return (
    <Card className="mb-10">
      <h2 className=" text-2xl font-bold text-center text-white p-4">
        Historical Ranking Trend
      </h2>
      <CardBody className="p-6">
        {loading ? (
          <div className="text-center text-lg text-blue-600 animate-pulse">
            Loading ranking history...
          </div>
        ) : (
          <PlayerRankingChart
            player1Name={player1Name}
            player1RankingHistory={player1RankingHistory}
            player2Name={player2Name}
            player2RankingHistory={player2RankingHistory}
          />
        )}
      </CardBody>
    </Card>
  );
}
