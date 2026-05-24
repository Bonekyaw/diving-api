import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type PlayerRecord = {
  id: string;
  role: "PLAYER" | "ADMIN";
  currentScore: number;
  highestScore: number;
  currentLevel: number;
  playerBanUntil: Date | null;
};

export type RequirePlayerSessionResult =
  | { ok: true; player: PlayerRecord }
  | { ok: false; response: NextResponse };

export async function requirePlayerSession(): Promise<RequirePlayerSessionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
      currentScore: true,
      highestScore: true,
      currentLevel: true,
      playerBanUntil: true,
    },
  });

  if (!user || user.role !== "PLAYER") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (user.playerBanUntil && user.playerBanUntil.getTime() > Date.now()) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Player is banned" }, { status: 403 }),
    };
  }

  return { ok: true, player: user };
}
