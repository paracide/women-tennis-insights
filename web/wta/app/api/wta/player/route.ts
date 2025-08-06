import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming you have a prisma client setup at lib/prisma

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("search");
  const playerId = searchParams.get("id");
  const topPlayers = searchParams.get("topPlayers"); // New param for top players
  const player1Id = searchParams.get("player1Id"); // New param for head-to-head
  const player2Id = searchParams.get("player2Id"); // New param for head-to-head

  try {
    if (topPlayers === "true") {
      // Fetch the latest ranking date
      const latestRankingDateResult = await prisma.ranking_100.findFirst({
        orderBy: {
          ranking_date: "desc",
        },
        select: {
          ranking_date: true,
        },
      });

      if (!latestRankingDateResult) {
        return NextResponse.json(
          { message: "No ranking data found" },
          { status: 404 },
        );
      }

      const latestDate = latestRankingDateResult.ranking_date;

      // Fetch top 2 players based on the latest ranking date
      const topPlayersData = await prisma.ranking_100.findMany({
        where: {
          ranking_date: latestDate,
        },
        orderBy: {
          rank: "asc",
        },
        take: 2,
        include: {
          players: {
            select: {
              player_id: true,
              name_first: true,
              name_last: true,
              hand: true,
              dob: true,
              ioc: true,
              height: true,
            },
          },
        },
      });

      const formattedTopPlayers = topPlayersData.map((r) => ({
        player_id: r.players.player_id,
        name_first: r.players.name_first,
        name_last: r.players.name_last,
        ioc: r.players.ioc,
        hand: r.players.hand,
        dob: r.players.dob ? r.players.dob.toISOString().split("T")[0] : null, // Format date to string
        height: r.players.height,
        latest_rank: r.rank,
        latest_points: r.points,
        latest_rank_date: r.ranking_date, // Format date to string
      }));

      return NextResponse.json(formattedTopPlayers);
    } else if (player1Id && player2Id) {
      // Fetch head-to-head matches between two players
      const matches = await prisma.wta.findMany({
        where: {
          OR: [
            {
              winner_id: parseInt(player1Id),
              loser_id: parseInt(player2Id),
            },
            {
              winner_id: parseInt(player2Id),
              loser_id: parseInt(player1Id),
            },
          ],
        },
        orderBy: {
          tourney_date: "desc", // Order by most recent matches first
        },
        select: {
          tourney_id: true,
          tourney_name: true,
          surface: true,
          tourney_level: true,
          tourney_date: true,
          winner_name: true,
          loser_name: true,
          score: true,
          round: true,
        },
      });

      return NextResponse.json(matches);
    } else if (playerId) {
      // Existing logic to fetch single player details
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
        latest_rank_date: latestRanking.ranking_date,
      };
      delete (response as any).ranking_100;

      return NextResponse.json(response);
    } else if (searchQuery) {
      // Existing logic to search players
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
