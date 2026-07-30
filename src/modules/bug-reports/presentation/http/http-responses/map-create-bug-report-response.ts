import type { ICreateBugReportApplicationOutput } from 'src/modules/bug-reports/application/dtos/bug-report/create-bug-report.output';
import { mapBugReportHttpResponse } from './map-bug-report-http-response';

export function mapCreateBugReportHttpResponse(
  output: ICreateBugReportApplicationOutput,
) {
  return mapBugReportHttpResponse(output);
}
