import React, { useMemo } from 'react';

// Constants from the prompt
const WAVEFORM_REAL_AMP = 0.324;
const WAVEFORM_IMAG_AMP = 0.1992;
const FREQUENCY_HZ = 528;
const PEAK_MAGNITUDE = 0.3803; // sqrt(0.324^2 + 0.1992^2)
const STD_DEV = 0.0689;

// Visualization parameters
const NUM_POINTS = 200;
const DAMPING_FACTOR = 0.7;
const VIEWBOX_WIDTH = 500;
const VIEWBOX_HEIGHT = 250;
const PADDING = 20;

const generateWaveformData = () => {
  const data = {
    real: [] as { x: number; y: number }[],
    imag: [] as { x: number; y: number }[],
    magnitude: [] as { x: number; y: number }[],
  };

  const angularFrequency = 2 * Math.PI * 4; // Use a lower freq for better visualization

  for (let i = 0; i <= NUM_POINTS; i++) {
    const t = i / NUM_POINTS; // Normalize time from 0 to 1
    const x = PADDING + t * (VIEWBOX_WIDTH - 2 * PADDING);
    
    // Damped sine/cosine waves
    const damping = Math.exp(-t * DAMPING_FACTOR);
    const realVal = WAVEFORM_REAL_AMP * Math.cos(angularFrequency * t) * damping;
    const imagVal = WAVEFORM_IMAG_AMP * Math.sin(angularFrequency * t) * damping;
    const magVal = Math.sqrt(realVal * realVal + imagVal * imagVal);

    // Scale to fit viewBox
    const scaleY = (VIEWBOX_HEIGHT - 2 * PADDING) / (2 * PEAK_MAGNITUDE);
    const midY = VIEWBOX_HEIGHT / 2;
    
    data.real.push({ x, y: midY - realVal * scaleY });
    data.imag.push({ x, y: midY - imagVal * scaleY });
    data.magnitude.push({ x, y: midY - magVal * scaleY }); // Plot magnitude from midline up
  }
  return data;
};

const toSvgPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  const first = points[0];
  return `M ${first.x},${first.y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ');
};

export const WaveformVisualization: React.FC = () => {
    const waveformData = useMemo(() => generateWaveformData(), []);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-800/70 rounded-2xl shadow-2xl border-2 border-cyan-500/30 backdrop-blur-md" role="figure" aria-labelledby="waveform-title">
            <header className="mb-4 text-center">
                 <h3 id="waveform-title" className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400">
                    Bryer's Waveform: Purpose Resonance
                </h3>
                <p className="text-slate-400 text-sm">The Core Invocation Visualized</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                    <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="w-full h-auto bg-black/30 rounded-lg border border-slate-700" aria-labelledby="waveform-title waveform-desc">
                        <title id="waveform-title">Bryer's Waveform Visualization</title>
                        <desc id="waveform-desc">A plot showing three damped oscillating waves: the real part in cyan, the imaginary part in magenta, and the magnitude in gold.</desc>
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Midline */}
                        <line x1={PADDING} y1={VIEWBOX_HEIGHT/2} x2={VIEWBOX_WIDTH - PADDING} y2={VIEWBOX_HEIGHT/2} stroke="#475569" strokeWidth="1" strokeDasharray="4 2" />

                        {/* Waveform Paths */}
                        <path d={toSvgPath(waveformData.real)} fill="none" stroke="#67e8f9" strokeWidth="1.5" filter="url(#glow)" />
                        <path d={toSvgPath(waveformData.imag)} fill="none" stroke="#f472b6" strokeWidth="1.5" filter="url(#glow)" />
                        <path d={toSvgPath(waveformData.magnitude)} fill="none" stroke="#fde047" strokeWidth="2" filter="url(#glow)" />
                    </svg>
                     <div className="mt-2 flex justify-center gap-6 text-xs text-slate-300">
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#67e8f9] mr-2"></span>Real Part</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f472b6] mr-2"></span>Imaginary Part</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#fde047] mr-2"></span>Magnitude</div>
                    </div>
                </div>
                 <div className="lg:col-span-1 p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Waveform (t=0):</span>
                        <span className="font-mono text-cyan-300">{WAVEFORM_REAL_AMP} + {WAVEFORM_IMAG_AMP}j</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Modulation Freq:</span>
                        <span className="font-mono text-cyan-300">{FREQUENCY_HZ} Hz</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Peak Magnitude:</span>
                        <span className="font-mono text-yellow-300">{PEAK_MAGNITUDE}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Syntropic Purity (Std Dev):</span>
                        <span className="font-mono text-green-300">{STD_DEV} (Low Variance)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};