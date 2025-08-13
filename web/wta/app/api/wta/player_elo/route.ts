import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const p1 = Number(url.searchParams.get("player1_id"));
  const p2 = Number(url.searchParams.get("player2_id"));

  if (!Number.isInteger(p1) || !Number.isInteger(p2)) {
    return NextResponse.json(
      { error: "player IDs must be integers" },
      { status: 400 },
    );
  }

  const player1 = await prisma.player_elo.findFirst({
    where: { player_id: p1 },
  });
  const player2 = await prisma.player_elo.findFirst({
    where: { player_id: p2 },
  });

  if (!player1 || !player2) {
    return NextResponse.json(
      { error: "One or both players not found" },
      { status: 404 },
    );
  }

  const E = (a: number | null, b: number | null) => {
    if (a == null || b == null) throw new Error("Elo rating missing");
    return 1 / (1 + 10 ** ((b - a) / 400));
  };

  return NextResponse.json({
    elo_win_rate: E(player1.elo_rating, player2.elo_rating),
    elo_win_rate_hard: E(player1.elo_hard, player2.elo_hard),
    elo_win_rate_grass: E(player1.elo_grass, player2.elo_grass),
    elo_win_rate_clay: E(player1.elo_clay, player2.elo_clay),
  });
}
