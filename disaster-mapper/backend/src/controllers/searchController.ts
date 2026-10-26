import type { FastifyRequest, FastifyReply } from 'fastify';
import { searchService } from '../services/searchService.js';
import { searchQuerySchema } from '../schemas/search.schema.js';
import { successResponse } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';

export class SearchController {
  async search(request: FastifyRequest, reply: FastifyReply) {
    const query = searchQuerySchema.parse(request.query);
    const pagination = parsePagination({ page: query.page, limit: query.limit });
    const user = request.user!;

    const results = await searchService.search(
      user.organizationId,
      query.q,
      query.type as any,
      query.bbox,
      pagination
    );

    return reply.send(successResponse(results));
  }
}

export const searchController = new SearchController();

