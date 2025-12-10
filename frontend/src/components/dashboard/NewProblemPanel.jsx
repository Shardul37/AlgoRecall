import React, { useState } from 'react';
import { Plus, Link as LinkIcon, BookOpen, Code, CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../utils/constants';

const NewProblemPanel = () => {
  const { addProblem } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    category: CATEGORIES[0],
    question: '',
    flashcard_title: '',
    flashcard_code: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Call the store action
    const result = await addProblem(formData);
    
    setLoading(false);
    if (result) {
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        link: '',
        category: CATEGORIES[0],
        question: '',
        flashcard_title: '',
        flashcard_code: ''
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-surface border border-dim/20 rounded-xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="text-primary" size={20} />
        Add New Problem
      </h3>

      {success && (
        <div className="mb-4 p-3 bg-success/10 text-success border border-success/20 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle size={16} />
          <span>Problem added! First revision scheduled for tomorrow.</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-dim uppercase mb-1 block">Problem Name</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Two Sum"
            className="w-full bg-background border border-dim/30 rounded p-2 text-sm focus:border-primary focus:outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Question */}
        <div>
          <label className="text-xs font-medium text-dim uppercase mb-1 block">Problem Question</label>
          <textarea
            rows="4"
            placeholder="Paste the full problem description here..."
            className="w-full bg-background border border-dim/30 rounded p-2 text-sm focus:border-primary focus:outline-none resize-none"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
          />
        </div>

        {/* Link & Category Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-dim uppercase mb-1 block">Link</label>
            <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-2.5 text-dim" />
                <input 
                    type="url" 
                    required
                    placeholder="https://..."
                    className="w-full bg-background border border-dim/30 rounded p-2 pl-9 text-sm focus:border-primary focus:outline-none"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-dim uppercase mb-1 block">Category</label>
            <select 
                className="w-full bg-background border border-dim/30 rounded p-2 text-sm focus:border-primary focus:outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Flashcard (Optional) */}
        <div className="pt-2 border-t border-dim/20">
            <p className="text-xs text-dim mb-3">Flashcard (Optional)</p>
            
            <div className="space-y-3">
                <div className="relative">
                    <BookOpen size={14} className="absolute left-3 top-2.5 text-dim" />
                    <input 
                        type="text" 
                        placeholder="Quick Hint / Title"
                        className="w-full bg-background border border-dim/30 rounded p-2 pl-9 text-sm focus:border-primary focus:outline-none"
                        value={formData.flashcard_title}
                        onChange={(e) => setFormData({...formData, flashcard_title: e.target.value})}
                    />
                </div>

                <div className="relative">
                    <Code size={14} className="absolute left-3 top-3 text-dim" />
                    <textarea 
                        rows="3"
                        placeholder="Paste key logic / snippet here..."
                        className="w-full bg-background border border-dim/30 rounded p-2 pl-9 text-sm font-mono focus:border-primary focus:outline-none resize-none"
                        value={formData.flashcard_code}
                        onChange={(e) => setFormData({...formData, flashcard_code: e.target.value})}
                    ></textarea>
                </div>
            </div>
        </div>
        
        <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 rounded font-medium transition-all ${
                loading 
                ? 'bg-dim/50 cursor-not-allowed text-dim' 
                : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20'
            }`}
        >
            {loading ? 'Saving...' : 'Add Problem'}
        </button>
      </form>
    </div>
  );
};

export default NewProblemPanel;