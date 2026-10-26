import type { FastifyRequest, FastifyReply } from 'fastify';
import { shelterService } from '../services/shelterService.js';
import { successResponse } from '../utils/response.js';
import { z } from 'zod';

const createShelterSchema = z.object({
  disasterEventId: z.string().min(1).optional(),
  name: z.string().min(1),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  totalCapacity: z.number().min(1),
  currentOccupancy: z.number().min(0).optional(),
  status: z.enum(['OPEN', 'FULL', 'CLOSED', 'DAMAGED']).optional(),
  isAccessible: z.boolean().optional(),
  hasMedicalFacilities: z.boolean().optional(),
  hasFoodSupplies: z.boolean().optional(),
  contactPhone: z.string().optional(),
  managerName: z.string().optional()
});

const updateOccupancySchema = z.object({
  currentOccupancy: z.number().min(0)
});

const planEvacuationSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  evacueeCount: z.number().min(1),
  requireAccessible: z.boolean().optional(),
  disasterId: z.string().optional()
});

export class ShelterController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId } = request.query as { disasterId?: string };
    const shelters = await shelterService.listShelters(disasterId);
    return reply.send(successResponse(shelters));
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const shelter = await shelterService.getShelterById(id);
    return reply.send(successResponse(shelter));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createShelterSchema.parse(request.body);
    const shelter = await shelterService.createShelter(body);
    return reply.code(201).send(successResponse(shelter));
  }

  async updateOccupancy(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = updateOccupancySchema.parse(request.body);
    const updated = await shelterService.updateOccupancy(id, body.currentOccupancy, request.user?.userId);
    return reply.send(successResponse(updated));
  }

  async planEvacuation(request: FastifyRequest, reply: FastifyReply) {
    const raw: any = (request.method === 'GET' ? request.query : request.body) || {};
    const disasterId =
      (request.params as any)?.id ||
      raw.disasterId ||
      'delhi-flood-2026';
    const body = planEvacuationSchema.parse({
      originLat: Number(raw.originLat ?? 28.6139),
      originLng: Number(raw.originLng ?? 77.2090),
      evacueeCount: Number(raw.evacueeCount ?? 50),
      requireAccessible: raw.requireAccessible === true || raw.requireAccessible === 'true',
      disasterId
    });

    const plan = await shelterService.planEvacuationAllocation(
      disasterId,
      body.originLat,
      body.originLng,
      body.evacueeCount,
      body.requireAccessible
    );

    return reply.send(successResponse(plan));
  }

  async getGeoJson(request: FastifyRequest, reply: FastifyReply) {
    const { disasterId } = request.query as { disasterId?: string };
    const geoJson = await shelterService.getGeoJson(disasterId);
    return reply.send(geoJson);
  }
}

export const shelterController = new ShelterController();
