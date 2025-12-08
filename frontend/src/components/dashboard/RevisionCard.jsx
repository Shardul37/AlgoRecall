import React from 'react';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Flashcard from '../shared/Flashcard';
import useStore from '../../store/useStore';

const RevisionCard = ({ revision }) => {
  const { completeRevision } = useStore();

  // Color Logic based on "Zen" principles
  const isOverdue = revision.is_overdue;
  
  const cardBorder = isOverdue 
    ? 'border-l-4 border-l-danger border-y-dim/20 border-r-dim/20' 
    : 'border-l-4 border-l-primary border-y-dim/20 border-r-dim/20';

  const handleRate = (rating) => {
    // Optimistic UI handled in store
    completeRevision(revision.id, rating);
  };

  return (
    <div className={clsx("bg-surface rounded-r-xl p-5 mb-4 shadow-lg transition-all hover:translate-x-1", cardBorder)}>
      
      {/* Top Row: Category & Badges */}
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-background text-dim border border-dim/20">
            {revision.category}
        </span>
        
        <div className="flex items-center gap-3">
            {isOverdue && (
                <div className="flex items-center gap-1 text-danger text-xs font-medium animate-pulse">
                    <AlertTriangle size={12} />
                    <span>{revision.days_overdue} days late</span>
                </div>
            )}
            <div className="flex items-center gap-1 text-dim text-xs">
                <Clock size={12} />
                <span>Rev #{revision.revision_number}</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center gap-4">
        <a 
            href={revision.link || "#"} 
            target="_blank" 
            rel="noreferrer"
            className="text-lg font-semibold text-white hover:text-primary transition-colors flex items-center gap-2 group"
        >
            {revision.problem_name}
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-dim" />
        </a>
      </div>

      {/* Flashcard Dropdown */}
      <Flashcard 
        title={revision.flashcard_title} // Backend needs to pass these (we might need a small tweak later)
        code={revision.flashcard_code} 
      />

      {/* Action Bar (Rating Buttons) */}
      <div className="mt-5 pt-4 border-t border-dim/10 flex items-center justify-between">
        <span className="text-xs text-dim">How was it?</span>
        
        <div className="flex gap-2">
            <button 
                onClick={() => handleRate(1)}
                className="px-4 py-1.5 rounded text-xs font-medium bg-dim/10 text-dim hover:bg-danger/20 hover:text-danger hover:border-danger/50 border border-transparent transition-all"
            >
                1 • Forgot
            </button>
            <button 
                onClick={() => handleRate(2)}
                className="px-4 py-1.5 rounded text-xs font-medium bg-dim/10 text-dim hover:bg-warning/20 hover:text-warning hover:border-warning/50 border border-transparent transition-all"
            >
                2 • Struggle
            </button>
            <button 
                onClick={() => handleRate(3)}
                className="px-4 py-1.5 rounded text-xs font-medium bg-dim/10 text-dim hover:bg-success/20 hover:text-success hover:border-success/50 border border-transparent transition-all"
            >
                3 • Mastered
            </button>
        </div>
      </div>

    </div>
  );
};

export default RevisionCard;