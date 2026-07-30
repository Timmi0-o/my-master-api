import type {
  EnrichOptions,
  SelectOptions,
} from 'src/modules/shared/domain/query';
import type { PresetReadOptions } from './preset-base.types';

export function splitPresetReadOptions<
  T,
  R extends object = Record<never, never>,
>(
  options: PresetReadOptions<T, R>,
): {
  selectOptions: SelectOptions<T, R>;
  enrich?: EnrichOptions;
} {
  const { enrich, ...selectOptions } = options;

  return {
    selectOptions,
    ...(enrich !== undefined ? { enrich } : {}),
  };
}
