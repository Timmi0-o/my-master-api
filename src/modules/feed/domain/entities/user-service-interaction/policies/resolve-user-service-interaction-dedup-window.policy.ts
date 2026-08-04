import { EUserServiceInteractionType } from '../user-service-interaction-type.enum';
import {
  USER_SERVICE_INTERACTION_CLICK_DEDUP_WINDOW_MS,
  USER_SERVICE_INTERACTION_VIEW_DEDUP_WINDOW_MS,
} from './user-service-interaction.constants';

export function resolveUserServiceInteractionDedupWindowMs(
  type: EUserServiceInteractionType,
): number {
  return type === EUserServiceInteractionType.VIEW
    ? USER_SERVICE_INTERACTION_VIEW_DEDUP_WINDOW_MS
    : USER_SERVICE_INTERACTION_CLICK_DEDUP_WINDOW_MS;
}
