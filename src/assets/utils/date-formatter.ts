export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export const toRFC3339 = (date: string) => {
    if (!date) return undefined;
    return new Date(date).toISOString();
};
