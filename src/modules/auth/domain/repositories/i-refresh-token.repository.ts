export interface IRefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface IRefreshTokenRepository {
  create(payload: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<IRefreshTokenRecord>;

  findByHash(tokenHash: string): Promise<IRefreshTokenRecord | null>;

  revokeById(tokenId: string): Promise<void>;

  revokeAllForUser(userId: string): Promise<void>;
}
