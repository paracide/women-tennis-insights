import { Card, CardBody } from "@heroui/card";
import { EloPredictionCard } from "@/components/players/head-to-head/EloPredictionCard";
import { OverallStatsCard } from "@/components/players/head-to-head/OverallStatsCard";
import { MatchHistoryTable } from "@/components/players/head-to-head/MatchHistoryTable";

interface HeadToHeadSectionProps {
  player1Details: PlayerDetails | undefined;
  player2Details: PlayerDetails | undefined;
  matchHistory: Match[];
  prediction: EloPrediction | undefined;
  loading: boolean;
  headToHeadStats: HeadToHeadStats | null;
}

export function HeadToHeadSection({
  player1Details,
  player2Details,
  matchHistory,
  prediction,
  loading,
  headToHeadStats,
}: HeadToHeadSectionProps) {
  if (!player1Details || !player2Details) return null;

  const player1Name = `${player1Details.name_first} ${player1Details.name_last}`;
  const player2Name = `${player2Details.name_first} ${player2Details.name_last}`;

  return (
    <Card className="shadow-lg">
      <CardBody className="p-6 flex flex-col gap-8">
        {loading && (
          <div className="text-center text-lg text-blue-600 animate-pulse">
            Loading match history...
          </div>
        )}

        {!loading && prediction && (
          <EloPredictionCard prediction={prediction} />
        )}

        {!loading && headToHeadStats && (
          <OverallStatsCard
            headToHeadStats={headToHeadStats}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        )}

        {!loading && matchHistory.length > 0 && (
          <MatchHistoryTable
            matchHistory={matchHistory}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        )}

        {!loading && matchHistory.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No head-to-head matches found between these players.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
