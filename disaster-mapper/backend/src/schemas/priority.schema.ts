import { z } from 'zod';
import { PriorityLevel } from '@prisma/client';

export const generatePrioritySchema = z.object({
  weights: z.object({
    populationRisk: z.number().optional(),
    buildingDamage: z.number().optional(),
    isolation: z.number().optional(),
    roadAccessibilityRisk: z.number().optional(),
    disasterSeverity: z.number().optional(),
  }).partial().optional(),
});

export const priorityParamsSchema = z.object({
  zoneId: z.string().min(1),
});

export const updatePrioritySchema = z.object({
  recommendedAction: z.string().optional(),
  priorityLevel: z.nativeEnum(PriorityLevel).optional(),
  priorityScore: z.number().min(0).max(100).optional(),
  overrideReason: z.string().optional(),
});

export type GeneratePriorityInput = z.infer<typeof generatePrioritySchema>;
export type PriorityParams = z.infer<typeof priorityParamsSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
