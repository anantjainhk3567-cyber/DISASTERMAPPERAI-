import { prisma } from '../config/database.js';
import type { ImageAsset, ImageType } from '../types/index.js';

export class ImageRepository {
  async findByDisasterId(
    disasterId: string,
    pagination: { skip: number; take: number }
  ): Promise<{ images: ImageAsset[]; total: number }> {
    const where = { disasterEventId: disasterId };
    const [images, total] = await Promise.all([
      prisma.imageAsset.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: { uploader: { select: { id: true, name: true, email: true } } }
      }),
      prisma.imageAsset.count({ where })
    ]);

    return { images, total };
  }

  async findById(id: string): Promise<any | null> {
    return prisma.imageAsset.findUnique({
      where: { id },
      include: {
        disasterEvent: true,
        uploader: { select: { id: true, name: true, email: true } },
        analysisJobs: { orderBy: { createdAt: 'desc' } }
      }
    });
  }

  async create(data: {
    disasterEventId: string;
    uploadedBy: string;
    type: ImageType;
    source?: string;
    fileUrl: string;
    thumbnailUrl?: string;
    metadata?: any;
    captureTime?: Date;
    latitude?: number;
    longitude?: number;
    boundingBox?: any;
  }): Promise<ImageAsset> {
    return prisma.imageAsset.create({
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.imageAsset.delete({
      where: { id }
    });
  }
}

export const imageRepository = new ImageRepository();

