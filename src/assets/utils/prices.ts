export interface PriceFormatOptions {
  showCurrency?: boolean;
  compact?: boolean;
  decimals?: number;
}

export const formatPrice = (
  price: number | null, 
  options: PriceFormatOptions = {}
): string => {
  const { 
    showCurrency = true, 
    compact = false,
    decimals = 0 
  } = options;
  
  if (price === null || price === undefined) return 'Цена не указана';
  
  if (compact && price >= 1000000) {
    const value = (price / 1000000).toFixed(1).replace('.', ',');
    return showCurrency ? `${value} млн ₽` : `${value} млн`;
  }
  
  if (compact && price >= 1000) {
    const value = (price / 1000).toFixed(0);
    return showCurrency ? `${value} тыс. ₽` : `${value} тыс.`;
  }
  
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(price);
  
  return showCurrency ? `${formatted} ₽` : formatted;
};