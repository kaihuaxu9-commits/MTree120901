import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>({
    rotationSpeed: 0.8,
    lightsIntensity: 1,
    bloomIntensity: 1.5,
    isPlaying: true,
    layoutMode: 'tree',
  });

  return (
    <div className="relative w-full h-full bg-emerald-950 overflow-hidden">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene appState={appState} />
      </div>

      {/* HTML UI Overlay */}
      <UIOverlay appState={appState} setAppState={setAppState} />
      
      {/* Decorative Vignette Overlay (CSS-based for extra depth) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,26,20,0.4)_100%)] mix-blend-multiply z-10"></div>
    </div>
  );
}

export default App;