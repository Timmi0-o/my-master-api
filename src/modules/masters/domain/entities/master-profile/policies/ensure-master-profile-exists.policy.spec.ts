import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
  MasterProfileForbiddenError,
  MasterProfileNotFoundError,
  type IMasterProfileEntity,
} from 'src/modules/masters/domain/entities/master-profile';

describe('ensureMasterProfileExists', () => {
  it('throws MasterProfileNotFoundError when entity is null', () => {
    expect(() => ensureMasterProfileExists(null, 'id-1')).toThrow(
      MasterProfileNotFoundError,
    );
  });

  it('passes when entity exists', () => {
    const entity = { id: 'id-1' } as IMasterProfileEntity;
    expect(() => ensureMasterProfileExists(entity, 'id-1')).not.toThrow();
  });
});

describe('ensureMasterProfileAccessible', () => {
  const profile = { id: 'p-1', userId: 'user-1' } as IMasterProfileEntity;

  it('allows staff user', () => {
    expect(() =>
      ensureMasterProfileAccessible(profile, {
        userId: 'other',
        isStaffUser: true,
      }),
    ).not.toThrow();
  });

  it('allows owner', () => {
    expect(() =>
      ensureMasterProfileAccessible(profile, {
        userId: 'user-1',
        isStaffUser: false,
      }),
    ).not.toThrow();
  });

  it('throws MasterProfileForbiddenError for non-owner', () => {
    expect(() =>
      ensureMasterProfileAccessible(profile, {
        userId: 'user-2',
        isStaffUser: false,
      }),
    ).toThrow(MasterProfileForbiddenError);
  });
});
