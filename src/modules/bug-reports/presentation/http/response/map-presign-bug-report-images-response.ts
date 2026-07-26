import type { IPresignBugReportImagesApplicationOutput } from 'src/modules/bug-reports/application/dtos/bug-report/presign-bug-report-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export function mapPresignBugReportImagesHttpResponse(
  output: IPresignBugReportImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}
