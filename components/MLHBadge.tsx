
import React from 'react';

const MLHBadge: React.FC = () => {
  return (
    <a 
      href="https://mlh.io/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="absolute bottom-6 right-6 group transition-all duration-300 hover:scale-105"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
        <span className="text-white/50 text-[10px] font-bold uppercase tracking-tighter">Powered By</span>
        <img 
          src="https://static.mlh.io/brand-assets/logo/official/mlh-logo-color.png" 
          alt="Major League Hacking Logo" 
          className="h-8 object-contain"
        />
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute -inset-1 bg-white/5 rounded-2xl -z-10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </a>
  );
};

export default MLHBadge;
