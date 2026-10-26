import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { config } from '../config/env.js';

export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.code(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.errors
      }
    });
  }

  // Handle Prisma known request errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    if (prismaError.code === 'P2002') {
      return reply.code(409).send({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A record with this value already exists'
        }
      });
    }
    if (prismaError.code === 'P2025') {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found'
        }
      });
    }
  }

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  if ((error as any).statusCode === 429) {
    return reply.code(429).send({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: error.message || 'Too many requests'
      }
    });
  }

  const isDev = config.NODE_ENV === 'development';
  
  return reply.code(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      ...(isDev ? { stack: error.stack } : {})
    }
  });
};
