import type { FastifyRequest, FastifyReply } from 'fastify';
import { disasterService } from '../services/disasterService.js';
import {
  createDisasterSchema,
  updateDisasterSchema,
  disasterParamsSchema,
  disasterQuerySchema
} from '../schemas/disaster.schema.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';

export class DisasterController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const validatedData = createDisasterSchema.parse(request.body);
    const user = request.user!;

    const disaster = await disasterService.create(
      validatedData,
      user.userId,
      user.organizationId,
      user.role
    );

    return reply.code(201).send(successResponse(disaster));
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const query = disasterQuerySchema.parse(request.query);
    const pagination = parsePagination({ page: query.page, limit: query.limit });
    const user = request.user!;

    const { disasters, total } = await disasterService.findAll(
      user.organizationId,
      user.role,
      {
        type: query.type,
        status: query.status,
        severity: query.severity
      },
      pagination
    );

    return reply.send(paginatedResponse(disasters, total, pagination.page, pagination.limit));
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = disasterParamsSchema.parse(request.params);
    const user = request.user!;

    const disaster = await disasterService.findById(id, user.organizationId, user.role);
    return reply.send(successResponse(disaster));
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = disasterParamsSchema.parse(request.params);
    const validatedData = updateDisasterSchema.parse(request.body);
    const user = request.user!;

    const updated = await disasterService.update(
      id,
      validatedData,
      user.userId,
      user.organizationId,
      user.role
    );

    return reply.send(successResponse(updated));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = disasterParamsSchema.parse(request.params);
    const user = request.user!;

    await disasterService.delete(id, user.userId, user.organizationId, user.role);
    return reply.send(successResponse({ message: 'Disaster event deleted successfully' }));
  }

  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const { id } = disasterParamsSchema.parse(request.params);
    const user = request.user!;

    const summary = await disasterService.getSummary(id, user.organizationId, user.role);
    return reply.send(successResponse(summary));
  }

  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    const { id } = disasterParamsSchema.parse(request.params);
    const user = request.user!;

    const stats = await disasterService.getStatistics(id, user.organizationId, user.role);
    return reply.send(successResponse(stats));
  }
}

export const disasterController = new DisasterController();

