export default function toUTCDate(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`);
}
