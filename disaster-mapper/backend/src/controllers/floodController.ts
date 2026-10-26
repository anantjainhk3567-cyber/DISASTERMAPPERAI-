import type { FastifyRequest, FastifyReply } from 'fastify';
import { floodService } from '../services/floodService.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';

const forecastInputSchema = z.object({
  forecastHorizonHours: z.number().optional(),
  predictedRainfallMm: z.number().min(1).max(500),
  drainageEfficiencyPercent: z.number().min(0).max(100).optional(),
  soilSaturationIndex: z.number().min(0).max(1).optional()
});

export class FloodController {
  async generateForecast(request: FastifyRequest, reply: FastifyReply) {
    const disasterEventId =
      (request.params as any)?.id ||
      (request.body as any)?.disasterEventId ||
      'delhi-flood-2026';
    const raw: any = request.body || {};
    const body = forecastInputSchema.parse({
      forecastHorizonHours: raw.forecastHorizonHours ?? raw.durationHours ?? 6,
      predictedRainfallMm: Number(raw.predictedRainfallMm ?? raw.rainfallMmPerHour ?? raw.rainfallAmountMm ?? 65),
      drainageEfficiencyPercent: Number(raw.drainageEfficiencyPercent ?? raw.drainageCapacityPercent ?? 50),
      soilSaturationIndex: Number(raw.soilSaturationIndex ?? (raw.soilSaturationPercent ? raw.soilSaturationPercent / 100 : 0.8))
    });

    const result = await floodService.generateForecast({
      disasterEventId,
      ...body
    });

    return reply.code(201).send(successResponse(result));
  }

  async getLatestForecast(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterEventId } = request.params as { id: string };
    const forecast = await floodService.getLatestForecast(disasterEventId);
    return reply.send(successResponse(forecast));
  }

  async listForecasts(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterEventId } = request.params as { id: string };
    const forecasts = await floodService.listForecasts(disasterEventId);
    return reply.send(successResponse(forecasts));
  }
}

export const floodController = new FloodController();
