import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { format } from "date-fns";

interface MatchHistoryTableProps {
  matchHistory: Match[];
  player1Name: string;
  player2Name: string;
}

export function MatchHistoryTable({
  matchHistory,
  player1Name,
  player2Name,
}: MatchHistoryTableProps) {
  return (
    <>
      <h2 className="font-bold text-2xl mb-2 text-center">Match History</h2>
      <Table className="w-full">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Tournament</TableColumn>
          <TableColumn>Level</TableColumn>
          <TableColumn>Surface</TableColumn>
          <TableColumn>Winner</TableColumn>
          <TableColumn>Loser</TableColumn>
          <TableColumn>Score</TableColumn>
          <TableColumn>Round</TableColumn>
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
                  [player1Name, player2Name].includes(match.winner_name)
                    ? "font-semibold text-green-700"
                    : ""
                }
              >
                {match.winner_name}
              </TableCell>
              <TableCell
                className={
                  [player1Name, player2Name].includes(match.loser_name)
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
  );
}
