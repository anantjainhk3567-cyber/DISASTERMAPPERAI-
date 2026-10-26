import { z } from 'zod';

export const changeDetectionSchema = z.object({
  beforeImageId: z.string().min(1),
  afterImageId: z.string().min(1),
});

export type ChangeDetectionInput = z.infer<typeof changeDetectionSchema>;
