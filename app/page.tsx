import { Suspense } from "react";
import { headers } from "next/headers";

import { DashboardPageFallback } from "@/app/dashboard/dashboard-fallback";
import { Dashboard } from "@/app/dashboard/dashboard";
import { LoginForm } from "@/app/login-form";
import { auth } from "@/lib/auth";
import {
  getCachedAdminUsers,
  getCachedCurrentAdmin,
  getCachedDatabaseNowMs,
  getCachedPlayerUsers,
} from "@/lib/dashboard-cache";

type HomeProps = {
  searchParams?: Promise<{
    section?: string;
  }>;
};

function resolveActiveSection(
  section: string | undefined,
): "dashboard" | "admins" | "players" {
  if (section === "admins" || section === "players") {
    return section;
  }
  return "dashboard";
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <Suspense fallback={<DashboardPageFallback />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeSection = resolveActiveSection(params?.section);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return <LoginForm />;
  }

  const currentAdmin = await getCachedCurrentAdmin(session.user.id);

  if (
    !currentAdmin ||
    currentAdmin.role !== "ADMIN" ||
    !currentAdmin.adminRole
  ) {
    return <LoginForm />;
  }

  const [adminUsers, playerUsers, nowMs] = await Promise.all([
    getCachedAdminUsers(),
    getCachedPlayerUsers(),
    getCachedDatabaseNowMs(),
  ]);

  return (
    <Dashboard
      currentAdmin={currentAdmin}
      adminUsers={adminUsers}
      playerUsers={playerUsers}
      activeSection={activeSection}
      nowMs={nowMs}
    />
  );
}
