export interface IValidateUserInput {
  identifier: string;
  password: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface IUserIdInput {
  userId: string;
}

export interface ILoginMetadataInput {
  ipAddress?: string | null;
  userAgent?: string | null;
}
