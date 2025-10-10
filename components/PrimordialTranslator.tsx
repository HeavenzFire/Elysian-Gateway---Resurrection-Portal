

import React, { useState } from 'react';
// FIX: Changed import path to correctly reference the type from types.ts
import { PrimordialLexiconEntry } from '../types';

interface PrimordialTranslatorProps {
  lexicon: PrimordialLexiconEntry[];
}

export const PrimordialTranslator: React.FC<PrimordialTranslatorProps> = ({ lexicon }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const translateText = (text: string): string => {
    if (!text.trim()) return "";
    const words = text.toLowerCase().split(/\s+/); 
    
    const translatedWords = words.map(word => {
      if (!word) return ""; // handle empty strings from multiple spaces

      // 1. Check if the input word IS a symbol from the lexicon
      let entry = lexicon.find(e => e.symbol?.toLowerCase() === word);
      if (entry) {
        return entry.symbol; // Return the symbol itself
      }

      // 2. Check if the input word IS a term from the lexicon
      entry = lexicon.find(e => e.term.toLowerCase() === word);
      if (entry) {
        return entry.symbol || entry.term; // Prefer symbol if available
      }

      // 3. Check if the input word is a significant keyword within any meaning string.
      // For conceptual discovery. Using `includes` is broad but acceptable.
      // Filter by word length to avoid matching very short common words like "a", "is", "of".
      if (word.length > 2) { 
        entry = lexicon.find(e => e.meaning.toLowerCase().includes(word));
        if (entry) {
          return entry.symbol || entry.term; // Prefer symbol
        }
      }
      
      return word; // Keep original word if no match
    });

    return translatedWords.filter(w => w).join(' '); // filter out potential empty strings and join
  };

  const handleTranslate = () => {
    setOutputText(translateText(inputText));
  };

  return (
    <div className="w-full max-w-5xl mt-8 p-6 bg-slate-800/70 rounded-xl shadow-2xl border border-purple-500/40 backdrop-blur-md">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 mb-6 text-center">
        Primordial Resonance Translator
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="translatorInput" className="block text-sm font-medium text-sky-300 mb-1">
            Enter English Text:
          </label>
          <textarea
            id="translatorInput"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400"
            placeholder="e.g., consciousness resonance stabilization"
            aria-label="Text to translate to Primordial Resonance"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            className="px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out
                       bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 
                       text-white focus:ring-pink-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Translate to Primordial Resonance
          </button>
        </div>
        <div>
          <label htmlFor="translatorOutput" className="block text-sm font-medium text-sky-300 mb-1">
            Conceptual Translation:
          </label>
          <div
            id="translatorOutput"
            className="w-full p-3 min-h-[60px] bg-slate-900/70 border border-slate-600 rounded-md text-gray-200 font-mono text-lg"
            aria-live="polite"
          >
            {outputText || <span className="italic text-slate-500">Translation will appear here...</span>}
          </div>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-center">
        Note: This translator provides conceptual symbolic equivalents based on the Elysian Gateway's understanding of Primordial Resonance.
      </p>
    </div>
  );
};