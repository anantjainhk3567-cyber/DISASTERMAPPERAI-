import { z } from 'zod';
import { ImageType } from '@prisma/client';

export const createImageSchema = z.object({
  type: z.nativeEnum(ImageType),
  source: z.string().optional(),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  captureTime: z.string().datetime().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  boundingBox: z.record(z.any()).optional(),
});

export const imageParamsSchema = z.object({
  id: z.string().min(1),
});

export const analyzeImageSchema = z.object({
  config: z.record(z.any()).optional()
}).optional();

export type CreateImageInput = z.infer<typeof createImageSchema>;
export type ImageParams = z.infer<typeof imageParamsSchema>;
export type AnalyzeImageInput = z.infer<typeof analyzeImageSchema>;
