import type { IUpdateOwnLanguageApplicationOutput } from 'src/modules/users/application/dtos/user/update-own-language.output';

export type IUpdateOwnLanguageHttpResponse = ReturnType<
  typeof mapUpdateOwnLanguageHttpResponse
>;

export function mapUpdateOwnLanguageHttpResponse(
  output: IUpdateOwnLanguageApplicationOutput,
) {
  return { data: output };
}
