import type { ICreateRootFolderApplicationInput } from 'src/modules/files/application/dtos/folder/create-root-folder.input';
import type { ICreateUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/create-user-profile.input';
import type { ICreateUserProfileApplicationOutput } from 'src/modules/users/application/dtos/user-profile/create-user-profile.output';

export function outputCreateUserProfileToCreateRootFolderInput(
  profile: ICreateUserProfileApplicationOutput,
  input: ICreateUserProfileApplicationInput,
): ICreateRootFolderApplicationInput {
  return {
    ownerKind: 'user-profile',
    ownerId: profile.id,
    actor: {
      userId: profile.userId,
      isStaffUser: input.actor.isStaffUser,
    },
  };
}
