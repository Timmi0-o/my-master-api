import type { IMasterOnboardingSnapshot } from 'src/modules/masters/domain/entities/master-profile';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export type IGetMasterOnboardingHttpResponse = ReturnType<
  typeof mapGetMasterOnboardingHttpResponse
>;

export function mapGetMasterOnboardingHttpResponse(
  snapshot: IMasterOnboardingSnapshot,
) {
  return mapEntityHttpResponse(snapshot);
}
