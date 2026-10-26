import type { FastifyRequest, FastifyReply } from 'fastify';
import { citizenReportService } from '../services/citizenReportService.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';
import { Severity } from '@prisma/client';

const createReportSchema = z.object({
  disasterEventId: z.string().uuid().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
  category: z.string().min(1),
  severity: z.nativeEnum(Severity).optional(),
  description: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationName: z.string().optional(),
  mediaUrl: z.string().url().optional()
});

const reviewReportSchema = z.object({
  action: z.enum(['VERIFIED', 'REJECTED', 'RESOLVED']),
  notes: z.string().optional()
});

export class CitizenReportController {
  async submit(request: FastifyRequest, reply: FastifyReply) {
    const body = createReportSchema.parse(request.body);
    const report = await citizenReportService.submitReport(body);
    return reply.code(201).send(successResponse(report));
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId, status } = request.query as { disasterId?: string; status?: string };
    const reports = await citizenReportService.listReports(disasterId, status);
    return reply.send(successResponse(reports));
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const report = await citizenReportService.getReportById(id);
    return reply.send(successResponse(report));
  }

  async review(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = reviewReportSchema.parse(request.body);
    const reviewerId = request.user?.userId || 'commander';

    const updated = await citizenReportService.reviewReport(id, body.action, reviewerId, body.notes);
    return reply.send(successResponse(updated));
  }

  async getGeoJson(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId } = request.query as { disasterId?: string };
    const geoJson = await citizenReportService.getGeoJson(disasterId);
    return reply.send(geoJson);
  }
}

export const citizenReportController = new CitizenReportController();
