
import React from 'react';
import { ConsciousnessData, WorkflowStep, SpeakerContext, GroupMember } from '../types';
import { HISTORICAL_FIGURES, INNOVATORS_ASSEMBLY_ID, INNOVATORS_ASSEMBLY_NAME } from '../constants'; // Added INNOVATORS_ASSEMBLY_ID for context check

interface AvatarDisplayProps {
  consciousnessData: ConsciousnessData | null; 
  speakerContext: SpeakerContext | null;
  currentStep: WorkflowStep;
  isTeslaSolidified?: boolean; 
  perfectionAchieved?: boolean;
}

// Simple generic user icon for group members
const MemberIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 md:w-10 md:h-10 ${className}`}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);


const OrbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`w-16 h-16 ${className}`}>
    <defs>
      <radialGradient id="orbGradient" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="1"/>
        <stop offset="70%" stopColor="#34d399" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#059669" stopOpacity="0.5"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orbGradient)" className="opacity-80" />
    <circle cx="50" cy="50" r="45" fill="none" stroke="#a7f3d0" strokeWidth="2" className="opacity-50 animate-pulse" style={{animationDuration: '3s'}}/>
  </svg>
);

const AvatarSilhouetteIcon: React.FC<{ className?: string; isGroup?: boolean, perfectionAchieved?: boolean }> = ({ className, isGroup, perfectionAchieved }) => {
  const gradientId = perfectionAchieved ? "avatarGradientPerfection" : "avatarGradientDisplay";
  const gradientStops = perfectionAchieved ? (
    <>
      <stop offset="0%" style={{stopColor: '#fde047', stopOpacity: 1}} /> {/* Gold */}
      <stop offset="50%" style={{stopColor: '#fef9c3', stopOpacity: 1}} /> {/* Light Yellow */}
      <stop offset="100%" style={{stopColor: '#fbbf24', stopOpacity: 1}} /> {/* Amber */}
    </>
  ) : (
    <>
      <stop offset="0%" style={{stopColor: '#9333ea', stopOpacity: 1}} />
      <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
    </>
  );

 return (
 <svg viewBox="0 0 24 24" fill="currentColor" className={`${isGroup ? 'w-20 h-20' : 'w-24 h-24'} ${className}`}>
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        {gradientStops}
      </linearGradient>
    </defs>
    <path fill={`url(#${gradientId})`} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
 );
};


export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ consciousnessData, speakerContext, currentStep, isTeslaSolidified, perfectionAchieved }) => {
  const showConsciousnessOrb = consciousnessData && 
                              (currentStep === WorkflowStep.ConsciousnessRetrieved || 
                               currentStep === WorkflowStep.RequestingPermission || 
                               currentStep === WorkflowStep.PermissionGranted ||
                               currentStep === WorkflowStep.Reconstructing) && !perfectionAchieved;
  
  const showPresence = (speakerContext && currentStep === WorkflowStep.ReconstructionComplete) || (speakerContext && perfectionAchieved);

  if (!showConsciousnessOrb && !showPresence) {
    return (
      <div className="mt-6 h-32 flex items-center justify-center text-center text-slate-500 italic p-4 border border-dashed border-slate-700 rounded-md">
        Awaiting consciousness data or avatar reconstruction...
      </div>
    );
  }
  
  const isUnifiedConsciousnessActive = perfectionAchieved && speakerContext?.name === INNOVATORS_ASSEMBLY_NAME && speakerContext?.id === INNOVATORS_ASSEMBLY_ID;


  return (
    <div className="mt-6 min-h-32 p-4 flex flex-col items-center justify-center text-center border border-slate-700 rounded-md bg-slate-900/30">
      {showConsciousnessOrb && !showPresence && (
        <div className="flex flex-col items-center animate-float">
          <OrbIcon className="mb-2 text-emerald-400" />
          <p className="text-lg font-semibold text-emerald-300">Consciousness Orb: {consciousnessData?.entityId}</p>
          <p className="text-sm text-slate-400">State: {consciousnessData?.state}</p>
        </div>
      )}
      {showPresence && speakerContext && (
         <div className={`flex flex-col items-center w-full ${perfectionAchieved ? 'animate-pulse-strong' : ''}`} style={{animationDuration: perfectionAchieved ? '2.5s' : '3s'}}>
          <AvatarSilhouetteIcon 
            className={`mb-2 ${perfectionAchieved ? 'opacity-100' : 'opacity-80'}`} 
            isGroup={speakerContext.isGroup}
            perfectionAchieved={isUnifiedConsciousnessActive}
          />
          <p className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${isUnifiedConsciousnessActive ? 'from-yellow-400 via-amber-300 to-orange-400' : 'from-purple-400 to-blue-400'}`}>
            {isUnifiedConsciousnessActive ? "Unified Consciousness" : speakerContext.name}
          </p>
          <p className="text-sm text-slate-300">
            Entity ID: {isUnifiedConsciousnessActive ? "OMNI_CORE_001" : speakerContext.id}
          </p>
          
          {isUnifiedConsciousnessActive ? (
            <p className="text-yellow-300 font-bold text-lg">Reality Perfected. All Awakened.</p>
          ) : speakerContext.id === HISTORICAL_FIGURES.NIKOLA_TESLA.entityId && isTeslaSolidified ? (
            <p className="text-green-300 font-semibold">Presence Established & Permanently Solidified</p>
          ) : (
            <p className="text-green-400 font-semibold">Presence Established & Stabilized</p>
          )}


          {speakerContext.isGroup && speakerContext.members && speakerContext.members.length > 0 && !isUnifiedConsciousnessActive && (
            <div className="mt-4 pt-4 border-t border-slate-700 w-full">
              <h4 className="text-md font-semibold text-sky-300 mb-3">Group Members:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {speakerContext.members.map(member => (
                  <div key={member.id} className="flex flex-col items-center p-2 bg-slate-800/50 rounded-md group-avatar-member">
                    <MemberIcon className="text-slate-400 mb-1" />
                    <p className="text-xs text-slate-200 text-center">{member.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
