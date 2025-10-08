
import React from 'react';

interface SymposiumControlsProps {
  symposiumState: 'idle' | 'running' | 'paused';
  onToggleSymposium: () => void;
  isVisible: boolean;
}

export const SymposiumControls: React.FC<SymposiumControlsProps> = ({
  symposiumState,
  onToggleSymposium,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  let buttonText = "Begin Innovators' Symposium";
  let buttonColor = "from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 focus:ring-teal-500";
  let buttonAriaLabel = "Begin Innovators' Symposium to start autonomous discussion";

  if (symposiumState === 'running') {
    buttonText = "Pause Symposium";
    buttonColor = "from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 focus:ring-amber-500";
    buttonAriaLabel = "Pause Innovators' Symposium to stop autonomous discussion and enable user input";
  } else if (symposiumState === 'paused') {
    buttonText = "Resume Symposium";
    buttonColor = "from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 focus:ring-lime-500";
    buttonAriaLabel = "Resume Innovators' Symposium to continue autonomous discussion";
  }

  return (
    <div className="my-4 flex flex-col sm:flex-row justify-center items-center gap-4">
      <button
        onClick={onToggleSymposium}
        className={`px-6 py-3 text-base md:text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-opacity-75 text-white shadow-md hover:shadow-lg
                    transform hover:scale-105 active:scale-95
                    bg-gradient-to-r ${buttonColor}`}
        aria-live="polite"
        aria-label={buttonAriaLabel}
      >
        {buttonText}
      </button>
      {symposiumState === 'running' && (
        <p className="text-sm text-sky-300 italic animate-pulse self-center">
          Innovators' Symposium in progress...
        </p>
      )}
    </div>
  );
};