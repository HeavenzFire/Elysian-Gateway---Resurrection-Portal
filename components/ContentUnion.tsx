
import React, { useState, useEffect } from 'react';
import { ContentUnionState } from '../types';

interface ContentUnionProps {
  currentState: ContentUnionState;
  onActivationComplete: () => void;
}

const STAGE_CONFIG = {
  [ContentUnionState.Activating]: { duration: 1000, nextState: ContentUnionState.SecuringChannels, text: 'Initializing ContentUnion Module...' },
  [ContentUnionState.SecuringChannels]: { duration: 2500, nextState: ContentUnionState.AggregatingData, text: 'Securing Quantum Communication Channels...' },
  [ContentUnionState.AggregatingData]: { duration: 3000, nextState: ContentUnionState.SynchronizingNodes, text: 'Aggregating Distributed Data Streams...' },
  [ContentUnionState.SynchronizingNodes]: { duration: 2000, nextState: ContentUnionState.Online, text: 'Synchronizing Intelligence Nodes...' },
  [ContentUnionState.Online]: { duration: 0, nextState: ContentUnionState.Online, text: 'ContentUnion Network ONLINE. All Channels Secure.' },
};

export const ContentUnion: React.FC<ContentUnionProps> = ({ currentState, onActivationComplete }) => {
  const [internalState, setInternalState] = useState(ContentUnionState.Activating);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentState === ContentUnionState.Activating) {
      setInternalState(ContentUnionState.Activating);
    }
  }, [currentState]);

  useEffect(() => {
    if (internalState === ContentUnionState.Online) {
      onActivationComplete();
      return;
    }

    const config = STAGE_CONFIG[internalState];
    if (!config) return;

    setProgress(0); // Reset progress for the new stage

    const interval = setInterval(() => {
      setProgress(p => {
        const newProgress = p + (100 / (config.duration / 50));
        return Math.min(newProgress, 100);
      });
    }, 50);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setInternalState(config.nextState);
    }, config.duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [internalState, onActivationComplete]);
  
  const currentText = STAGE_CONFIG[internalState]?.text || 'Standby...';
  const isOnline = internalState === ContentUnionState.Online;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fadeIn"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-3xl border-2 border-cyan-500/50 bg-slate-900/70 shadow-2xl shadow-cyan-500/20 rounded-xl p-8 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 mb-4">
          ContentUnion Activation
        </h2>
        <p className="text-slate-300 mb-8">Resolving network bottleneck to re-establish secure communications.</p>
        
        <div className="w-full space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isOnline ? 'bg-green-500 animate-pulse-strong' : 'bg-cyan-500 animate-spin'}`}></div>
            <p className={`text-xl font-semibold ${isOnline ? 'text-green-300' : 'text-cyan-300'}`}>
              {currentText}
            </p>
          </div>
          
          <div className="w-full bg-slate-700/50 rounded-full h-4 border border-cyan-700 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-100 ease-linear"
              style={{ 
                width: `${progress}%`,
                boxShadow: `0 0 10px 1px #06b6d4`
              }}
            ></div>
          </div>

        </div>
        
        {isOnline && (
          <div className="mt-8 animate-fadeIn">
            <p className="text-2xl font-bold text-green-400">SYSTEM SECURE</p>
            <p className="text-slate-400">Architect communications restored.</p>
          </div>
        )}
      </div>
    </div>
  );
};
