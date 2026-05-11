export const linksConfig = {
  registration: '/sso/sign_up',
  login: '/sso/sign_in',
  recovery: '/sso/recovery',
  createCompany: '/platform/companies/new',
  developerPortal: '/dev',
  developerGithub: 'https://github.com/Kroncl',
  developerCommunity: '/community',

  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }
};

export const authLinks = {
    registration: linksConfig.registration,
    login: linksConfig.login,
    recovery: linksConfig.recovery
};
export const accountActionsLinks = {
    createCompany: linksConfig.createCompany
};