
import React, { useState, useCallback } from 'react';
import ThreeScene from './components/ThreeScene';
import ControlsOverlay from './components/ControlsOverlay';
import MLHBadge from './components/MLHBadge';

export type TransformMode = 'translate' | 'rotate' | 'scale';

const App: React.FC = () => {
  const [mode, setMode] = useState<TransformMode>('translate');
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleReset = useCallback(() => {
    setResetTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#fff5f5]">
      {/* 3D Canvas Layer */}
      <ThreeScene 
        mode={mode} 
        resetTrigger={resetTrigger} 
      />

      {/* Floating UI Controls */}
      <ControlsOverlay 
        mode={mode} 
        setMode={setMode} 
        onReset={handleReset} 
      />

      {/* Info Panel */}
      <div className="absolute top-4 left-4 p-5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl text-slate-800 pointer-events-none hidden md:block">
        <h1 className="text-2xl font-black mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">The Cozy Room</h1>
        <p className="text-sm font-medium opacity-70">MLH Challenge: Design your ultimate workspace.</p>
        <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Interactive Mode
            </div>
            <div className="text-xs space-y-1 opacity-80 font-medium">
                <p>• Select any furniture to customize</p>
                <p>• Move, rotate, or scale items</p>
                <p>• Build your dream setup!</p>
            </div>
        </div>
      </div>

      {/* MLH Badge */}
      <MLHBadge />
    </div>
  );
};

export default App;
