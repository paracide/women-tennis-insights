// app/api/wta/ageData/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const ageRanges = [
    { range: "16-20", min: 16, max: 20 },
    { range: "21-25", min: 21, max: 25 },
    { range: "26-30", min: 26, max: 30 },
    { range: "31-35", min: 31, max: 35 },
    { range: "36-40", min: 36, max: 40 },
  ];

  // Run aggregated queries in parallel
  const results = await Promise.all(
    ageRanges.map(async ({ range, min, max }) => {
      const [winners, losers] = await Promise.all([
        prisma.wta.count({
          where: {
            winner_age: {
              gte: min,
              lte: max,
            },
          },
        }),
        prisma.wta.count({
          where: {
            loser_age: {
              gte: min,
              lte: max,
            },
          },
        }),
      ]);

      return {
        ageRange: range,
        winners,
        losers,
      };
    }),
  );

  return NextResponse.json(results);
}
