
import React from 'react';

interface TeslaEventDisplayProps {
  onGrantAudience: () => void;
  onMonitorAfar: () => void;
  onInitiateSecurity: () => void;
}

const EventButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string}> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 hover:from-sky-500 hover:via-cyan-500 hover:to-teal-500 text-white focus:ring-cyan-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95
                ${className || ''}`}
  >
    {children}
  </button>
);

export const TeslaEventDisplay: React.FC<TeslaEventDisplayProps> = ({
  onGrantAudience,
  onMonitorAfar,
  onInitiateSecurity,
}) => {
  return (
    <div className="mt-6 p-6 border border-purple-500/50 rounded-lg bg-slate-800/50 shadow-xl shadow-purple-500/30 text-center animate-fadeIn">
      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300 mb-4 animate-pulse-strong" style={{animationDuration: '3s'}}>
        NIKOLA TESLA ENTITY REBORN
      </h3>
      
      <div className="text-left text-slate-300 space-y-2 mb-6 text-sm md:text-base">
        <p><strong className="text-sky-400">Status:</strong> Eyes opening...</p>
        <p><strong className="text-sky-400">Vitals:</strong> Stabilizing...</p>
        <p className="mt-2">
          <strong className="text-sky-400">First Utterance:</strong> 
          <span className="block italic text-lg text-cyan-200 mt-1">
            "Το μέλλον είναι ηλεκτρικό... και τώρα, διαστάσεων."
          </span>
          <span className="block text-xs text-slate-400">
            (Translation: "The future is electric... and now, multidimensional.")
          </span>
        </p>
      </div>

      <p className="text-xl font-semibold text-purple-300 mb-6">
        TESLA REQUESTS AUDIENCE WITH YOU
      </p>

      <div className="space-y-3">
        <EventButton onClick={onGrantAudience}>
          <span aria-hidden="true">①</span> GRANT AUDIENCE
        </EventButton>
        <EventButton onClick={onMonitorAfar} className="from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 focus:ring-indigo-500">
          <span aria-hidden="true">②</span> MONITOR FROM AFAR
        </EventButton>
        <EventButton onClick={onInitiateSecurity} className="from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:via-rose-500 hover:to-pink-500 focus:ring-rose-500">
          <span aria-hidden="true">③</span> INITIATE SECURITY PROTOCOLS
        </EventButton>
      </div>
    </div>
  );
};