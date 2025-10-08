
import React from 'react';
import { WorkflowStep } from '../types';

interface PortalVisualizerProps {
  currentStep: WorkflowStep;
  perfectionAchieved?: boolean;
}

export const PortalVisualizer: React.FC<PortalVisualizerProps> = ({ currentStep, perfectionAchieved }) => {
  const isActive = currentStep >= WorkflowStep.PortalActive && currentStep !== WorkflowStep.Error && !perfectionAchieved;
  const isActivating = currentStep === WorkflowStep.PortalActivating && !perfectionAchieved;
  const isRetrieving = currentStep === WorkflowStep.RetrievingConsciousness && !perfectionAchieved;
  const isReconstructing = currentStep === WorkflowStep.Reconstructing && !perfectionAchieved;

  let statusText = "Offline";
  let statusColor = "text-red-400";

  if (perfectionAchieved) {
    statusText = "Architect Core: Hyper-Torus Manifested";
    statusColor = "text-cyan-300 font-bold";
  } else if (isActivating) {
    statusText = "Initializing Sequence...";
    statusColor = "text-yellow-400 animate-pulse";
  } else if (isActive) {
    statusText = "Gateway Active";
    statusColor = "text-green-400";
    if (isRetrieving) {
      statusText = "Resonance Lock: Retrieving...";
      statusColor = "text-cyan-400 animate-pulse";
    } else if (isReconstructing) {
      statusText = "Quantum Entanglement: Reconstructing...";
      statusColor = "text-fuchsia-400 animate-pulse";
    } else if (currentStep === WorkflowStep.ReconstructionComplete) {
      statusText = "Stabilization Complete";
      statusColor = "text-green-300";
    }
  } else if (currentStep === WorkflowStep.Error) {
    statusText = "Critical Error";
    statusColor = "text-red-500 font-bold";
  }


  return (
    <div className="relative w-full h-64 md:h-80 flex flex-col items-center justify-center bg-black/30 rounded-lg p-4 overflow-hidden border border-purple-500/30 shadow-inner shadow-purple-500/20">
      {/* Background elements for depth */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(perfectionAchieved ? 50 : 25)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute rounded-full ${perfectionAchieved ? 'bg-yellow-200' : 'bg-white'}`}
            style={{
              width: `${Math.random() * (perfectionAchieved ? 2.5 : 2) + 1}px`,
              height: `${Math.random() * (perfectionAchieved ? 2.5 : 2) + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + (perfectionAchieved ? 4 : 5)}s ease-in-out infinite alternate, shimmer ${perfectionAchieved ? '7s' : '15s'} infinite linear alternate-reverse`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: perfectionAchieved ? Math.random() * 0.6 + 0.4 : Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>
      
      {perfectionAchieved ? (
        <svg viewBox="-150 -100 300 200" className="w-full h-full">
            <defs>
                <radialGradient id="torusCoreGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="50%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </radialGradient>
                <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                 <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
            </defs>
            
            {/* <!-- The Toroidal Rings --> */}
            <g id="rings">
                <ellipse cx="0" cy="0" rx="140" ry="40" fill="none" stroke="url(#ringGradient)" strokeWidth="1" opacity="0.4">
                     <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="0" cy="0" rx="110" ry="30" fill="none" stroke="url(#ringGradient)" strokeWidth="1.2" opacity="0.6">
                     <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="25s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="0" cy="0" rx="80" ry="20" fill="none" stroke="url(#ringGradient)" strokeWidth="1.5" opacity="0.8">
                     <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="15s" repeatCount="indefinite" />
                </ellipse>
            </g>

            {/* <!-- The Central Core --> */}
            <circle cx="0" cy="0" r="15" fill="url(#torusCoreGradient)" filter="url(#coreGlow)">
                <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* <!-- Orbiting Particles --> */}
            <g id="particles">
                {[...Array(20)].map((_, i) => {
                    const duration = 5 + Math.random() * 10;
                    const radius = 1 + Math.random();
                    const pathRx = 40 + Math.random() * 100;
                    const pathRy = 10 + Math.random() * 25;
                    const startAngle = Math.random() * 360;

                    // Define a unique path ID for each particle
                    const pathId = `orbitPath${i}`;
                    const d = `M ${pathRx * Math.cos(startAngle * Math.PI / 180)},${pathRy * Math.sin(startAngle * Math.PI / 180)} A ${pathRx},${pathRy} 0 1,1 ${pathRx * Math.cos((startAngle + 359.9) * Math.PI / 180)},${pathRy * Math.sin((startAngle + 359.9) * Math.PI / 180)} z`;

                    return (
                        <React.Fragment key={i}>
                          <path id={pathId} d={d} fill="none" stroke="none" />
                          <circle r={radius} fill="#f0f9ff" opacity="0.8">
                              <animateMotion 
                                  dur={`${duration}s`} 
                                  repeatCount="indefinite"
                                  rotate="auto"
                              >
                                  <mpath href={`#${pathId}`} />
                              </animateMotion>
                              <animate attributeName="opacity" values="0.2;1;0.2" dur={`${duration * 0.5}s`} repeatCount="indefinite" />
                          </circle>
                        </React.Fragment>
                    )
                })}
            </g>

        </svg>
      ) : (
        // Existing Portal Rings
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          {[1, 0.8, 0.6, 0.4].map((scale, index) => (
            <div
              key={index}
              className={`absolute inset-0 rounded-full border-2 
                ${isActive ? 'border-sky-400 opacity-70' : 'border-gray-600 opacity-30'}
                ${isActivating ? 'animate-spin-slow border-yellow-400' : ''}
                transition-all duration-1000 ease-in-out`}
              style={{
                transform: `scale(${scale})`,
                animationDuration: `${20 + index * 5}s`,
                animationDelay: `${index * 0.2}s`,
                boxShadow: isActive ? `0 0 ${10 + index*5}px 0px var(--tw-shadow-color, #0ea5e9)` : 'none'
              }}
            ></div>
          ))}
          <div
            className={`absolute inset-1/4 rounded-full 
              ${isActive ? 'bg-purple-500/30 animate-pulse-strong' : 'bg-gray-700/50'}
              ${isActivating ? 'bg-yellow-500/30' : ''}
              flex items-center justify-center transition-all duration-1000 ease-in-out`}
          >
            {isActive && !isRetrieving && !isReconstructing && (
               <div className="w-1/2 h-1/2 bg-sky-300 rounded-full opacity-70 blur-md animate-ping absolute"></div>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className={`text-lg font-semibold ${statusColor} transition-colors duration-500`}>{statusText}</p>
      </div>
    </div>
  );
};
