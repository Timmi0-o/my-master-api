import { Module } from '@nestjs/common';
import { GetApartmentsUseCase } from './application/use-cases/apartment/get-apartments.use-case';
import { GetBuildingsUseCase } from './application/use-cases/building/get-buildings.use-case';
import { GetLocalitiesUseCase } from './application/use-cases/locality/get-localities.use-case';
import { GetLocalityBySlugOrIdUseCase } from './application/use-cases/locality/get-locality-by-slug-or-id.use-case';
import { GetStreetsUseCase } from './application/use-cases/street/get-streets.use-case';
import { ADDRESS_REPOSITORY_TOKEN } from './domain/repositories/address';
import {
  APARTMENT_REPOSITORY_TOKEN,
  type IApartmentRepository,
} from './domain/repositories/apartment';
import {
  BUILDING_REPOSITORY_TOKEN,
  type IBuildingRepository,
} from './domain/repositories/building';
import {
  LOCALITY_REPOSITORY_TOKEN,
  type ILocalityRepository,
} from './domain/repositories/locality';
import {
  STREET_REPOSITORY_TOKEN,
  type IStreetRepository,
} from './domain/repositories/street';
import { PrismaAddressRepository } from './infrastructure/persistence/repositories/address/prisma-address.repository';
import { PrismaApartmentRepository } from './infrastructure/persistence/repositories/apartment/prisma-apartment.repository';
import { PrismaBuildingRepository } from './infrastructure/persistence/repositories/building/prisma-building.repository';
import { PrismaLocalityRepository } from './infrastructure/persistence/repositories/locality/prisma-locality.repository';
import { PrismaStreetRepository } from './infrastructure/persistence/repositories/street/prisma-street.repository';
import { ApartmentsController } from './presentation/http/controllers/apartments.controller';
import { BuildingsController } from './presentation/http/controllers/buildings.controller';
import { LocalitiesController } from './presentation/http/controllers/localities.controller';
import { StreetsController } from './presentation/http/controllers/streets.controller';

@Module({
  controllers: [
    LocalitiesController,
    StreetsController,
    BuildingsController,
    ApartmentsController,
  ],
  providers: [
    {
      provide: LOCALITY_REPOSITORY_TOKEN,
      useClass: PrismaLocalityRepository,
    },
    {
      provide: STREET_REPOSITORY_TOKEN,
      useClass: PrismaStreetRepository,
    },
    {
      provide: BUILDING_REPOSITORY_TOKEN,
      useClass: PrismaBuildingRepository,
    },
    {
      provide: APARTMENT_REPOSITORY_TOKEN,
      useClass: PrismaApartmentRepository,
    },
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: PrismaAddressRepository,
    },
    {
      provide: GetLocalitiesUseCase,
      useFactory: (repo: ILocalityRepository) => new GetLocalitiesUseCase(repo),
      inject: [LOCALITY_REPOSITORY_TOKEN],
    },
    {
      provide: GetLocalityBySlugOrIdUseCase,
      useFactory: (repo: ILocalityRepository) =>
        new GetLocalityBySlugOrIdUseCase(repo),
      inject: [LOCALITY_REPOSITORY_TOKEN],
    },
    {
      provide: GetStreetsUseCase,
      useFactory: (repo: IStreetRepository) => new GetStreetsUseCase(repo),
      inject: [STREET_REPOSITORY_TOKEN],
    },
    {
      provide: GetBuildingsUseCase,
      useFactory: (repo: IBuildingRepository) => new GetBuildingsUseCase(repo),
      inject: [BUILDING_REPOSITORY_TOKEN],
    },
    {
      provide: GetApartmentsUseCase,
      useFactory: (repo: IApartmentRepository) =>
        new GetApartmentsUseCase(repo),
      inject: [APARTMENT_REPOSITORY_TOKEN],
    },
  ],
  exports: [ADDRESS_REPOSITORY_TOKEN, LOCALITY_REPOSITORY_TOKEN],
})
export class GeoModule {}
