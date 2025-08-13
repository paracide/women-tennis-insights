import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

interface OverallStatsCardProps {
  headToHeadStats: HeadToHeadStats;
  player1Name: string;
  player2Name: string;
}

export function OverallStatsCard({
  headToHeadStats,
  player1Name,
  player2Name,
}: OverallStatsCardProps) {
  return (
    <div className="mb-6 p-4 rounded-lg shadow-sm ">
      <h3 className="font-bold text-base mb-2 text-center">
        Overall Head-to-Head
      </h3>
      <p className="mb-2">
        Total Matches:{" "}
        <span className="font-semibold">{headToHeadStats.totalMatches}</span>
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-semibold">{player1Name}</p>
          <p>
            Wins:{" "}
            <span className="font-bold text-green-700">
              {headToHeadStats.p1Wins}
            </span>
          </p>
          <p>
            Win Rate:{" "}
            <span className="font-bold">{headToHeadStats.p1WinRate}%</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">{player2Name}</p>
          <p>
            Wins:{" "}
            <span className="font-bold text-green-700">
              {headToHeadStats.p2Wins}
            </span>
          </p>
          <p>
            Win Rate:{" "}
            <span className="font-bold">{headToHeadStats.p2WinRate}%</span>
          </p>
        </div>
      </div>

      {headToHeadStats.surfaceStats.length > 0 && (
        <>
          <h3 className="font-bold text-base mb-2 text-center">
            Win Rate by Surface
          </h3>
          <Table className="w-full text-sm">
            <TableHeader>
              <TableColumn className="font-semibold">Surface</TableColumn>
              <TableColumn className="text-center font-semibold">
                Matches
              </TableColumn>
              <TableColumn className="text-center font-semibold">
                {player1Name} Win %
              </TableColumn>
              <TableColumn className="text-center font-semibold">
                {player2Name} Win %
              </TableColumn>
            </TableHeader>
            <TableBody>
              {headToHeadStats.surfaceStats.map((stats, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{stats.surface}</TableCell>
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
  );
}
