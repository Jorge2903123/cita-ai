const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

export function formatTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return timeFormatter.format(date);
}

export function formatDateRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
