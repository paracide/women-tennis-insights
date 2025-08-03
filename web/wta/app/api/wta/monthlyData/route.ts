// app/api/wta/monthlyData/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const matchData = await prisma.wta.findMany({
    where: {
      winner_age: { not: null },
      loser_age: { not: null },
      tourney_date: { not: null },
    },
    select: {
      tourney_date: true,
      tourney_id: true,
    },
  });

  const monthlyStats: Record<
    number,
    { matches: number; tournaments: Set<string> }
  > = {};

  matchData.forEach((match) => {
    if (match.tourney_date) {
      const date = new Date(match.tourney_date);
      const month = date.getMonth();

      if (!monthlyStats[month]) {
        monthlyStats[month] = { matches: 0, tournaments: new Set() };
      }

      monthlyStats[month].matches++;
      if (match.tourney_id) {
        monthlyStats[month].tournaments.add(match.tourney_id);
      }
    }
  });

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = MONTHS.map((monthName, index) => ({
    month: monthName,
    matches: monthlyStats[index]?.matches || 0,
    tournaments: monthlyStats[index]?.tournaments.size || 0,
  }));

  return NextResponse.json(chartData);
}
