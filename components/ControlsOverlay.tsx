
import React from 'react';
import { TransformMode } from '../App';

interface ControlsOverlayProps {
  mode: TransformMode;
  setMode: (mode: TransformMode) => void;
  onReset: () => void;
}

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({ mode, setMode, onReset }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-4 w-64">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-3">
        <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] px-2 mb-1">
          Editor Gizmos
        </div>
        
        <ControlButton 
          active={mode === 'translate'} 
          onClick={() => setMode('translate')}
          icon="fa-arrows-up-down-left-right"
          label="Move"
          color="bg-blue-500"
        />
        
        <ControlButton 
          active={mode === 'rotate'} 
          onClick={() => setMode('rotate')}
          icon="fa-rotate"
          label="Rotate"
          color="bg-purple-500"
        />
        
        <ControlButton 
          active={mode === 'scale'} 
          onClick={() => setMode('scale')}
          icon="fa-maximize"
          label="Scale"
          color="bg-pink-500"
        />

        <div className="h-px bg-slate-200/50 my-1" />

        <button 
          onClick={onReset}
          className="group flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white border border-slate-200/50"
        >
          <span className="text-sm font-bold">Deselect All</span>
          <i className="fa-solid fa-xmark text-xs opacity-50 group-hover:opacity-100" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-xl text-white">
        <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-lightbulb text-yellow-300" />
            <span className="font-black text-sm uppercase tracking-wider">Hacker Tip</span>
        </div>
        <p className="text-xs leading-relaxed font-medium opacity-90">
          Try scaling the <span className="font-bold underline decoration-yellow-300 underline-offset-2 text-yellow-100">MLH Trophy</span> or rotating the <span className="font-bold underline decoration-pink-300 underline-offset-2 text-pink-100 text-sm">Gamer Chair</span>!
        </p>
      </div>
    </div>
  );
};

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ active, onClick, icon, label, color }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
        ${active 
          ? `${color} text-white shadow-lg shadow-black/10 scale-[1.02]` 
          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent hover:border-slate-200'}
      `}
    >
      <i className={`fa-solid ${icon} w-5 text-center text-lg ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      
      {active && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </button>
  );
};

export default ControlsOverlay;
