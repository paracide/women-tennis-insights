import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const surfaceData = await prisma.wta.findMany({
    where: {
      surface: {
        not: null,
      },
    },
    select: {
      surface: true,
    },
  });

  const surfaceCounts = surfaceData.reduce(
    (acc: Record<string, number>, match) => {
      const surface = match.surface || "Unknown";
      acc[surface] = (acc[surface] || 0) + 1;
      return acc;
    },
    {},
  );

  const chartData = Object.entries(surfaceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return NextResponse.json(chartData);
}
