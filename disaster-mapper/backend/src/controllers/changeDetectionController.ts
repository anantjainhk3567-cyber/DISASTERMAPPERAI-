import type { FastifyRequest, FastifyReply } from 'fastify';
import { changeDetectionService } from '../services/changeDetectionService.js';
import { disasterParamsSchema } from '../schemas/disaster.schema.js';
import { changeDetectionSchema } from '../schemas/changeDetection.schema.js';
import { successResponse } from '../utils/response.js';

export class ChangeDetectionController {
  async trigger(request: FastifyRequest, reply: FastifyReply) {
    const { id: disasterId } = disasterParamsSchema.parse(request.params);
    const { beforeImageId, afterImageId } = changeDetectionSchema.parse(request.body);
    const user = request.user!;

    const job = await changeDetectionService.triggerChangeDetection(
      disasterId,
      beforeImageId,
      afterImageId,
      user.userId,
      user.organizationId
    );

    return reply.code(202).send(
      successResponse({
        jobId: job.id,
        status: job.status,
        message: 'Change detection job queued successfully'
      })
    );
  }
}

export const changeDetectionController = new ChangeDetectionController();

