import React from 'react';

interface VoiceControlsProps {
    voiceConnectionState: 'idle' | 'connecting' | 'connected' | 'error';
    onToggleVoice: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({ voiceConnectionState, onToggleVoice }) => {
    const isConnecting = voiceConnectionState === 'connecting';
    const isConnected = voiceConnectionState === 'connected';
    
    let buttonClass = 'text-slate-300 hover:bg-slate-700';
    let buttonText = 'Voice';
    let ariaLabel = 'Start voice session';
    let animate = false;

    if (isConnecting) {
        buttonClass = 'text-yellow-300 bg-yellow-500/20';
        buttonText = 'Connecting';
        ariaLabel = 'Connecting voice session...';
        animate = true;
    } else if (isConnected) {
        buttonClass = 'text-red-300 bg-red-500/20';
        buttonText = 'End Voice';
        ariaLabel = 'Stop voice session';
        animate = true;
    } else if (voiceConnectionState === 'error') {
        buttonClass = 'text-red-400 bg-red-500/20';
        buttonText = 'Error';
        ariaLabel = 'Voice session error, click to reset';
    }

    return (
        <button
            onClick={onToggleVoice}
            disabled={isConnecting}
            className={`relative flex-1 capitalize text-sm px-3 py-1.5 rounded-md transition-colors ${buttonClass}`}
            aria-label={ariaLabel}
        >
            <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>{buttonText}</span>
            </div>
            {animate && (
                <span className="absolute top-0 right-0 h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
            )}
        </button>
    );
};
