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
import type { ISearchTaxonomyReader } from './domain/repositories/search-taxonomy';
import { SEARCH_TAXONOMY_READER_TOKEN } from './domain/repositories/search-taxonomy';
import { PrismaSearchTaxonomyReader } from './infrastructure/persistence/prisma-search-taxonomy.reader';
import { SearchController } from './presentation/http/controllers/search.controller';

@Module({
  imports: [MastersModule, GeoModule],
  controllers: [SearchController],
  providers: [
    {
      provide: SEARCH_TAXONOMY_READER_TOKEN,
      useClass: PrismaSearchTaxonomyReader,
    },
    {
      provide: SearchByTextUseCase,
      useFactory: (
        masterProfileRepository: IMasterProfileRepository,
        masterServiceRepository: IMasterServiceRepository,
        addressRepository: IAddressRepository,
        searchTaxonomyReader: ISearchTaxonomyReader,
      ) =>
        new SearchByTextUseCase(
          masterProfileRepository,
          masterServiceRepository,
          addressRepository,
          searchTaxonomyReader,
        ),
      inject: [
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        ADDRESS_REPOSITORY_TOKEN,
        SEARCH_TAXONOMY_READER_TOKEN,
      ],
    },
  ],
})
export class SearchModule {}
