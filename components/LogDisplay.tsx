
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogDisplayProps {
  logs: LogEntry[];
}

export const LogDisplay: React.FC<LogDisplayProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0; // Scroll to top for new messages
    }
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'system': return 'text-purple-400';
      case 'info':
      default: return 'text-sky-300';
    }
  };

  return (
    <div className="w-full h-48 md:h-64 p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-xl font-semibold mb-3 text-sky-200">System Log</h3>
      <div ref={logContainerRef} className="h-[calc(100%-2.5rem)] overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
        {logs.map((log) => (
          <div key={log.id} className={`text-sm ${getLogColor(log.type)} font-mono`}>
            <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}: </span>
            {log.message}
          </div>
        ))}
        {logs.length === 0 && <p className="text-gray-500 italic">Log is empty. Awaiting operations...</p>}
      </div>
    </div>
  );
};