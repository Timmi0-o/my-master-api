export type IEnqueueImageVariantsJobInput = {
  fileId: string;
  force?: boolean;
};

export interface IImageVariantsQueuePort {
  enqueueProcessImageVariants(
    input: IEnqueueImageVariantsJobInput,
  ): Promise<void>;
}

export const IMAGE_VARIANTS_QUEUE_PORT_TOKEN = Symbol(
  'IMAGE_VARIANTS_QUEUE_PORT_TOKEN',
);
