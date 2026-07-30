/**
 * Cross-module read enrichments controlled by presets.
 * Not passed to persistence — only consumed by application use cases.
 */
export type EnrichOptions = {
  personalNotes?: boolean;
};

export function wantsPersonalNotesEnrich(
  enrich: EnrichOptions | undefined,
): boolean {
  return enrich?.personalNotes === true;
}
