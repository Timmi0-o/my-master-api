import { Module } from '@nestjs/common';
import type { IAddressRepository } from '../geo/domain/repositories/address';
import { ADDRESS_REPOSITORY_TOKEN } from '../geo/domain/repositories/address';
import { GeoModule } from '../geo/geo.module';
import type { IMasterProfileRepository } from '../masters/domain/repositories/master-profile';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from '../masters/domain/repositories/master-service';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-service';
import { MastersModule } from '../masters/masters.module';
import { SearchByTextUseCase } from './application/use-cases/search-by-text.use-case';
import { SearchController } from './presentation/http/controllers/search.controller';

@Module({
  imports: [MastersModule, GeoModule],
  controllers: [SearchController],
  providers: [
    {
      provide: SearchByTextUseCase,
      useFactory: (
        masterProfileRepository: IMasterProfileRepository,
        masterServiceRepository: IMasterServiceRepository,
        addressRepository: IAddressRepository,
      ) =>
        new SearchByTextUseCase(
          masterProfileRepository,
          masterServiceRepository,
          addressRepository,
        ),
      inject: [
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        ADDRESS_REPOSITORY_TOKEN,
      ],
    },
  ],
})
export class SearchModule {}
