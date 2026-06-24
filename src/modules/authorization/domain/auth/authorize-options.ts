export type TAuthorizeOptions =
  | { kind: 'authenticated' }
  | { kind: 'staff-only' }
  | { kind: 'permissions'; permissions: readonly string[] };
