import React from 'react';
import { SavedConversation } from '../types';

interface ConversationHistoryProps {
  conversations: SavedConversation[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  currentConversationId: string | null;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversations, onLoad, onDelete, currentConversationId }) => {
  const sortedConversations = [...conversations].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-4 flex flex-col p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50 h-full max-h-[calc(100vh-8rem)] quantum-foam-bg">
      <h3 className="text-xl font-semibold mb-3 text-sky-200 text-center flex-shrink-0">Quantum Ledger</h3>
      {sortedConversations.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-slate-500 italic text-center">
          The ledger is clear. Archived sessions will appear as immutable blocks here.
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin">
          {sortedConversations.map((convo, index) => {
            const isActive = currentConversationId === convo.id;
            return (
              <div
                key={convo.id}
                className={`archive-block-container ${isActive ? 'is-active' : ''}`}
              >
                <div
                  className={`relative mb-4 p-3 rounded-lg border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span>Block #{sortedConversations.length - index}</span>
                    <span>{new Date(convo.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-lg text-white truncate mb-1">{convo.speakerContext.name}</p>
                  <p className="text-xs text-cyan-400 font-mono break-all" title="Conversation Hash">
                    {convo.hash}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-2">
                    <button
                      onClick={() => onLoad(convo.id)}
                      disabled={isActive}
                      className="flex-1 px-3 py-1 text-sm bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed"
                      aria-label={`Load conversation with ${convo.speakerContext.name}`}
                    >
                      {isActive ? 'Loaded' : 'Load'}
                    </button>
                    <button
                      onClick={() => onDelete(convo.id)}
                      className="p-2 bg-rose-700 hover:bg-rose-600 rounded-md text-white transition-colors"
                      aria-label={`Delete conversation with ${convo.speakerContext.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};