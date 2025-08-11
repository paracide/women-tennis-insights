import { Card, CardBody } from "@heroui/card"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table"
import { format } from "date-fns"

interface PlayerDetails {
  player_id: number
  name_first: string
  name_last: string
  ioc: string
  hand: string
  dob: string
  height: number
  latest_rank: number | null
  latest_points: number | null
  latest_rank_date: string | null
  ace_avg_last_10_matches: number | null
  df_avg_last_10_matches: number | null
  first_in_avg_last_10_matches: number | null
  first_won_avg_last_10_matches: number | null
  svpt_avg_last_10_matches: number | null
  bp_faced_avg_last_10_matches: number | null
  bp_saved_avg_last_10_matches: number | null
  win_rate_last_10_matches: number | null
}

interface Match {
  tourney_id: string
  tourney_name: string
  surface: string
  tourney_level: string
  tourney_date: string
  winner_name: string
  loser_name: string
  score: string
  round: string
}

interface HeadToHeadSectionProps {
  player1Details: PlayerDetails | null
  player2Details: PlayerDetails | null
  matchHistory: Match[]
  loading: boolean
}

export function HeadToHeadSection({ player1Details, player2Details, matchHistory, loading }: HeadToHeadSectionProps) {
  const calculateHeadToHeadStats = () => {
    if (!player1Details || !player2Details || matchHistory.length === 0) {
      return null
    }

    const p1FullName = `${player1Details.name_first} ${player1Details.name_last}`
    const p2FullName = `${player2Details.name_first} ${player2Details.name_last}`

    let p1Wins = 0
    let p2Wins = 0
    const surfaceStats: {
      [key: string]: { p1Wins: number; p2Wins: number; total: number }
    } = {}

    matchHistory.forEach((match) => {
      const surface = match.surface || "Unknown"
      if (!surfaceStats[surface]) {
        surfaceStats[surface] = { p1Wins: 0, p2Wins: 0, total: 0 }
      }
      surfaceStats[surface].total++

      if (match.winner_name === p1FullName) {
        p1Wins++
        surfaceStats[surface].p1Wins++
      } else if (match.winner_name === p2FullName) {
        p2Wins++
        surfaceStats[surface].p2Wins++
      }
    })

    const totalMatches = p1Wins + p2Wins
    const p1WinRate = totalMatches > 0 ? ((p1Wins / totalMatches) * 100).toFixed(1) : "N/A"
    const p2WinRate = totalMatches > 0 ? ((p2Wins / totalMatches) * 100).toFixed(1) : "N/A"

    const formattedSurfaceStats = Object.entries(surfaceStats).map(([surface, stats]) => {
      const surfaceTotal = stats.p1Wins + stats.p2Wins
      const p1SurfaceWinRate = surfaceTotal > 0 ? ((stats.p1Wins / surfaceTotal) * 100).toFixed(1) : "N/A"
      const p2SurfaceWinRate = surfaceTotal > 0 ? ((stats.p2Wins / surfaceTotal) * 100).toFixed(1) : "N/A"
      return {
        surface,
        p1Wins: stats.p1Wins,
        p2Wins: stats.p2Wins,
        p1SurfaceWinRate,
        p2SurfaceWinRate,
        surfaceTotal,
      }
    })

    return {
      totalMatches,
      p1Wins,
      p2Wins,
      p1WinRate,
      p2WinRate,
      surfaceStats: formattedSurfaceStats,
    }
  }

  const headToHeadStats = calculateHeadToHeadStats()

  if (!player1Details || !player2Details) {
    return null // Don't render if both players aren't selected
  }

  return (
    <Card className="shadow-lg">
      <CardBody className="p-6 flex gap-8">
        {loading ? (
          <div className="text-center text-lg text-blue-600 animate-pulse">Loading match history...</div>
        ) : matchHistory.length > 0 ? (
          <>
            {headToHeadStats && (
              <div className="mb-6 p-4">
                <h3 className="font-bold text-base mb-2 text-center">Overall Head-to-Head:</h3>
                <p className="mb-2">
                  Total Matches: <span className="font-semibold">{headToHeadStats.totalMatches}</span>
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-semibold">
                      {player1Details.name_first} {player1Details.name_last}:
                    </p>
                    <p>
                      Wins: <span className="font-bold text-green-700">{headToHeadStats.p1Wins}</span>
                    </p>
                    <p>
                      Win Rate: <span className="font-bold">{headToHeadStats.p1WinRate}%</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {player2Details.name_first} {player2Details.name_last}:
                    </p>
                    <p>
                      Wins: <span className="font-bold text-green-700">{headToHeadStats.p2Wins}</span>
                    </p>
                    <p>
                      Win Rate: <span className="font-bold">{headToHeadStats.p2WinRate}%</span>
                    </p>
                  </div>
                </div>
                {headToHeadStats.surfaceStats.length > 0 && (
                  <>
                    <h3 className="font-bold text-base mb-2 text-center">Win Rate by Surface:</h3>
                    <Table className="w-full text-sm">
                      <TableHeader>
                        <TableColumn className="font-semibold">Surface</TableColumn>
                        <TableColumn className="text-center font-semibold">Matches</TableColumn>
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
                            <TableCell className="font-medium">{stats.surface}</TableCell>
                            <TableCell className="text-center">{stats.surfaceTotal}</TableCell>
                            <TableCell className="text-center">{stats.p1SurfaceWinRate}%</TableCell>
                            <TableCell className="text-center">{stats.p2SurfaceWinRate}%</TableCell>
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
                <TableColumn className="text-gray-600 font-semibold">Date</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Tournament</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Level</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Surface</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Winner</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Loser</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Score</TableColumn>
                <TableColumn className="text-gray-600 font-semibold">Round</TableColumn>
              </TableHeader>
              <TableBody>
                {matchHistory.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(match.tourney_date), "PPP")}</TableCell>
                    <TableCell>{match.tourney_name}</TableCell>
                    <TableCell>{match.tourney_level}</TableCell>
                    <TableCell>{match.surface}</TableCell>
                    <TableCell
                      className={
                        match.winner_name === `${player1Details.name_first} ${player1Details.name_last}` ||
                        match.winner_name === `${player2Details.name_first} ${player2Details.name_last}`
                          ? "font-semibold text-green-700"
                          : ""
                      }
                    >
                      {match.winner_name}
                    </TableCell>
                    <TableCell
                      className={
                        match.loser_name === `${player1Details.name_first} ${player1Details.name_last}` ||
                        match.loser_name === `${player2Details.name_first} ${player2Details.name_last}`
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
          <p className="text-center text-muted-foreground py-4">No head-to-head matches found between these players.</p>
        )}
      </CardBody>
    </Card>
  )
}
