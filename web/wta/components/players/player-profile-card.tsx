import { Card, CardBody, CardHeader } from "@heroui/card";
import { format } from "date-fns";

interface PlayerDetails {
  player_id: number;
  name_first: string;
  name_last: string;
  ioc: string;
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

interface PlayerProfileCardProps {
  player: PlayerDetails | null;
  title: string;
}

export function PlayerProfileCard({ player, title }: PlayerProfileCardProps) {
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

  return (
    <Card className="flex-1 min-w-[300px] shadow-lg">
      <CardHeader className="justify-center">
        {player
          ? player.name_first + " " + player.name_last + ` Profile`
          : title}
      </CardHeader>
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
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select a player to see details.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
