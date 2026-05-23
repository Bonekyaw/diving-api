import {
  createAdminUserAction,
  deleteAdminUserAction,
  updateAdminUserAction,
} from "@/app/admin-users/actions";

import {
  BtnDanger,
  BtnPrimary,
  BtnSecondary,
  CountBadge,
  FieldInput,
  FieldSelect,
  PanelCard,
  PanelHeader,
  StatusBadge,
} from "./ui";

type AdminRole = "SUPER_ADMIN" | "MANAGER" | "EDITOR" | "STAFF";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  adminRole: AdminRole | null;
  createdAt: Date;
};

const managedRoles = [
  { value: "MANAGER", label: "Manager" },
  { value: "EDITOR", label: "Editor" },
  { value: "STAFF", label: "Staff" },
] as const;

function roleLabel(role: AdminRole | null) {
  if (role === "SUPER_ADMIN") return "Super admin";
  if (role === "MANAGER") return "Manager";
  if (role === "EDITOR") return "Editor";
  if (role === "STAFF") return "Staff";
  return "Unassigned";
}

function RoleSelect({
  name,
  defaultValue,
  form,
}: {
  name: string;
  defaultValue?: Exclude<AdminRole, "SUPER_ADMIN">;
  form?: string;
}) {
  return (
    <FieldSelect
      name={name}
      form={form}
      defaultValue={defaultValue || "STAFF"}
      aria-label="Admin role"
    >
      {managedRoles.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </FieldSelect>
  );
}

export function AdminUsersPanel({
  users,
  canManageAdmins,
}: {
  users: AdminUser[];
  canManageAdmins: boolean;
}) {
  return (
    <PanelCard>
      <PanelHeader
        eyebrow="Access control"
        title="Admin users"
        description="Super admins manage manager, editor, and staff accounts."
        badge={<CountBadge>{users.length} total</CountBadge>}
      />

      {canManageAdmins ? (
        <form
          action={createAdminUserAction}
          className="grid gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-5 lg:grid-cols-[1fr_1.2fr_160px_auto]"
        >
          <FieldInput name="name" required placeholder="Full name" />
          <FieldInput
            name="email"
            type="email"
            required
            placeholder="admin@example.com"
          />
          <RoleSelect name="adminRole" />
          <BtnPrimary type="submit">Add admin</BtnPrimary>
        </form>
      ) : (
        <div className="border-b border-slate-100 bg-amber-50/60 px-6 py-4 text-sm text-amber-900">
          Admin management is available to super admins only.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3.5 font-semibold">Name</th>
              <th className="px-3 py-3.5 font-semibold">Email</th>
              <th className="px-3 py-3.5 font-semibold">Role</th>
              <th className="px-3 py-3.5 font-semibold">Created</th>
              <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const canEdit = canManageAdmins && user.adminRole !== "SUPER_ADMIN";

              return (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50/80"
                >
                  {canEdit ? (
                    <>
                      <td className="px-6 py-4">
                        <form
                          id={`update-admin-${user.id}`}
                          action={updateAdminUserAction}
                          className="contents"
                        >
                          <input type="hidden" name="id" value={user.id} />
                          <FieldInput
                            name="name"
                            defaultValue={user.name}
                            required
                            className="min-w-[140px]"
                          />
                        </form>
                      </td>
                      <td className="px-3 py-4">
                        <FieldInput
                          form={`update-admin-${user.id}`}
                          name="email"
                          type="email"
                          defaultValue={user.email}
                          required
                          className="min-w-[180px]"
                        />
                      </td>
                      <td className="px-3 py-4">
                        <RoleSelect
                          name="adminRole"
                          form={`update-admin-${user.id}`}
                          defaultValue={
                            user.adminRole === "MANAGER" ||
                            user.adminRole === "EDITOR" ||
                            user.adminRole === "STAFF"
                              ? user.adminRole
                              : "STAFF"
                          }
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-3 py-4 text-slate-600">{user.email}</td>
                      <td className="px-3 py-4">
                        <StatusBadge tone="neutral">
                          {roleLabel(user.adminRole)}
                        </StatusBadge>
                      </td>
                    </>
                  )}
                  <td className="px-3 py-4 text-slate-500">
                    {user.createdAt.toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {canEdit ? (
                      <div className="flex justify-end gap-2">
                        <BtnSecondary type="submit" form={`update-admin-${user.id}`}>
                          Save
                        </BtnSecondary>
                        <form action={deleteAdminUserAction}>
                          <input type="hidden" name="id" value={user.id} />
                          <BtnDanger type="submit">Delete</BtnDanger>
                        </form>
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
                  colSpan={5}
                  className="px-6 py-16 text-center text-sm text-slate-500"
                >
                  No manager, editor, or staff admins have been added yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}
