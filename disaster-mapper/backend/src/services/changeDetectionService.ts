import { imageRepository } from '../repositories/imageRepository.js';
import { analysisRepository } from '../repositories/analysisRepository.js';
import { changeDetectionQueue } from '../queues/index.js';
import { config } from '../config/env.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { detectionRepository } from '../repositories/detectionRepository.js';
import { floodZoneRepository } from '../repositories/floodZoneRepository.js';
import { auditService } from './auditService.js';
import { cacheService } from './cacheService.js';

export class ChangeDetectionService {
  async triggerChangeDetection(
    disasterId: string,
    beforeImageId: string,
    afterImageId: string,
    userId: string,
    orgId: string
  ) {
    const [beforeImg, afterImg] = await Promise.all([
      imageRepository.findById(beforeImageId),
      imageRepository.findById(afterImageId)
    ]);

    if (!beforeImg || !afterImg) {
      throw new NotFoundError('One or both image assets could not be found');
    }

    if (beforeImg.disasterEventId !== disasterId || afterImg.disasterEventId !== disasterId) {
      throw new ValidationError('Both images must belong to the specified disaster event');
    }

    // Create analysis job for tracking
    const job = await analysisRepository.create({
      disasterEventId: disasterId,
      imageId: afterImageId,
      organizationId: orgId,
      status: 'QUEUED'
    });

    // Add to BullMQ changeDetectionQueue
    await changeDetectionQueue.add(
      'process-change-detection',
      {
        jobId: job.id,
        disasterId,
        beforeImageUrl: beforeImg.fileUrl,
        afterImageUrl: afterImg.fileUrl,
        disasterType: afterImg.disasterEvent.type,
        centerLatitude: afterImg.latitude || afterImg.disasterEvent.centerLatitude,
        centerLongitude: afterImg.longitude || afterImg.disasterEvent.centerLongitude
      },
      { jobId: job.id }
    );

    await auditService.log('CHANGE_DETECTION_STARTED', 'AnalysisJob', {
      userId,
      organizationId: orgId,
      resourceId: job.id,
      metadata: { beforeImageId, afterImageId }
    });

    return job;
  }

  async processChangeDetection(data: {
    jobId: string;
    disasterId: string;
    beforeImageUrl: string;
    afterImageUrl: string;
    disasterType: string;
    centerLatitude: number;
    centerLongitude: number;
  }) {
    const { jobId, disasterId, beforeImageUrl, afterImageUrl, disasterType, centerLatitude, centerLongitude } = data;

    try {
      await analysisRepository.updateStatus(jobId, 'PROCESSING', {
        progress: 15,
        startedAt: new Date()
      });

      const url = `${config.AI_SERVICE_URL}/ai/change-detection`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforeImageUrl,
          afterImageUrl,
          disasterType,
          latitude: centerLatitude,
          longitude: centerLongitude
        })
      });

      if (!response.ok) {
        throw new Error(`AI Change Detection failed with status: ${response.status}`);
      }

      const aiData = await response.json();

      // Store any new damage detections
      if (aiData.newDamage && aiData.newDamage.length > 0) {
        const detections = aiData.newDamage.map((d: any) => ({
          analysisJobId: jobId,
          disasterEventId: disasterId,
          type: d.type,
          confidence: Number(d.confidence) || 0.9,
          severity: d.severity || 'HIGH',
          geometry: d.geometry,
          centroidLatitude: Number(d.centroidLatitude) || centerLatitude,
          centroidLongitude: Number(d.centroidLongitude) || centerLongitude,
          properties: { isNewDamage: true }
        }));
        await detectionRepository.createMany(detections);
      }

      // Store any new flood extents
      if (aiData.newFlooding && aiData.newFlooding.length > 0) {
        const floodZones = aiData.newFlooding.map((f: any) => ({
          disasterEventId: disasterId,
          geometry: f.geometry,
          confidence: Number(f.confidence) || 0.92,
          severity: f.severity || 'HIGH',
          estimatedArea: f.estimatedArea || 3.1
        }));
        await floodZoneRepository.createMany(floodZones);
      }

      await analysisRepository.updateStatus(jobId, 'COMPLETED', {
        progress: 100,
        completedAt: new Date(),
        modelVersion: aiData.modelVersion || 'disastermapper-v1'
      });

      await cacheService.invalidateDisasterCache(disasterId);
      return aiData;
    } catch (err: any) {
      console.error('Error processing change detection:', err);
      await analysisRepository.updateStatus(jobId, 'FAILED', {
        errorMessage: err.message,
        completedAt: new Date()
      });
      throw err;
    }
  }
}

export const changeDetectionService = new ChangeDetectionService();

