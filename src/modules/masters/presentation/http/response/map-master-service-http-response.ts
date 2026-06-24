import { mapFileToHttpResponse } from 'src/modules/files/presentation/http/response/map-file-response';
import type { IMasterServiceImagePublicEntity } from 'src/modules/masters/domain/entities/master-service-image';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';

type MasterServiceWithRelations = IMasterServicePublicEntity &
  Partial<IMasterServiceRelations>;

export function mapMasterServiceToHttpResponse(
  service: MasterServiceWithRelations,
): MasterServiceWithRelations {
  if (service.images == null) {
    return service;
  }

  return {
    ...service,
    images: service.images.map(
      (image): IMasterServiceImagePublicEntity => ({
        ...image,
        ...(image.file != null
          ? {
              file: mapFileToHttpResponse(image.file) as unknown as NonNullable<
                IMasterServiceImagePublicEntity['file']
              >,
            }
          : {}),
      }),
    ),
  };
}

export function mapMasterServicesToHttpResponse(
  services: MasterServiceWithRelations[],
): MasterServiceWithRelations[] {
  return services.map(mapMasterServiceToHttpResponse);
}
