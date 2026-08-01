import type { IGetLocalityBySlugOrIdApplicationInput } from 'src/modules/geo/application/dtos/locality/get-locality-by-slug-or-id.input';
import type { ISlugOrIdParamPayload } from '../../validation/schemas/slug-or-id-param.types';

export function requestParamsToGetLocalityBySlugOrIdUseCaseInput(
  params: ISlugOrIdParamPayload,
): IGetLocalityBySlugOrIdApplicationInput {
  return {
    slugOrId: params.slugOrId,
  };
}
