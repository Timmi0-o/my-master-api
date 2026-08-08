import {
  doesMasterServiceReviewUpdateRequireRemoderation,
  resolveMasterServiceReviewStatusOnCreate,
  resolveMasterServiceReviewStatusOnUpdate,
} from 'src/modules/masters/domain/entities/master-service-review';
import { EMasterServiceReviewStatus } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-status.enum';

describe('master service review moderation policies', () => {
  it('creates reviews in REVIEWING', () => {
    expect(resolveMasterServiceReviewStatusOnCreate()).toBe(
      EMasterServiceReviewStatus.REVIEWING,
    );
  });

  it('remoderates only text changes', () => {
    expect(
      doesMasterServiceReviewUpdateRequireRemoderation({ text: 'spam' }),
    ).toBe(true);
    expect(
      doesMasterServiceReviewUpdateRequireRemoderation({ rating: 5 }),
    ).toBe(false);
  });

  it('moves ACTIVE to REVIEWING on text edit', () => {
    expect(
      resolveMasterServiceReviewStatusOnUpdate(
        EMasterServiceReviewStatus.ACTIVE,
        { text: 'updated' },
      ),
    ).toBe(EMasterServiceReviewStatus.REVIEWING);
  });

  it('keeps ACTIVE on rating-only edit', () => {
    expect(
      resolveMasterServiceReviewStatusOnUpdate(
        EMasterServiceReviewStatus.ACTIVE,
        { rating: 4 },
      ),
    ).toBe(EMasterServiceReviewStatus.ACTIVE);
  });
});
