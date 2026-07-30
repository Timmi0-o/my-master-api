export function mapEntityHttpResponse<T>(entity: T): { data: T } {
  return { data: entity };
}
