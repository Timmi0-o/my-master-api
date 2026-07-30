import type { IGetRoleByIdApplicationOutput } from 'src/modules/authorization/application/dtos/role/get-role-by-id.output';

export type IGetRoleByIdHttpResponse = ReturnType<
  typeof mapGetRoleByIdHttpResponse
>;

export function mapGetRoleByIdHttpResponse(
  output: IGetRoleByIdApplicationOutput,
) {
  return { data: output };
}
