

import React, { useState, useCallback } from 'react';

type ContextType = 'code' | 'image' | 'url';
type OnSubmitData = 
  | { type: 'text' }
  | { type: 'code', data: string }
  | { type: 'image', data: { file: File } }
  | { type: 'url', data: string };

interface SynergyWorkbenchProps {
    onSubmit: (prompt: string, context: OnSubmitData) => void;
    isSubmitting: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none ${
            active
                ? 'bg-slate-700/80 border-slate-600 border-b-transparent text-sky-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-sky-400'
        }`}
        role="tab"
        aria-selected={active}
    >
        {children}
    </button>
);

export const SynergyWorkbench: React.FC<SynergyWorkbenchProps> = ({ onSubmit, isSubmitting }) => {
    const [activeTab, setActiveTab] = useState<ContextType>('code');
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [url, setUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isSubmitting) return;

        let contextData: OnSubmitData;
        switch (activeTab) {
            case 'code':
                if (!code.trim()) return;
                contextData = { type: 'code', data: code };
                break;
            case 'image':
                if (!imageFile) return;
                contextData = { type: 'image', data: { file: imageFile } };
                break;
            case 'url':
                if (!url.trim()) return;
                contextData = { type: 'url', data: url };
                break;
        }

        onSubmit(prompt, contextData);
        // Reset prompts after submission
        setPrompt('');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'code':
                return (
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="code-input" className="block text-sm font-medium text-sky-300 mb-1">Code Artifact</label>
                            <textarea
                                id="code-input"
                                rows={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Paste your code, algorithm, or technical text here..."
                                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400 font-mono text-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="space-y-3">
                        <label htmlFor="image-input" className="block text-sm font-medium text-sky-300 mb-1">Image / Diagram</label>
                        <div className="flex items-center gap-4">
                            <input
                                id="image-input"
                                type="file"
                                accept="image/png, image/jpeg, image/webp, image/gif"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-purple-50 hover:file:bg-purple-500 disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-slate-600" />}
                        </div>
                    </div>
                );
            case 'url':
                return (
                    <div className="space-y-3">
                        <div>
                           <label htmlFor="url-input" className="block text-sm font-medium text-sky-300 mb-1">Webpage URL</label>
                            <input
                                id="url-input"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/article.html"
                                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-5xl mt-6 p-4 bg-slate-800/70 rounded-xl shadow-2xl border border-purple-500/40 backdrop-blur-md animate-fadeIn">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 mb-3 text-center">
                Synergy Workbench
            </h3>
            <div className="border-b border-slate-600 mb-3">
                <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                    <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')}>Code-Forge</TabButton>
                    <TabButton active={activeTab === 'image'} onClick={() => setActiveTab('image')}>Image Analyzer</TabButton>
                    <TabButton active={activeTab === 'url'} onClick={() => setActiveTab('url')}>Web Assimilator</TabButton>
                </nav>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {renderTabContent()}
                <div>
                     <label htmlFor="prompt-input" className="block text-sm font-medium text-sky-300 mb-1">Your Prompt / Question</label>
                    <textarea
                        id="prompt-input"
                        rows={2}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Ask a question about the ${activeTab}...`}
                        className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !prompt.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Submit ${activeTab} for analysis`}
                    >
                        {isSubmitting ? 'Analyzing...' : `Submit for Analysis`}
                    </button>
                </div>
            </form>
        </div>
    );
};