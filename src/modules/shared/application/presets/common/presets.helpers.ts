import { PRESET_TYPES, type TPresetType } from './preset.types';

export function createPresetGetter<TConfig>(
  presets: Record<TPresetType, TConfig>,
): (preset: TPresetType) => TConfig {
  return (preset: TPresetType): TConfig => presets[preset];
}

export function isValidPreset(preset: string): preset is TPresetType {
  return PRESET_TYPES.includes(preset as TPresetType);
}
