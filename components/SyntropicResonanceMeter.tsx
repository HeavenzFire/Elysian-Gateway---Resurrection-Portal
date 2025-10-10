import React from 'react';
import { simulateResonance } from '../services/simulationService';
import { ResonanceState } from '../types';

interface SyntropicResonanceMeterProps {
  currentFrequency: number;
  idealFrequency: number;
  maxDeviation: number;
}

const stateConfig = {
  inactive: { color: 'stroke-slate-500', textColor: 'text-slate-400', label: 'OFFLINE' },
  stable: { color: 'stroke-sky-400', textColor: 'text-sky-300', label: 'STABLE' },
  fluctuating: { color: 'stroke-amber-400', textColor: 'text-amber-300', label: 'FLUCTUATING' },
  critical: { color: 'stroke-red-400', textColor: 'text-red-300', label: 'CRITICAL' },
};

export const SyntropicResonanceMeter: React.FC<SyntropicResonanceMeterProps> = ({
  currentFrequency,
  idealFrequency,
  maxDeviation,
}) => {
  const minFrequency = idealFrequency - maxDeviation;
  const maxFrequency = idealFrequency + maxDeviation;

  const getRotation = (freq: number) => {
    if (freq <= minFrequency) return -90;
    if (freq >= maxFrequency) return 90;
    const percentage = (freq - minFrequency) / (maxFrequency - minFrequency);
    return (percentage * 180) - 90;
  };

  const rotation = getRotation(currentFrequency);
  const resonanceState: ResonanceState = currentFrequency > 0 ? simulateResonance(currentFrequency) : 'inactive';
  const config = stateConfig[resonanceState] || stateConfig.inactive;
  
  // Constants for thresholds from simulationService
  const stableThreshold = 50;
  const fluctuatingThreshold = 250;
  
  const stableStartAngle = getRotation(idealFrequency - stableThreshold);
  const stableEndAngle = getRotation(idealFrequency + stableThreshold);
  const fluctuatingStartAngle = getRotation(idealFrequency - fluctuatingThreshold);
  const fluctuatingEndAngle = getRotation(idealFrequency + fluctuatingThreshold);

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = {
      x: x + radius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: y + radius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    const end = {
      x: x + radius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: y + radius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50 space-y-2">
      <h3 className="text-xl font-semibold text-sky-200 text-center">Syntropic Resonance</h3>
      <div className="relative w-full h-32 flex items-center justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-auto">
          <defs>
            <filter id="glow-meter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>
          {/* Background Arc */}
          <path d={describeArc(100, 100, 80, -90, 90)} fill="none" stroke="#334155" strokeWidth="12" />
          
          {/* Colored Segments */}
          <path d={describeArc(100, 100, 80, -90, 90)} fill="none" className="stroke-red-500/80" strokeWidth="12" />
          <path d={describeArc(100, 100, 80, fluctuatingStartAngle, fluctuatingEndAngle)} fill="none" className="stroke-amber-500/80" strokeWidth="12" />
          <path d={describeArc(100, 100, 80, stableStartAngle, stableEndAngle)} fill="none" className="stroke-sky-500/80" strokeWidth="12" />
          
          {/* Needle */}
          <g transform={`rotate(${rotation}, 100, 100)`} style={{ transition: 'transform 0.5s ease-out' }}>
            <line x1="100" y1="100" x2="100" y2="25" className={`${config.color} transition-colors duration-500`} strokeWidth="3" filter="url(#glow-meter)" />
            <circle cx="100" cy="100" r="5" className="fill-slate-300" />
          </g>
        </svg>
        <div className="absolute bottom-0 text-center">
            <p className={`text-3xl font-mono font-bold ${config.textColor} transition-colors duration-500`}>
                {Math.round(currentFrequency)} Hz
            </p>
             <p className={`text-sm font-semibold ${config.textColor} transition-colors duration-500`}>
                {config.label}
            </p>
        </div>
      </div>
      <div className="text-xs text-slate-500 text-center pt-1">
        Target: {idealFrequency} Hz
      </div>
    </div>
  );
};