interface ClientInfo {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  platform: string;
  referrer: string;
  url: string;
  timestamp: string;
}

export const getClientInfo = (): ClientInfo => {
  const { userAgent, language } = navigator;
  const { width, height } = screen;
  const { referrer } = document;
  const { href } = window.location;

  // Определяем тип устройства
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
  
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (isMobile) deviceType = 'mobile';
  if (isTablet) deviceType = 'tablet';

  // Определяем платформу
  let platform = 'Unknown';
  if (/Android/i.test(userAgent)) platform = 'Android';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) platform = 'iOS';
  else if (/Windows/i.test(userAgent)) platform = 'Windows';
  else if (/Macintosh/i.test(userAgent)) platform = 'macOS';
  else if (/Linux/i.test(userAgent)) platform = 'Linux';

  return {
    userAgent: userAgent.substring(0, 500), // Ограничиваем длину
    language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${width}x${height}`,
    deviceType,
    platform,
    referrer: referrer || 'direct',
    url: href,
    timestamp: new Date().toISOString()
  };
};

// Компактная версия для отправки
export const getCompactClientInfo = () => {
  const info = getClientInfo();
  return {
    ua: info.userAgent.substring(0, 200), // Ещё более компактно
    lang: info.language,
    tz: info.timezone,
    res: info.screenResolution,
    device: info.deviceType,
    plat: info.platform,
    ref: info.referrer.substring(0, 100),
    url: info.url.substring(0, 200),
    ts: info.timestamp
  };
};