export function normalizeSearchQuery(q: string): string {
  return q.trim().toLowerCase().replaceAll('ё', 'е');
}
