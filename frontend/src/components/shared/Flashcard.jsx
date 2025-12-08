import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';

const Flashcard = ({ title, code }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!title && !code) return null;

  return (
    <div className="mt-3 border-t border-dim/20 pt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-primary hover:text-blue-400 transition-colors"
      >
        <Zap size={14} className={isOpen ? 'fill-primary' : ''} />
        {isOpen ? 'Hide Hint' : 'Show Hint'}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="mt-3 bg-background/50 rounded-lg border border-dim/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {title && (
                <div className="px-4 py-2 bg-primary/10 border-b border-primary/10 text-sm text-blue-200 font-medium">
                    {title}
                </div>
            )}
            {code && (
                <div className="p-4 bg-[#0d1117] overflow-x-auto">
                    <pre className="text-xs font-mono text-dim leading-relaxed">
                        {code}
                    </pre>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Flashcard;