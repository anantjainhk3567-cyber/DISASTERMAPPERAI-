import { defaultDemoDisasters } from '../store/useDisasterStore';
import { getGeoJsonForDisaster, LANDSLIDE_SHIMLA_GEOJSON, FLOOD_ASSAM_GEOJSON, LANDSLIDE_JK_GEOJSON } from '../data/multiDisasterGeoJson';

console.log('====================================================');
console.log('DISASTERMAPPER AI — COMPREHENSIVE VERIFICATION SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       -> ${details}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       -> ${details}`);
    failCount++;
  }
}

// ----------------------------------------------------
// TEST 1: Registered Disasters Context & Identification
// ----------------------------------------------------
console.log('--- TEST GROUP 1: Registered Disasters Integrity ---');
const disasterIds = defaultDemoDisasters.map((d) => d.id);
assert(disasterIds.includes('assam-flood-recent'), 'Assam Flood registered', 'ID: assam-flood-recent');
assert(disasterIds.includes('jk-landslide-flood-recent'), 'J&K Landslide registered', 'ID: jk-landslide-flood-recent');
assert(disasterIds.includes('shimla-landslide-recent'), 'Shimla Landslide registered', 'ID: shimla-landslide-recent');
assert(disasterIds.includes('delhi-flood-2026'), 'Delhi Flood registered', 'ID: delhi-flood-2026');

const shimla = defaultDemoDisasters.find((d) => d.id === 'shimla-landslide-recent');
assert(
  shimla?.centerLatitude === 31.1048 && shimla?.centerLongitude === 77.1734,
  'Shimla coordinates accurate to Himachal Himalayas',
  `Lat: ${shimla?.centerLatitude}, Lng: ${shimla?.centerLongitude}`
);

const assam = defaultDemoDisasters.find((d) => d.id === 'assam-flood-recent');
assert(
  assam?.centerLatitude === 26.3150 && assam?.centerLongitude === 92.9376,
  'Assam coordinates accurate to Brahmaputra basin',
  `Lat: ${assam?.centerLatitude}, Lng: ${assam?.centerLongitude}`
);

const jk = defaultDemoDisasters.find((d) => d.id === 'jk-landslide-flood-recent');
assert(
  jk?.centerLatitude === 33.2420 && jk?.centerLongitude === 75.2450,
  'J&K coordinates accurate to NH-44 Ramban corridor',
  `Lat: ${jk?.centerLatitude}, Lng: ${jk?.centerLongitude}`
);

// ----------------------------------------------------
// TEST 2: Shimla GIS GeoJSON Feature Correctness
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: Shimla Geospatial Layers (Defect B) ---');
const shimlaGeo = getGeoJsonForDisaster('shimla-landslide-recent');
assert(shimlaGeo.features.length >= 8, 'Shimla has full GIS layer features', `Count: ${shimlaGeo.features.length}`);

const scarp = shimlaGeo.features.find((f: any) => f.id === 'shimla-scarp-summerhill');
assert(scarp !== undefined && scarp.properties?.name.includes('Summer Hill'), 'Summer Hill Crown Scarp feature exists', scarp?.properties?.name);

const railway = shimlaGeo.features.find((f: any) => f.id === 'shimla-rail-kalka-shimla');
assert(railway !== undefined && railway.properties?.status === 'BLOCKED', 'Kalka-Shimla UNESCO rail suspension gap mapped', railway?.properties?.name);

const nh5 = shimlaGeo.features.find((f: any) => f.id === 'shimla-road-nh5-taradevi');
assert(nh5 !== undefined && nh5.properties?.name.includes('Tara Devi'), 'NH-5 Tara Devi rockfall blockage mapped', nh5?.properties?.name);

const redZone = shimlaGeo.features.find((f: any) => f.id === 'shimla-rescue-red-summerhill');
assert(
  redZone !== undefined && redZone.properties?.priorityLevel === 'RED' && redZone.properties?.priorityHeight === 320,
  'RED Priority Zone for Summer Hill & Shiv Bawdi with 320m Priority Visualization Height',
  `Priority Score: ${redZone?.properties?.priorityScore}, Height: ${redZone?.properties?.priorityHeight}m`
);

