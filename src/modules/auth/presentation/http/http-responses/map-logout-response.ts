export type ILogoutHttpResponse = ReturnType<typeof mapLogoutHttpResponse>;

export function mapLogoutHttpResponse(output: { success: boolean }) {
  return output;
}
