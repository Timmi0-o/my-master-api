import { Module } from '@nestjs/common';
import { IMAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/image/image.repository.tokens';
import { PrismaImageRepository } from '../../persistence/repositories/image/prisma-image.repository';

@Module({
  providers: [
    {
      provide: IMAGE_REPOSITORY_TOKEN,
      useClass: PrismaImageRepository,
    },
  ],
  exports: [IMAGE_REPOSITORY_TOKEN],
})
export class ImageModule {}
