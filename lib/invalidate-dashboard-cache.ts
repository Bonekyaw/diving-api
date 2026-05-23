import { revalidateTag } from "next/cache";

import {
  DASHBOARD_CACHE_TAGS,
  adminProfileCacheTag,
} from "@/lib/dashboard-cache";

export function invalidateDashboardUserLists() {
  revalidateTag(DASHBOARD_CACHE_TAGS.adminUsers, "max");
  revalidateTag(DASHBOARD_CACHE_TAGS.playerUsers, "max");
  revalidateTag(DASHBOARD_CACHE_TAGS.databaseNow, "max");
}

export function invalidateAdminProfile(userId: string) {
  revalidateTag(adminProfileCacheTag(userId), "max");
}
