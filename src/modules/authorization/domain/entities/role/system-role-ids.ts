import { ERoleIdentifier } from './role.enum';

export const SYSTEM_ROLE_IDS = {
  [ERoleIdentifier.USER]: '00000000-0000-4000-8000-000000000001',
  [ERoleIdentifier.ADMIN]: '00000000-0000-4000-8000-000000000002',
  [ERoleIdentifier.SUPER_ADMIN]: '00000000-0000-4000-8000-000000000003',
  [ERoleIdentifier.API_CLIENT]: '00000000-0000-4000-8000-000000000004',
} as const satisfies Record<ERoleIdentifier, string>;
