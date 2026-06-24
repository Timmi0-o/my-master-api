import type { ICreateRootFolderApplicationInput } from 'src/modules/files/application/dtos/folder/create-root-folder.input';
import type { ICreateMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/create-master-profile.input';
import type { ICreateMasterProfileApplicationOutput } from 'src/modules/masters/application/dtos/master-profile/create-master-profile.output';

export function outputCreateMasterProfileToCreateRootFolderInput(
  profile: ICreateMasterProfileApplicationOutput,
  input: ICreateMasterProfileApplicationInput,
): ICreateRootFolderApplicationInput {
  return {
    ownerKind: 'master-profile',
    ownerId: profile.id,
    actor: {
      userId: profile.userId,
      isStaffUser: input.actor.isStaffUser,
    },
  };
}
