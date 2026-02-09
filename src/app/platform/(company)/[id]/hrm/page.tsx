import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Plus from "@/assets/ui-kit/icons/plus";
import { CompanyParams } from "../layout";
import styles from './page.module.scss';
import { EmployeeCard } from "./components/employee-card/card";

export default function Page({params}: CompanyParams) {
    const companyId = params.id;
    return (
        <>
            <PlatformHead
                title="Сотрудники"
                description="Бизнес начинается с команды."
                actions={[
                    {
                        children: 'Создать',
                        variant: 'accent',
                        icon: <Plus />,
                        as: 'link',
                        href: `/platform/${companyId}/hrm/create`
                    }
                ]}
                searchProps={{
                    placeholder: 'Поиск по сотрудникам'
                }}
                showSearch
            />
            <div className={styles.grid}>
                <EmployeeCard />
                <EmployeeCard />
                <EmployeeCard />
                <EmployeeCard />
                <EmployeeCard />
                <EmployeeCard />
            </div>
        </>
    )
}