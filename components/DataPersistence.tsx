import React from 'react';

interface DataPersistenceProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export const DataPersistence: React.FC<DataPersistenceProps> = ({ onExport, onImport }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset the input value so the same file can be selected again
      event.target.value = ''; 
    }
  };

  return (
    <div className="w-full p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 space-y-4">
      <h3 className="text-xl font-semibold text-sky-200">Ledger Persistence</h3>
      <p className="text-xs text-slate-400">
        Your archive is stored in this browser's local memory. To prevent data loss and move it between devices, you can export it to a file.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={onExport}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white focus:ring-sky-500 shadow-md hover:shadow-lg"
        >
          Export Ledger
        </button>
        <label
          htmlFor="import-ledger-input"
          className="flex-1 text-center cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 text-white focus:ring-slate-500 shadow-md hover:shadow-lg"
        >
          Import Ledger
          <input
            id="import-ledger-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};