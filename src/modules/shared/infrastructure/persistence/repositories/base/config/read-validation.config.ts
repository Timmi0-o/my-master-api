import type { RelationConfig } from './relation.config';

export type ReadOptionsValidationConfig = {
  allowedSelectFields: readonly string[];
  maxIncludeDepth: number;
  includeGraph: Record<string, RelationConfig>;
};

export const DEFAULT_MAX_INCLUDE_DEPTH = 3;
