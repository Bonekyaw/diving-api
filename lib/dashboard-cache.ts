import { cacheLife, cacheTag } from "next/cache";

import prisma from "@/lib/prisma";

export const DASHBOARD_CACHE_TAGS = {
  adminUsers: "admin-users",
  playerUsers: "player-users",
  databaseNow: "database-now",
} as const;

export function adminProfileCacheTag(userId: string) {
  return `admin-profile-${userId}`;
}

export async function getCachedCurrentAdmin(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(adminProfileCacheTag(userId));

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
      adminRole: true,
    },
  });
}

export async function getCachedAdminUsers() {
  "use cache";
  cacheLife("minutes");
  cacheTag(DASHBOARD_CACHE_TAGS.adminUsers);

  return prisma.user.findMany({
    where: {
      role: "ADMIN",
      adminRole: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      adminRole: true,
      createdAt: true,
    },
    orderBy: [
      {
        adminRole: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getCachedPlayerUsers() {
  "use cache";
  cacheLife("minutes");
  cacheTag(DASHBOARD_CACHE_TAGS.playerUsers);

  return prisma.user.findMany({
    where: {
      role: "PLAYER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      currentScore: true,
      highestScore: true,
      currentLevel: true,
      createdAt: true,
      playerBanUntil: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getCachedDatabaseNowMs() {
  "use cache";
  cacheLife("minutes");
  cacheTag(DASHBOARD_CACHE_TAGS.databaseNow);

  const databaseNow = await prisma.$queryRaw<{ now: Date }[]>`
    SELECT NOW() AS now
  `;

  return databaseNow[0]?.now.getTime() ?? Date.now();
}
