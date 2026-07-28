import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { NotificationModule } from './infrastructure/modules/notification/notification.module';
import { NotificationsController } from './presentation/http/controllers/notifications.controller';

@Module({
  imports: [AuthGuardsModule, AuthorizationModule, NotificationModule],
  controllers: [NotificationsController],
  exports: [NotificationModule],
})
export class NotificationsModule {}
