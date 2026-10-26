import type { FastifyRequest, FastifyReply } from 'fastify';
import { imageService } from '../services/imageService.js';
import { createImageSchema, imageParamsSchema } from '../schemas/image.schema.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';

export class ImageController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const validatedData = createImageSchema.parse(request.body);
    const user = request.user!;

    const image = await imageService.create(
      validatedData,
      disasterId,
      user.userId,
      user.organizationId,
      user.role
    );

    return reply.code(201).send(successResponse(image));
  }

  async findByDisasterId(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const pagination = parsePagination(request.query as any);
    const user = request.user!;

    const { images, total } = await imageService.findByDisasterId(
      disasterId,
      pagination,
      user.organizationId,
      user.role
    );

    return reply.send(paginatedResponse(images, total, pagination.page, pagination.limit));
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = imageParamsSchema.parse(request.params);
    const user = request.user!;

    const image = await imageService.findById(id, user.organizationId, user.role);
    return reply.send(successResponse(image));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = imageParamsSchema.parse(request.params);
    const user = request.user!;

    await imageService.delete(id, user.userId, user.organizationId, user.role);
    return reply.send(successResponse({ message: 'Image deleted successfully' }));
  }

  async triggerAnalysis(request: FastifyRequest, reply: FastifyReply) {
    const { id } = imageParamsSchema.parse(request.params);
    const user = request.user!;

    const job = await imageService.triggerAnalysis(id, user.userId, user.organizationId, user.role);

    // Exact response per Requirement 17: { jobId: "...", status: "QUEUED" }
    return reply.code(202).send({
      success: true,
      data: {
        jobId: job.id,
        status: job.status
      }
    });
  }
}

export const imageController = new ImageController();

