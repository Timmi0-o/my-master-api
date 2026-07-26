export interface IPresignBugReportImageFileInput {
  name: string;
  sha256sum: string;
}

export interface IPresignBugReportImagesApplicationInput {
  bugReportId: string;
  files: IPresignBugReportImageFileInput[];
}
