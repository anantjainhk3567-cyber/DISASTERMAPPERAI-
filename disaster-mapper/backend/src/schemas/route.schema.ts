import { z } from 'zod';

export const calculateRouteSchema = z.object({
  origin: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  destination: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export const routeParamsSchema = z.object({
  id: z.string().min(1),
});

export type CalculateRouteInput = z.infer<typeof calculateRouteSchema>;
export type RouteParams = z.infer<typeof routeParamsSchema>;
