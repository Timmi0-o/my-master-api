import { VapidConfigMissingError } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { IGetVapidPublicKeyApplicationOutput } from '../../dtos/web-push-subscription/get-vapid-public-key.output';

export class GetVapidPublicKeyUseCase {
  constructor(private readonly publicKey: string | null) {}

  execute(): IGetVapidPublicKeyApplicationOutput {
    if (!this.publicKey) {
      throw new VapidConfigMissingError();
    }

    return { publicKey: this.publicKey };
  }
}
