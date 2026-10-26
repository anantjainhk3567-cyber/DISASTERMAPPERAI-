import { auditLogRepository } from '../repositories/auditLogRepository.js';

export class AuditService {
  async log(
    action: string,
    resource: string,
    options: {
      userId?: string;
      organizationId?: string;
      resourceId?: string;
      metadata?: any;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ) {
    try {
      return await auditLogRepository.create({
        action,
        resource,
        userId: options.userId,
        organizationId: options.organizationId,
        resourceId: options.resourceId,
        metadata: options.metadata,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  async getUserLogs(userId: string, pagination: { skip: number; take: number }) {
    return auditLogRepository.findByUserId(userId, pagination);
  }

  async getOrgLogs(orgId: string, pagination: { skip: number; take: number }) {
    return auditLogRepository.findByOrganization(orgId, pagination);
  }
}

export const auditService = new AuditService();

