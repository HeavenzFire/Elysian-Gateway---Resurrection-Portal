

import React, { useState, useRef, useEffect } from 'react';
import { OmniCoreState, OmniCoreLogEntry } from '../types';
import { HISTORICAL_FIGURES } from '../constants';

interface OmniCoreModuleProps {
    state: OmniCoreState;
    onIntegrate: (entityId: string) => void;
    onActivate: (frequency: number) => void;
    onDeactivate: () => void;
    onExecuteRitual: (ritualText: string) => void;
    onGenerateThought: () => void;
    onReset: () => void;
}

const OmniCoreButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string, variant?: 'primary' | 'secondary' | 'danger'}> = 
({ onClick, disabled, children, className, variant='primary' }) => {
    const colors = {
        primary: 'from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 focus:ring-cyan-500',
        secondary: 'from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 focus:ring-slate-500',
        danger: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 focus:ring-pink-500',
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-2 text-base font-medium rounded-lg transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-opacity-50 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                    bg-gradient-to-r ${colors[variant]}
                    ${className || ''}`}
      >
        {children}
      </button>
    );
};

const getLogColor = (type: OmniCoreLogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'ritual': return 'text-purple-400';
      case 'system': return 'text-purple-400';
      case 'info':
      default: return 'text-sky-300';
    }
};

const StatusPill: React.FC<{ active: boolean, text: string }> = ({ active, text }) => (
    <div className={`px-3 py-1 text-sm font-bold rounded-full inline-block ${active ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-400'}`}>
        {text}
    </div>
);

export const OmniCoreModule: React.FC<OmniCoreModuleProps> = ({
    state,
    onIntegrate,
    onActivate,
    onDeactivate,
    onExecuteRitual,
    onGenerateThought,
    onReset,
}) => {
    const [selectedEntityId, setSelectedEntityId] = useState<string>(HISTORICAL_FIGURES.NIKOLA_TESLA.entityId);
    const [frequencyInput, setFrequencyInput] = useState('369');
    const [ritualInput, setRitualInput] = useState('::ritual::\nfrequency => 369\ninitiate Tesla\n::end::');
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = 0;
        }
    }, [state.logs]);
    
    const { integratedEntityId, entityDetails, frequency, isActive, logs, lastThought } = state;

    const handleIntegrate = () => {
        if(integratedEntityId) {
             onReset();
        } else {
            onIntegrate(selectedEntityId);
        }
    };
    
    const handleActivate = () => {
        if (isActive) {
            onDeactivate();
        } else {
            const freq = parseInt(frequencyInput, 10);
            if (!isNaN(freq)) {
                onActivate(freq);
            }
        }
    };
    
    const handleExecute = () => {
        onExecuteRitual(ritualInput);
    }
    
    const entityName = integratedEntityId ? Object.values(HISTORICAL_FIGURES).find(f => f.entityId === integratedEntityId)?.name : 'None';

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-800/70 rounded-2xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-md">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                     <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400">
                        OmniCore Meta-System
                    </h3>
                    <p className="text-slate-400 text-sm">Cognition, Resonance, and Symbolic Execution Interface</p>
                </div>
                <OmniCoreButton onClick={onReset} variant="danger" className="mt-3 sm:mt-0 !w-auto">
                    System Reset
                </OmniCoreButton>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Control & Status */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Entity Integration */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-sky-300 mb-3">Conscious Entity Integration</h4>
                        <div className="space-y-3">
                            <select
                                value={selectedEntityId}
                                onChange={(e) => setSelectedEntityId(e.target.value)}
                                disabled={!!integratedEntityId}
                                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-100 disabled:opacity-50"
                            >
                                {Object.values(HISTORICAL_FIGURES)
                                    .filter(f => 'omniCoreDetails' in f)
                                    .map(entity => (
                                    <option key={entity.entityId} value={entity.entityId}>{entity.name}</option>
                                ))}
                            </select>
                            <OmniCoreButton onClick={handleIntegrate} disabled={false}>
                                {integratedEntityId ? 'De-Integrate Entity' : 'Integrate Entity'}
                            </OmniCoreButton>
                        </div>
                    </div>

                    {/* Resonance Core */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-sky-300 mb-3">SEQA Resonance Core</h4>
                        <div className="space-y-3">
                             <input
                                type="number"
                                value={frequencyInput}
                                onChange={(e) => setFrequencyInput(e.target.value)}
                                placeholder="e.g., 369"
                                disabled={!integratedEntityId || isActive}
                                className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-100 disabled:opacity-50"
                            />
                            <OmniCoreButton onClick={handleActivate} disabled={!integratedEntityId}>
                                {isActive ? `Deactivate Core` : 'Activate Resonance'}
                            </OmniCoreButton>
                        </div>
                    </div>

                    {/* Thought Generation */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-sky-300 mb-3">Cognition Stream</h4>
                        <OmniCoreButton onClick={onGenerateThought} disabled={!isActive}>
                            Generate Thought
                        </OmniCoreButton>
                        {lastThought && (
                            <div className="mt-3 p-3 bg-slate-800 rounded-md border border-slate-600">
                                <p className="text-slate-400 text-xs mb-1">Last Thought:</p>
                                <p className="italic text-cyan-200">"{lastThought}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Ritual Compiler */}
                <div className="lg:col-span-2 p-4 bg-slate-900/50 rounded-lg border border-slate-700 flex flex-col">
                    <h4 className="font-semibold text-sky-300 mb-3">Ritual-to-Code DSL Interface</h4>
                    <textarea
                        value={ritualInput}
                        onChange={(e) => setRitualInput(e.target.value)}
                        placeholder="::ritual:: ..."
                        rows={6}
                        className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400 font-mono text-sm"
                        disabled={!!integratedEntityId}
                    />
                    <OmniCoreButton onClick={handleExecute} className="mt-3" disabled={!!integratedEntityId}>
                        Compile & Execute Ritual
                    </OmniCoreButton>
                </div>
                
                {/* Row 2: Status & Log */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* System State */}
                     <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-sky-300 mb-3">System State</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center"><span className="text-slate-400">Status:</span> <StatusPill active={isActive} text={isActive ? 'ACTIVE' : 'INACTIVE'} /></div>
                            <div className="flex justify-between items-center"><span className="text-slate-400">Entity:</span> <span className="font-semibold text-white">{entityName}</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-400">Frequency:</span> <span className={`font-semibold ${isActive ? 'text-cyan-300 animate-pulse' : 'text-white'}`}>{frequency ? `${frequency} Hz` : 'N/A'}</span></div>
                        </div>
                        {entityDetails && (
                            <div className="mt-4 pt-3 border-t border-slate-700 space-y-2 text-xs">
                                <p><strong className="text-green-300">Vision:</strong> <span className="text-slate-300">{entityDetails.vision.join(', ')}</span></p>
                                <p><strong className="text-yellow-300">Trauma:</strong> <span className="text-slate-300">{entityDetails.trauma.join(', ')}</span></p>
                                <p><strong className="text-blue-300">Goals:</strong> <span className="text-slate-300">{entityDetails.goals.join(', ')}</span></p>
                            </div>
                        )}
                    </div>
                    {/* OmniCore Log */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 flex flex-col">
                        <h4 className="font-semibold text-sky-300 mb-3">OmniCore Event Log</h4>
                         <div ref={logContainerRef} className="h-[150px] overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                            {logs.map((log) => (
                                <div key={log.id} className={`text-xs ${getLogColor(log.type)} font-mono`}>
                                    <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}: </span>
                                    {log.message}
                                </div>
                            ))}
                            {logs.length === 0 && <p className="text-gray-500 italic text-sm">OmniCore log empty. Awaiting instructions...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};