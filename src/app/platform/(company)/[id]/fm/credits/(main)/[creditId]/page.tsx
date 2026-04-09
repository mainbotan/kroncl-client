'use client';

import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { usePermission } from "@/apps/permissions/hooks";

export default function Page() {
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.FM_CREDITS);
    const ALLOW_CREDIT_UPDATE = usePermission(PERMISSIONS.FM_CREDITS_UPDATE);   
    const ALLOW_CREDIT_PAY = usePermission(PERMISSIONS.FM_CREDITS_PAY); 
    const ALLOW_CREDIT_TRANSACTIONS = usePermission(PERMISSIONS.FM_CREDITS_TRANSACTIONS); 

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.FM_CREDITS} />
    )

    return (
        <div></div>
    )
}