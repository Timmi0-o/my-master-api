import type { EUserLanguage } from 'src/modules/users/domain/entities/user';

export interface IUpdateOwnLanguageApplicationInput {
  userId: string;
  language: EUserLanguage;
}
