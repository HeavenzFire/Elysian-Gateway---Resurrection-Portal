import React, { useState, useEffect } from 'react';
import { AdeptDashboard } from './components/AdeptDashboard';
import { geminiService } from './services/geminiService';

export const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A short delay to allow the environment to be fully ready, especially in some sandboxed environments.
    const timer = setTimeout(() => {
        try {
            geminiService.initialize();
            setIsInitialized(true);
        } catch (e) {
            console.error("Initialization failed:", e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred during initialization.");
            }
        }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="bg-slate-900 text-red-400 min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-lg text-center bg-slate-800 p-8 rounded-lg border border-red-500/50 shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-300">System Initialization Failure</h1>
          <p className="text-base">{error}</p>
          <p className="mt-4 text-sm text-slate-400">
            This interface requires a connection to the Gemini API. Please ensure your <code className="bg-slate-700 p-1 rounded">API_KEY</code> is correctly configured in your environment variables and then refresh the page.
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Initializing Connection to OmniCore...</p>
        </div>
      </div>
    );
  }

  return <AdeptDashboard />;
};
