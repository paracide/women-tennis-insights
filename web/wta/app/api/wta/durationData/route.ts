// app/api/wta/durationData/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const matchData = await prisma.wta.findMany({
    where: {
      minutes: {
        not: null,
        gt: 0,
      },
    },
    select: {
      minutes: true,
    },
  });

  const durationRanges = [
    { range: "0-60", min: 0, max: 60 },
    { range: "61-90", min: 61, max: 90 },
    { range: "91-120", min: 91, max: 120 },
    { range: "121-150", min: 121, max: 150 },
    { range: "151-180", min: 151, max: 180 },
    { range: "181+", min: 181, max: Number.POSITIVE_INFINITY },
  ];

  const durationStats = durationRanges.map(({ range, min, max }) => {
    const count = matchData.filter(
      (match) =>
        match.minutes !== null && match.minutes >= min && match.minutes <= max,
    ).length;

    return { range, count };
  });

  return NextResponse.json(durationStats);
}
