import {
  banPlayerAction,
  unbanPlayerAction,
} from "@/app/player-users/actions";

import {
  BtnDanger,
  BtnSecondary,
  CountBadge,
  FieldSelect,
  PanelCard,
  PanelHeader,
  StatusBadge,
} from "./ui";

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

function formatDate(value: Date) {
  return value.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isActiveBan(value: Date | null, nowMs: number) {
  return Boolean(value && value.getTime() > nowMs);
}

export function PlayerUsersPanel({
  users,
  canModeratePlayers,
  nowMs,
}: {
  users: PlayerUser[];
  canModeratePlayers: boolean;
  nowMs: number;
}) {
  return (
    <PanelCard>
      <PanelHeader
        eyebrow="Player access"
        title="Players"
        description="Mobile app accounts are view-only here. Admins can manage temporary ban status."
        badge={<CountBadge>{users.length} total</CountBadge>}
      />

      {!canModeratePlayers ? (
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
          Staff admins can view players but cannot ban or unban them.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3.5 font-semibold">Player</th>
              <th className="px-3 py-3.5 font-semibold">Level</th>
              <th className="px-3 py-3.5 font-semibold">Current score</th>
              <th className="px-3 py-3.5 font-semibold">Best score</th>
              <th className="px-3 py-3.5 font-semibold">Joined</th>
              <th className="px-3 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const banned = isActiveBan(user.playerBanUntil, nowMs);

              return (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="mt-0.5 break-all text-xs text-slate-500">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-700">
                    {user.currentLevel}
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-700">
                    {user.currentScore.toLocaleString()}
                  </td>
                  <td className="px-3 py-4">
                    <span className="font-semibold text-slate-900">
                      {user.highestScore.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-3 py-4">
                    {banned && user.playerBanUntil ? (
                      <StatusBadge tone="danger">
                        Banned until {formatDate(user.playerBanUntil)}
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="success">Active</StatusBadge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {canModeratePlayers ? (
                      <div className="flex justify-end gap-2">
                        {banned ? (
                          <form action={unbanPlayerAction}>
                            <input type="hidden" name="id" value={user.id} />
                            <BtnSecondary type="submit">Unban</BtnSecondary>
                          </form>
                        ) : (
                          <form
                            action={banPlayerAction}
                            className="flex justify-end gap-2"
                          >
                            <input type="hidden" name="id" value={user.id} />
                            <FieldSelect
                              name="banDays"
                              defaultValue="7"
                              className="w-[120px]"
                              aria-label="Ban duration"
                            >
                              <option value="1">1 day</option>
                              <option value="7">7 days</option>
                              <option value="14">14 days</option>
                              <option value="30">30 days</option>
                            </FieldSelect>
                            <BtnDanger type="submit">Ban</BtnDanger>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="text-right text-slate-300">—</div>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-sm text-slate-500"
                >
                  No mobile app players have registered yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}
