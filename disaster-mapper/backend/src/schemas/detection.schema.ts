import { z } from 'zod';
import { DetectionType, Severity } from '@prisma/client';

export const detectionQuerySchema = z.object({
  type: z.nativeEnum(DetectionType).optional(),
  severity: z.nativeEnum(Severity).optional(),
  bbox: z.string().optional(), // format: 'minLng,minLat,maxLng,maxLat'
  page: z.coerce.number().int().default(1).optional(),
  limit: z.coerce.number().int().default(20).optional(),
});

export const detectionParamsSchema = z.object({
  detectionId: z.string().min(1),
});

export type DetectionQuery = z.infer<typeof detectionQuerySchema>;
export type DetectionParams = z.infer<typeof detectionParamsSchema>;
