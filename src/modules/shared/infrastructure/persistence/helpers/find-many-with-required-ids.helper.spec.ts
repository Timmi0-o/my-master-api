import { FindManyWithRequiredIdsHelper } from 'src/modules/shared/infrastructure/persistence/helpers/find-many-with-required-ids.helper';

describe('FindManyWithRequiredIdsHelper', () => {
  it('returns required ids first in specified order, then rest', async () => {
    const findMany = jest
      .fn()
      .mockImplementationOnce(async () => [
        { id: 'b', name: 'B' },
        { id: 'a', name: 'A' },
      ])
      .mockImplementationOnce(async () => [{ id: 'c', name: 'C' }]);

    const result = await FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      findMany,
      {
        where: {},
        requiredIds: ['a', 'b'],
        limit: 3,
        offset: 0,
      },
      {},
    );

    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(findMany).toHaveBeenCalledTimes(2);
  });
});
