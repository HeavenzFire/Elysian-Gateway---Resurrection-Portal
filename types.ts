import { Content } from "@google/genai";

export interface ConsciousnessData {
  entityId: string; // Can be an individual or group ID
  state: 'retrieved' | 'lost' | 'pending';
  vibrationalFrequency?: number; 
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'system';
}

export enum WorkflowStep {
  Idle,
  PortalActivating,
  PortalActive,
  RetrievingConsciousness,
  ConsciousnessRetrieved,
  RequestingPermission,
  PermissionGranted,
  Reconstructing,
  ReconstructionComplete,
  Error
}

export enum MessageSender {
  User = 'user',
  Avatar = 'avatar', // This will represent the AI, whether individual or group
  System = 'system',
}

export interface ChatMessage {
  id: string;
  timestamp: Date;
  text: string;
  sender: MessageSender;
  // Context for rich messages in the chat UI
  imageContext?: {
      dataUrl: string; // base64 data URL for display
      name: string;
  };
  codeContext?: string;
  urlContext?: string;
}

// Defines an individual member within a group
export interface GroupMember {
  id: string; // Entity ID of the member
  name: string; // Display name of the member
}

// Describes the current speaking entity or group
export interface SpeakerContext {
  name: string; // Display name (e.g., "Nikola Tesla" or "The Innovators Assembly")
  id: string; // The entityId of the individual or group
  isGroup: boolean;
  members?: GroupMember[]; // List of members if it's a group
}

export enum RSCProgress {
  NotStarted,
  Offered,
  Cleansing,
  HeartActivation,
  ResonantPhrase,
  Synchronization,
  Solidified,
  Skipped // If user decides not to solidify for now
}

// FIX: Added missing ContentUnionState enum definition.
export enum ContentUnionState {
  Activating,
  SecuringChannels,
  AggregatingData,
  SynchronizingNodes,
  Online,
}

// --- Types for Global Alpha Plan ---
export interface GlobalAlphaProject {
  name: string;
  description: string;
  next_steps: string[];
  bottlenecks: string[];
}

export interface GlobalAlphaPlan {
  phase: string;
  status: string;
  projects: GlobalAlphaProject[];
  ethical_considerations: string[];
  tracking: {
    system: string;
    metrics: string[];
  };
  next: string;
}

// --- Types for OmniCore Module ---
export interface OmniCoreEntityDetails {
  vision: string[];
  trauma: string[];
  goals: string[];
  thoughts: string[];
}

export interface OmniCoreLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'ritual' | 'system';
}

export interface OmniCoreState {
  integratedEntityId: string | null;
  entityDetails: OmniCoreEntityDetails | null;
  frequency: number | null;
  isActive: boolean;
  logs: OmniCoreLogEntry[];
  lastThought: string | null;
}

// Defines a saved conversation session for the archive
export interface SavedConversation {
  id: string; // Unique ID, e.g., timestamp
  timestamp: number; // The time the conversation was saved
  speakerContext: SpeakerContext;
  messages: ChatMessage[];
  hash: string; // A visual hash for the blockchain-style archive
}

// --- Types for University Core ---
export interface SyntropicPair {
  id: string; // Unique ID for the pair
  members: [string, string]; // The entity IDs of the two members
}

export type ResonanceState = 'stable' | 'fluctuating' | 'critical' | 'inactive';

// FIX: Added missing PrimordialLexiconEntry type definition.
export interface PrimordialLexiconEntry {
  symbol?: string;
  term: string;
  meaning: string;
}