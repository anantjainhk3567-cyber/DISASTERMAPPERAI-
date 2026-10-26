import { detectionRepository, DetectionFilters } from '../repositories/detectionRepository.js';
import { disasterRepository } from '../repositories/disasterRepository.js';
import { parseBoundingBox } from '../utils/spatial.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import type { Detection } from '../types/index.js';

export class DetectionService {
  async findByDisasterId(
    disasterId: string,
    filters: DetectionFilters & { bbox?: string }
  ) {
    const disaster = await disasterRepository.findById(disasterId);
    if (!disaster) {
      throw new NotFoundError('Disaster event not found');
    }

    if (filters.bbox) {
      const parsedBbox = parseBoundingBox(filters.bbox);
      if (!parsedBbox) {
        throw new ValidationError('Invalid bbox format. Expected: minLng,minLat,maxLng,maxLat');
      }
      const detections = await detectionRepository.findInBoundingBox(disasterId, parsedBbox);
      return {
        detections,
        total: detections.length
      };
    }

    return detectionRepository.findByDisasterId(disasterId, filters);
  }

  async findById(id: string): Promise<Detection> {
    const detection = await detectionRepository.findById(id);
    if (!detection) {
      throw new NotFoundError('Detection not found');
    }
    return detection;
  }
}

export const detectionService = new DetectionService();

