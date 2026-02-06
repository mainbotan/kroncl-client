// вроде где-то уже есть, похуй уберём ))) ага конечно ебанат, забудешь ты
export interface CompanyAccount {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role_id: string;
  role_code: string;
  role_name: string;
  status: string;
  created_at: string;
  joined_at: string;
}

export interface CompanyAccountsResponse {
  accounts: CompanyAccount[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}