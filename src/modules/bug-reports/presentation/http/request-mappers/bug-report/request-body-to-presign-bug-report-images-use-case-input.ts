import type { IPresignBugReportImagesApplicationInput } from 'src/modules/bug-reports/application/dtos/bug-report/presign-bug-report-images.input';
import type { IPresignBugReportImagesPayload } from '../../validation/schemas/presign-bug-report-images-payload.types';

export function requestBodyToPresignBugReportImagesUseCaseInput(
  bugReportId: string,
  payload: IPresignBugReportImagesPayload,
): IPresignBugReportImagesApplicationInput {
  return {
    bugReportId,
    files: payload.files.map((file) => ({
      name: file.name,
      sha256sum: file.sha256sum,
    })),
  };
}
