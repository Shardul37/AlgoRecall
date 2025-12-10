import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, BookOpen, Code, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';

const ProblemModal = ({ problemId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionExpanded, setQuestionExpanded] = useState(false);

  // Fetch details when modal opens
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/api/problems/${problemId}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load problem", err);
        setLoading(false);
      }
    };
    if (problemId) fetchDetails();
  }, [problemId]);

  if (!problemId) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      
      {/* Modal Content */}
      <div className="bg-surface border border-dim/20 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-dim/10 flex justify-between items-start bg-background/50">
          <div>
             {loading ? (
                <div className="h-8 w-48 bg-dim/20 rounded animate-pulse" />
             ) : (
                <>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                            {data.category}
                        </span>
                        <span className="text-dim text-xs flex items-center gap-1">
                           <Calendar size={12} />
                           Next: {data.next_revision_date}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight">{data.name}</h2>
                </>
             )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-dim hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
            {loading ? (
                <div className="space-y-4">
                    <div className="h-4 w-full bg-dim/10 rounded" />
                    <div className="h-4 w-3/4 bg-dim/10 rounded" />
                </div>
            ) : (
                <>
                    {/* Link */}
                    <div>
                        <a
                            href={data.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-blue-400 font-medium transition-colors"
                        >
                            <ExternalLink size={16} />
                            Open Problem in LeetCode/GFG
                        </a>
                    </div>

                    {/* Question Section */}
                    {data.question && (
                        <div className="bg-background/50 rounded-xl border border-dim/20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-dim/10 flex items-center gap-2 text-sm font-semibold text-dim">
                                <Code size={16} />
                                Problem Statement
                            </div>
                            <div className="p-4">
                                <div className={`text-sm text-dim whitespace-pre-wrap leading-relaxed ${
                                    !questionExpanded ? 'max-h-16 overflow-hidden' : ''
                                }`}>
                                    {data.question}
                                </div>
                                {data.question.length > 150 && (
                                    <button
                                        onClick={() => setQuestionExpanded(!questionExpanded)}
                                        className="mt-2 text-xs text-primary hover:text-blue-400 font-medium transition-colors"
                                    >
                                        {questionExpanded ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Flashcard Section */}
                    {(data.flashcard_title || data.flashcard_code) && (
                        <div className="bg-background/50 rounded-xl border border-dim/20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-dim/10 flex items-center gap-2 text-sm font-semibold text-dim">
                                <BookOpen size={16} />
                                Your Notes
                            </div>
                            <div className="p-4 space-y-3">
                                {data.flashcard_title && (
                                    <p className="text-blue-200 font-medium">{data.flashcard_title}</p>
                                )}
                                {data.flashcard_code && (
                                    <div className="relative">
                                        <Code size={14} className="absolute left-3 top-3 text-dim" />
                                        <pre className="bg-[#0d1117] p-3 pl-9 rounded-lg text-xs font-mono text-dim overflow-x-auto">
                                            {data.flashcard_code}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* History / Analytics for this Problem */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-warning" />
                            Revision History
                        </h3>
                        <div className="space-y-2">
                            {data.revisions.sort((a,b) => b.revision_number - a.revision_number).map((rev) => (
                                <div key={rev.revision_number} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-white/5 border border-dim/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-dim/20 flex items-center justify-center text-xs font-mono text-dim">
                                            #{rev.revision_number}
                                        </span>
                                        <span className="text-sm text-dim">
                                            {rev.completed_date || "Scheduled (Pending)"}
                                        </span>
                                    </div>
                                    
                                    {/* Rating Badge */}
                                    {rev.rating ? (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            rev.rating === 3 ? 'bg-success/10 text-success' : 
                                            rev.rating === 2 ? 'bg-warning/10 text-warning' : 
                                            'bg-danger/10 text-danger'
                                        }`}>
                                            {rev.rating === 3 ? 'Mastered' : rev.rating === 2 ? 'Struggle' : 'Forgot'}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-dim italic">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProblemModal;