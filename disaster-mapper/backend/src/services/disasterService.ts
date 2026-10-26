import { disasterRepository, DisasterFilters } from '../repositories/disasterRepository.js';
import { cacheService } from './cacheService.js';
import { auditService } from './auditService.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { CACHE_TTL } from '../config/constants.js';
import type { DisasterEvent, UserRole } from '../types/index.js';

export class DisasterService {
  private verifyOrgAccess(disasterOrgId: string, userOrgId: string, role: UserRole) {
    if (role === 'ADMIN' || role === 'COMMANDER') return;
    if (disasterOrgId?.startsWith('demo') && userOrgId?.startsWith('demo')) return;
    if (disasterOrgId !== userOrgId) {
      throw new ForbiddenError('Access denied to this organization\'s disaster event');
    }
  }

  async create(
    data: any,
    userId: string,
    userOrgId: string,
    _role: UserRole
  ): Promise<DisasterEvent> {
    const disaster = await disasterRepository.create({
      ...data,
      organizationId: userOrgId
    });

    await auditService.log('DISASTER_CREATE', 'DisasterEvent', {
      userId,
      organizationId: userOrgId,
      resourceId: disaster.id,
      metadata: { name: disaster.name, type: disaster.type }
    });

    await cacheService.invalidateDashboardCache(userOrgId);
    return disaster;
  }

  async findAll(
    userOrgId: string,
    role: UserRole,
    filters: DisasterFilters,
    pagination: { skip: number; take: number }
  ) {
    return disasterRepository.findAll(userOrgId, filters, pagination);
  }

  async findById(id: string, userOrgId: string, role: UserRole): Promise<DisasterEvent> {
    const disaster = await disasterRepository.findById(id);
    if (!disaster) {
      throw new NotFoundError('Disaster event not found');
    }
    this.verifyOrgAccess(disaster.organizationId, userOrgId, role);
    return disaster;
  }

  async update(
    id: string,
    data: any,
    userId: string,
    userOrgId: string,
    role: UserRole
  ): Promise<DisasterEvent> {
    const existing = await disasterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Disaster event not found');
    }
    this.verifyOrgAccess(existing.organizationId, userOrgId, role);

    const updated = await disasterRepository.update(id, data);

    await auditService.log('DISASTER_UPDATE', 'DisasterEvent', {
      userId,
      organizationId: userOrgId,
      resourceId: id,
      metadata: data
    });

    await cacheService.invalidateDisasterCache(id);
    await cacheService.invalidateDashboardCache(userOrgId);
    return updated;
  }

  async delete(
    id: string,
    userId: string,
    userOrgId: string,
    role: UserRole
  ): Promise<void> {
    const existing = await disasterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Disaster event not found');
    }
    this.verifyOrgAccess(existing.organizationId, userOrgId, role);

    await disasterRepository.delete(id);

    await auditService.log('DISASTER_DELETE', 'DisasterEvent', {
      userId,
      organizationId: userOrgId,
      resourceId: id,
      metadata: { name: existing.name }
    });

    await cacheService.invalidateDisasterCache(id);
    await cacheService.invalidateDashboardCache(userOrgId);
  }

  async getSummary(id: string, userOrgId: string, role: UserRole) {
    const existing = await disasterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Disaster event not found');
    }
    this.verifyOrgAccess(existing.organizationId, userOrgId, role);

    const cacheKey = `disaster:summary:${id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const summary = await disasterRepository.getSummary(id);
    if (summary) {
      await cacheService.set(cacheKey, summary, CACHE_TTL.summary);
    }
    return summary;
  }

  async getStatistics(id: string, userOrgId: string, role: UserRole) {
    const existing = await disasterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Disaster event not found');
    }
    this.verifyOrgAccess(existing.organizationId, userOrgId, role);

    const cacheKey = `disaster:stats:${id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const stats = await disasterRepository.getStatistics(id);
    await cacheService.set(cacheKey, stats, CACHE_TTL.summary);
    return stats;
  }
}

export const disasterService = new DisasterService();

