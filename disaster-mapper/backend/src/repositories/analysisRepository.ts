import { prisma } from '../config/database.js';
import type { AnalysisJob, AnalysisStatus } from '../types/index.js';

export class AnalysisRepository {
  async findById(id: string): Promise<AnalysisJob | null> {
    return prisma.analysisJob.findUnique({
      where: { id },
      include: {
        image: true,
        disasterEvent: true,
        _count: {
          select: { detections: true }
        }
      }
    });
  }

  async findByDisasterId(disasterId: string): Promise<AnalysisJob[]> {
    return prisma.analysisJob.findMany({
      where: { disasterEventId: disasterId },
      orderBy: { createdAt: 'desc' },
      include: {
        image: {
          select: { id: true, type: true, fileUrl: true, createdAt: true }
        },
        _count: {
          select: { detections: true }
        }
      }
    });
  }

  async create(data: {
    disasterEventId: string;
    imageId: string;
    organizationId: string;
    status?: AnalysisStatus;
    modelVersion?: string;
  }): Promise<AnalysisJob> {
    return prisma.analysisJob.create({
      data: {
        disasterEventId: data.disasterEventId,
        imageId: data.imageId,
        organizationId: data.organizationId,
        status: data.status || 'QUEUED',
        progress: 0,
        modelVersion: data.modelVersion
      }
    });
  }

  async updateStatus(
    id: string,
    status: AnalysisStatus,
    extras?: {
      progress?: number;
      startedAt?: Date;
      completedAt?: Date;
      errorMessage?: string;
      modelVersion?: string;
    }
  ): Promise<AnalysisJob> {
    return prisma.analysisJob.update({
      where: { id },
      data: {
        status,
        ...extras
      }
    });
  }

  async getResults(jobId: string) {
    const job = await prisma.analysisJob.findUnique({
      where: { id: jobId },
      include: {
        image: true,
        disasterEvent: true,
        detections: {
          include: {
            buildingImpact: true,
            roadSegment: true
          }
        },
        aiExplanations: true
      }
    });

    if (!job) return null;

    // Fetch associated entities for the disaster
    const [buildings, roads, floodZones, settlements] = await Promise.all([
      prisma.buildingImpact.findMany({ where: { disasterEventId: job.disasterEventId } }),
      prisma.roadSegment.findMany({ where: { disasterEventId: job.disasterEventId } }),
      prisma.floodZone.findMany({ where: { disasterEventId: job.disasterEventId } }),
      prisma.settlementImpact.findMany({ where: { disasterEventId: job.disasterEventId } })
    ]);

    return {
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        errorMessage: job.errorMessage,
        modelVersion: job.modelVersion
      },
      detections: job.detections,
      buildings,
      roads,
      floodZones,
      settlements,
      aiExplanations: job.aiExplanations
    };
  }
}

export const analysisRepository = new AnalysisRepository();

