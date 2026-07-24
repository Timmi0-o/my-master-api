import type { IImagePublicEntity } from 'src/modules/masters/domain/entities/image';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';

export function toProfileAvatarView(
  image: IImagePublicEntity,
): IProfileAvatarView {
  return {
    id: image.id,
    fileId: image.fileId,
    ...(image.file != null ? { file: image.file } : {}),
  };
}

export function groupAvatarsByEntityId(
  images: readonly IImagePublicEntity[],
): Map<string, IProfileAvatarView> {
  const grouped = new Map<string, IProfileAvatarView>();

  for (const image of images) {
    if (!grouped.has(image.entityId)) {
      grouped.set(image.entityId, toProfileAvatarView(image));
    }
  }

  return grouped;
}

export function wantsAvatarInclude(include: unknown): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(include, 'avatar');
}

export function wantsNestedMasterProfileAvatarInclude(
  include: unknown,
): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  const masterProfile = (include as Record<string, unknown>).masterProfile;
  if (masterProfile === true) {
    return false;
  }

  if (!masterProfile || typeof masterProfile !== 'object') {
    return false;
  }

  const nestedInclude = (masterProfile as { include?: unknown }).include;
  return wantsAvatarInclude(nestedInclude);
}

export function wantsNestedClientUserProfileAvatarInclude(
  include: unknown,
): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  const clientUser = (include as Record<string, unknown>).clientUser;
  if (clientUser === true || !clientUser || typeof clientUser !== 'object') {
    return false;
  }

  const clientUserInclude = (clientUser as { include?: unknown }).include;
  if (!clientUserInclude || typeof clientUserInclude !== 'object') {
    return false;
  }

  // Presence of userProfile is enough: avatar is virtual and hydrated separately.
  return Object.prototype.hasOwnProperty.call(clientUserInclude, 'userProfile');
}

export function wantsNestedAppointmentPeerAvatarsInclude(
  include: unknown,
): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  const appointment = (include as Record<string, unknown>).appointment;
  if (appointment === true || !appointment || typeof appointment !== 'object') {
    return false;
  }

  const appointmentInclude = (appointment as { include?: unknown }).include;
  return (
    wantsNestedMasterProfileAvatarInclude(appointmentInclude) ||
    wantsNestedClientUserProfileAvatarInclude(appointmentInclude)
  );
}
