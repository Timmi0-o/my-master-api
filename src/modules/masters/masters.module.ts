import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FilesModule } from '../files/files.module';
import { FavoriteMasterServiceModule } from './infrastructure/modules/favorite-master-service/favorite-master-service.module';
import { MasterProfileModule } from './infrastructure/modules/master-profile/master-profile.module';
import { MasterScheduleExceptionModule } from './infrastructure/modules/master-schedule-exception/master-schedule-exception.module';
import { MasterServiceReviewReactionModule } from './infrastructure/modules/master-service-review-reaction/master-service-review-reaction.module';
import { MasterServiceReviewModule } from './infrastructure/modules/master-service-review/master-service-review.module';
import { MasterServiceModule } from './infrastructure/modules/master-service/master-service.module';
import { MasterSubscriptionModule } from './infrastructure/modules/master-subscription/master-subscription.module';
import { MasterWeeklyScheduleModule } from './infrastructure/modules/master-weekly-schedule/master-weekly-schedule.module';
import { FavoriteMasterServicesController } from './presentation/http/controllers/favorite-master-services.controller';
import { MasterProfilesController } from './presentation/http/controllers/master-profiles.controller';
import { MasterScheduleExceptionsController } from './presentation/http/controllers/master-schedule-exceptions.controller';
import { MasterServiceReviewReactionsController } from './presentation/http/controllers/master-service-review-reactions.controller';
import { MasterServiceReviewsController } from './presentation/http/controllers/master-service-reviews.controller';
import { MasterServicesController } from './presentation/http/controllers/master-services.controller';
import { MasterSubscriptionsController } from './presentation/http/controllers/master-subscriptions.controller';
import { MasterWeeklySchedulesController } from './presentation/http/controllers/master-weekly-schedules.controller';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    AuthGuardsModule,
    AuthorizationModule,
    FilesModule,
    MasterProfileModule,
    MasterServiceModule,
    MasterWeeklyScheduleModule,
    MasterScheduleExceptionModule,
    MasterServiceReviewModule,
    MasterServiceReviewReactionModule,
    MasterSubscriptionModule,
    FavoriteMasterServiceModule,
  ],
  controllers: [
    MasterProfilesController,
    MasterServicesController,
    MasterServiceReviewsController,
    MasterServiceReviewReactionsController,
    MasterWeeklySchedulesController,
    MasterScheduleExceptionsController,
    MasterSubscriptionsController,
    FavoriteMasterServicesController,
  ],
  exports: [
    MasterProfileModule,
    MasterServiceModule,
    MasterWeeklyScheduleModule,
    MasterScheduleExceptionModule,
    MasterServiceReviewModule,
    MasterServiceReviewReactionModule,
    MasterSubscriptionModule,
    FavoriteMasterServiceModule,
  ],
})
export class MastersModule {}
