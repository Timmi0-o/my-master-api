export interface IPresignBugReportImagesApplicationOutputItem {
  imageId: string;
  fileId: string;
  name: string;
  path: string;
  url: string;
}

export type IPresignBugReportImagesApplicationOutput =
  IPresignBugReportImagesApplicationOutputItem[];
