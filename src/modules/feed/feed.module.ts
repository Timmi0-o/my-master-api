import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import type { IAddressRepository } from '../geo/domain/repositories/address';
import { ADDRESS_REPOSITORY_TOKEN } from '../geo/domain/repositories/address';
import { GeoModule } from '../geo/geo.module';
import type { IMasterProfileRepository } from '../masters/domain/repositories/master-profile';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from '../masters/domain/repositories/master-service';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-service';
import { MastersModule } from '../masters/masters.module';
import { GetFeedServicesUseCase } from './application/use-cases/get-feed-services.use-case';
import { RecordFeedEventsUseCase } from './application/use-cases/record-feed-events.use-case';
import type { IFeedInterestSignalsReader } from './domain/repositories/feed-interest-signals/i-feed-interest-signals.reader';
import { FEED_INTEREST_SIGNALS_READER_TOKEN } from './domain/repositories/feed-interest-signals/i-feed-interest-signals.reader';
import type { IUserServiceInteractionRepository } from './domain/repositories/user-service-interaction';
import { USER_SERVICE_INTERACTION_REPOSITORY_TOKEN } from './domain/repositories/user-service-interaction';
import { PrismaFeedInterestSignalsReader } from './infrastructure/persistence/prisma-feed-interest-signals.reader';
import { PrismaUserServiceInteractionRepository } from './infrastructure/persistence/repositories/user-service-interaction/prisma-user-service-interaction.repository';
import { FeedController } from './presentation/http/controllers/feed.controller';

@Module({
  imports: [MastersModule, GeoModule, AuthGuardsModule, AuthorizationModule],
  controllers: [FeedController],
  providers: [
    {
      provide: USER_SERVICE_INTERACTION_REPOSITORY_TOKEN,
      useClass: PrismaUserServiceInteractionRepository,
    },
    {
      provide: FEED_INTEREST_SIGNALS_READER_TOKEN,
      useClass: PrismaFeedInterestSignalsReader,
    },
    {
      provide: RecordFeedEventsUseCase,
      useFactory: (
        interactionRepository: IUserServiceInteractionRepository,
        masterServiceRepository: IMasterServiceRepository,
      ) =>
        new RecordFeedEventsUseCase(
          interactionRepository,
          masterServiceRepository,
        ),
      inject: [
        USER_SERVICE_INTERACTION_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetFeedServicesUseCase,
      useFactory: (
        masterServiceRepository: IMasterServiceRepository,
        masterProfileRepository: IMasterProfileRepository,
        addressRepository: IAddressRepository,
        interestSignalsReader: IFeedInterestSignalsReader,
      ) =>
        new GetFeedServicesUseCase(
          masterServiceRepository,
          masterProfileRepository,
          addressRepository,
          interestSignalsReader,
        ),
      inject: [
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        ADDRESS_REPOSITORY_TOKEN,
        FEED_INTEREST_SIGNALS_READER_TOKEN,
      ],
    },
  ],
})
export class FeedModule {}
