export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}