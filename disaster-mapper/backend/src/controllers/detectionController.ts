import type { FastifyRequest, FastifyReply } from 'fastify';
import { detectionService } from '../services/detectionService.js';
import { detectionQuerySchema, detectionParamsSchema } from '../schemas/detection.schema.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';

export class DetectionController {
  async findByDisasterId(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const query = detectionQuerySchema.parse(request.query);
    const pagination = parsePagination({ page: query.page, limit: query.limit });

    const result = await detectionService.findByDisasterId(disasterId, {
      type: query.type,
      severity: query.severity,
      bbox: query.bbox,
      skip: pagination.skip,
      take: pagination.take
    });

    return reply.send(
      paginatedResponse(result.detections, result.total, pagination.page, pagination.limit)
    );
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { detectionId } = detectionParamsSchema.parse(request.params);
    const detection = await detectionService.findById(detectionId);
    return reply.send(successResponse(detection));
  }
}

export const detectionController = new DetectionController();

