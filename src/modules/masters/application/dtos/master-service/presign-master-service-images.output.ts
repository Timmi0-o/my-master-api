export interface IPresignMasterServiceImagesApplicationOutputItem {
  imageId: string;
  fileId: string;
  name: string;
  path: string;
  url: string;
}

export type IPresignMasterServiceImagesApplicationOutput =
  IPresignMasterServiceImagesApplicationOutputItem[];
