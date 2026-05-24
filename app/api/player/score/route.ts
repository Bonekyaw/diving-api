import { NextResponse } from "next/server";
import { z } from "zod";

import { invalidateDashboardUserLists } from "@/lib/invalidate-dashboard-cache";
import { requirePlayerSession } from "@/lib/player-auth";
import prisma from "@/lib/prisma";

const saveScoreSchema = z.object({
  score: z.number().int().min(0),
  level: z.number().int().min(1),
  reason: z.enum(["game_over", "level_complete"]),
});

export async function GET() {
  const authResult = await requirePlayerSession();
  if (!authResult.ok) {
    return authResult.response;
  }

  const { player } = authResult;

  return NextResponse.json({
    currentScore: player.currentScore,
    highestScore: player.highestScore,
    currentLevel: player.currentLevel,
  });
}

export async function POST(request: Request) {
  const authResult = await requirePlayerSession();
  if (!authResult.ok) {
    return authResult.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = saveScoreSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 },
    );
  }

  const { score, level } = parsed.data;
  const { player } = authResult;

  const updated = await prisma.user.update({
    where: {
      id: player.id,
    },
    data: {
      currentScore: score,
      currentLevel: level,
      highestScore: Math.max(player.highestScore, score),
      updatedAt: new Date(),
    },
    select: {
      currentScore: true,
      highestScore: true,
      currentLevel: true,
    },
  });

  invalidateDashboardUserLists();

  return NextResponse.json(updated);
}
