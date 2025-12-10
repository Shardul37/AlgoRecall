import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Code, HelpCircle } from 'lucide-react';

const Flashcard = ({ question, title, code }) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!question && !title && !code) return null;

  // Function to add line numbers to code
  const formatCode = (codeText) => {
    if (!codeText) return '';
    const lines = codeText.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-500 text-xs mr-4 select-none w-8 text-right">
          {index + 1}
        </span>
        <span className="text-gray-300 font-mono text-sm leading-relaxed">
          {line || '\u00A0'}
        </span>
      </div>
    ));
  };

  return (
    <div className="mt-3 border-t border-dim/20 pt-2 space-y-2">

      {/* Question Dropdown */}
      {question && (
        <div>
          <button
            onClick={() => setShowQuestion(!showQuestion)}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-blue-400 transition-colors"
          >
            <HelpCircle size={14} className={showQuestion ? 'fill-primary' : ''} />
            {showQuestion ? 'Hide Question' : 'Show Question'}
            {showQuestion ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showQuestion && (
            <div className="mt-2 bg-background/50 rounded-lg border border-dim/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 text-sm text-gray-300 leading-relaxed">
                {question}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hint/Title and Code Section */}
      {(title || code) && (
        <div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-blue-400 transition-colors"
          >
            <Zap size={14} className={showCode ? 'fill-primary' : ''} />
            {showCode ? 'Hide Hint & Code' : 'Show Hint & Code'}
            {showCode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCode && (
            <div className="mt-2 bg-background/50 rounded-lg border border-dim/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {title && (
                    <div className="px-4 py-2 bg-primary/10 border-b border-primary/10 text-sm text-blue-200 font-medium">
                        {title}
                    </div>
                )}
                {code && (
                    <div className="p-4 bg-[#0d1117] overflow-x-auto">
                        <div className="font-mono text-sm">
                            {formatCode(code)}
                        </div>
                    </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcard;