import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { userRepository } from '../repositories/userRepository.js';
import { auditService } from './auditService.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError
} from '../utils/errors.js';
import type { JwtPayload, TokenPair, User } from '../types/index.js';

export class AuthService {
  async register(data: {
    name: string;
    email: string;
    password: string;
    organizationId?: string;
  }): Promise<{ user: Omit<User, 'passwordHash'>; tokens: TokenPair }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    let organizationId = data.organizationId;
    if (!organizationId) {
      try {
        let defaultOrg = await prisma.organization.findFirst();
        if (!defaultOrg) {
          defaultOrg = await prisma.organization.create({
            data: {
              name: 'DisasterMapper Demo Org',
              type: 'GOVERNMENT'
            }
          });
        }
        organizationId = defaultOrg.id;
      } catch {
        organizationId = 'demo-org';
      }
    } else {
      try {
        const org = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!org) {
          throw new NotFoundError('Specified organization not found');
        }
      } catch (e: any) {
        if (e instanceof NotFoundError) throw e;
        organizationId = 'demo-org';
      }
    }

    const passwordHash = await argon2.hash(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      organizationId,
      role: 'VIEWER'
    });

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    });

    await auditService.log('USER_REGISTER', 'User', {
      userId: user.id,
      organizationId: user.organizationId
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: TokenPair }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await userRepository.updateLastLogin(user.id);

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    });

    await auditService.log('USER_LOGIN', 'User', {
      userId: user.id,
      organizationId: user.organizationId,
      ipAddress,
      userAgent
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload;
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError('User no longer exists');
      }

      return this.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      });
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN as any
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as any
    });

    return { accessToken, refreshToken };
  }

  async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();

