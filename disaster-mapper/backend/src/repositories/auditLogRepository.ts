import { prisma } from '../config/database.js';
import type { AuditLog } from '../types/index.js';

export class AuditLogRepository {
  async create(data: {
    userId?: string;
    organizationId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data
    });
  }

  async findByUserId(
    userId: string,
    pagination: { skip: number; take: number }
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const where = { userId };
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { logs, total };
  }

  async findByOrganization(
    orgId: string,
    pagination: { skip: number; take: number }
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const where = { organizationId: orgId };
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { logs, total };
  }
}

export const auditLogRepository = new AuditLogRepository();

