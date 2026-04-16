import Collection from "@/assets/ui-kit/icons/collection";
import { PanelAction } from "../../components/panel/_types";
import Edit from "@/assets/ui-kit/icons/edit";
import Package from "@/assets/ui-kit/icons/package";
import Business from "@/assets/ui-kit/icons/business";

export const actionsList = (): PanelAction[] => {
    return ([
        {
            children: "Создать",
            href: "/platform/companies/new",
            variant: "contrast",
            as: 'link',
            icon: <Business />
        }
    ]);
}