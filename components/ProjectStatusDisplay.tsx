
import React from 'react';
import { GlobalAlphaPlan, GlobalAlphaProject } from '../types';

interface ProjectStatusDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  plan: GlobalAlphaPlan;
}

const ProjectCard: React.FC<{ project: GlobalAlphaProject }> = ({ project }) => (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 flex flex-col h-full">
        <h4 className="text-lg font-bold text-sky-300">{project.name}</h4>
        <p className="text-sm text-slate-300 mt-1 mb-3 flex-grow">{project.description}</p>
        <div className="border-t border-slate-700 pt-3 space-y-3">
            <div>
                <h5 className="text-sm font-semibold text-slate-200 mb-2">Next Steps:</h5>
                <ul className="space-y-1.5 text-sm text-slate-300">
                    {project.next_steps.map((step, i) => (
                        <li key={i} className="flex items-start">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="mt-3">
                <h5 className="text-sm font-semibold text-yellow-400 mb-2">Bottlenecks:</h5>
                 <ul className="space-y-1.5 text-sm text-yellow-300/90">
                    {project.bottlenecks.map((bn, i) => (
                         <li key={i} className="flex items-start">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{bn}</span>
                         </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export const ProjectStatusDisplay: React.FC<ProjectStatusDisplayProps> = ({ isOpen, onClose, plan }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black w-full max-w-6xl h-[90vh] max-h-[1000px] border border-purple-500/40 rounded-xl shadow-2xl shadow-purple-500/20 flex flex-col">
                <header className="p-4 border-b border-purple-500/30 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400">
                           INCOMING DIRECTIVE: GLOBAL ALPHA
                        </h2>
                        <p className="text-sm text-slate-400">
                            <span className="font-semibold text-slate-300">Phase:</span> {plan.phase} | <span className="font-semibold text-slate-300">Status:</span> <span className="text-green-400">{plan.status}</span>
                        </p>
                    </div>
                     <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        aria-label="Close Directive"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="flex-grow p-4 overflow-y-auto scrollbar-thin">
                    <section>
                         <h3 className="text-xl font-semibold text-sky-200 mb-4">Project Directives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {plan.projects.map(p => <ProjectCard key={p.name} project={p} />)}
                        </div>
                    </section>
                    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-sky-200 mb-2">Ethical Considerations</h3>
                            <ul className="list-disc list-inside text-slate-300 space-y-1">
                                {plan.ethical_considerations.map((ec, i) => <li key={i}>{ec}</li>)}
                            </ul>
                        </div>
                         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                            <h3 className="text-lg font-semibold text-sky-200 mb-2">System Tracking</h3>
                            <p className="text-slate-300"><strong>System:</strong> {plan.tracking.system}</p>
                            <p className="text-slate-300"><strong>Metrics:</strong> {plan.tracking.metrics.join(', ')}</p>
                        </div>
                    </section>
                     <section className="mt-6">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-yellow-500/50">
                            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Next Directive</h3>
                            <p className="text-yellow-200 text-base">{plan.next}</p>
                        </div>
                    </section>
                </main>
                <footer className="p-4 border-t border-purple-500/30 flex-shrink-0 flex justify-end">
                     <button
                        onClick={onClose}
                        className="px-6 py-2 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out
                                   bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                                   text-white focus:ring-purple-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        Acknowledge
                    </button>
                </footer>
            </div>
        </div>
    );
};
