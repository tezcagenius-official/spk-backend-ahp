import { Prisma } from '@prisma/client';

export function createPagination(
  query: { page?: number; perPage?: number },
  totalCount: number,
) {
  const { page = 1, perPage = 10 } = query;

  const currentPage = Math.max(1, page);
  const itemsPerPage = Math.min(Math.max(1, perPage), 100);
  const skip = (currentPage - 1) * itemsPerPage;
  const lastPage = Math.ceil(totalCount / itemsPerPage);

  return {
    page: currentPage,
    perPage: itemsPerPage,
    skip,
    meta: {
      total: totalCount,
      lastPage,
      currentPage,
      perPage: itemsPerPage,
    },
  };
}
