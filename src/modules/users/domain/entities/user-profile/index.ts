export type { IUserProfileEntity, IUserProfilePublicEntity } from './i-user-profile.entity';
export type { ICreateUserProfileInput } from './i-create-user-profile.input';
export type { IUpdateUserProfileInput } from './i-update-user-profile.input';
export type { IUserProfileRelations } from './i-user-profile-relations';
export {
  UserProfileNotFoundError,
  UserProfileForbiddenError,
} from './errors';
export {
  ensureUserProfileExists,
  ensureUserProfileAccessible,
  type IUserProfileActor,
} from './policies';