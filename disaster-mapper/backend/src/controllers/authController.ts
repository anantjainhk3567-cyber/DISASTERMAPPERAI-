import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/authService.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { successResponse } from '../utils/response.js';
import { UnauthorizedError } from '../utils/errors.js';

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const validatedData = registerSchema.parse(request.body);
    const { user, tokens } = await authService.register(validatedData);

    reply.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth'
    });

    return reply.code(201).send(
      successResponse({
        user,
        accessToken: tokens.accessToken
      })
    );
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const validatedData = loginSchema.parse(request.body);
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    const { user, tokens } = await authService.login(
      validatedData.email,
      validatedData.password,
      ipAddress,
      userAgent
    );

    reply.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth'
    });

    return reply.send(
      successResponse({
        user,
        accessToken: tokens.accessToken
      })
    );
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token cookie missing');
    }

    const tokens = await authService.refreshToken(refreshToken);

    reply.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth'
    });

    return reply.send(
      successResponse({
        accessToken: tokens.accessToken
      })
    );
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('refreshToken', { path: '/api/auth' });
    return reply.send(
      successResponse({
        message: 'Logged out successfully'
      })
    );
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const user = await authService.getCurrentUser(request.user.userId);
    return reply.send(successResponse(user));
  }
}

export const authController = new AuthController();

