export const linksConfig = {
  registration: process.env.NEXT_PUBLIC_REGISTRATION_URL || 'https://auth.yieldaa.com/reg',
  login: process.env.NEXT_PUBLIC_LOGIN_URL || 'https://auth.yieldaa.com',
  developerPortal: process.env.NEXT_PUBLIC_DEV_PORTAL || 'https://dev.yieldaa.com',
  createCompany: process.env.NEXT_PUBLIC_CREATE_COMPANY_URL || 'https://platform.yieldaa.com/ogranization/create',
  // Можно также сделать fallback для development
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }
};

export const authLinks = {
    registration: linksConfig.registration,
    login: linksConfig.login,
};
export const accountActionsLinks = {
    createCompany: linksConfig.createCompany
};