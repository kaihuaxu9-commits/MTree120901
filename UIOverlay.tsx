import React from 'react';
import { AppState } from '../types';
import { Pause, Play, Sun, Sparkles as SparklesIcon, Share2, BoxSelect, Boxes } from 'lucide-react';

interface UIOverlayProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ appState, setAppState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10 text-gold-100">
      
      {/* Header / Branding */}
      <header className="flex justify-between items-start animate-fade-in-down">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-400 drop-shadow-lg tracking-wider">
            ARIX
          </h1>
          <p className="font-sans text-xs md:text-sm tracking-[0.3em] text-emerald-300 uppercase mt-1 ml-1 opacity-80">
            Signature Collection
          </p>
        </div>
        <div className="hidden md:block">
            <div className="border border-gold-500/30 bg-emerald-950/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-serif italic text-gold-300">
                Est. 2024 • Limited Edition
            </div>
        </div>
      </header>

      {/* Main Content Area (Empty for view) */}
      <div className="flex-grow"></div>

      {/* Controls Footer */}
      <footer className="pointer-events-auto w-full max-w-4xl mx-auto backdrop-blur-xl bg-emerald-950/60 border border-gold-500/20 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Playback Control */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setAppState(s => ({ ...s, isPlaying: !s.isPlaying }))}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-emerald-950 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    title={appState.isPlaying ? "Pause Rotation" : "Start Rotation"}
                >
                    {appState.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                
                {/* Mode Toggle: Tree vs Scattered */}
                <button 
                    onClick={() => setAppState(s => ({ ...s, layoutMode: s.layoutMode === 'tree' ? 'scattered' : 'tree' }))}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border border-gold-400/50 hover:bg-gold-500/20 transition-all ${appState.layoutMode === 'scattered' ? 'bg-gold-500/20 shadow-[0_0_10px_rgba(212,175,55,0.3)]' : ''}`}
                    title="Toggle Scatter Mode"
                >
                   {appState.layoutMode === 'tree' ? <Boxes size={20} /> : <BoxSelect size={20} />}
                </button>

                <div className="text-sm">
                    <div className="text-gold-100 font-serif">Interactive</div>
                    <div className="text-gold-500 text-xs">
                        {appState.layoutMode === 'tree' ? 'Assembled' : 'Floating'}
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-10 bg-gold-500/20"></div>

            {/* Sliders */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-auto">
                
                {/* Bloom Control */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gold-300 font-sans tracking-widest uppercase">
                        <SparklesIcon size={12} />
                        <span>Radiance</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="3" 
                        step="0.1"
                        value={appState.bloomIntensity}
                        onChange={(e) => setAppState(s => ({ ...s, bloomIntensity: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                    />
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gold-300 font-sans tracking-widest uppercase">
                        <Sun size={12} />
                        <span>Speed</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.2" 
                        max="5" 
                        step="0.1"
                        value={appState.rotationSpeed}
                        onChange={(e) => setAppState(s => ({ ...s, rotationSpeed: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                    />
                </div>
            </div>

             {/* Share/Action */}
             <div className="hidden md:block">
                 <button className="p-3 rounded-full hover:bg-gold-500/10 text-gold-300 transition-colors">
                    <Share2 size={20} />
                 </button>
             </div>

        </div>
      </footer>
    </div>
  );
};