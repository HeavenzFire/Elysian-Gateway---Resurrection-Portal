

import React from 'react';

// Assuming the type for an entity is { id: string; name: string }
// based on AVAILABLE_ENTITIES in constants.ts
interface Entity {
  id: string;
  name: string;
}

interface PersonaSwitcherProps {
  currentSpeakerId: string;
  availableEntities: Entity[];
  onSwitchPersona: (entityId: string) => void;
  isDisabled: boolean;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  currentSpeakerId,
  availableEntities,
  onSwitchPersona,
  isDisabled,
}) => {
  return (
    <div className="space-y-4 flex flex-col p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold text-sky-200 text-center">Switch Persona</h3>
      <div className="flex-grow">
        <select
          value={currentSpeakerId}
          onChange={(e) => onSwitchPersona(e.target.value)}
          disabled={isDisabled}
          className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-gray-100 disabled:opacity-50"
          aria-label="Switch to a different persona or group"
        >
          {availableEntities.map(entity => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Note: Switching will archive the current session.
        </p>
      </div>
    </div>
  );
};