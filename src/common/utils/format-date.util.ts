export function formatDate(value: Date | string): string {
  if (!value) return '';
  const date = new Date(value);
  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}시 ${pad(date.getMinutes())}분 ${pad(date.getSeconds())}초`
  );
}
