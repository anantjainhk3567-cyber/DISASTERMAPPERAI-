import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserRole } from '../types/index.js';

export const requireRole = (...roles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
  };
};

export const requireOrganization = () => {
  return async (request: FastifyRequest<{ Params: { organizationId?: string }; Querystring: { organizationId?: string } }>, reply: FastifyReply) => {
    const { user } = request;
    if (!user) {
      return reply.code(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }

    if (user.role === 'ADMIN') {
      return;
    }

    const orgId = request.params.organizationId || request.query.organizationId;

    if (!orgId || user.organizationId !== orgId) {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this organization\'s resources'
        }
      });
    }
  };
};
