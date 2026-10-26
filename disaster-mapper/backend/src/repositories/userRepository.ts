import { prisma } from '../config/database.js';
import type { User, UserRole } from '../types/index.js';

// Pre-seeded demo hash for "Demo@123"
const DEMO_HASH = '$argon2id$v=19$m=65536,t=3,p=4$SC983AqBzwJ/qxDw3+Sf7w$LLfC+Ak6oTrSspjIqYNY7eA0SF6vt3/cQyEhta88cuo';

const inMemoryUsers = new Map<string, User>([
  ['commander@demo.local', {
    id: 'demo-commander',
    name: 'Incident Commander',
    email: 'commander@demo.local',
    passwordHash: DEMO_HASH,
    role: 'COMMANDER',
    organizationId: 'demo-org',
    phone: '+91 98110 99881',
    badgeNumber: 'CMD-01',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  ['admin@demo.local', {
    id: 'demo-admin',
    name: 'National Administrator',
    email: 'admin@demo.local',
    passwordHash: DEMO_HASH,
    role: 'ADMIN',
    organizationId: 'demo-org',
    phone: '+91 98110 99882',
    badgeNumber: 'ADM-01',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  ['responder@demo.local', {
    id: 'demo-responder',
    name: 'Field Responder',
    email: 'responder@demo.local',
    passwordHash: DEMO_HASH,
    role: 'RESPONDER',
    organizationId: 'demo-org',
    phone: '+91 98110 99883',
    badgeNumber: 'RSP-01',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  ['citizen@demo.local', {
    id: 'demo-citizen',
    name: 'Public Citizen',
    email: 'citizen@demo.local',
    passwordHash: DEMO_HASH,
    role: 'CITIZEN',
    organizationId: 'demo-org',
    phone: null,
    badgeNumber: null,
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  ['analyst@demo.local', {
    id: 'demo-analyst',
    name: 'GIS Intelligence Analyst',
    email: 'analyst@demo.local',
    passwordHash: DEMO_HASH,
    role: 'ANALYST',
    organizationId: 'demo-org',
    phone: null,
    badgeNumber: null,
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }]
]);

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (user) return user;
    } catch {
      // Database offline/error fallback
    }
    return inMemoryUsers.get(email.toLowerCase()) || null;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { organization: true }
      });
      if (user) return user;
    } catch {
      // Database offline/error fallback
    }
    for (const u of inMemoryUsers.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    organizationId: string;
  }): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          role: (data.role === 'COMMANDER' ? 'ADMIN' : (data.role || 'VIEWER')) as any,
          organizationId: data.organizationId
        }
      });
    } catch {
      // Database offline fallback: store in memory
      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role || 'VIEWER',
        organizationId: data.organizationId || 'demo-org',
        phone: null,
        badgeNumber: null,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryUsers.set(data.email.toLowerCase(), newUser);
      return newUser;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { lastLoginAt: new Date() }
      });
    } catch {
      for (const u of inMemoryUsers.values()) {
        if (u.id === id) {
          u.lastLoginAt = new Date();
          break;
        }
      }
    }
  }
}

export const userRepository = new UserRepository();