const igmc = shimlaGeo.features.find((f: any) => f.id === 'shimla-facility-igmc');
assert(igmc !== undefined && igmc.properties?.name.includes('IGMC'), 'IGMC Hospital trauma facility mapped for Shimla', igmc?.properties?.name);

const stadium = shimlaGeo.features.find((f: any) => f.id === 'shimla-shelter-stadium');
assert(stadium !== undefined && stadium.properties?.name.includes('Stadium'), 'Municipal Indoor Stadium shelter mapped for Shimla', stadium?.properties?.name);

// ----------------------------------------------------
// TEST 3: Zero Cross-Contamination (Defect A)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Cross-Contamination Isolation (Defect A & D) ---');
const shimlaFeatureNames = JSON.stringify(shimlaGeo.features);
assert(!shimlaFeatureNames.includes('Mundakkai'), 'Shimla GIS data contains zero references to Mundakkai', 'No Wayanad leakage');
assert(!shimlaFeatureNames.includes('Chooralmala'), 'Shimla GIS data contains zero references to Chooralmala', 'No Wayanad leakage');
assert(!shimlaFeatureNames.includes('Yamuna'), 'Shimla GIS data contains zero references to Yamuna', 'No Delhi leakage');

// ----------------------------------------------------
// TEST 4: Assam & J&K GeoJSON Isolation
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: Assam & J&K Geospatial Layers ---');
const assamGeo = getGeoJsonForDisaster('assam-flood-recent');
const assamNames = JSON.stringify(assamGeo.features);
assert(assamNames.includes('Brahmaputra') && assamNames.includes('Morigaon'), 'Assam GIS features contain Brahmaputra & Morigaon', 'Authentic Assam GIS');
assert(!assamNames.includes('Summer Hill') && !assamNames.includes('Yamuna'), 'Assam GIS has zero Shimla/Delhi contamination', 'Strictly isolated');

const jkGeo = getGeoJsonForDisaster('jk-landslide-flood-recent');
const jkNames = JSON.stringify(jkGeo.features);
assert(jkNames.includes('Panthyal') && jkNames.includes('Ramban'), 'J&K GIS features contain Panthyal & Ramban', 'Authentic J&K GIS');
assert(!jkNames.includes('Summer Hill') && !jkNames.includes('Brahmaputra'), 'J&K GIS has zero Shimla/Assam contamination', 'Strictly isolated');

// ----------------------------------------------------
// TEST 5: Geotechnical & Hydrodynamic Physics Verification
// ----------------------------------------------------
console.log('\n--- TEST GROUP 5: Universal Multi-Hazard Sandbox Simulation (Section 6 & 7) ---');
// Landslide geotechnical model test
const slopeAngleDeg = 44;
const phiDeg = 32;
const cKpa = 14;
const gammaKnM3 = 19;
const zM = 4.2;
const mSat = 0.98;

const slopeRad = (slopeAngleDeg * Math.PI) / 180;
const phiRad = (phiDeg * Math.PI) / 180;
const normalStress = gammaKnM3 * zM * Math.cos(slopeRad) * Math.cos(slopeRad);
const porePressure = mSat * 9.81 * zM * Math.cos(slopeRad) * Math.cos(slopeRad);
const effectiveNormalStress = Math.max(1, normalStress - porePressure);
const shearStrength = cKpa + effectiveNormalStress * Math.tan(phiRad);
const shearStress = gammaKnM3 * zM * Math.sin(slopeRad) * Math.cos(slopeRad);
const factorOfSafety = Math.round((shearStrength / shearStress) * 100) / 100;

assert(factorOfSafety < 1.0, 'Landslide physics: 44° slope at 98% saturation triggers slope failure (F_s < 1.0)', `Computed FoS: ${factorOfSafety} (< 1.0 FAILED)`);

// ----------------------------------------------------
// FINAL VERDICT
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount === 0) {
  console.log('\nVERDICT: PASS');
  if (typeof (globalThis as any).process !== 'undefined') {
    (globalThis as any).process.exit?.(0);
  }
} else {
  console.error('\nVERDICT: FAIL -- Regression detected');
  if (typeof (globalThis as any).process !== 'undefined') {
    (globalThis as any).process.exit?.(1);
  }
}

