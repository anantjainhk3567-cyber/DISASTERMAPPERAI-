import type { FastifyRequest, FastifyReply } from 'fastify';
import { timelineService } from '../services/timelineService.js';
import { successResponse } from '../utils/response.js';

export class TimelineController {
  async getEvents(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = request.params as { id: string };
    const events = await timelineService.getTimelineEvents(disasterId);
    return reply.send(successResponse(events));
  }
}

export const timelineController = new TimelineController();
