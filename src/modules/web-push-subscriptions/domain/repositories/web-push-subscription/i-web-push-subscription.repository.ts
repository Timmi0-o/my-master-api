import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateWebPushSubscriptionInput,
  IUpdateWebPushSubscriptionInput,
  IWebPushSubscriptionEntity,
} from '../../entities/web-push-subscription';

export interface IWebPushSubscriptionRepository {
  findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity | null>;

  findEntityByEndpoint(
    endpoint: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity | null>;

  findActiveByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity[]>;

  findManyByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity[]>;

  create(
    input: ICreateWebPushSubscriptionInput,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;

  update(
    id: string,
    input: IUpdateWebPushSubscriptionInput,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;

  softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;

  recordDeliverySuccess(
    id: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;

  recordDeliveryFailure(
    id: string,
    failureCode: number | null,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;

  markExpired(
    id: string,
    failureCode: number | null,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity>;
}
