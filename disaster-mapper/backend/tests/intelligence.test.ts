import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../src/utils/spatial.js';

describe('Disaster Intelligence Logic', () => {
  describe('Geodesic & Spatial Distance Calculations', () => {
    it('should accurately calculate distance between coordinates', () => {
      const p1 = { lat: 28.6139, lng: 77.2090 };
      const p2 = { lat: 28.6239, lng: 77.2090 };
      const dist = calculateDistance(p1, p2);
      // 0.01 deg latitude ~ 1110 meters
      expect(dist).toBeGreaterThan(1100);
      expect(dist).toBeLessThan(1125);
    });
  });

  describe('Urban Runoff & Flood Intelligence Estimation', () => {
    it('should compute rational runoff and excess standing water', () => {
      const rainfallMm = 120;
      const soilSaturation = 0.8; // 80% saturation
      const drainageEfficiency = 0.7; // 70% drainage efficiency

      const runoffCoefficient = Math.min(0.95, 0.65 + (soilSaturation * 0.25));
      const netExcessRainfallMm = Math.max(0, rainfallMm * runoffCoefficient * (1 - (drainageEfficiency * 0.4)));

      expect(runoffCoefficient).toBeCloseTo(0.85, 2);
      expect(netExcessRainfallMm).toBeGreaterThan(70);
      expect(netExcessRainfallMm).toBeLessThan(80);
    });
  });

  describe('What-If Simulation Delta Calculation', () => {
    it('should compute accurate scenario differences', () => {
      const scenarioA = {
        rainfallAmountMm: 50,
        estimatedFloodAreaKm2: 4.5,
        exposedPopulation: 2200,
        potentiallyAffectedRoads: 2,
        estimatedShelterDemand: 396
      };

      const scenarioB = {
        rainfallAmountMm: 120,
        estimatedFloodAreaKm2: 11.2,
        exposedPopulation: 5800,
        potentiallyAffectedRoads: 6,
        estimatedShelterDemand: 1044
      };

      const deltas = {
        areaKm2Diff: Number((scenarioB.estimatedFloodAreaKm2 - scenarioA.estimatedFloodAreaKm2).toFixed(2)),
        populationDiff: scenarioB.exposedPopulation - scenarioA.exposedPopulation,
        roadsDiff: scenarioB.potentiallyAffectedRoads - scenarioA.potentiallyAffectedRoads,
        shelterDemandDiff: scenarioB.estimatedShelterDemand - scenarioA.estimatedShelterDemand,
        rainfallDiffMm: scenarioB.rainfallAmountMm - scenarioA.rainfallAmountMm
      };

      expect(deltas.areaKm2Diff).toBe(6.7);
      expect(deltas.populationDiff).toBe(3600);
      expect(deltas.roadsDiff).toBe(4);
      expect(deltas.shelterDemandDiff).toBe(648);
      expect(deltas.rainfallDiffMm).toBe(70);
    });
  });

  describe('Smart Shelter Evacuation Allocation Logic', () => {
    it('should allocate evacuees to nearest available shelters without exceeding capacity', () => {
      const shelters = [
        { id: 's1', name: 'Shelter Alpha', capacity: 500, current: 400, dist: 1200 }, // available: 100
        { id: 's2', name: 'Shelter Beta', capacity: 800, current: 200, dist: 2500 },  // available: 600
        { id: 's3', name: 'Shelter Gamma', capacity: 300, current: 300, dist: 800 }   // available: 0 (full)
      ];

      const evacueeCount = 350;

      const candidates = shelters
        .map(s => ({ ...s, available: Math.max(0, s.capacity - s.current) }))
        .filter(s => s.available > 0)
        .sort((a, b) => a.dist - b.dist);

      let remaining = evacueeCount;
      const allocation: any[] = [];

      for (const c of candidates) {
        if (remaining <= 0) break;
        const allocated = Math.min(remaining, c.available);
        allocation.push({ shelterId: c.id, allocated });
        remaining -= allocated;
      }

      expect(remaining).toBe(0); // All accommodated
      expect(allocation.length).toBe(2);
      expect(allocation[0]).toEqual({ shelterId: 's1', allocated: 100 });
      expect(allocation[1]).toEqual({ shelterId: 's2', allocated: 250 });
    });
  });

  describe('Prediction vs Reality Metrics (IoU & F1)', () => {
    it('should calculate valid Jaccard Index (IoU) and Precision/Recall', () => {
      const predictedArea = 12.0;
      const observedArea = 10.0;
      const intersectionArea = 8.0;

      const unionArea = predictedArea + observedArea - intersectionArea; // 14.0
      const iou = Number((intersectionArea / unionArea).toFixed(3)); // 8 / 14 = 0.571
      const precision = Number((intersectionArea / predictedArea).toFixed(3)); // 8 / 12 = 0.667
      const recall = Number((intersectionArea / observedArea).toFixed(3)); // 8 / 10 = 0.800
      const f1 = Number(((2 * precision * recall) / (precision + recall)).toFixed(3));

      expect(iou).toBe(0.571);
      expect(precision).toBe(0.667);
      expect(recall).toBe(0.800);
      expect(f1).toBeGreaterThan(0.7);
    });
  });
});
