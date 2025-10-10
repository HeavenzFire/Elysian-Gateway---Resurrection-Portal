
import React from 'react';

interface TTSControlsProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  onVoiceChange: (uri: string) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  onReplay: () => void;
  isReplayable: boolean;
}

export const TTSControls: React.FC<TTSControlsProps> = ({
  isEnabled,
  onToggle,
  availableVoices,
  selectedVoiceURI,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  onReplay,
  isReplayable,
}) => {
  return (
    <div className="w-full p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sky-200">Voice Synthesis</h3>
        <label htmlFor="tts-toggle" className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            id="tts-toggle" 
            className="sr-only peer" 
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
        </label>
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div>
          <label htmlFor="voice-select" className="block text-sm font-medium text-slate-300 mb-1">
            Voice
          </label>
          <select
            id="voice-select"
            value={selectedVoiceURI || ''}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-100"
            aria-label="Select a voice for speech synthesis"
          >
            {availableVoices.map(voice => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {`${voice.name} (${voice.lang})`}
              </option>
            ))}
            {availableVoices.length === 0 && <option disabled>Loading voices...</option>}
          </select>
        </div>

        <div>
          <label htmlFor="rate-slider" className="block text-sm font-medium text-slate-300 mb-1">
            Rate: <span className="font-mono text-sky-300">{rate.toFixed(1)}</span>
          </label>
          <input
            id="rate-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            aria-label="Adjust speech rate"
          />
        </div>

        <div>
          <label htmlFor="pitch-slider" className="block text-sm font-medium text-slate-300 mb-1">
            Pitch: <span className="font-mono text-sky-300">{pitch.toFixed(1)}</span>
          </label>
          <input
            id="pitch-slider"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            aria-label="Adjust speech pitch"
          />
        </div>

        <button
          onClick={onReplay}
          disabled={!isReplayable}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-slate-600 hover:bg-slate-500 text-white disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          aria-label="Replay last AI message"
        >
          Replay Last Message
        </button>
      </div>
    </div>
  );
};
