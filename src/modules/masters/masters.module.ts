import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { FilesModule } from '../files/files.module';
import { MasterProfileModule } from './infrastructure/modules/master-profile/master-profile.module';
import { MasterScheduleExceptionModule } from './infrastructure/modules/master-schedule-exception/master-schedule-exception.module';
import { MasterServiceReviewModule } from './infrastructure/modules/master-service-review/master-service-review.module';
import { MasterServiceModule } from './infrastructure/modules/master-service/master-service.module';
import { MasterWeeklyScheduleModule } from './infrastructure/modules/master-weekly-schedule/master-weekly-schedule.module';
import { MasterProfilesController } from './presentation/http/controllers/master-profiles.controller';
import { MasterScheduleExceptionsController } from './presentation/http/controllers/master-schedule-exceptions.controller';
import { MasterServiceReviewsController } from './presentation/http/controllers/master-service-reviews.controller';
import { MasterServicesController } from './presentation/http/controllers/master-services.controller';
import { MasterWeeklySchedulesController } from './presentation/http/controllers/master-weekly-schedules.controller';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    AuthModule,
    AuthorizationModule,
    FilesModule,
    MasterProfileModule,
    MasterServiceModule,
    MasterWeeklyScheduleModule,
    MasterScheduleExceptionModule,
    MasterServiceReviewModule,
  ],
  controllers: [
    MasterProfilesController,
    MasterServicesController,
    MasterServiceReviewsController,
    MasterWeeklySchedulesController,
    MasterScheduleExceptionsController,
  ],
  exports: [
    MasterProfileModule,
    MasterServiceModule,
    MasterWeeklyScheduleModule,
    MasterScheduleExceptionModule,
    MasterServiceReviewModule,
  ],
})
export class MastersModule {}
