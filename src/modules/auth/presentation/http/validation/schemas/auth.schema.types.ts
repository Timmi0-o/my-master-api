export interface IValidateUserInput {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  username: string;
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

export interface ISendResetPasswordEmailPayload {
  email: string;
}

export interface IValidateResetPasswordTokenPayload {
  token: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ISendVerificationEmailPayload {
  email: string;
}

export interface IVerifyEmailPayload {
  token: string;
}
