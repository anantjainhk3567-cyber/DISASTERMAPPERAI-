import type { FastifyRequest, FastifyReply } from 'fastify';
import { simulationService } from '../services/simulationService.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';

const runSimulationSchema = z.object({
  scenarioName: z.string().min(1),
  rainfallAmountMm: z.number().min(5).max(400),
  durationHours: z.number().min(0.5).max(72),
  intensityMultiplier: z.number().min(0.2).max(3.0).optional(),
  drainageCapacityPercent: z.number().min(10).max(100).optional()
});

const compareSchema = z.object({
  scenarioIdA: z.string().min(1),
  scenarioIdB: z.string().min(1)
});

export class SimulationController {
  async run(request: FastifyRequest, reply: FastifyReply) {
    const disasterEventId =
      (request.params as any)?.id ||
      (request.body as any)?.disasterEventId ||
      'delhi-flood-2026';
    const raw: any = request.body || {};
    const params = raw.parameters || {};
    const body = runSimulationSchema.parse({
      scenarioName: raw.scenarioName || params.scenarioName || 'Yamuna Basin Simulation Scenario',
      rainfallAmountMm: Number(raw.rainfallAmountMm ?? params.rainfallAmountMm ?? params.rainfallMmPerHour ?? raw.rainfallMmPerHour ?? 75),
      durationHours: Number(raw.durationHours ?? params.durationHours ?? 6),
      intensityMultiplier: Number(raw.intensityMultiplier ?? params.intensityMultiplier ?? 1.2),
      drainageCapacityPercent: Number(raw.drainageCapacityPercent ?? params.drainageCapacityPercent ?? 50)
    });

    const result = await simulationService.runSimulation({
      disasterEventId,
      ...body
    });

    return reply.code(201).send(successResponse(result));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterEventId } = request.params as { id: string };
    const scenarios = await simulationService.listScenarios(disasterEventId);
    return reply.send(successResponse(scenarios));
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { scenarioId } = request.params as { scenarioId: string };
    const scenario = await simulationService.getScenarioById(scenarioId);
    return reply.send(successResponse(scenario));
  }

  async compare(request: FastifyRequest, reply: FastifyReply) {
    const body = compareSchema.parse(request.body);
    const comparison = await simulationService.compareScenarios(body.scenarioIdA, body.scenarioIdB);
    return reply.send(successResponse(comparison));
  }
}

export const simulationController = new SimulationController();
