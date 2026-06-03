export type RelationConfig = {
  prismaName?: string;
  nested?: Record<string, RelationConfig>;
  allowedSelectFields?: readonly string[];
};
