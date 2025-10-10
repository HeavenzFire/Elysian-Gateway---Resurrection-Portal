import React, { useEffect, useState, useRef } from 'react';
import { ResonanceState } from '../types';

interface PortalVisualizerProps {
  resonanceState: ResonanceState;
}

const inactiveClasses = {
  glow: 'bg-slate-500',
  ring1: 'border-slate-400/50 animate-spin-slow',
  ring2: 'border-slate-500/60 animate-spin-slow',
  core: 'bg-gradient-to-br from-slate-300 to-slate-500',
  text: 'text-slate-300',
  label: 'INACTIVE',
  wave: 'stroke-slate-400',
  glowOpacity: 'opacity-20',
};

const stableClasses = {
  glow: 'bg-sky-500',
  ring1: 'border-sky-400/50 animate-spin-slow',
  ring2: 'border-sky-500/60 animate-spin-slow',
  core: 'bg-gradient-to-br from-sky-300 to-sky-500 animate-pulse-stable',
  text: 'text-sky-300',
  label: 'STABLE',
  wave: 'stroke-sky-300',
  glowOpacity: 'opacity-80',
};

const fluctuatingClasses = {
  glow: 'bg-amber-500',
  ring1: 'border-amber-400/50 animate-spin-medium',
  ring2: 'border-amber-500/60 animate-spin-medium',
  core: 'bg-gradient-to-br from-amber-300 to-amber-500 animate-pulse-fluctuating',
  text: 'text-amber-300',
  label: 'FLUCTUATING',
  wave: 'stroke-amber-300',
  glowOpacity: 'opacity-60',
};

const criticalClasses = {
  glow: 'bg-red-500',
  ring1: 'border-red-400/50 animate-spin-fast',
  ring2: 'border-red-500/60 animate-spin-fast',
  core: 'bg-gradient-to-br from-red-300 to-red-500 animate-pulse-critical animate-glitch',
  text: 'text-red-300',
  label: 'CRITICAL',
  wave: 'stroke-red-300',
  glowOpacity: 'opacity-30',
};

const stateConfig = {
  inactive: inactiveClasses,
  stable: stableClasses,
  fluctuating: fluctuatingClasses,
  critical: criticalClasses,
};

export const PortalVisualizer: React.FC<PortalVisualizerProps> = ({ resonanceState }) => {
  const config = stateConfig[resonanceState] || stateConfig.inactive;
  const [isArModeActive, setIsArModeActive] = useState(false);
  const [arError, setArError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!('vibrate' in navigator)) {
      return;
    }

    try {
      switch (resonanceState) {
        case 'stable':
          navigator.vibrate(50); // Gentle pulse
          break;
        case 'fluctuating':
          navigator.vibrate(100); // Brief buzz
          break;
        case 'critical':
          navigator.vibrate(200); // Short, sharp vibration
          break;
        case 'inactive':
           navigator.vibrate(0); // Stop any ongoing vibration
           break;
        default:
          break;
      }
    } catch (error) {
        console.warn("Haptic feedback failed:", error);
    }
  }, [resonanceState]);

  const startArMode = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setArError("AR mode is not supported on this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      setIsArModeActive(true);
      setArError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setArError("Camera access denied. Please enable camera permissions for this site.");
      setIsArModeActive(false);
    }
  };

  const stopArMode = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsArModeActive(false);
  };

  const toggleArMode = () => {
    if (isArModeActive) {
      stopArMode();
    } else {
      startArMode();
    }
  };

  useEffect(() => {
    // Cleanup effect to stop the camera when the component unmounts
    return () => {
      stopArMode();
    };
  }, []);

  const ringBaseClasses = `absolute inset-0 border-2 rounded-full`;
  const coreBaseClasses = `absolute w-1/3 h-1/3 rounded-full transition-all duration-500 flex items-center justify-center`;

  return (
    <div 
      className={`relative w-full p-4 ${isArModeActive ? 'bg-transparent' : 'bg-slate-800/70'} rounded-xl shadow-lg border ${isArModeActive ? 'border-transparent' : 'border-slate-700/50'} space-y-4 transition-colors duration-500 overflow-hidden`}
      role="status"
      aria-live="polite"
      aria-label={`Connection Resonance State: ${config.label}`}
    >
      {isArModeActive && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          playsInline
          autoPlay
          muted
        ></video>
      )}
      <div className={`${isArModeActive ? 'bg-black/40 backdrop-blur-sm rounded-lg p-2' : ''}`}>
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-sky-200 text-center flex-1">Connection Resonance</h3>
            <button
              onClick={toggleArMode}
              className="p-2 rounded-full text-slate-300 hover:bg-slate-700 transition-colors"
              title={isArModeActive ? "Exit AR Mode" : "Enter AR Mode"}
              aria-label={isArModeActive ? "Exit Augmented Reality Mode" : "Enter Augmented Reality Mode"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>

        {arError && <p className="text-xs text-red-400 text-center mt-2">{arError}</p>}
      
        <div className="relative w-48 h-48 mx-auto mt-2">
          {/* Glow effect */}
          <div className={`absolute inset-0 ${config.glow} rounded-full blur-2xl ${config.glowOpacity} transition-all duration-500`}></div>
          
          {/* Rings */}
          <div className={`${ringBaseClasses} ${config.ring1}`} style={{ animationDirection: 'reverse' }}></div>
          <div className={`${ringBaseClasses} ${config.ring2} scale-75`}></div>
          <div className={`${ringBaseClasses} ${config.ring1} scale-50`}></div>

          {/* Core with Waveform */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${coreBaseClasses} ${config.core}`}>
              <svg viewBox="0 0 100 50" className="w-3/4 h-3/4 opacity-80" aria-hidden="true">
                  <path 
                      d="M 5,25 C 25,0 45,0 50,25 S 75,50 95,25" 
                      fill="none" 
                      strokeWidth="3"
                      className={`${config.wave} transition-colors duration-500`}
                      strokeLinecap="round"
                  />
              </svg>
            </div>
          </div>
        </div>
        <div className={`text-center text-2xl font-bold transition-colors duration-500 ${config.text}`}>
          {config.label}
        </div>
      </div>
    </div>
  );
};