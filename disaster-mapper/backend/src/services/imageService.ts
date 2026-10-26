import { imageRepository } from '../repositories/imageRepository.js';
import { disasterRepository } from '../repositories/disasterRepository.js';
import { analysisRepository } from '../repositories/analysisRepository.js';
import { analysisQueue } from '../queues/index.js';
import { auditService } from './auditService.js';
import { cacheService } from './cacheService.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { ImageAsset, AnalysisJob, UserRole } from '../types/index.js';

export class ImageService {
  async create(
    data: any,
    disasterId: string,
    userId: string,
    userOrgId: string,
    role: UserRole
  ): Promise<ImageAsset> {
    const disaster = await disasterRepository.findById(disasterId);
    if (!disaster) {
      throw new NotFoundError('Disaster event not found');
    }
    if (role !== 'ADMIN' && disaster.organizationId !== userOrgId) {
      throw new ForbiddenError('Access denied to this disaster event');
    }

    const image = await imageRepository.create({
      ...data,
      disasterEventId: disasterId,
      uploadedBy: userId
    });

    await auditService.log('IMAGE_UPLOAD', 'ImageAsset', {
      userId,
      organizationId: userOrgId,
      resourceId: image.id,
      metadata: { disasterEventId: disasterId, type: image.type }
    });

    return image;
  }

  async findByDisasterId(
    disasterId: string,
    pagination: { skip: number; take: number },
    userOrgId: string,
    role: UserRole
  ) {
    const disaster = await disasterRepository.findById(disasterId);
    if (!disaster) {
      throw new NotFoundError('Disaster event not found');
    }
    if (role !== 'ADMIN' && disaster.organizationId !== userOrgId) {
      throw new ForbiddenError('Access denied to this disaster event');
    }

    return imageRepository.findByDisasterId(disasterId, pagination);
  }

  async findById(id: string, userOrgId: string, role: UserRole): Promise<ImageAsset> {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw new NotFoundError('Image not found');
    }
    if (role !== 'ADMIN' && image.disasterEvent.organizationId !== userOrgId) {
      throw new ForbiddenError('Access denied to this image');
    }
    return image;
  }

  async delete(id: string, userId: string, userOrgId: string, role: UserRole): Promise<void> {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw new NotFoundError('Image not found');
    }
    if (role !== 'ADMIN' && image.disasterEvent.organizationId !== userOrgId) {
      throw new ForbiddenError('Access denied to this image');
    }

    await imageRepository.delete(id);

    await auditService.log('IMAGE_DELETE', 'ImageAsset', {
      userId,
      organizationId: userOrgId,
      resourceId: id
    });
  }

  async triggerAnalysis(
    imageId: string,
    userId: string,
    userOrgId: string,
    role: UserRole
  ): Promise<AnalysisJob> {
    const image = await imageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundError('Image not found');
    }
    if (role !== 'ADMIN' && image.disasterEvent.organizationId !== userOrgId) {
      throw new ForbiddenError('Access denied to this image');
    }

    // 1. Create AnalysisJob record in database
    const job = await analysisRepository.create({
      disasterEventId: image.disasterEventId,
      imageId: image.id,
      organizationId: image.disasterEvent.organizationId,
      status: 'QUEUED'
    });

    // 2. Push to BullMQ queue for async processing
    await analysisQueue.add(
      'process-analysis',
      {
        jobId: job.id,
        disasterId: image.disasterEventId,
        imageId: image.id,
        imageUrl: image.fileUrl,
        disasterType: image.disasterEvent.type,
        centerLatitude: image.latitude || image.disasterEvent.centerLatitude,
        centerLongitude: image.longitude || image.disasterEvent.centerLongitude
      },
      {
        jobId: job.id
      }
    );

    await auditService.log('ANALYSIS_STARTED', 'AnalysisJob', {
      userId,
      organizationId: userOrgId,
      resourceId: job.id,
      metadata: { imageId, disasterEventId: image.disasterEventId }
    });

    await cacheService.invalidateDisasterCache(image.disasterEventId);

    return job;
  }
}

export const imageService = new ImageService();

