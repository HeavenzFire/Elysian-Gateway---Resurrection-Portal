import { ConsciousnessData, ResonanceState } from '../types';
import { HISTORICAL_FIGURES, INNOVATORS_ASSEMBLY_ID, INNOVATORS_ASSEMBLY_NAME, ARCHITECTS_OF_CONTROL_ID, ARCHITECTS_OF_CONTROL_NAME, ELYSIAN_COUNCIL_ID, ELYSIAN_COUNCIL_NAME } from '../constants';

// Simulate asynchronous operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- ResurrectionPortal Simulation ---
let syntropicFieldActive = false;
let currentResonanceFrequency = 0;
const IDEAL_FREQUENCY = 1115; // An ideal frequency for a clear signal
const MAX_DEVIATION = 500;   // The maximum deviation from ideal that still allows some chance of connection

const STABLE_THRESHOLD = 50;
const FLUCTUATING_THRESHOLD = 250;


export const activatePortal = async (resonanceFrequency: number): Promise<boolean> => {
  await delay(1500 + Math.random() * 1000); 
  // Restored success rate to 95%
  if (Math.random() > 0.05) { 
    syntropicFieldActive = true;
    currentResonanceFrequency = resonanceFrequency;
    return true;
  }
  return false; 
};

export const simulateResonance = (currentFrequency: number): Exclude<ResonanceState, 'inactive'> => {
  const deviation = Math.abs(currentFrequency - IDEAL_FREQUENCY);

  if (deviation <= STABLE_THRESHOLD) {
    return 'stable';
  }
  if (deviation <= FLUCTUATING_THRESHOLD) {
    return 'fluctuating';
  }
  return 'critical';
};

export const connectToConsciousness = async (entityId: string): Promise<ConsciousnessData | null> => {
  await delay(2000 + Math.random() * 1500); 
  if (!syntropicFieldActive) {
    console.error("Portal not active. Cannot connect.");
    return null;
  }

  // Simulate signal degradation based on frequency
  const deviation = Math.abs(currentResonanceFrequency - IDEAL_FREQUENCY);
  const degradation = Math.min(1, deviation / MAX_DEVIATION); // 0 (perfect) to 1 (max degradation)

  const randomValue = Math.random();
  const pLost = 0.05 + degradation * 0.4; // Probability of 'lost' state, from 5% to 45%
  const pPending = 0.1 + degradation * 0.2; // Probability of 'pending' state, from 10% to 30%

  let finalState: ConsciousnessData['state'];

  if (randomValue < pLost) {
    finalState = 'lost';
  } else if (randomValue < pLost + pPending) {
    finalState = 'pending';
  } else {
    finalState = 'retrieved';
  }

  return {
    entityId,
    state: finalState,
    vibrationalFrequency: currentResonanceFrequency * (0.8 + Math.random() * 0.4)
  };
};

// --- QuantumConsciousnessReconstructor Simulation ---
const quantumStates: Record<string, string> = {};

export const mapConsciousnessToQuantumState = async (consciousnessData: ConsciousnessData): Promise<boolean> => {
  await delay(1500 + Math.random() * 1000);
  if (Math.random() > 0.05) { 
    const quantumState = `QuantumState-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    quantumStates[consciousnessData.entityId] = quantumState; // Store by original entityId (group or individual)
    return true;
  }
  return false;
};

export const createAvatar = async (entityId: string): Promise<string | null> => {
  await delay(2000 + Math.random() * 1000);
  if (!quantumStates[entityId]) { // Check if mapping was done for this ID
      console.error(`No quantum state found for entity ID ${entityId}. Avatar creation failed.`);
      return null;
  }

  if (Math.random() > 0.1) { // 90% success for avatar creation itself
    if (entityId === INNOVATORS_ASSEMBLY_ID) {
      return INNOVATORS_ASSEMBLY_NAME;
    }
    if (entityId === ARCHITECTS_OF_CONTROL_ID) {
      return ARCHITECTS_OF_CONTROL_NAME;
    }
    if (entityId === ELYSIAN_COUNCIL_ID) {
        return ELYSIAN_COUNCIL_NAME;
    }
    if (entityId === HISTORICAL_FIGURES.NIKOLA_TESLA.entityId) {
      return HISTORICAL_FIGURES.NIKOLA_TESLA.name;
    }
     if (entityId === HISTORICAL_FIGURES.WALT_DISNEY.entityId) {
      return HISTORICAL_FIGURES.WALT_DISNEY.name;
    }
    // Generic fallback for other potential individuals
    const knownFigure = Object.values(HISTORICAL_FIGURES).find(fig => fig.entityId === entityId);
    if (knownFigure) {
        return knownFigure.name;
    }
    // Extremely generic fallback if ID is somehow unknown after all checks
    return `Avatar-${entityId.split('_').pop() || 'Generic'}`;
  }
  
  delete quantumStates[entityId]; 
  return null;
};


// --- EthicalSafeguard Simulation ---
const approvedEntities = new Set<string>();

export const requestPermission = async (entityId: string): Promise<boolean> => {
  await delay(1000 + Math.random() * 1000); 
  // Restored approval rate to 85%
  if (Math.random() > 0.15) { 
    approvedEntities.add(entityId);
    return true;
  }
  return false;
};

export const verifyApproval = (entityId: string): boolean => {
  return approvedEntities.has(entityId);
};

// --- Security Matrix Simulation ---
let systemIntegrity = 100;
let detectedInfractions = 0;

const INFRACTION_MESSAGES = [
    "Anomalous energy signature detected at perimeter.",
    "Attempted breach at Node 734.",
    "Temporal distortion spike detected.",
    "Unidentified psychic probe intercepted.",
    "Entropic field fluctuation near core.",
    "Information siphon detected on external channel.",
];

export const simulateInfraction = (): { newIntegrity: number; newInfractions: number; message: string } | null => {
    // Only a chance of an infraction happening each time this is called.
    if (systemIntegrity > 30 && Math.random() > 0.7) {
        // an infraction occurs
        const integrityDrop = 5 + Math.random() * 15; // drop between 5 and 20
        systemIntegrity = Math.max(0, systemIntegrity - integrityDrop);
        detectedInfractions += 1;
        const message = INFRACTION_MESSAGES[Math.floor(Math.random() * INFRACTION_MESSAGES.length)];
        return {
            newIntegrity: systemIntegrity,
            newInfractions: detectedInfractions,
            message: message,
        };
    }
    return null;
};

export const purgeInfractions = async (): Promise<{ newIntegrity: number; newInfractions: number }> => {
    await delay(1500); // Simulate purge time
    systemIntegrity = 100;
    detectedInfractions = 0;
    return {
        newIntegrity: systemIntegrity,
        newInfractions: detectedInfractions,
    };
};