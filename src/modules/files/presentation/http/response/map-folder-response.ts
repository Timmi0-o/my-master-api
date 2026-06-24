import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetFolderApplicationOutput } from 'src/modules/files/application/dtos/folder/get-folder.output';
import type { ICreateFolderApplicationOutput } from 'src/modules/files/application/dtos/folder/create-folder.output';
import type { IUpdateFolderApplicationOutput } from 'src/modules/files/application/dtos/folder/update-folder.output';
import type { IMoveFolderApplicationOutput } from 'src/modules/files/application/dtos/folder/move-folder.output';
import type { IDeleteFolderApplicationOutput } from 'src/modules/files/application/dtos/folder/delete-folder.output';

export type IGetFolderHttpResponse = ReturnType<typeof mapGetFolderHttpResponse>;
export type ICreateFolderHttpResponse = ReturnType<typeof mapCreateFolderHttpResponse>;
export type IUpdateFolderHttpResponse = ReturnType<typeof mapUpdateFolderHttpResponse>;
export type IMoveFolderHttpResponse = ReturnType<typeof mapMoveFolderHttpResponse>;
export type IDeleteFolderHttpResponse = ReturnType<typeof mapDeleteFolderHttpResponse>;

export function mapGetFolderHttpResponse(output: IGetFolderApplicationOutput) {
  return mapEntityHttpResponse(output);
}

export function mapCreateFolderHttpResponse(output: ICreateFolderApplicationOutput) {
  return mapEntityHttpResponse(output);
}

export function mapUpdateFolderHttpResponse(output: IUpdateFolderApplicationOutput) {
  return mapEntityHttpResponse(output);
}

export function mapMoveFolderHttpResponse(output: IMoveFolderApplicationOutput) {
  return mapEntityHttpResponse(output);
}

export function mapDeleteFolderHttpResponse(output: IDeleteFolderApplicationOutput) {
  return mapEntityHttpResponse(output);
}
