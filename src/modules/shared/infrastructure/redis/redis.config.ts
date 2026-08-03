export interface IRedisConfig {
  url: string;
  host: string;
  port: number;
  password?: string;
  db: number;
}

export function loadRedisConfig(): IRedisConfig {
  const url = process.env.REDIS_URL?.trim();
  const host = process.env.REDIS_HOST?.trim() || '127.0.0.1';
  const port = Number(process.env.REDIS_PORT ?? 6379);
  const password = process.env.REDIS_PASSWORD?.trim() || undefined;
  const db = Number(process.env.REDIS_DB ?? 0);

  return {
    url:
      url ||
      (password
        ? `redis://:${encodeURIComponent(password)}@${host}:${port}/${db}`
        : `redis://${host}:${port}/${db}`),
    host,
    port: Number.isFinite(port) ? port : 6379,
    password,
    db: Number.isFinite(db) ? db : 0,
  };
}

export function toBullMqConnection(config: IRedisConfig = loadRedisConfig()) {
  return {
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db,
    maxRetriesPerRequest: null as null,
  };
}
