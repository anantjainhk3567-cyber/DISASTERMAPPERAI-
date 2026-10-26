import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../config/constants.js';

export function parsePagination(query: { page?: number; limit?: number }) {
  const page = Math.max(1, query.page ? Number(query.page) : 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, query.limit ? Number(query.limit) : DEFAULT_PAGE_SIZE));
  
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit
  };
}
