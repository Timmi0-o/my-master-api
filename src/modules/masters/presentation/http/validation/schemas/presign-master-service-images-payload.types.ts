export interface IPresignMasterServiceImagesFilePayload {
  name: string;
  sha256sum: string;
}

export interface IPresignMasterServiceImagesPayload {
  files: IPresignMasterServiceImagesFilePayload[];
}
