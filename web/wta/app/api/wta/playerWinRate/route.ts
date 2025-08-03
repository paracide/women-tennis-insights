import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const matches = await prisma.wta.findMany({
    where: {
      winner_name: { not: null },
      loser_name: { not: null },
    },
    select: {
      winner_name: true,
      loser_name: true,
    },
  });

  const playerStats: Record<string, { wins: number; losses: number }> = {};

  matches.forEach((match) => {
    const winner = match.winner_name!;
    const loser = match.loser_name!;

    if (!playerStats[winner]) {
      playerStats[winner] = { wins: 0, losses: 0 };
    }
    if (!playerStats[loser]) {
      playerStats[loser] = { wins: 0, losses: 0 };
    }

    playerStats[winner].wins++;
    playerStats[loser].losses++;
  });

  const playerWinRates = Object.entries(playerStats)
    .map(([name, stats]) => {
      const totalMatches = stats.wins + stats.losses;
      const winRate = totalMatches > 0 ? (stats.wins / totalMatches) * 100 : 0;
      return {
        name,
        winRate: Math.round(winRate * 100) / 100,
        wins: stats.wins,
        losses: stats.losses,
        totalMatches,
      };
    })
    .filter((player) => player.totalMatches >= 20)
    .sort((a, b) => b.winRate - a.winRate) // 注意这里要倒序显示最高胜率
    .slice(0, 15);

  return NextResponse.json(playerWinRates);
}
