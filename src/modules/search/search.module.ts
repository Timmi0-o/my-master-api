import { Module } from '@nestjs/common';
import type { IMasterProfileRepository } from '../masters/domain/repositories/master-profile';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from '../masters/domain/repositories/master-service';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-service';
import { MastersModule } from '../masters/masters.module';
import { SearchByTextUseCase } from './application/use-cases/search-by-text.use-case';
import { SearchController } from './presentation/http/controllers/search.controller';

@Module({
  imports: [MastersModule],
  controllers: [SearchController],
  providers: [
    {
      provide: SearchByTextUseCase,
      useFactory: (
        masterProfileRepository: IMasterProfileRepository,
        masterServiceRepository: IMasterServiceRepository,
      ) =>
        new SearchByTextUseCase(
          masterProfileRepository,
          masterServiceRepository,
        ),
      inject: [
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
      ],
    },
  ],
})
export class SearchModule {}
