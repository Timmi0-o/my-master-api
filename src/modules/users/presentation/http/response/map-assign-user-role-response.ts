import type { IAssignUserRoleApplicationOutput } from 'src/modules/users/application/dtos/user/assign-user-role.output';

export type IAssignUserRoleHttpResponse = ReturnType<
  typeof mapAssignUserRoleHttpResponse
>;

export function mapAssignUserRoleHttpResponse(
  output: IAssignUserRoleApplicationOutput,
) {
  return { data: output };
}
