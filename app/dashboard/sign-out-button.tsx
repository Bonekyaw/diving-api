"use client";

import { useRouter } from "next/navigation";

import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
    >
      Sign out
    </button>
  );
}
