import { config } from '../config/env.js';
import { analysisRepository } from '../repositories/analysisRepository.js';
import { detectionRepository } from '../repositories/detectionRepository.js';
import { buildingRepository } from '../repositories/buildingRepository.js';
import { roadRepository } from '../repositories/roadRepository.js';
import { floodZoneRepository } from '../repositories/floodZoneRepository.js';
import { settlementRepository } from '../repositories/settlementRepository.js';
import { cacheService } from './cacheService.js';
import { auditService } from './auditService.js';
import { priorityService } from './priorityService.js';
import { NotFoundError } from '../utils/errors.js';
import type { AnalysisJob } from '../types/index.js';

export class AnalysisService {
  async findById(jobId: string): Promise<AnalysisJob> {
    const job = await analysisRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Analysis job not found');
    }
    return job;
  }

  async findByDisasterId(disasterId: string): Promise<AnalysisJob[]> {
    return analysisRepository.findByDisasterId(disasterId);
  }

  async getResults(jobId: string) {
    const results = await analysisRepository.getResults(jobId);
    if (!results) {
      throw new NotFoundError('Analysis job results not found');
    }
    return results;
  }

  async callAIService(payload: {
    imageUrl: string;
    disasterType: string;
    latitude: number;
    longitude: number;
    metadata?: any;
  }) {
    const url = `${config.AI_SERVICE_URL}/ai/analyze-image`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service request failed with status ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async processAnalysis(jobData: {
    jobId: string;
    disasterId: string;
    imageId: string;
    imageUrl: string;
    disasterType: string;
    centerLatitude: number;
    centerLongitude: number;
  }) {
    const { jobId, disasterId, imageUrl, disasterType, centerLatitude, centerLongitude } = jobData;

    try {
      // 1. Update status to PROCESSING
      await analysisRepository.updateStatus(jobId, 'PROCESSING', {
        progress: 10,
        startedAt: new Date()
      });

      // 2. Call AI Service
      const aiResponse = await this.callAIService({
        imageUrl,
        disasterType,
        latitude: centerLatitude,
        longitude: centerLongitude
      });

      await analysisRepository.updateStatus(jobId, 'PROCESSING', {
        progress: 50,
        modelVersion: aiResponse.modelVersion || 'disastermapper-v1'
      });

      // 3. Store detections in DB
      if (aiResponse.detections && aiResponse.detections.length > 0) {
        const detectionData = aiResponse.detections.map((d: any) => ({
          analysisJobId: jobId,
          disasterEventId: disasterId,
          type: d.type,
          confidence: Number(d.confidence) || 0.85,
          severity: d.severity || 'MEDIUM',
          geometry: d.geometry,
          centroidLatitude: Number(d.centroidLatitude) || centerLatitude,
          centroidLongitude: Number(d.centroidLongitude) || centerLongitude,
          properties: d.properties || null
        }));

        await detectionRepository.createMany(detectionData);
      }

      // 4. Store Building Impacts
      if (aiResponse.buildings && aiResponse.buildings.length > 0) {
        const buildingData = aiResponse.buildings.map((b: any) => ({
          disasterEventId: disasterId,
          damageLevel: b.damageLevel || 'MODERATE',
          confidence: Number(b.confidence) || 0.88,
          geometry: b.geometry,
          estimatedOccupants: b.estimatedOccupants || Math.floor(Math.random() * 10) + 1,
          criticality: b.criticality || 'NORMAL'
        }));

        await buildingRepository.createMany(buildingData);
      }

      // 5. Store Road Segments
      if (aiResponse.roads && aiResponse.roads.length > 0) {
        const roadData = aiResponse.roads.map((r: any) => ({
          disasterEventId: disasterId,
          name: r.name || 'Segment',
          roadType: r.roadType || 'LOCAL',
          geometry: r.geometry,
          status: r.status || 'USABLE',
          confidence: Number(r.confidence) || 0.85,
          accessibilityScore: r.status === 'USABLE' ? 90 : (r.status === 'PARTIALLY_BLOCKED' ? 45 : 10)
        }));

        await roadRepository.createMany(roadData);
      }

      // 6. Store Flood Zones
      if (aiResponse.floodZones && aiResponse.floodZones.length > 0) {
        const floodData = aiResponse.floodZones.map((f: any) => ({
          disasterEventId: disasterId,
          geometry: f.geometry,
          confidence: Number(f.confidence) || 0.9,
          severity: f.severity || 'HIGH',
          estimatedArea: f.estimatedArea || 2.5,
          estimatedDepth: f.estimatedDepth !== undefined ? f.estimatedDepth : null
        }));

        await floodZoneRepository.createMany(floodData);
      }

      // 7. Store Settlement Impacts
      if (aiResponse.settlements && aiResponse.settlements.length > 0) {
        const settlementData = aiResponse.settlements.map((s: any) => ({
          disasterEventId: disasterId,
          geometry: s.geometry,
          estimatedPopulation: s.estimatedPopulation || 250,
          affectedPopulation: Math.floor((s.estimatedPopulation || 250) * 0.7),
          isolationScore: s.isolationScore || 65,
          severity: s.severity || 'HIGH'
        }));

        await settlementRepository.createMany(settlementData);
      }

      await analysisRepository.updateStatus(jobId, 'PROCESSING', {
        progress: 80
      });

      // 8. Trigger Priority and Rescue Zone calculation automatically
      await priorityService.generatePriorities(disasterId, undefined, jobId);

      // 9. Update job to COMPLETED
      const completedJob = await analysisRepository.updateStatus(jobId, 'COMPLETED', {
        progress: 100,
        completedAt: new Date()
      });

      // 10. Audit log and Cache Invalidation
      await auditService.log('ANALYSIS_COMPLETED', 'AnalysisJob', {
        resourceId: jobId,
        metadata: {
          disasterId,
          detectionsCount: aiResponse.detections?.length || 0
        }
      });

      await cacheService.invalidateDisasterCache(disasterId);
      await cacheService.invalidateDashboardCache();

      return completedJob;
    } catch (error: any) {
      console.error(`Analysis job ${jobId} failed:`, error);
      await analysisRepository.updateStatus(jobId, 'FAILED', {
        errorMessage: error.message || 'Unknown processing error',
        completedAt: new Date()
      });
      throw error;
    }
  }
}

export const analysisService = new AnalysisService();

