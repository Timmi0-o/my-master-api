import {
  doesMasterServiceUpdateRequireRemoderation,
  resolveMasterServiceStatusOnCreate,
  resolveMasterServiceStatusOnUpdate,
} from 'src/modules/masters/domain/entities/master-service';
import { EMasterServiceStatus } from 'src/modules/masters/domain/entities/master-service/master-service-status.enum';

describe('master service moderation policies', () => {
  it('creates services in REVIEWING', () => {
    expect(resolveMasterServiceStatusOnCreate()).toBe(
      EMasterServiceStatus.REVIEWING,
    );
  });

  it('remoderates only content fields', () => {
    expect(
      doesMasterServiceUpdateRequireRemoderation({ name: 'New' }),
    ).toBe(true);
    expect(
      doesMasterServiceUpdateRequireRemoderation({ description: 'New' }),
    ).toBe(true);
    expect(
      doesMasterServiceUpdateRequireRemoderation({ tags: ['a', 'b', 'c'] }),
    ).toBe(true);
    expect(doesMasterServiceUpdateRequireRemoderation({ price: 100 })).toBe(
      false,
    );
    expect(
      doesMasterServiceUpdateRequireRemoderation({ durationMinutes: 30 }),
    ).toBe(false);
  });

  it('moves ACTIVE to REVIEWING on content edit', () => {
    expect(
      resolveMasterServiceStatusOnUpdate(EMasterServiceStatus.ACTIVE, {
        name: 'Updated',
      }),
    ).toBe(EMasterServiceStatus.REVIEWING);
  });

  it('keeps BLOCKED on content edit attempt', () => {
    expect(
      resolveMasterServiceStatusOnUpdate(EMasterServiceStatus.BLOCKED, {
        name: 'Updated',
      }),
    ).toBe(EMasterServiceStatus.BLOCKED);
  });

  it('keeps status when only non-content fields change', () => {
    expect(
      resolveMasterServiceStatusOnUpdate(EMasterServiceStatus.ACTIVE, {
        price: 200,
      }),
    ).toBe(EMasterServiceStatus.ACTIVE);
  });
});
