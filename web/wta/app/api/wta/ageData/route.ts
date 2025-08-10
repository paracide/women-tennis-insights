// app/api/wta/ageData/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const matchData = await prisma.wta.findMany({
    where: {
      NOT: [{ winner_age: null }, { loser_age: null }],
    },
    select: {
      winner_age: true,
      loser_age: true,
    },
  });

  // 构造年龄区间
  const ageRanges = [
    { range: "16-20", min: 16, max: 20 },
    { range: "21-25", min: 21, max: 25 },
    { range: "26-30", min: 26, max: 30 },
    { range: "31-35", min: 31, max: 35 },
    { range: "36-40", min: 36, max: 40 },
  ];

  const ageStats = ageRanges.map(({ range, min, max }) => {
    const winners = matchData.filter(
      (match) =>
        match.winner_age !== null &&
        match.winner_age.toNumber() >= min &&
        match.winner_age.toNumber() <= max,
    ).length;

    const losers = matchData.filter(
      (match) =>
        match.loser_age !== null &&
        match.loser_age.toNumber() >= min &&
        match.loser_age.toNumber() <= max,
    ).length;

    return {
      ageRange: range,
      winners,
      losers,
    };
  });

  return NextResponse.json(ageStats);
}
