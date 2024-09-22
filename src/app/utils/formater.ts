// utils/formater.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
}

export function formatHour(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatIDR(value: number, prefix = true): string {
  const formattedValue = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  return prefix ? `Rp ${formattedValue}` : formattedValue;
}
