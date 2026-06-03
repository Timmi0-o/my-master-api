import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { ReadOptionsValidationConfig } from '../config/read-validation.config';
import { assertIncludeDepth } from './include-depth.validator';
import { assertRelationGraph } from './relation-graph.validator';
import { assertSelectFields } from './select-fields.validator';

export function validateReadOptions<T, R extends object = Record<never, never>>(
  options: SelectOptions<T, R> | undefined,
  config: ReadOptionsValidationConfig,
): void {
  if (!options) {
    return;
  }

  if (options.select) {
    assertSelectFields(options.select, config.allowedSelectFields);
  }

  if (options.include) {
    assertIncludeDepth(options.include, config.maxIncludeDepth);
    assertRelationGraph(options.include, config.includeGraph);
  }
}
