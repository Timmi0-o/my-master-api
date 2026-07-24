export type RelationConfig = {
  prismaName?: string;
  nested?: Record<string, RelationConfig>;
  allowedSelectFields?: readonly string[];
  /** Not a Prisma relation — hydrated after read by the repository */
  virtual?: boolean;
};
