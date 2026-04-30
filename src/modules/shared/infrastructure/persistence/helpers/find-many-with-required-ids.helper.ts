export type FindManyOptions = {
  where?: Record<string, unknown>;
  take?: number;
  skip?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  select?: unknown;
  include?: unknown;
};

export type FindManyWithRequiredIdsParams = {
  where: Record<string, unknown>;
  requiredIds: string[];
  limit: number;
  offset: number;
};

export class FindManyWithRequiredIdsHelper {
  static async findManyWithRequiredIds<T extends { id: string }>(
    findMany: (options: FindManyOptions) => Promise<T[] | null>,
    params: FindManyWithRequiredIdsParams,
    findOptions: Omit<FindManyOptions, 'where' | 'take' | 'skip'>,
  ): Promise<T[]> {
    const { where, requiredIds, limit, offset } = params;
    const hasNestedFilter = Object.keys(where).length > 0;

    const requiredWhere = hasNestedFilter
      ? ({
          AND: [where, { id: { in: requiredIds } }] as [
            Record<string, unknown>,
            { id: { in: string[] } },
          ],
        } as Record<string, unknown>)
      : { id: { in: requiredIds } };

    const restWhere = hasNestedFilter
      ? ({
          AND: [where, { id: { notIn: requiredIds } }] as [
            Record<string, unknown>,
            { id: { notIn: string[] } },
          ],
        } as Record<string, unknown>)
      : { id: { notIn: requiredIds } };

    const takeRest = Math.max(0, limit - requiredIds.length);

    const [requiredItems, restItems] = await Promise.all([
      findMany({
        ...findOptions,
        where: requiredWhere,
        take: requiredIds.length,
      }),
      takeRest > 0
        ? findMany({
            ...findOptions,
            where: restWhere,
            take: takeRest,
            skip: offset,
          })
        : Promise.resolve(null),
    ]);

    const requiredList = requiredItems ?? [];
    const restList = restItems ?? [];

    const byRequiredOrder = requiredList
      .slice()
      .sort((a, b) => requiredIds.indexOf(a.id) - requiredIds.indexOf(b.id));

    return [...byRequiredOrder, ...restList];
  }
}
