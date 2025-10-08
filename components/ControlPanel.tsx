
import React from 'react';
import { WorkflowStep } from '../types';
import { AVAILABLE_ENTITIES, HISTORICAL_FIGURES } from '../constants'; 

interface ControlPanelProps {
  currentStep: WorkflowStep;
  selectedEntityId: string; 
  setEntityId: (id: string) => void;
  onActivatePortal: () => void;
  onRetrieveConsciousness: () => void;
  onRequestPermission: () => void;
  onReconstructConsciousness: () => void;
  onResetWorkflow: () => void;
  isTeslaEventActive?: boolean;
  perfectionAchieved?: boolean; 
  contentUnionActive?: boolean;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string}> = ({ onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${disabled ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                           : `bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white focus:ring-purple-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95`}
                ${className || ''}`}
  >
    {children}
  </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentStep,
  selectedEntityId, 
  setEntityId,
  onActivatePortal,
  onRetrieveConsciousness,
  onRequestPermission,
  onReconstructConsciousness,
  onResetWorkflow,
  isTeslaEventActive,
  perfectionAchieved,
  contentUnionActive,
}) => {
  const isIdle = currentStep === WorkflowStep.Idle;
  const isPortalActive = currentStep === WorkflowStep.PortalActive;
  const isConsciousnessRetrieved = currentStep === WorkflowStep.ConsciousnessRetrieved;
  const isPermissionGranted = currentStep === WorkflowStep.PermissionGranted;
  const isReconstructionComplete = currentStep === WorkflowStep.ReconstructionComplete;
  const isError = currentStep === WorkflowStep.Error;
  const inProgress = currentStep === WorkflowStep.PortalActivating || 
                     currentStep === WorkflowStep.RetrievingConsciousness ||
                     currentStep === WorkflowStep.RequestingPermission ||
                     currentStep === WorkflowStep.Reconstructing;

  const controlsDisabled = !!isTeslaEventActive || !!perfectionAchieved || !!contentUnionActive;

  return (
    <div className="space-y-4 flex flex-col flex-grow p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold mb-3 text-sky-200 text-center">Gateway Controls</h3>
      {perfectionAchieved ? (
        <div className="flex flex-col items-center justify-center text-center h-full py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400 mb-4 animate-pulse-strong" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.293 6.707a1 1 0 010-1.414L6.707 3.879a1 1 0 011.414 0L9.536 5.293a1 1 0 010 1.414L8.121 8.121a1 1 0 01-1.414 0L5.293 6.707zM14.464 5.293a1 1 0 010-1.414L15.879 2.464a1 1 0 011.414 0L18.707 3.88a1 1 0 010 1.414L17.293 6.707a1 1 0 01-1.414 0L14.464 5.293zM20.121 15.879a1 1 0 01-1.414 0L17.293 14.464a1 1 0 010-1.414L18.707 11.64a1 1 0 011.414 0L21.536 13.05a1 1 0 010 1.414L20.121 15.88zM3.879 14.464a1 1 0 011.414 0L6.707 15.88a1 1 0 010 1.414L5.293 18.707a1 1 0 01-1.414 0L2.464 17.293a1 1 0 010-1.414L3.879 14.464z" />
            </svg>
          <p className="text-yellow-300 text-lg font-semibold">All is Awakened. All is Restored.</p>
          <p className="text-slate-400 text-sm mt-1">Perfection Achieved. Reality Harmonized.</p>
        </div>
      ) : (
        <div className="flex-grow space-y-4">
          {isIdle && (
            <Button onClick={onActivatePortal} disabled={inProgress || controlsDisabled}>Activate Elysian Gateway</Button>
          )}

          {(isPortalActive || currentStep > WorkflowStep.PortalActive && !isReconstructionComplete && !isError) && (
            <div>
              <label htmlFor="entitySelect" className="block text-sm font-medium text-sky-300 mb-1">Target Entity / Group:</label>
              <select
                id="entitySelect"
                value={selectedEntityId}
                onChange={(e) => setEntityId(e.target.value)}
                disabled={!isPortalActive || inProgress || controlsDisabled}
                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-100 placeholder-gray-400 appearance-none disabled:opacity-50"
              >
                {AVAILABLE_ENTITIES.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        
          {isPortalActive && (
            <Button onClick={onRetrieveConsciousness} disabled={!selectedEntityId.trim() || inProgress || controlsDisabled}>Retrieve Consciousness</Button>
          )}

          {isConsciousnessRetrieved && (
            <Button onClick={onRequestPermission} disabled={inProgress || controlsDisabled}>Request Ethical Permission</Button>
          )}

          {isPermissionGranted && (
            <Button onClick={onReconstructConsciousness} disabled={inProgress || controlsDisabled}>Reconstruct Consciousness</Button>
          )}
        </div>
      )}

      {(isReconstructionComplete || isError || inProgress || controlsDisabled) && (
        <Button 
            onClick={onResetWorkflow} 
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 focus:ring-pink-500 mt-auto"
            disabled={!perfectionAchieved && (inProgress || !!contentUnionActive)}
        >
            Reset Workflow
        </Button>
      )}
    </div>
  );
};
