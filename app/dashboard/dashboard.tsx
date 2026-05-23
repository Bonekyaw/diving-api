import Link from "next/link";

import { AdminUsersPanel } from "./admin-users-panel";
import { PlayerUsersPanel } from "./player-users-panel";
import { SignOutButton } from "./sign-out-button";

type AdminRole = "SUPER_ADMIN" | "MANAGER" | "EDITOR" | "STAFF";
type DashboardSection = "dashboard" | "admins" | "players";

type CurrentAdmin = {
  name: string;
  email: string;
  adminRole: AdminRole | null;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  adminRole: AdminRole | null;
  createdAt: Date;
};

type PlayerUser = {
  id: string;
  name: string;
  email: string;
  currentScore: number;
  highestScore: number;
  currentLevel: number;
  createdAt: Date;
  playerBanUntil: Date | null;
};

function roleLabel(role: AdminRole | null) {
  if (role === "SUPER_ADMIN") return "Super admin";
  if (role === "MANAGER") return "Manager";
  if (role === "EDITOR") return "Editor";
  if (role === "STAFF") return "Staff";
  return "Admin";
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "DA"
  );
}

const metricAccents = [
  {
    ring: "bg-teal-100 text-teal-700",
    bar: "bg-teal-500",
  },
  {
    ring: "bg-sky-100 text-sky-700",
    bar: "bg-sky-500",
  },
  {
    ring: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
  },
  {
    ring: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
  },
] as const;

export function Dashboard({
  currentAdmin,
  adminUsers,
  playerUsers,
  activeSection,
  nowMs,
}: {
  currentAdmin: CurrentAdmin;
  adminUsers: AdminUser[];
  playerUsers: PlayerUser[];
  activeSection: DashboardSection;
  nowMs: number;
}) {
  const canManageAdmins = currentAdmin.adminRole === "SUPER_ADMIN";
  const canModeratePlayers =
    Boolean(currentAdmin.adminRole) && currentAdmin.adminRole !== "STAFF";
  const managedAdmins = adminUsers.filter(
    (user) => user.adminRole !== "SUPER_ADMIN",
  ).length;
  const activePlayerBans = playerUsers.filter(
    (user) => user.playerBanUntil && user.playerBanUntil.getTime() > nowMs,
  ).length;
  const sectionDetails = {
    dashboard: {
      title: "Dashboard",
      description:
        "Overview of admin permissions, team accounts, player volume, and active restrictions.",
    },
    admins: {
      title: "Admin management",
      description:
        "Manage dashboard access, assign operational roles, and keep permissions organized.",
    },
    players: {
      title: "Player management",
      description:
        "Review mobile player accounts, score progress, and temporary ban status.",
    },
  } satisfies Record<
    DashboardSection,
    {
      title: string;
      description: string;
    }
  >;
  const activeTitle = sectionDetails[activeSection].title;
  const activeDescription = sectionDetails[activeSection].description;
  const navItems = [
    {
      key: "dashboard",
      label: "Overview",
      href: "/?section=dashboard",
      icon: "◆",
    },
    {
      key: "admins",
      label: "Admins",
      href: "/?section=admins",
      count: adminUsers.length,
      icon: "A",
    },
    {
      key: "players",
      label: "Players",
      href: "/?section=players",
      count: playerUsers.length,
      icon: "P",
    },
  ] as const;
  const metrics = [
    {
      label: "Your role",
      value: roleLabel(currentAdmin.adminRole),
      detail: "Current dashboard permission level",
      trend: canManageAdmins ? "Full access" : "Limited access",
    },
    {
      label: "Managed admins",
      value: managedAdmins.toString(),
      detail: "Manager, editor, and staff accounts",
      trend: `${adminUsers.length} total`,
    },
    {
      label: "Total players",
      value: playerUsers.length.toString(),
      detail: "Registered from the mobile app",
      trend: "View only",
    },
    {
      label: "Active bans",
      value: activePlayerBans.toString(),
      detail: "Temporary restrictions in effect",
      trend: canModeratePlayers ? "Can moderate" : "View only",
    },
  ];

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-[1600px]">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-6 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 px-1">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-teal-500 to-teal-700 text-sm font-bold text-white shadow-md shadow-teal-600/25">
              D
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">
                Diving Admin
              </p>
              <p className="text-xs text-slate-500">Operations console</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </p>
            {navItems.map((item) => {
              const active = activeSection === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex h-11 items-center justify-between rounded-xl px-3 text-sm font-medium transition ${
                    active
                      ? "bg-teal-50 text-teal-900 ring-1 ring-teal-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                        active
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {"count" in item ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        active
                          ? "bg-teal-100 text-teal-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick stats
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-teal-500" />
                {managedAdmins} managed admins
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-sky-500" />
                {playerUsers.length} mobile players
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-amber-500" />
                {activePlayerBans} active bans
              </li>
            </ul>
          </div>

          <div className="mt-8 lg:mt-auto lg:pt-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                  {initials(currentAdmin.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {currentAdmin.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {currentAdmin.email}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Role</span>
                <span className="text-xs font-semibold text-slate-800">
                  {roleLabel(currentAdmin.adminRole)}
                </span>
              </div>
              <div className="mt-3">
                <SignOutButton />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-white">
          <header className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  {activeSection === "dashboard"
                    ? "Overview"
                    : activeSection === "admins"
                  ? "Team"
                  : "Community"}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {activeTitle}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {activeDescription}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {roleLabel(currentAdmin.adminRole)}
              </div>
            </div>
          </header>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {activeSection === "dashboard" ? (
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric, index) => {
                  const accent = metricAccents[index] ?? metricAccents[0];

                  return (
                    <article
                      key={metric.label}
                      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-500">
                          {metric.label}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${accent.ring}`}
                        >
                          {metric.trend}
                        </span>
                      </div>
                      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        {metric.value}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        {metric.detail}
                      </p>
                    </article>
                  );
                })}
              </section>
            ) : activeSection === "admins" ? (
              <AdminUsersPanel
                users={adminUsers}
                canManageAdmins={canManageAdmins}
              />
            ) : (
              <PlayerUsersPanel
                users={playerUsers}
                canModeratePlayers={canModeratePlayers}
                nowMs={nowMs}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
