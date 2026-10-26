import { z } from 'zod';
import { DisasterType, DisasterStatus, Severity } from '@prisma/client';

export const createDisasterSchema = z.object({
  name: z.string().min(3),
  type: z.nativeEnum(DisasterType),
  description: z.string().optional(),
  centerLatitude: z.number().min(-90).max(90),
  centerLongitude: z.number().min(-180).max(180),
  affectedArea: z.record(z.any()).optional(),
  severity: z.nativeEnum(Severity).optional(),
  startedAt: z.string().datetime().optional(),
});

export const updateDisasterSchema = createDisasterSchema.partial().extend({
  status: z.nativeEnum(DisasterStatus).optional(),
});

export const disasterParamsSchema = z.object({
  id: z.string().min(1),
});

export const disasterQuerySchema = z.object({
  page: z.coerce.number().int().default(1).optional(),
  limit: z.coerce.number().int().default(20).optional(),
  type: z.nativeEnum(DisasterType).optional(),
  status: z.nativeEnum(DisasterStatus).optional(),
  severity: z.nativeEnum(Severity).optional(),
});

export type CreateDisasterInput = z.infer<typeof createDisasterSchema>;
export type UpdateDisasterInput = z.infer<typeof updateDisasterSchema>;
export type DisasterParams = z.infer<typeof disasterParamsSchema>;
export type DisasterQuery = z.infer<typeof disasterQuerySchema>;
