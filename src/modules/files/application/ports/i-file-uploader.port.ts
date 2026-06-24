export interface SignedUrlEntry {
  url: string;
  fileUrl: string;
  slug: string;
}

export type SignedUrls = Record<string, SignedUrlEntry>;

export interface IFileUploaderPort {
  getPresignedUrl(
    file: { name: string; sha256sum?: string },
    options?: { ownerKind?: string; ownerId?: string },
  ): Promise<SignedUrlEntry>;
}

export const FILE_UPLOADER_PORT_TOKEN = Symbol('FILE_UPLOADER_PORT_TOKEN');
