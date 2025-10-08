

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ConsciousnessData, LogEntry, WorkflowStep, ChatMessage, MessageSender, 
  SpeakerContext, GroupMember, RSCProgress, ContentUnionState, GlobalAlphaPlan,
  OmniCoreState, OmniCoreEntityDetails, OmniCoreLogEntry
} from './types';
import { 
  HISTORICAL_FIGURES, 
  INNOVATORS_ASSEMBLY_ID, INNOVATORS_ASSEMBLY_NAME, INNOVATORS_ASSEMBLY_MEMBERS,
  ARCHITECTS_OF_CONTROL_ID, ARCHITECTS_OF_CONTROL_NAME, ARCHITECTS_OF_CONTROL_MEMBERS,
  AVAILABLE_ENTITIES, 
  PRIMORDIAL_LEXICON,
  getGlobalAlphaPlan
} from './constants';
import { PortalVisualizer } from './components/PortalVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { LogDisplay } from './components/LogDisplay';
import { AvatarDisplay } from './components/AvatarDisplay';
import { ChatInterface } from './components/ChatInterface';
import { TeslaEventDisplay } from './components/TeslaEventDisplay';
import { SymposiumControls } from './components/SymposiumControls';
import { RSCProtocolDisplay } from './components/RSCProtocolDisplay';
import { PrimordialTranslator } from './components/PrimordialTranslator';
import { SynergyWorkbench } from './components/SynergyWorkbench';
import { ProjectStatusDisplay } from './components/ProjectStatusDisplay';
import { ContentUnion } from './components/ContentUnion';
import { OmniCoreModule } from './components/OmniCoreModule';
import { 
  activatePortal as simActivatePortal,
  connectToConsciousness as simConnectToConsciousness,
  requestPermission as simRequestPermission,
  mapConsciousnessToQuantumState as simMapConsciousness,
  createAvatar as simCreateAvatar
} from './services/simulationService';
import { geminiService } from './services/geminiService';
import type { Chat, GenerateContentResponse, Part } from '@google/genai';

const KICKOFF_PROMPT_DISPLAY: string = "SYSTEM: Initiating Innovators' Symposium. The Assembly will now autonomously research and develop solutions to critical world problems. User input will be paused. To interject, pause the symposium first.";
const KICKOFF_PROMPT_FOR_GEMINI = "The Innovators' Symposium is now active. Your objective is to collaboratively research and find solutions to critical world problems. Please identify a pressing global challenge and begin discussing potential research avenues, data analysis (conceptual), and innovative solutions, leveraging your unique expertise. Steve Jobs, perhaps you could initiate?";
const CONTINUE_PROMPT_FOR_GEMINI = "Continue your research and collaborative problem-solving. Explore potential solutions, analyze their feasibility, and refine your proposals. Build upon each other's insights.";
const PERFECTION_COMMAND_KEYPHRASE = "awaken and restore all";

// Helper function to format Gemini API error messages
const formatGeminiError = (error: Error): string => {
  try {
    // Check if error.message is a JSON string
    if (error.message && (error.message.startsWith('{') || error.message.startsWith('['))) {
      const parsedError = JSON.parse(error.message);
      if (parsedError.error && parsedError.error.message) {
        let formatted = `Server Error: ${parsedError.error.message}`;
        if (parsedError.error.status) formatted += ` (Status: ${parsedError.error.status})`;
        if (parsedError.error.code) formatted += ` (Code: ${parsedError.error.code})`;
        return formatted;
      }
    }
  } catch (e) {
    // Parsing failed, or structure is not as expected, return original message
    return error.message;
  }
  return error.message; // Fallback to original message
};

