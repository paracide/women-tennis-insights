import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const LEVEL_LABELS = {
  G: "Grand Slam",
  WTA1000: "WTA 1000",
  WTA500: "WTA 500",
  WTA250: "WTA 250",
  Other: "Other",
};

export async function GET() {
  const tournamentData = await prisma.wta.findMany({
    where: {
      tourney_level: {
        not: null,
      },
    },
    select: {
      tourney_level: true,
    },
  });

  const levelCounts = tournamentData.reduce(
    (acc: Record<string, number>, tournament) => {
      const level = tournament.tourney_level || "Other";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(levelCounts).map(([level, value]) => ({
    name: LEVEL_LABELS[level as keyof typeof LEVEL_LABELS] || level,
    value,
  }));

  return NextResponse.json(chartData);
}
