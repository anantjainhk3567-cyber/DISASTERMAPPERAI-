import type { FastifyRequest, FastifyReply } from 'fastify';
import { dashboardService } from '../services/dashboardService.js';
import { successResponse } from '../utils/response.js';

export class DashboardController {
  async getOverview(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user!;
    const overview = await dashboardService.getOverview(user.organizationId);
    return reply.send(successResponse(overview));
  }

  async getRecentAnalysis(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user!;
    const recent = await dashboardService.getRecentAnalysis(user.organizationId);
    return reply.send(successResponse(recent));
  }

  async getCriticalZones(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user!;
    const zones = await dashboardService.getCriticalZones(user.organizationId);
    return reply.send(successResponse(zones));
  }
}

export const dashboardController = new DashboardController();

