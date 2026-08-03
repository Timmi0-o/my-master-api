const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function serializeForRedisPubSub(value: unknown): string {
  return JSON.stringify(value);
}

export function parseRedisPubSubMessage<T>(message: string): T {
  return JSON.parse(message, (_key, value) => {
    if (typeof value === 'string' && ISO_DATE_RE.test(value)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
    return value;
  }) as T;
}
