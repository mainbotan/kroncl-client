'use client';

import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { usePermission } from "@/apps/permissions/hooks";

export default function Page() {
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_ANALYSIS)

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.allowed && !ALLOW_PAGE.isLoading) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_ANALYSIS} />
    )
    
    return (
        <div></div>
    )
}