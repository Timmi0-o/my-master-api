export type RelationConfig = {
  prismaName?: string;
  nested?: Record<string, RelationConfig>;
  allowedSelectFields?: readonly string[];
  /** Not a Prisma relation — allowed in read include contract; hydrated by application enrichment */
  virtual?: boolean;
};
