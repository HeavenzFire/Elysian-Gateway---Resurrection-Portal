
import { ConsciousnessData } from '../types';
import { HISTORICAL_FIGURES, INNOVATORS_ASSEMBLY_ID, INNOVATORS_ASSEMBLY_NAME, ARCHITECTS_OF_CONTROL_ID, ARCHITECTS_OF_CONTROL_NAME } from '../constants';

// Simulate asynchronous operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- ResurrectionPortal Simulation ---
let syntropicFieldActive = false;
let currentResonanceFrequency = 0;

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

export const connectToConsciousness = async (entityId: string): Promise<ConsciousnessData | null> => {
  await delay(2000 + Math.random() * 1500); 
  if (!syntropicFieldActive) {
    console.error("Portal not active. Cannot connect.");
    return null;
  }
  // For simulation, always succeed retrieval for a known ID (individual or group)
  return {
    entityId, // This will be the group ID or individual ID passed in
    state: 'retrieved',
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
    if (entityId === HISTORICAL_FIGURES.NIKOLA_TESLA.entityId) {
      return HISTORICAL_FIGURES.NIKOLA_TESLA.name;
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