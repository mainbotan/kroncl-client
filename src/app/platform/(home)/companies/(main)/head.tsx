import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Edit from "@/assets/ui-kit/icons/edit";
import Plus from "@/assets/ui-kit/icons/plus";

export function CompaniesHeader({ 
  searchQuery, 
  onSearch 
}: { 
  searchQuery: string; 
  onSearch: (value: string) => void 
}) {
  return (
    <PlatformHead
      title="Ваши организации"
      description="Компании, к которым вы имеете доступ, собраны здесь – перемещайтесь между учетными системами нескольких организаций без задержек."
      actions={[
        {
          label: 'Создать',
          href: '/platform/companies/new',
          variant: 'accent',
          icon: <Plus />
        }
      ]}
      sections={[
        {
          label: 'Все',
          value: 'all',
          href: '/platform/companies?role=all',
          disabled: false
        },
        {
          label: 'Владеете',
          value: 'owner',
          href: '/platform/companies?role=owner',
          disabled: false
        },
        {
          label: 'Приглашены',
          value: 'joined',
          href: '/platform/companies?role=guest',
          disabled: false
        }
      ]}
      showSearch={true}
      searchProps={{
        placeholder: "Поиск по названию компании...",
        defaultValue: searchQuery,
        onSearch: onSearch,
        debounceMs: 500
      }}
    />
  );
}