import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { DeleteWebPushSubscriptionByIdUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/delete-web-push-subscription-by-id.use-case';
import { GetMyWebPushSubscriptionsUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/get-my-web-push-subscriptions.use-case';
import { GetVapidPublicKeyUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/get-vapid-public-key.use-case';
import { UpsertWebPushSubscriptionUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/upsert-web-push-subscription.use-case';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { payloadToDeleteWebPushSubscriptionInput } from '../mappers/web-push-subscription/payload-to-delete-web-push-subscription-input';
import { payloadToGetMyWebPushSubscriptionsInput } from '../mappers/web-push-subscription/payload-to-get-my-web-push-subscriptions-input';
import { payloadToUpsertWebPushSubscriptionInput } from '../mappers/web-push-subscription/payload-to-upsert-web-push-subscription-input';
import { mapDeleteWebPushSubscriptionHttpResponse } from '../response/map-delete-web-push-subscription-response';
import { mapGetMyWebPushSubscriptionsHttpResponse } from '../response/map-get-my-web-push-subscriptions-response';
import { mapGetVapidPublicKeyHttpResponse } from '../response/map-get-vapid-public-key-response';
import { mapUpsertWebPushSubscriptionHttpResponse } from '../response/map-upsert-web-push-subscription-response';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';
import { upsertWebPushSubscriptionPayloadSchema } from '../validation/schemas/upsert-web-push-subscription-payload.schema';
import type { IUpsertWebPushSubscriptionPayload } from '../validation/schemas/upsert-web-push-subscription-payload.types';

@Controller({ path: 'web-push-subscriptions', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
@Authorize({ kind: 'authenticated' })
export class WebPushSubscriptionsController {
  constructor(
    private readonly upsertWebPushSubscriptionUseCase: UpsertWebPushSubscriptionUseCase,
    private readonly getMyWebPushSubscriptionsUseCase: GetMyWebPushSubscriptionsUseCase,
    private readonly deleteWebPushSubscriptionByIdUseCase: DeleteWebPushSubscriptionByIdUseCase,
    private readonly getVapidPublicKeyUseCase: GetVapidPublicKeyUseCase,
  ) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    const output = this.getVapidPublicKeyUseCase.execute();
    return mapGetVapidPublicKeyHttpResponse(output);
  }

  @Get()
  async getMyWebPushSubscriptions(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetMyWebPushSubscriptionsInput(
      user,
      metadata.isStaffUser,
    );
    const output = await this.getMyWebPushSubscriptionsUseCase.execute(input);
    return mapGetMyWebPushSubscriptionsHttpResponse(output);
  }

  @Post()
  async upsertWebPushSubscription(
    @HttpBody(upsertWebPushSubscriptionPayloadSchema, {
      errorMessage: 'Некорректный payload web push подписки',
    })
    payload: IUpsertWebPushSubscriptionPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpsertWebPushSubscriptionInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.upsertWebPushSubscriptionUseCase.execute(input);
    return mapUpsertWebPushSubscriptionHttpResponse(output);
  }

  @Delete(':id')
  async deleteWebPushSubscription(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteWebPushSubscriptionInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteWebPushSubscriptionByIdUseCase.execute(input);
    return mapDeleteWebPushSubscriptionHttpResponse();
  }
}
