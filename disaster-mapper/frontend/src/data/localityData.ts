export interface LocalityFocus {
  id: string;
  disasterId: string;
  name: string;
  category: 'DISTRICT_HQ' | 'CHOKE_POINT' | 'HOSPITAL' | 'RIVERBANK' | 'VILLAGE' | 'SHELTER';
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  hazardStatus: 'CRITICAL_BREACH' | 'HIGHWAY_SUBMERGED' | 'CATASTROPHIC_SEVERANCE' | 'ROAD_SUBSIDENCE' | 'ISOLATED_COMMUNITY' | 'SAFE_OPERATIONAL' | 'SAFE_HQ';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  description: string;
  exposedPopulation: number;
  facilities: string;
  roadAccessStatus: string;
  recommendedAction: string;
}

export const LOCALITIES_DATABASE: LocalityFocus[] = [
  // ==========================================
  // ASSAM BRAHMAPUTRA BASIN LOCALITIES
  // ==========================================
  {
    id: 'loc-as-morigaon',
    disasterId: 'assam-flood-recent',
    name: 'Morigaon District Command HQ & Civil Hospital',
    category: 'DISTRICT_HQ',
    coordinates: [92.3420, 26.2520],
    zoom: 15.2,
    pitch: 44,
    bearing: -12,
    hazardStatus: 'SAFE_OPERATIONAL',
    severity: 'MODERATE',
    description: 'Central administrative staging base and emergency dispatch hub. Water edge 1.4km north; high-capacity mobile generators operational.',
    exposedPopulation: 28400,
    facilities: 'Morigaon Civil Hospital (120 beds, 18 ICU slots available), Municipal Indoor Camp',
    roadAccessStatus: 'NH-715 open eastbound toward Nagaon; local PWD link roads partially flooded',
    recommendedAction: 'Maintain primary medical reception corridor; dispatch boat squads to Lahorighat'
  },
  {
    id: 'loc-as-lahorighat',
    disasterId: 'assam-flood-recent',
    name: 'Lahorighat Brahmaputra Riverbank (Ground Zero)',
    category: 'RIVERBANK',
    coordinates: [92.3850, 26.4150],
    zoom: 15.6,
    pitch: 48,
    bearing: -15,
    hazardStatus: 'CRITICAL_BREACH',
    severity: 'CRITICAL',
    description: 'Severe Brahmaputra riverbank scouring. 340m earthen dyke section breached, floodwaters rushing into riparian paddy villages.',
    exposedPopulation: 14200,
    facilities: 'Sub-center clinic submerged; SDRF inflatable boat medical team deployed',
    roadAccessStatus: 'Embankment road breached at Ch 14.2km; accessible strictly via motorised assault boats',
    recommendedAction: 'Immediate amphibious evacuation of stranded char villagers to Morigaon relief shelters'
  },
  {
    id: 'loc-as-jakhalabandha',
    disasterId: 'assam-flood-recent',
    name: 'Jakhalabandha NH-27 Highway Breach Choke Point',
    category: 'CHOKE_POINT',
    coordinates: [93.0150, 26.5820],
    zoom: 15.4,
    pitch: 46,
    bearing: -18,
    hazardStatus: 'HIGHWAY_SUBMERGED',
    severity: 'CRITICAL',
    description: 'Vital 4-lane East-West arterial link (NH-27) submerged under 0.85m fast-moving overflow. Heavy freight traffic halted.',
    exposedPopulation: 8500,
    facilities: 'Jakhalabandha Police Station staging post, mobile fuel tanker unit',
    roadAccessStatus: 'NH-27 closed between km 184 and 188; light traffic diverted via elevated Nagaon bypass',
    recommendedAction: 'Deploy NDRF flood rescue trucks; position sandbag barrier teams to prevent highway foundation washaway'
  },
  {
    id: 'loc-as-kaliabor',
    disasterId: 'assam-flood-recent',
    name: 'Kaliabor Sub-Divisional Hospital & Safe Plateau',
    category: 'HOSPITAL',
    coordinates: [92.9850, 26.5450],
    zoom: 15.5,
    pitch: 45,
    bearing: -10,
    hazardStatus: 'SAFE_OPERATIONAL',
    severity: 'LOW',
    description: 'Elevated bedrock plateau serving as major surgical reception center and air-drop staging zone above maximum flood crest.',
    exposedPopulation: 12000,
    facilities: 'Kaliabor Sub-Divisional Hospital (240 beds, 72h backup diesel generator, blood bank)',
    roadAccessStatus: 'High-clearance road links open south to Nagaon; floodwaters contained 800m north',
    recommendedAction: 'Stage medical trauma teams and establish regional anti-venom and water-purification depot'
  },
  {
    id: 'loc-as-bhuragaon',
    disasterId: 'assam-flood-recent',
    name: 'Bhuragaon Char Riverine Islands (Isolated)',
    category: 'VILLAGE',
    coordinates: [92.2650, 26.3750],
    zoom: 15.2,
    pitch: 42,
    bearing: -8,
    hazardStatus: 'ISOLATED_COMMUNITY',
    severity: 'HIGH',
    description: 'Series of low-lying sandbar islands completely marooned. 6,800 residents sheltering on raised school plinths.',
    exposedPopulation: 6800,
    facilities: 'Temporary floating dispensary on country boats; aerial food drops active',
    roadAccessStatus: 'Zero terrestrial connectivity; boat travel only (caution: high river current 3.2 m/s)',
    recommendedAction: 'Deploy 8 motorised rescue boats with dry food rations, chlorine tablets, and satellite radios'
  },

  // ==========================================
  // JAMMU & KASHMIR RAMBAN CORRIDOR LOCALITIES
  // ==========================================
  {
    id: 'loc-jk-ramban',
    disasterId: 'jk-landslide-flood-recent',
    name: 'Ramban District Hospital & Military Helipad',
    category: 'HOSPITAL',
    coordinates: [75.2410, 33.2430],
    zoom: 15.5,
    pitch: 52,
    bearing: -20,
    hazardStatus: 'SAFE_OPERATIONAL',
    severity: 'MODERATE',
    description: 'District medical trauma facility perched on stable mountain shelf overlooking Chenab river gorge.',
    exposedPopulation: 18500,
    facilities: '180 beds (165 occupied), Army medical team, IAF helicopter helipad operational',
    roadAccessStatus: 'Local town roads open; NH-44 northbound to Srinagar completely blocked',
    recommendedAction: 'Maintain helipad flight readiness for critical trauma airlifts to Military Hospital Udhampur'
  },
  {
    id: 'loc-jk-panthyal',
    disasterId: 'jk-landslide-flood-recent',
    name: 'Panthyal NH-44 High-Risk Rockfall Chute',
    category: 'CHOKE_POINT',
    coordinates: [75.2250, 33.2450],
    zoom: 15.8,
    pitch: 56,
    bearing: -25,
    hazardStatus: 'CATASTROPHIC_SEVERANCE',
    severity: 'CRITICAL',
    description: 'Steep 58° fractured shale cliff face. 18,000 m³ massive boulder fall completely crushed steel rock-shed and buried NH-44.',
    exposedPopulation: 6500,
    facilities: 'BRO heavy equipment base 2.4km south; emergency paramedic ambulance on standby',
    roadAccessStatus: 'Total highway severance. Zero vehicular passage. Active falling stones.',
    recommendedAction: 'BRO controlled blast rock clearance with CAT D8 dozers; enforce strict civilian exclusion zone'
  },
  {
    id: 'loc-jk-mehar',
    disasterId: 'jk-landslide-flood-recent',
    name: 'Mehar Highway Deep Slump & Subsidence',
    category: 'CHOKE_POINT',
    coordinates: [75.2180, 33.2320],
    zoom: 15.6,
    pitch: 54,
    bearing: -22,
    hazardStatus: 'ROAD_SUBSIDENCE',
    severity: 'CRITICAL',
    description: 'Massive rotational slope failure. Road foundation displaced 4.5m vertically toward surging Chenab riverbed.',
    exposedPopulation: 4100,
    facilities: 'Emergency police checkpoint post, searchlight tower',
    roadAccessStatus: 'Road cracked open with 2m wide fissures; impassable for all wheeled vehicles',
    recommendedAction: 'Deploy wire mesh gabion retaining wall stabilization; establish temporary foot ropeway'
  },
  {
    id: 'loc-jk-chanderkote',
    disasterId: 'jk-landslide-flood-recent',
    name: 'Chanderkote Army Transit & Relief Staging Base',
    category: 'SHELTER',
    coordinates: [75.1850, 33.1950],
    zoom: 15.2,
    pitch: 48,
    bearing: -15,
    hazardStatus: 'SAFE_HQ',
    severity: 'LOW',
    description: 'Sprawling army cantonment ground functioning as primary reception camp for 1,840 stranded highway passengers.',
    exposedPopulation: 2500,
    facilities: '2,500 capacity transit shelters, mass community kitchen, 4 fuel tankers, satellite terminal',
    roadAccessStatus: 'NH-44 open southbound toward Jammu and Udhampur',
    recommendedAction: 'Coordinate logistics resupply from Jammu; shelter stranded truck drivers and tourists'
  },
  {
    id: 'loc-jk-gool',
    disasterId: 'jk-landslide-flood-recent',
    name: 'Gool Mountain Cut-Off Highland Pocket',
    category: 'VILLAGE',
    coordinates: [75.1200, 33.2400],
    zoom: 15.0,
    pitch: 52,
    bearing: -18,
    hazardStatus: 'ISOLATED_COMMUNITY',
    severity: 'HIGH',
    description: 'Highland valley pocket with 14 mountain hamlets completely isolated after bridge washouts along Ramban-Gool link.',
    exposedPopulation: 12200,
    facilities: 'Primary health dispensary low on insulin and IV fluids; IAF air-drop active',
    roadAccessStatus: 'All 3 mountain road bridges collapsed; foot trails hazardous due to debris slurry',
    recommendedAction: 'Daily IAF Mi-17 aerial ration drops; deploy portable satellite communications backpacks'
  },

  // ==========================================
  // SHIMLA VALLEY DISASTER LOCALITIES
  // ==========================================
  {
    id: 'loc-sh-summerhill',
    disasterId: 'shimla-landslide-recent',
    name: 'Summer Hill Scarp & Shiv Bawdi Ground Zero',
    category: 'CHOKE_POINT',
    coordinates: [77.1350, 31.1140],
    zoom: 16.2,
    pitch: 56,
    bearing: -15,
    hazardStatus: 'CATASTROPHIC_SEVERANCE',
    severity: 'CRITICAL',
    description: 'Catastrophic slope collapse triggered by 180mm deluge. 24,000 m³ limestone slurry swept through temple ravine.',
    exposedPopulation: 4800,
    facilities: 'IGMC Mobile Trauma ICU, SDRF USAR canine search teams, acoustic life detectors',
    roadAccessStatus: 'Ravine road sheared away; heavy earthmovers accessing via Boileauganj track',
    recommendedAction: 'Continuous acoustic life-detector search in temple rubble; anchor active upper crown scarp'
  },
  {
    id: 'loc-sh-kalka-rail',
    disasterId: 'shimla-landslide-recent',
    name: 'Kalka-Shimla UNESCO Railway Suspension Gap',
    category: 'CHOKE_POINT',
    coordinates: [77.1350, 31.1140],
    zoom: 16.5,
    pitch: 58,
    bearing: -18,
    hazardStatus: 'CATASTROPHIC_SEVERANCE',
    severity: 'CRITICAL',
    description: 'Heritage railway viaduct foundation completely swept away; tracks and ties suspended in mid-air across a 30m chasm.',
    exposedPopulation: 1200,
    facilities: 'Northern Railway emergency bridge inspection crew',
    roadAccessStatus: 'Railway line suspended indefinitely between Kalka and Shimla terminus',
    recommendedAction: 'Erect structural shoring piers; halt all rail traffic and evacuate nearby slope dwellings'
  },
  {
    id: 'loc-sh-igmc',
    disasterId: 'shimla-landslide-recent',
    name: 'Indira Gandhi Medical College (IGMC) Hospital',
    category: 'HOSPITAL',
    coordinates: [77.1820, 31.1090],
    zoom: 15.8,
    pitch: 48,
    bearing: -12,
    hazardStatus: 'SAFE_OPERATIONAL',
    severity: 'LOW',
    description: 'Himachal state premier 800-bed tertiary trauma facility. Operating 24/7 on dedicated backup diesel generators.',
    exposedPopulation: 34000,
    facilities: '800 beds, 24 operating theatres, blood bank, trauma triage staging zone',
    roadAccessStatus: 'Circular Cart Road open for emergency ambulances; police escorting trauma vehicles',
    recommendedAction: 'Maintain clear ambulance corridor along Circular Road; stage emergency blood supplies'
  },
  {
    id: 'loc-sh-taradevi',
    disasterId: 'shimla-landslide-recent',
    name: 'NH-5 Kalka-Shimla Highway Tara Devi Choke Point',
    category: 'CHOKE_POINT',
    coordinates: [77.1500, 31.0900],
    zoom: 15.5,
    pitch: 52,
    bearing: -20,
    hazardStatus: 'ROAD_SUBSIDENCE',
    severity: 'HIGH',
    description: 'NH-5 arterial link to Chandigarh buried under 8,200 m³ rockfall. Critical relief trucks halted on highway.',
    exposedPopulation: 6200,
    facilities: 'HPPWD emergency earthmover station, police traffic diversion post',
    roadAccessStatus: 'Single-lane emergency channel cleared for essential military and medical vehicles',
    recommendedAction: 'Continuous rock drill blasting to widen channel to 2 lanes; police escort for convoys'
  },
  {
    id: 'loc-sh-ridge',
    disasterId: 'shimla-landslide-recent',
    name: 'The Ridge & Mall Road Coordination Headquarters',
    category: 'DISTRICT_HQ',
    coordinates: [77.1750, 31.1040],
    zoom: 16.0,
    pitch: 44,
    bearing: -10,
    hazardStatus: 'SAFE_HQ',
    severity: 'LOW',
    description: 'Elevated bedrock ridge crest designated as central state disaster management headquarters and civilian safe zone.',
    exposedPopulation: 12000,
    facilities: 'Municipal Indoor Stadium emergency shelter (850 capacity), state command tent',
    roadAccessStatus: 'All municipal arterial links open to pedestrian and authorized emergency transport',
    recommendedAction: 'Direct public information broadcasts; distribute relief rations from Municipal Indoor Stadium'
  },

  // ==========================================
  // DELHI URBAN MONSOON SURGE LOCALITIES
  // ==========================================
  {
    id: 'loc-del-loha-pul',
    disasterId: 'delhi-flood-2026',
    name: 'Old Railway Bridge (Loha Pul River Gauge)',
    category: 'CHOKE_POINT',
    coordinates: [77.2450, 28.6620],
    zoom: 15.5,
    pitch: 45,
    bearing: -12,
    hazardStatus: 'CRITICAL_BREACH',
    severity: 'CRITICAL',
    description: 'Historic Yamuna gauge recording 208.66m, 3.33m above Danger Mark (205.33m). High water velocity.',
    exposedPopulation: 45000,
    facilities: 'Central Water Commission hydro-telemetry post, boat rescue base',
    roadAccessStatus: 'Old Railway Bridge closed to all train and vehicular traffic',
    recommendedAction: 'Continuous river stage monitoring; enforce evacuation of Yamuna floodplain khaddar'
  },
  {
    id: 'loc-del-kashmere-gate',
    disasterId: 'delhi-flood-2026',
    name: 'Kashmere Gate ISBT & Ring Road Choke Point',
    category: 'CHOKE_POINT',
    coordinates: [77.2280, 28.6680],
    zoom: 15.5,
    pitch: 46,
    bearing: -15,
    hazardStatus: 'HIGHWAY_SUBMERGED',
    severity: 'CRITICAL',
    description: 'Northern Ring Road and ISBT terminal inundated with 1.2m water; interstate buses suspended.',
    exposedPopulation: 38000,
    facilities: 'Metro station upper concourse dry; lower road levels submerged',
    roadAccessStatus: 'Ring Road closed between Majnu Ka Tilla and Shanti Van; traffic diverted to Rani Jhansi Road',
    recommendedAction: 'Deploy high-capacity dewatering pump sets (400 HP); divert traffic to central Delhi'
  },
  {
    id: 'loc-del-ito',
    disasterId: 'delhi-flood-2026',
    name: 'ITO Barrage Drain No. 12 Regulator Breach',
    category: 'CHOKE_POINT',
    coordinates: [77.2510, 28.6290],
    zoom: 15.5,
    pitch: 44,
    bearing: -10,
    hazardStatus: 'CRITICAL_BREACH',
    severity: 'CRITICAL',
    description: 'Backflow of Yamuna into Drain 12 inundating Vikas Marg and WHO building junction.',
    exposedPopulation: 25000,
    facilities: 'Indian Army Corps of Engineers sandbag reinforcement site',
    roadAccessStatus: 'Vikas Marg closed westbound towards ITO; traffic diverted via Geeta Colony bridge',
    recommendedAction: 'Indian Army heavy sandbag bunding; continuous diving operations to clear barrage gates'
  }
];

export function getLocalitiesForDisaster(disasterId?: string): LocalityFocus[] {
  if (!disasterId) return LOCALITIES_DATABASE.filter(l => l.disasterId === 'assam-flood-recent');
  const id = disasterId.toLowerCase();

  if (id.includes('assam')) {
    return LOCALITIES_DATABASE.filter(l => l.disasterId === 'assam-flood-recent');
  }
  if (id.includes('jk') || id.includes('kashmir') || id.includes('ramban')) {
    return LOCALITIES_DATABASE.filter(l => l.disasterId === 'jk-landslide-flood-recent');
  }
  if (id.includes('shimla') || id.includes('himachal')) {
    return LOCALITIES_DATABASE.filter(l => l.disasterId === 'shimla-landslide-recent');
  }
  if (id.includes('delhi')) {
    return LOCALITIES_DATABASE.filter(l => l.disasterId === 'delhi-flood-2026');
  }

  // Fallback to Assam
  return LOCALITIES_DATABASE.filter(l => l.disasterId === 'assam-flood-recent');
}
