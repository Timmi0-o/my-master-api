import {
  groupAvatarsByEntityId,
  toProfileAvatarView,
} from 'src/modules/masters/application/helpers/profile-avatar-batch.helper';

export { groupAvatarsByEntityId, toProfileAvatarView };

export function wantsAvatarInclude(include: unknown): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(include, 'avatar');
}

export function wantsBannerInclude(include: unknown): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(include, 'banner');
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

export function wantsNestedActorUserProfileAvatarInclude(
  include: unknown,
): boolean {
  if (!include || typeof include !== 'object') {
    return false;
  }

  const actor = (include as Record<string, unknown>).actor;
  if (actor === true || !actor || typeof actor !== 'object') {
    return false;
  }

  const actorInclude = (actor as { include?: unknown }).include;
  if (!actorInclude || typeof actorInclude !== 'object') {
    return false;
  }

  // Presence of userProfile is enough: avatar is virtual and hydrated separately.
  return Object.prototype.hasOwnProperty.call(actorInclude, 'userProfile');
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
