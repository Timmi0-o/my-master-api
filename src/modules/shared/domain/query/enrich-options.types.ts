/**
 * Cross-module read enrichments controlled by presets.
 * Not passed to persistence — only consumed by application use cases.
 */
export type EnrichOptions = {
  personalNotes?: boolean;
  profileAvatars?: boolean;
};
