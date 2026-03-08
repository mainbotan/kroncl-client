import { CategoryStatus, UnitStatus } from "@/apps/company/modules/wm/types";

export function getStatusLabel(status: CategoryStatus | UnitStatus): string {
    switch (status) {
        case 'active':
            return 'Активная';
        case 'inactive':
            return 'Неактивная';
        default:
            return status;
    }
}

export function getStatusVariant(status: CategoryStatus | UnitStatus): string {
    switch (status) {
        case 'active':
            return 'accent';
        case 'inactive':
            return 'default';
        default:
            return 'default';
    }
}