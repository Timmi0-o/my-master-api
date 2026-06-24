import type {
  IFindAuthorizationContextByUserIdApplicationInput,
  IFindAuthorizationContextByUserIdApplicationOutput,
} from '../../dtos/auth/find-authorization-context-by-user-id.output';
import type { IAuthorizationContextRepository } from 'src/modules/authorization/domain/repositories/authorization-context/i-authorization-context.repository';

export class FindAuthorizationContextByUserIdUseCase {
  constructor(
    private readonly authorizationContextRepository: IAuthorizationContextRepository,
  ) {}

  async execute(
    input: IFindAuthorizationContextByUserIdApplicationInput,
  ): Promise<IFindAuthorizationContextByUserIdApplicationOutput> {
    return this.authorizationContextRepository.findByUserId(input.userId);
  }
}
