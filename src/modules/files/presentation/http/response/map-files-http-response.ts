import type { IGrantFileAccessApplicationOutput } from 'src/modules/files/application/dtos/file-access/grant-file-access.output';
import type { ICreateFileShareApplicationOutput } from 'src/modules/files/application/dtos/file-share/create-file-share.output';
import type { IQueryFilesApplicationOutput } from 'src/modules/files/application/dtos/file/query-files.output';
import type { IGetFileShareApplicationOutput } from 'src/modules/files/application/dtos/file-share/get-file-share.output';
import type { ICreateFilesApplicationOutput } from 'src/modules/files/application/dtos/file/create-files.output';
import type { IDeleteFilesApplicationOutput } from 'src/modules/files/application/dtos/file/delete-files.output';
import type { IGetFileApplicationOutput } from 'src/modules/files/application/dtos/file/get-file.output';
import type { IGetFilesByIdsApplicationOutput } from 'src/modules/files/application/dtos/file/get-files-by-ids.output';
import type { IMoveFileApplicationOutput } from 'src/modules/files/application/dtos/file/move-file.output';
import type { IPresignedUploadApplicationOutput } from 'src/modules/files/application/dtos/file/presigned-upload.output';
import type { IUpdateFileApplicationOutput } from 'src/modules/files/application/dtos/file/update-file.output';
import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import {
  mapFileToHttpResponse,
  mapFilesToHttpResponse,
} from './map-file-response';

export type IPresignedUploadHttpResponse = ReturnType<
  typeof mapPresignedUploadHttpResponse
>;
export type IQueryFilesHttpResponse = ReturnType<
  typeof mapQueryFilesHttpResponse
>;
export type IGetFilesByIdsHttpResponse = ReturnType<
  typeof mapGetFilesByIdsHttpResponse
>;
export type ICreateFilesHttpResponse = ReturnType<
  typeof mapCreateFilesHttpResponse
>;
export type IGetFileByIdHttpResponse = ReturnType<
  typeof mapGetFileByIdHttpResponse
>;
export type IUpdateFileHttpResponse = ReturnType<
  typeof mapUpdateFileHttpResponse
>;
export type IMoveFileHttpResponse = ReturnType<typeof mapMoveFileHttpResponse>;
export type IDeleteFilesHttpResponse = ReturnType<
  typeof mapDeleteFilesHttpResponse
>;
export type IGrantFileAccessHttpResponse = ReturnType<
  typeof mapGrantFileAccessHttpResponse
>;
export type IRevokeFileAccessHttpResponse = ReturnType<
  typeof mapRevokeFileAccessHttpResponse
>;
export type ICreateFileShareHttpResponse = ReturnType<
  typeof mapCreateFileShareHttpResponse
>;
export type IRevokeFileShareHttpResponse = ReturnType<
  typeof mapRevokeFileShareHttpResponse
>;

export function mapPresignedUploadHttpResponse(
  output: IPresignedUploadApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

export function mapQueryFilesHttpResponse(
  output: IQueryFilesApplicationOutput,
) {
  return {
    data: mapFilesToHttpResponse(output.data),
    meta: output.meta,
  };
}

export function mapGetFilesByIdsHttpResponse(
  output: IGetFilesByIdsApplicationOutput,
) {
  return mapEntityHttpResponse(mapFilesToHttpResponse(output.files));
}

export function mapCreateFilesHttpResponse(
  output: ICreateFilesApplicationOutput,
) {
  return mapEntityHttpResponse(mapFilesToHttpResponse(output.files));
}

export function mapGetFileByIdHttpResponse(output: IGetFileApplicationOutput) {
  return mapEntityHttpResponse(mapFileToHttpResponse(output));
}

export function mapUpdateFileHttpResponse(
  output: IUpdateFileApplicationOutput,
) {
  return mapEntityHttpResponse(mapFileToHttpResponse(output));
}

export function mapMoveFileHttpResponse(output: IMoveFileApplicationOutput) {
  return mapEntityHttpResponse(mapFileToHttpResponse(output));
}

export function mapDeleteFilesHttpResponse(
  output: IDeleteFilesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

export function mapGrantFileAccessHttpResponse(
  output: IGrantFileAccessApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

export function mapRevokeFileAccessHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}

export function mapCreateFileShareHttpResponse(
  output: ICreateFileShareApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

export function mapRevokeFileShareHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}

export function mapGetFileShareByTokenHttpResponse(
  result: IGetFileShareApplicationOutput,
) {
  return mapEntityHttpResponse({
    share: result.share,
    file: mapFileToHttpResponse(result.file),
  });
}
