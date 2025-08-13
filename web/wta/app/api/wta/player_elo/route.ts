import { NextResponse } from "next/server";

export async function get(
  req: Request,
  { params }: { params: { player_id: string } },
) {
  const result = await prisma.player_elo.findFirst({
    where: { player_id: params.player_id },
  });

  return NextResponse.json(result);
}
