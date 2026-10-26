import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  type: z.enum(['disasters', 'settlements', 'roads', 'rescue_zones']).optional(),
  bbox: z.string().optional(),
  page: z.coerce.number().int().default(1).optional(),
  limit: z.coerce.number().int().default(20).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
