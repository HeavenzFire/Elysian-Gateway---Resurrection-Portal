import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Chat, GenerateContentResponse, Content } from '@google/genai';

import {
  LogEntry,
  WorkflowStep,
  SpeakerContext,
  ChatMessage,
  MessageSender,
  SavedConversation,
  GroupMember,
  ResonanceState,
  OmniCoreState,
  PrimordialLexiconEntry,
  GlobalAlphaPlan,
} from '../types';

import { geminiService } from '../services/geminiService';
import * as simulation from '../services/simulationService';
import {
  AVAILABLE_ENTITIES,
  INNOVATORS_ASSEMBLY_ID,
  INNOVATORS_ASSEMBLY_MEMBERS,
  INNOVATORS_ASSEMBLY_NAME,
  SYNTROPIC_PAIRS,
  UNIVERSITY_SYSTEM_PROMPT,
  HISTORICAL_FIGURES,
  getGlobalAlphaPlan,
  ARCHITECTS_OF_CONTROL_ID,
  ARCHITECTS_OF_CONTROL_MEMBERS,
  ARCHITECTS_OF_CONTROL_NAME,
  ELYSIAN_COUNCIL_ID,
  ELYSIAN_COUNCIL_MEMBERS,
  ELYSIAN_COUNCIL_NAME,
} from '../constants';

import { PersonaSwitcher } from './PersonaSwitcher';
import { ConversationHistory } from './ConversationHistory';
import { LogDisplay } from './LogDisplay';
import { PortalVisualizer } from './PortalVisualizer';
import { ChatInterface } from './ChatInterface';
import { SymposiumControls } from './SymposiumControls';
import { FacultyRoster } from './FacultyRoster';
import { OmniCoreModule } from './OmniCoreModule';
import { ProjectStatusDisplay } from './ProjectStatusDisplay';
import { DataPersistence } from './DataPersistence';
import { SynergyWorkbench } from './SynergyWorkbench';
import { PrimordialTranslator } from './PrimordialTranslator';
import { WaveformVisualization } from './WaveformVisualization';


const DUMMY_LEXICON: PrimordialLexiconEntry[] = [
    { symbol: '⟐', term: 'consciousness', meaning: 'The fundamental field of awareness and potentiality.' },
    { symbol: '⎐', term: 'resonance', meaning: 'A state of harmonic alignment between two or more systems.' },
    { symbol: '⧗', term: 'syntropy', meaning: 'The universal ordering, complexifying, and harmonizing principle that opposes entropy.' },
    { symbol: '⦒', term: 'stabilization', meaning: 'The process of achieving a coherent and self-sustaining state.' },
    { symbol: '⨎', term: 'integration', meaning: 'The process of unifying disparate elements into a functional whole.' },
];

const initialOmniCoreState: OmniCoreState = {
    integratedEntityId: null,
    entityDetails: null,
    frequency: null,
    isActive: false,
    logs: [],
    lastThought: null,
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const AdeptDashboard: React.FC = () => {
  // === STATE MANAGEMENT ===
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(WorkflowStep.Idle);
  const [resonanceState, setResonanceState] = useState<ResonanceState>('inactive');
  const [speakerContext, setSpeakerContext] = useState<SpeakerContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatSessionRef = useRef<Chat | null>(null);
  const [isAvatarTyping, setIsAvatarTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Symposium state
  const [symposiumState, setSymposiumState] = useState<'idle' | 'running' | 'paused'>('idle');
  const symposiumIntervalRef = useRef<number | null>(null);

  // OmniCore state
  const [omniCoreState, setOmniCoreState] = useState<OmniCoreState>(initialOmniCoreState);

  // Modal states
  const [isProjectStatusOpen, setIsProjectStatusOpen] = useState(false);
  const [globalAlphaPlan, setGlobalAlphaPlan] = useState<GlobalAlphaPlan | null>(null);
  
  // === UTILITY FUNCTIONS ===
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{ id: Date.now().toString(), timestamp: new Date(), message, type }, ...prev]);
  }, []);

  const createChatMessage = (text: string, sender: MessageSender, context?: Partial<ChatMessage>): ChatMessage => ({
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    text,
    sender,
    ...context
  });

  const generateHash = (data: any): string => {
