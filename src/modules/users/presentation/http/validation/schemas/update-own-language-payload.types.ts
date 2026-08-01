import type { EUserLanguage } from 'src/modules/users/domain/entities/user';

export interface IUpdateOwnLanguagePayload {
  language: EUserLanguage;
}
