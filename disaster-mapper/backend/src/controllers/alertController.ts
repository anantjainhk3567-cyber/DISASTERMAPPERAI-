import type { FastifyRequest, FastifyReply } from 'fastify';
import { alertService } from '../services/alertService.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';
import { Severity } from '@prisma/client';

const createAlertSchema = z.object({
  disasterEventId: z.string().uuid().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  severity: z.nativeEnum(Severity),
  type: z.string().min(1)
});

export class AlertController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId, severity, isAcknowledged } = request.query as {
      disasterId?: string;
      severity?: string;
      isAcknowledged?: string;
    };

    const ackBool = isAcknowledged === 'true' ? true : (isAcknowledged === 'false' ? false : undefined);
    const alerts = await alertService.listAlerts(disasterId, severity, ackBool);
    return reply.send(successResponse(alerts));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createAlertSchema.parse(request.body);
    const alert = await alertService.createAlert(body);
    return reply.code(201).send(successResponse(alert));
  }

  async acknowledge(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const officerId = request.user?.userId || 'commander';
    const alert = await alertService.acknowledgeAlert(id, officerId);
    return reply.send(successResponse(alert));
  }

  async acknowledgeAll(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId } = request.query as { disasterId?: string };
    const officerId = request.user?.userId || 'commander';
    await alertService.acknowledgeAll(disasterId, officerId);
    return reply.send(successResponse({ acknowledged: true }));
  }
}

export const alertController = new AlertController();
