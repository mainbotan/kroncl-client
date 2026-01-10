/**
 * Очищает номер телефона от всех нецифровых символов
 */
export const cleanPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Форматирует номер телефона в красивый вид: +7 (XXX) XXX-XX-XX
 */
export const formatPhoneNumber = (value: string): string => {
  const cleaned = cleanPhoneNumber(value);
  
  // Ограничиваем длину (максимум 11 цифр для российского номера)
  const limited = cleaned.slice(0, 11);
  
  // Форматируем в зависимости от длины
  if (limited.length === 0) return '';
  if (limited.length <= 1) return `+7`;
  if (limited.length <= 4) return `+7 (${limited.slice(1)}`;
  if (limited.length <= 7) return `+7 (${limited.slice(1, 4)}) ${limited.slice(4)}`;
  if (limited.length <= 9) return `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
  
  return `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9, 11)}`;
};

/**
 * Валидирует российский номер телефона
 */
export const isValidRussianPhone = (value: string): boolean => {
  const cleaned = cleanPhoneNumber(value);
  
  // Российский номер должен быть 11 цифр и начинаться с 7 или 8
  if (cleaned.length !== 11) return false;
  if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) return false;
  
  // Проверяем код оператора (второй, третий, четвертый символы)
  const operatorCode = cleaned.slice(1, 4);
  
  // Список валидных кодов операторов России
  const validOperatorCodes = [
    // МТС
    '900', '901', '902', '903', '904', '905', '906', '908', '909', '910', '911', '912', 
    '913', '914', '915', '916', '917', '918', '919', '980', '981', '982', '983', '984', 
    '985', '986', '987', '988', '989',
    // МегаФон
    '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931',
    '932', '933', '934', '935', '936', '937', '938', '939',
    // Билайн
    '900', '902', '903', '904', '905', '906', '908', '909', '960', '961', '962', '963', 
    '964', '965', '966', '967', '968', '969',
    // Tele2
    '900', '901', '902', '904', '908', '950', '951', '952', '953', '954', '955', '956', 
    '958', '970', '971', '972', '973', '974', '975', '976', '977', '978', '979',
    // Yota
    '995', '996', '997', '998', '999',
    // Другие операторы
    '900', '901', '902', '903', '904', '905', '906', '908', '909'
  ];
  
  return validOperatorCodes.includes(operatorCode);
};

/**
 * Нормализует номер для хранения в БД (только цифры, начинается с 7)
 */
export const normalizePhoneForDB = (value: string): string => {
  const cleaned = cleanPhoneNumber(value);
  
  if (cleaned.length === 0) return '';
  
  // Если номер начинается с 8, заменяем на 7
  if (cleaned.startsWith('8')) {
    return '7' + cleaned.slice(1);
  }
  
  // Если номер начинается с 7, оставляем как есть
  if (cleaned.startsWith('7')) {
    return cleaned;
  }
  
  // Если номер без кода страны (10 цифр), добавляем 7
  if (cleaned.length === 10) {
    return '7' + cleaned;
  }
  
  return cleaned;
};

/**
 * Отображает номер в красивом формате для UI
 */
export const displayPhoneNumber = (value: string): string => {
  const cleaned = cleanPhoneNumber(value);
  
  if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
    const normalized = cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned;
    return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
  }
  
  // Если номер невалидный, возвращаем как есть
  return value;
};

/**
 * Проверяет, является ли номер российским
 */
export const isRussianPhone = (value: string): boolean => {
  const cleaned = cleanPhoneNumber(value);
  return cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'));
};

/**
 * Получает код оператора из номера
 */
export const getOperatorCode = (value: string): string => {
  const cleaned = cleanPhoneNumber(value);
  if (cleaned.length >= 4) {
    return cleaned.slice(1, 4);
  }
  return '';
};

/**
 * Определяет оператора по коду
 */
export const getOperatorName = (value: string): string => {
  const operatorCode = getOperatorCode(value);
  
  const operators: { [key: string]: string } = {
    '900': 'МТС', '901': 'МТС', '902': 'МТС', '903': 'МТС', '904': 'МТС', '905': 'МТС', 
    '906': 'МТС', '908': 'МТС', '909': 'МТС', '910': 'МТС', '911': 'МТС', '912': 'МТС',
    '913': 'МТС', '914': 'МТС', '915': 'МТС', '916': 'МТС', '917': 'МТС', '918': 'МТС',
    '919': 'МТС', '980': 'МТС', '981': 'МТС', '982': 'МТС', '983': 'МТС', '984': 'МТС',
    '985': 'МТС', '986': 'МТС', '987': 'МТС', '988': 'МТС', '989': 'МТС',
    
    '920': 'МегаФон', '921': 'МегаФон', '922': 'МегаФон', '923': 'МегаФон', '924': 'МегаФон',
    '925': 'МегаФон', '926': 'МегаФон', '927': 'МегаФон', '928': 'МегаФон', '929': 'МегаФон',
    '930': 'МегаФон', '931': 'МегаФон', '932': 'МегаФон', '933': 'МегаФон', '934': 'МегаФон',
    '935': 'МегаФон', '936': 'МегаФон', '937': 'МегаФон', '938': 'МегаФон', '939': 'МегаФон',
    
    '960': 'Билайн', '961': 'Билайн', '962': 'Билайн', '963': 'Билайн', '964': 'Билайн',
    '965': 'Билайн', '966': 'Билайн', '967': 'Билайн', '968': 'Билайн', '969': 'Билайн',
    
    '950': 'Tele2', '951': 'Tele2', '952': 'Tele2', '953': 'Tele2', '954': 'Tele2',
    '955': 'Tele2', '956': 'Tele2', '958': 'Tele2', '970': 'Tele2', '971': 'Tele2',
    '972': 'Tele2', '973': 'Tele2', '974': 'Tele2', '975': 'Tele2', '976': 'Tele2',
    '977': 'Tele2', '978': 'Tele2', '979': 'Tele2',
    
    '995': 'Yota', '996': 'Yota', '997': 'Yota', '998': 'Yota', '999': 'Yota'
  };
  
  return operators[operatorCode] || 'Неизвестный оператор';
};