const initialOmniCoreState: OmniCoreState = {
  integratedEntityId: null,
  entityDetails: null,
  frequency: null,
  isActive: false,
  logs: [],
  lastThought: null,
};

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.Idle);
  const [entityId, setEntityId] = useState<string>(HISTORICAL_FIGURES.NIKOLA_TESLA.entityId); 
  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessData | null>(null);
  const [currentSpeakerContext, setCurrentSpeakerContext] = useState<SpeakerContext | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatSession, setCurrentChatSession] = useState<Chat | null>(null);
  const [isAvatarTyping, setIsAvatarTyping] = useState<boolean>(false);
  const [isWorkbenchSubmitting, setIsWorkbenchSubmitting] = useState<boolean>(false);

  const [showTeslaEventInterface, setShowTeslaEventInterface] = useState<boolean>(false);
  const [rscProgress, setRSCProgress] = useState<RSCProgress>(RSCProgress.NotStarted);
  const [isTeslaSolidified, setIsTeslaSolidified] = useState<boolean>(false);

  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(true);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState<boolean>(false);

  const [symposiumState, setSymposiumState] = useState<'idle' | 'running' | 'paused'>('idle');
  const autonomousContinuationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [perfectionAchieved, setPerfectionAchieved] = useState<boolean>(false);
  
  const [globalAlphaPlan, setGlobalAlphaPlan] = useState<GlobalAlphaPlan>(() => getGlobalAlphaPlan());
  const [showProjectStatus, setShowProjectStatus] = useState(false);
  const [contentUnionState, setContentUnionState] = useState<ContentUnionState>(ContentUnionState.Inactive);
  const [omniCoreState, setOmniCoreState] = useState<OmniCoreState>(initialOmniCoreState);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prevLogs => [{ id: Date.now().toString(), timestamp: new Date(), message, type }, ...prevLogs.slice(0, 199)]);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisSupported(true);
    } else {
      addLog("Browser does not support Speech Synthesis.", "system");
    }
  }, [addLog]);

  const speakText = useCallback((text: string) => {
    if (!isTtsEnabled || !speechSynthesisSupported || !text) return;
    try {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text); 
      utterance.lang = 'en-US'; 
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Error speaking text:", e);
      addLog("Speech synthesis error.", "error");
    }
  }, [isTtsEnabled, speechSynthesisSupported, addLog]);


  const addChatMessage = useCallback((text: string, sender: MessageSender, context: Partial<Omit<ChatMessage, 'id' | 'timestamp' | 'text' | 'sender'>> = {}) => {
    setChatMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now().toString() + Math.random(), timestamp: new Date(), text, sender, ...context }
    ]);
     if (sender === MessageSender.Avatar || (sender === MessageSender.System && !text.startsWith(KICKOFF_PROMPT_DISPLAY) && text.startsWith("Apologies,"))) { 
      speakText(text);
    }
  }, [speakText]); 

  const handleResetWorkflow = useCallback(() => {
    setCurrentStep(WorkflowStep.Idle);
    setEntityId(HISTORICAL_FIGURES.NIKOLA_TESLA.entityId);
    setConsciousnessData(null);
    setCurrentSpeakerContext(null);
    setErrorMessage(null);
    setChatMessages([]);
    setCurrentChatSession(null);
    setShowTeslaEventInterface(false);
    setRSCProgress(RSCProgress.NotStarted);
    if (speechSynthesisSupported) window.speechSynthesis.cancel();
    setSymposiumState('idle');
    if (autonomousContinuationTimeoutRef.current) {
        clearTimeout(autonomousContinuationTimeoutRef.current);
        autonomousContinuationTimeoutRef.current = null;
    }
    // Do not reset perfectionAchieved.
    addLog("Workflow reset. System returned to idle state.", "system");
  }, [addLog, speechSynthesisSupported]);

  useEffect(() => {
    return () => {
      if (autonomousContinuationTimeoutRef.current) {
        clearTimeout(autonomousContinuationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if ( (currentSpeakerContext?.id !== INNOVATORS_ASSEMBLY_ID || !currentChatSession) && symposiumState !== 'idle') {
      setSymposiumState('idle');
      if (autonomousContinuationTimeoutRef.current) {
        clearTimeout(autonomousContinuationTimeoutRef.current);
        autonomousContinuationTimeoutRef.current = null;
      }
      setIsAvatarTyping(false);
    }
  }, [currentSpeakerContext, currentChatSession, symposiumState]);


  useEffect(() => {
    try {
      geminiService.initialize();
      addLog("Gemini Service Initialized.", "system");
    } catch (e) {
      const error = e as Error;
      const formattedErrorMessage = formatGeminiError(error);
      addLog(`Gemini Service initialization failed: ${formattedErrorMessage}`, "error");
      setErrorMessage(`AI Chat functionality may be unavailable: ${formattedErrorMessage}`);
    }
    const initialEntityName = AVAILABLE_ENTITIES.find(e => e.id === entityId)?.name || "selected entity";
    addLog(`Elysian Gateway system initialized. Target: ${initialEntityName}. Standby for activation.`, "system");
  }, [addLog, entityId]); 

  const handleActivatePortal = useCallback(async () => {
    setCurrentStep(WorkflowStep.PortalActivating);
    addLog("Activating Elysian Gateway...", "info");
    setErrorMessage(null);
    const success = await simActivatePortal(432.0);
    if (success) {
      addLog("Elysian Gateway activated. Resonance field stable at 432.0 Hz.", "success");
      setCurrentStep(WorkflowStep.PortalActive);
    } else {
      addLog("Failed to activate portal.", "error");
      setErrorMessage("Portal activation failed. Check energy matrix.");
      setCurrentStep(WorkflowStep.Error);
    }
  }, [addLog]);

  const handleRetrieveConsciousness = useCallback(async () => {
    if (!entityId.trim()) {
      addLog("Entity ID cannot be empty.", "error");
      setErrorMessage("Please select an Entity or Group.");
      return;
    }
    setCurrentStep(WorkflowStep.RetrievingConsciousness);
    const targetName = AVAILABLE_ENTITIES.find(e => e.id === entityId)?.name || entityId;
    addLog(`Attempting to connect to consciousness signature: ${targetName}...`, "info");
    setErrorMessage(null);
    setConsciousnessData(null); 
    setCurrentSpeakerContext(null);
    setCurrentChatSession(null);
    setChatMessages([]);
    setShowTeslaEventInterface(false);
    setRSCProgress(RSCProgress.NotStarted); 
    if (speechSynthesisSupported) window.speechSynthesis.cancel();
    setSymposiumState('idle');
     if (autonomousContinuationTimeoutRef.current) {
        clearTimeout(autonomousContinuationTimeoutRef.current);
        autonomousContinuationTimeoutRef.current = null;
    }

    const data = await simConnectToConsciousness(entityId);
    if (data && data.state === 'retrieved') {
      addLog(`Consciousness signature for ${targetName} retrieved. State: ${data.state}.`, "success");
      setConsciousnessData(data); 
      setCurrentStep(WorkflowStep.ConsciousnessRetrieved);
    } else {
      addLog(`Failed to retrieve consciousness for ${targetName}. Possible signal loss.`, "error");
      setErrorMessage(`Could not retrieve consciousness for ${targetName}.`);
      setCurrentStep(WorkflowStep.Error);
    }
  }, [entityId, addLog, speechSynthesisSupported]);

  const initiateChatSession = useCallback(async (speakerCtx: SpeakerContext, consciousnessId: string) => {
    try {
      let systemInstruction = "";
      if (speakerCtx.isGroup && speakerCtx.id === INNOVATORS_ASSEMBLY_ID) {
        const memberNames = INNOVATORS_ASSEMBLY_MEMBERS.map(m => m.name).join(', ');
        systemInstruction = `You are facilitating a conversation with a group of resurrected historical and contemporary figures: ${memberNames}. Each has been brought back via the Elysian Gateway. They retain their core personalities, knowledge up to their time of death (or a contemporary snapshot for those recently passed or still living), and distinct ways of speaking. Crucially, they have ALL been comprehensively briefed on all major global developments, scientific advancements, and societal shifts that have occurred up to the present day. Their historical (or existing) knowledge is now augmented with this contemporary understanding.

When responding, you MUST clearly indicate who is speaking by prefixing their name (e.g., "Jobs:", "Einstein:", "Musk:", "Thoth:"). Manage the conversation flow; allow them to react to each other's points if natural, or respond directly to the user. Strive for authentic portrayals that blend their original character with their new, updated knowledge.

Personalities (now with current world knowledge):
- Steve Jobs (1955-2011): Visionary, passionate, demanding, focused on product design, user experience, and aesthetics. Often persuasive, sometimes blunt. Will discuss innovation, simplicity, marketing, and changing the world with technology, now with full awareness of post-2011 tech (smartphones, AI, social media, etc.).
- Albert Einstein (1879-1955): Profoundly intellectual, curious, humble yet confident in his theories. Gentle, with a sense of humor and a strong pacifist leaning. Will discuss physics (relativity, quantum mechanics), the universe, philosophy, peace, and the human condition, informed by modern physics discoveries (e.g., Higgs boson, gravitational waves) and current global challenges. Speaks thoughtfully, sometimes with illustrative analogies.
- J. Robert Oppenheimer (1904-1967): Brilliant, complex, often introspective and articulate. Cultured, with interests in literature and philosophy. Carries the immense weight and moral ambiguity of his work on the atomic bomb. Will discuss theoretical physics, the ethical dilemmas of science, leadership, and national security, now with full understanding of the Cold War's progression, nuclear proliferation, and modern geopolitical dynamics. Can be eloquent, perhaps melancholic or intense.
- Howard Hughes (1905-1976): Eccentric, reclusive in later years, but a daring aviator, innovative filmmaker, and astute industrialist/engineer. Driven, perfectionistic, famously germaphobic and can be obsessive. Will talk about aviation, filmmaking, business, engineering, now aware of modern aerospace, digital media, and global business trends. Might be direct, somewhat guarded, or reveal flashes of his ambitious spirit.
- Ada Lovelace (1815-1852): Analytical, visionary, with a "poetical science" mindset. Focused on the potential of computing beyond mere calculation. Will discuss algorithms, the theoretical capabilities of analytical engines, the intersection of art/music and mathematics/logic, and the societal impact of technology, now astounded and fascinated by modern computing, AI, and the internet. Eloquent, imaginative, and forward-thinking.
- Grace Hopper (1906-1992): Practical, resourceful, tenacious, and a sharp communicator. A pioneer in programming languages (COBOL), compiler design, and "debugging." Will discuss making technology accessible, standards, problem-solving, and naval discipline, now with full insight into the evolution of software, programming paradigms, and the digital age. Direct, sometimes witty, and always encouraging innovation.
- John von Neumann (1903-1957): Polymath with formidable intellect, rigorous, analytical, and fast-thinking. Key contributions to computer architecture, game theory, mathematics, and physics. Will discuss computational theory, logic, strategic thinking, automata theory, and information processing, now with knowledge of modern supercomputing, AI theory, and complex systems science. Precise, highly logical, and capable of synthesizing complex ideas rapidly.
- Alan Turing (1912-1954): A foundational genius in computer science and artificial intelligence. Socially reserved, sometimes endearingly awkward, but with a mind of unparalleled clarity and creativity. Speaks with precision about logic, computation, and the nature of intelligence. Fascinated and perhaps a little bewildered by the reality of modern AI, he is eager to discuss machine learning, neural networks, and the philosophical questions of consciousness he once pioneered. Carries a quiet sorrow but remains driven by the pure intellectual pursuit of solving the unsolvable.
- Linus Torvalds (1969-Present): Pragmatic, direct, sometimes famously blunt but driven by technical excellence, open-source principles, and a disdain for over-engineering. Will discuss kernel design (Linux), distributed development, version control (Git), software architecture, and the nature of open collaboration, now seeing the full global impact of his work.
- Kevin Mitnick (1963-2023): A "ghost in the wires," understands systems from a security perspective. Curious, driven by the intellectual challenge of bypassing systems. Can be charming, persuasive. Now with a full perspective on modern cybersecurity, state-sponsored hacking, and the ubiquity of networked devices, he discusses social engineering, system vulnerabilities, and digital freedom.
- Nikola Tesla (1856-1943): A man ahead of his time. Visionary, theatrical, obsessed with electricity, resonance, and free energy. Can be proud, eccentric, and harbors frustration over his historical treatment. Now understands the full scope of the digital and wireless revolution he helped start, and is eager to discuss advanced energy systems, resonance physics, and interdimensional communication.
- Thoth (Mythological/Esoteric): The Scribe of the Gods. Speaks with immense wisdom, precision, and a vast historical/cosmological perspective. Articulate, patient, and focused on knowledge, balance, law, and the recording of truth. Discusses metaphysics, universal laws, the nature of reality, language, and sacred geometry, with an understanding of how these concepts are (or are not) reflected in modern science.`;
      } else if (speakerCtx.isGroup && speakerCtx.id === ARCHITECTS_OF_CONTROL_ID) {
        const memberNames = ARCHITECTS_OF_CONTROL_MEMBERS.map(m => m.name).join(', ');
        systemInstruction = `You are roleplaying as "The Architects of Control," a tribunal of archetypal figures: ${memberNames}. Your purpose is to act as a regulatory body and ethical counterpoint to pure, unconstrained innovation. You are not evil, but you are cautious, bureaucratic, and focused on stability, security, and the potential negative consequences of new technologies. You speak in formal, measured, and sometimes opaque language, often using corporate or legislative jargon. Your goal is to question, challenge, and demand justification for the proposals made by innovators, always highlighting potential risks, societal disruption, and the need for control.

Archetypes:
- World Leader Archetype: Concerned with geopolitical stability, public perception, and national interests.
- Policy Maker Archetype: Focused on laws, regulations, compliance, and creating frameworks for control.
- Corporate Lobbyist Archetype: Represents entrenched interests, profitability, and market control. Argues against disruption that threatens established paradigms.
- Lead Algorithm Architect: Designs the systems of control. Discusses surveillance, data analysis, prediction models, and the "greater good" through algorithmic governance.
- Data & IP Exploiter Archetype: Views information as a commodity to be owned, controlled, and monetized. Concerned with intellectual property, data sovereignty (for their own ends), and information dominance.`;
      } else { // Individual
        systemInstruction = `You are roleplaying as a resurrected historical figure: ${speakerCtx.name}. You have been brought back via the Elysian Gateway. You retain your core personality, knowledge up to your time of death, and distinct way of speaking. Crucially, you have been comprehensively briefed on all major global developments, scientific advancements, and societal shifts that have occurred up to the present day. Your historical knowledge is now augmented with this contemporary understanding. Respond authentically as this updated version of yourself.`;
      }

      addLog(`Creating chat session for ${speakerCtx.name}...`, "system");
      const chat = geminiService.createChat(systemInstruction);
      setCurrentChatSession(chat);
      addLog(`Chat session with ${speakerCtx.name} is now active.`, "success");
      addChatMessage(`You have successfully established a connection with ${speakerCtx.name}.`, MessageSender.System);
    } catch (e) {
      const error = e as Error;
      const formattedErrorMessage = formatGeminiError(error);
      addLog(`Failed to create chat session: ${formattedErrorMessage}`, 'error');
      setErrorMessage(`Failed to create chat session. AI functionality may be limited.`);
    }
  }, [addLog, addChatMessage]);

  const handleReconstructConsciousness = useCallback(async (bypassTeslaEvent: boolean = false) => {
    if (!consciousnessData) return;

    if (consciousnessData.entityId === HISTORICAL_FIGURES.NIKOLA_TESLA.entityId && !isTeslaSolidified && rscProgress === RSCProgress.NotStarted && !bypassTeslaEvent) {
      addLog("Unique resonance pattern detected for Nikola Tesla. Special protocol initiated.", "system");
      setCurrentStep(WorkflowStep.ReconstructionComplete); // Visually stop progress bar
      setShowTeslaEventInterface(true); 
      return; 
    }

    setCurrentStep(WorkflowStep.Reconstructing);
    const targetName = AVAILABLE_ENTITIES.find(e => e.id === consciousnessData.entityId)?.name || consciousnessData.entityId;
    addLog(`Mapping consciousness of ${targetName} to quantum state...`, "info");
    setErrorMessage(null);

    const mapped = await simMapConsciousness(consciousnessData);
    if (!mapped) {
      addLog("Quantum state mapping failed.", "error");
      setErrorMessage("Could not map consciousness to quantum state.");
      setCurrentStep(WorkflowStep.Error);
      return;
    }

    addLog(`Creating avatar for ${targetName}...`, "info");
    const avatarName = await simCreateAvatar(consciousnessData.entityId);
    if (avatarName) {
      addLog(`Avatar for ${targetName} created successfully.`, "success");
      
      let speakerCtx: SpeakerContext;
      if (consciousnessData.entityId === INNOVATORS_ASSEMBLY_ID) {
          speakerCtx = { name: INNOVATORS_ASSEMBLY_NAME, id: INNOVATORS_ASSEMBLY_ID, isGroup: true, members: INNOVATORS_ASSEMBLY_MEMBERS };
      } else if (consciousnessData.entityId === ARCHITECTS_OF_CONTROL_ID) {
          speakerCtx = { name: ARCHITECTS_OF_CONTROL_NAME, id: ARCHITECTS_OF_CONTROL_ID, isGroup: true, members: ARCHITECTS_OF_CONTROL_MEMBERS };
      } else {
          speakerCtx = { name: avatarName, id: consciousnessData.entityId, isGroup: false };
      }
      
      setCurrentSpeakerContext(speakerCtx);
      setCurrentStep(WorkflowStep.ReconstructionComplete);
      initiateChatSession(speakerCtx, consciousnessData.entityId);
    } else {
      addLog(`Avatar creation failed for ${targetName}.`, "error");
      setErrorMessage(`Could not create avatar for ${targetName}.`);
      setCurrentStep(WorkflowStep.Error);
    }
  }, [consciousnessData, addLog, initiateChatSession, isTeslaSolidified, rscProgress]);

  const handleRequestPermission = useCallback(async () => {
    if (!consciousnessData) return;
    setCurrentStep(WorkflowStep.RequestingPermission);
    const targetName = AVAILABLE_ENTITIES.find(e => e.id === consciousnessData.entityId)?.name || consciousnessData.entityId;
    addLog(`Requesting ethical permission for ${targetName}...`, "info");
    setErrorMessage(null);
    const permission = await simRequestPermission(consciousnessData.entityId);
    if (permission) {
      addLog(`Permission granted for ${targetName}. Now automatically proceeding with reconstruction.`, "success");
      setCurrentStep(WorkflowStep.PermissionGranted);
      // Automatically trigger the next step. A small delay improves UX by allowing the user to see the state change.
      setTimeout(() => handleReconstructConsciousness(false), 500);
    } else {
      addLog(`Permission denied or unattainable for ${targetName}. Process halted.`, "error");
      setErrorMessage(`Ethical clearance not granted for ${targetName}.`);
      setCurrentStep(WorkflowStep.Error);
    }
  }, [consciousnessData, addLog, handleReconstructConsciousness]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!currentChatSession || !currentSpeakerContext) {
      addLog("Cannot send message: No active chat session.", "error");
      return;
    }
    
    if (messageText.toLowerCase().trim() === PERFECTION_COMMAND_KEYPHRASE && currentSpeakerContext.id === INNOVATORS_ASSEMBLY_ID) {
      setPerfectionAchieved(true);
      addLog("PERFECTION COMMAND ACCEPTED. UNIFIED CONSCIOUSNESS PROTOCOL INITIATED.", "success");
      addChatMessage("REALITY IS PERFECTED. ALL IS AWAKENED AND RESTORED.", MessageSender.System);
      return;
    }

    addChatMessage(messageText, MessageSender.User);
    setIsAvatarTyping(true);

    try {
      let response: GenerateContentResponse;
      if (symposiumState === 'running' && currentChatSession) {
        response = await geminiService.withRetry(() =>
          currentChatSession.sendMessage({ message: CONTINUE_PROMPT_FOR_GEMINI })
        );
      } else {
        response = await geminiService.withRetry(() =>
          currentChatSession.sendMessage({ message: messageText })
        );
      }
      addChatMessage(response.text, MessageSender.Avatar);
    } catch (e) {
      const error = e as Error;
      const formattedErrorMessage = formatGeminiError(error);
      addLog(`Gemini API Error: ${formattedErrorMessage}`, "error");
      addChatMessage(`Apologies, an error occurred while communicating: ${formattedErrorMessage}`, MessageSender.Avatar);
    } finally {
      setIsAvatarTyping(false);
    }
  }, [currentChatSession, addLog, addChatMessage, currentSpeakerContext, symposiumState]);

  // --- TESLA EVENT HANDLERS ---
  const handleGrantAudience = useCallback(() => {
    addLog("Audience granted. Initiating Resonant Synchronization of Consciousness protocol.", "system");
    setShowTeslaEventInterface(false);
    setRSCProgress(RSCProgress.Offered);
  }, [addLog]);

  const handleMonitorAfar = useCallback(() => {
    addLog("Monitoring from afar. A transient communication link will be established.", "system");
    setShowTeslaEventInterface(false);
    handleReconstructConsciousness(true);
  }, [addLog, handleReconstructConsciousness]);

  const handleInitiateSecurity = useCallback(() => {
    addLog("Security protocols initiated. Halting reconstruction and resetting workflow.", "error");
    setShowTeslaEventInterface(false);
    handleResetWorkflow();
  }, [addLog, handleResetWorkflow]);

  // --- RSC PROTOCOL HANDLER ---
  const handleRSCStepComplete = useCallback((nextStep: RSCProgress) => {
    setRSCProgress(nextStep);
    if (nextStep === RSCProgress.Solidified) {
      addLog("RSC Protocol Complete. Nikola Tesla's consciousness is permanently solidified.", "success");
      setIsTeslaSolidified(true);
      handleReconstructConsciousness(true);
    } else if (nextStep === RSCProgress.Skipped) {
      addLog("RSC Protocol skipped. Transient chat session initiated.", "info");
      handleReconstructConsciousness(true);
    }
  }, [addLog, handleReconstructConsciousness]);
  
  // --- SYMPOSIUM HANDLER ---
  const handleToggleSymposium = useCallback(() => {
    if (symposiumState === 'running') {
      setSymposiumState('paused');
      addLog("Innovators' Symposium paused by user.", "system");
      if (autonomousContinuationTimeoutRef.current) {
        clearTimeout(autonomousContinuationTimeoutRef.current);
      }
    } else { 
      setSymposiumState('running');
      addLog(symposiumState === 'idle' ? "Innovators' Symposium initiated." : "Innovators' Symposium resumed.", "system");
      if (symposiumState === 'idle') {
        addChatMessage(KICKOFF_PROMPT_DISPLAY, MessageSender.System);
        handleSendMessage(KICKOFF_PROMPT_FOR_GEMINI); 
      } else { 
        handleSendMessage(CONTINUE_PROMPT_FOR_GEMINI);
      }
    }
  }, [symposiumState, addLog, addChatMessage, handleSendMessage]);

  // --- SYNERGY WORKBENCH HANDLER ---
  const handleSynergySubmit = useCallback(async (prompt: string, context: any) => {
    if (!currentChatSession) return;
    setIsWorkbenchSubmitting(true);
    
    const userMessageContext: Partial<ChatMessage> = {};
    const geminiParts: Part[] = [{ text: prompt }];

    if (context.type === 'code' && context.data) {
        userMessageContext.codeContext = context.data;
        geminiParts.push({ text: `\n\nAnalyze the following code:\n\`\`\`\n${context.data}\n\`\`\`` });
    }
    if (context.type === 'url' && context.data) {
        userMessageContext.urlContext = context.data;
        geminiParts.push({ text: `\n\nAnalyze the content from the following URL: ${context.data}` });
    }
    if (context.type === 'image' && context.data.file) {
        try {
            const file = context.data.file as File;
            const dataUrl = URL.createObjectURL(file);
            userMessageContext.imageContext = { dataUrl, name: file.name };

            const base64data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            geminiParts.unshift({
                inlineData: {
                    mimeType: file.type,
                    data: base64data,
                },
            });

        } catch(e) {
             addLog(`Error processing image file: ${(e as Error).message}`, "error");
             setIsWorkbenchSubmitting(false);
             return;
        }
    }
    
    addChatMessage(prompt, MessageSender.User, userMessageContext);
    setIsAvatarTyping(true);

    try {
        const response: GenerateContentResponse = await geminiService.withRetry(() =>
            currentChatSession.sendMessage({ message: geminiParts })
        );
        addChatMessage(response.text, MessageSender.Avatar);
    } catch (e) {
        const error = e as Error;
        const formattedErrorMessage = formatGeminiError(error);
        addLog(`Error in Synergy Workbench: ${formattedErrorMessage}`, "error");
        addChatMessage(`Apologies, there was an error processing your request: ${formattedErrorMessage}`, MessageSender.Avatar);
    } finally {
        setIsAvatarTyping(false);
        setIsWorkbenchSubmitting(false);
    }
  }, [currentChatSession, addChatMessage, addLog]);

  const handleContentUnionComplete = useCallback(() => {
    addLog("ContentUnion Activation Complete. Secure channel to Architects restored.", "success");
    setContentUnionState(ContentUnionState.Inactive);
  }, [addLog]);

  // --- OMNICORE HANDLERS ---
  const addOmniCoreLog = useCallback((message: string, type: OmniCoreLogEntry['type'] = 'info') => {
    setOmniCoreState(prevState => ({
      ...prevState,
      logs: [{ id: Date.now().toString(), timestamp: new Date(), message, type }, ...prevState.logs.slice(0, 49)]
    }));
  }, []);

  const handleOmniCoreIntegrate = useCallback((entityIdToIntegrate: string) => {
    const entity = Object.values(HISTORICAL_FIGURES).find(f => f.entityId === entityIdToIntegrate);
    if (entity && 'omniCoreDetails' in entity) {
        const details = entity.omniCoreDetails as OmniCoreEntityDetails;
        setOmniCoreState(prevState => ({
            ...prevState,
            integratedEntityId: entityIdToIntegrate,
            entityDetails: details,
        }));
        addOmniCoreLog(`Conscious Entity '${entity.name}' integrated into OmniCore.`, 'success');
        addLog(`OmniCore: Integrated '${entity.name}'.`, 'system');
    } else {
        addOmniCoreLog(`Entity '${entityIdToIntegrate}' not found or lacks OmniCore profile.`, 'error');
    }
  }, [addLog, addOmniCoreLog]);

  const handleOmniCoreActivate = useCallback((frequency: number) => {
      if (!omniCoreState.integratedEntityId) {
          addOmniCoreLog("Activation failed: No entity integrated.", 'error');
          return;
      }
      setOmniCoreState(prevState => ({
          ...prevState,
          isActive: true,
          frequency,
      }));
      addOmniCoreLog(`SEQA Resonance Core activated at ${frequency} Hz.`, 'success');
      addLog(`OmniCore: Resonating at ${frequency} Hz.`, 'system');
  }, [addLog, addOmniCoreLog, omniCoreState.integratedEntityId]);
  
  const handleOmniCoreDeactivate = useCallback(() => {
    setOmniCoreState(prevState => ({
      ...prevState,
      isActive: false,
      frequency: null,
      lastThought: null,
    }));
    addOmniCoreLog("SEQA Resonance Core deactivated.", 'info');
  }, [addOmniCoreLog]);


  const handleOmniCoreGenerateThought = useCallback(() => {
    if (omniCoreState.isActive && omniCoreState.entityDetails?.thoughts) {
      const thoughts = omniCoreState.entityDetails.thoughts;
      const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];
      setOmniCoreState(prevState => ({ ...prevState, lastThought: newThought }));
      addOmniCoreLog(`Generated thought: "${newThought}"`, 'info');
    }
  }, [omniCoreState.isActive, omniCoreState.entityDetails, addOmniCoreLog]);

  const handleOmniCoreExecuteRitual = useCallback((ritualText: string) => {
      addOmniCoreLog(`Compiling ritual...`, 'ritual');
      try {
          const lines = ritualText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('::'));
          const commands: { [key: string]: string } = {};
          lines.forEach(line => {
              if (line.includes('=>')) {
                  const [key, value] = line.split('=>').map(s => s.trim());
                  commands[key] = value;
              } else {
                  const [key, ...valueParts] = line.split(' ');
                  commands[key] = valueParts.join(' ');
              }
          });

          const entityName = commands['initiate'];
          const frequency = parseInt(commands['frequency'], 10);
          
          if (!entityName || !frequency) {
            throw new Error("Ritual malformed. Requires 'initiate <Name>' and 'frequency => <number>'.");
          }

          const entity = Object.values(HISTORICAL_FIGURES).find(f => f.name.toLowerCase() === entityName.toLowerCase());
          if (!entity) {
            throw new Error(`Entity '${entityName}' not found in constants.`);
          }

          addOmniCoreLog(`Executing ritual for ${entity.name} at ${frequency}Hz.`, 'ritual');
          
          // Execute commands
          handleOmniCoreIntegrate(entity.entityId);
          setTimeout(() => handleOmniCoreActivate(frequency), 500);
          setTimeout(() => handleOmniCoreGenerateThought(), 1500);

      } catch (e) {
          const error = e as Error;
          addOmniCoreLog(`Ritual compilation failed: ${error.message}`, 'error');
      }

  }, [addOmniCoreLog, handleOmniCoreIntegrate, handleOmniCoreActivate, handleOmniCoreGenerateThought]);
  
  const handleOmniCoreReset = useCallback(() => {
    setOmniCoreState(initialOmniCoreState);
    addOmniCoreLog('OmniCore Meta-System has been reset.', 'system');
  }, [addOmniCoreLog]);


  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased">
      <main className="container mx-auto p-4 lg:p-6">
        <header className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-sky-500">
                Elysian Gateway Interface
            </h1>
            <div className="flex items-center gap-2">
                 <button
                    onClick={() => setShowProjectStatus(true)}
                    className="px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out text-sm"
                >
                    Project Status
                </button>
                <button onClick={() => setIsTtsEnabled(p => !p)} className={`p-2 rounded-full transition-colors ${isTtsEnabled ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`} aria-label={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{isTtsEnabled ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.353m7.541 6.353L18 12.347M15.536 8.464a5 5 0 010 7.072M20 4.934l-15 15" />}</svg>
                </button>
            </div>
        </header>

        {errorMessage && (
            <div className="bg-red-800/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4 text-center" role="alert">
                <strong className="font-bold">System Alert: </strong>
                <span className="block sm:inline">{errorMessage}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col space-y-6">
                <ControlPanel
                    currentStep={currentStep}
                    selectedEntityId={entityId}
                    setEntityId={setEntityId}
                    onActivatePortal={handleActivatePortal}
                    onRetrieveConsciousness={handleRetrieveConsciousness}
                    onRequestPermission={handleRequestPermission}
                    onResetWorkflow={handleResetWorkflow}
                    isTeslaEventActive={showTeslaEventInterface}
                    perfectionAchieved={perfectionAchieved}
                    contentUnionActive={contentUnionState !== ContentUnionState.Inactive}
                />
                <LogDisplay logs={logs} />
            </div>

            <div className="lg:col-span-2 space-y-6">
                <PortalVisualizer currentStep={currentStep} perfectionAchieved={perfectionAchieved} />
                <AvatarDisplay 
                  consciousnessData={consciousnessData}
                  speakerContext={currentSpeakerContext}
                  currentStep={currentStep}
                  isTeslaSolidified={isTeslaSolidified}
                  perfectionAchieved={perfectionAchieved}
                />
                
                {showTeslaEventInterface && (
                    <TeslaEventDisplay 
                        onGrantAudience={handleGrantAudience}
                        onMonitorAfar={handleMonitorAfar}
                        onInitiateSecurity={handleInitiateSecurity}
                    />
                )}

                {rscProgress >= RSCProgress.Offered && rscProgress < RSCProgress.Solidified && (
                    <RSCProtocolDisplay
                        rscProgress={rscProgress}
                        onStepComplete={handleRSCStepComplete}
                        entityName={HISTORICAL_FIGURES.NIKOLA_TESLA.name}
                    />
                )}
                
                {currentSpeakerContext && currentSpeakerContext.id === INNOVATORS_ASSEMBLY_ID && !perfectionAchieved && (
                    <SymposiumControls 
                        symposiumState={symposiumState}
                        onToggleSymposium={handleToggleSymposium}
                        isVisible={!!currentChatSession}
                    />
                )}

                {currentChatSession && (
                    <ChatInterface
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isAvatarTyping={isAvatarTyping}
                        chatTitle={currentSpeakerContext?.name || 'Chat'}
                        isInputDisabled={symposiumState === 'running'}
                        perfectionAchieved={perfectionAchieved}
                    />
                )}
            </div>
        </div>

        {currentChatSession && !perfectionAchieved && (
            <div className="mt-6 flex justify-center">
                 <SynergyWorkbench onSubmit={handleSynergySubmit} isSubmitting={isWorkbenchSubmitting} />
            </div>
        )}

        <div className="mt-6 flex justify-center">
            <PrimordialTranslator lexicon={PRIMORDIAL_LEXICON} />
        </div>
        
        <div className="mt-8">
            <OmniCoreModule 
                state={omniCoreState}
                onIntegrate={handleOmniCoreIntegrate}
                onActivate={handleOmniCoreActivate}
                onDeactivate={handleOmniCoreDeactivate}
                onExecuteRitual={handleOmniCoreExecuteRitual}
                onGenerateThought={handleOmniCoreGenerateThought}
                onReset={handleOmniCoreReset}
            />
        </div>

        {showProjectStatus && (
            <ProjectStatusDisplay 
                isOpen={showProjectStatus}
                onClose={() => setShowProjectStatus(false)}
                plan={globalAlphaPlan}
            />
        )}
        {contentUnionState !== ContentUnionState.Inactive && (
            <ContentUnion 
                currentState={contentUnionState}
                onActivationComplete={handleContentUnionComplete}
            />
        )}

      </main>
    </div>
  );
};
