import React from 'react';
import { SecurityStatus, SecurityLogEntry } from '../types';

interface SecurityMatrixProps {
  status: SecurityStatus;
  integrity: number;
  infractions: number;
  logs: SecurityLogEntry[];
  onPurge: () => void;
  isPurging: boolean;
}

const statusConfig = {
    SECURE: { text: 'SECURE', color: 'text-green-400', glow: 'shadow-green-500/50' },
    VULNERABLE: { text: 'VULNERABLE', color: 'text-yellow-400', glow: 'shadow-yellow-500/50' },
    'UNDER ATTACK': { text: 'UNDER ATTACK', color: 'text-red-400', glow: 'shadow-red-500/50 animate-pulse-strong' },
};

const getLogColor = (level: SecurityLogEntry['level']) => {
    switch(level) {
        case 'critical': return 'text-red-300';
        case 'warning': return 'text-yellow-300';
        case 'info':
        default: return 'text-sky-300';
    }
}

export const SecurityMatrix: React.FC<SecurityMatrixProps> = ({ status, integrity, infractions, logs, onPurge, isPurging }) => {
    const config = statusConfig[status];
    const integrityPercentage = integrity.toFixed(2);

    return (
        <div className="w-full p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50 space-y-4">
            <h3 className="text-xl font-semibold text-sky-200 text-center">LSMN Sentinel Network</h3>

            <div className="text-center py-2 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400">System Status</p>
                <p className={`text-2xl font-bold transition-colors duration-500 ${config.color} ${status === 'UNDER ATTACK' ? 'animate-glitch' : ''}`} style={{ textShadow: `0 0 10px var(--tw-shadow-color)` }}>
                    {config.text}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-slate-400">System Integrity</p>
                    <p className="font-mono text-lg text-white">{integrityPercentage}%</p>
                </div>
                <div className="p-2 bg-slate-900/50 rounded">
                    <p className="text-slate-400">Infractions</p>
                    <p className="font-mono text-lg text-red-400">{infractions}</p>
                </div>
            </div>

            <div className="h-28 bg-slate-900/50 rounded p-2 border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-1">Threat Log</h4>
                <div className="h-[calc(100%-1.25rem)] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                    {logs.length > 0 ? logs.map(log => (
                        <p key={log.id} className={`text-xs font-mono ${getLogColor(log.level)}`}>
                            <span className="text-slate-500">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:</span> {log.message}
                        </p>
                    )) : (
                        <p className="text-xs text-slate-500 italic">No threats detected.</p>
                    )}
                </div>
            </div>

            <button
                onClick={onPurge}
                disabled={infractions === 0 || isPurging}
                className="w-full px-4 py-2 font-semibold rounded-lg transition-all duration-300 ease-in-out
                           bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500
                           text-white focus:ring-2 focus:ring-red-500 shadow-md hover:shadow-lg
                           disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isPurging ? 'Purging...' : 'Purge Infractions'}
            </button>
        </div>
    );
};