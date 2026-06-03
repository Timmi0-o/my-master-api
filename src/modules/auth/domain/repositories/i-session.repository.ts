export interface ISessionRepository {
  create(payload: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void>;
}
