import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("search");
  const playerId = searchParams.get("id");

  try {
    if (playerId) {
      const playerDetails = await prisma.players.findFirst({
        where: {
          player_id: parseInt(playerId),
        },
        select: {
          player_id: true,
          name_first: true,
          name_last: true,
          hand: true,
          dob: true,
          ioc: true,
          height: true,
          ranking_100: {
            orderBy: {
              ranking_date: "desc",
            },
            take: 1,
            select: {
              rank: true,
              points: true,
              ranking_date: true,
            },
          },
        },
      });

      if (!playerDetails) {
        return NextResponse.json(
          { message: "Player not found" },
          { status: 404 },
        );
      }

      const latestRanking = playerDetails.ranking_100[0] || {};
      const response = {
        ...playerDetails,
        latest_rank: latestRanking.rank ?? null,
        latest_points: latestRanking.points ?? null,
        latest_rank_date: latestRanking.ranking_date ?? null,
      };
      delete (response as any).ranking_100;

      return NextResponse.json(response);
    } else if (searchQuery) {
      const players = await prisma.players.findMany({
        where: {
          OR: [
            {
              name_first: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              name_last: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          player_id: true,
          name_first: true,
          name_last: true,
          ioc: true,
        },
        take: 10,
      });

      return NextResponse.json(players);
    } else {
      return NextResponse.json(
        { message: "Missing search query or player ID" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
