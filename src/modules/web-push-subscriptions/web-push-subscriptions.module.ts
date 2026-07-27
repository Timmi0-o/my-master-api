import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { WebPushSubscriptionModule } from './infrastructure/modules/web-push-subscription/web-push-subscription.module';
import { WebPushSubscriptionsController } from './presentation/http/controllers/web-push-subscriptions.controller';

@Module({
  imports: [AuthGuardsModule, AuthorizationModule, WebPushSubscriptionModule],
  controllers: [WebPushSubscriptionsController],
  exports: [WebPushSubscriptionModule],
})
export class WebPushSubscriptionsModule {}
