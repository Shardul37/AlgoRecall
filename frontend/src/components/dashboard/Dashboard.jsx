import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import NewProblemPanel from './NewProblemPanel';
import RevisionCard from './RevisionCard'; // <--- Import

const Dashboard = () => {
  const { todayRevisions, fetchTodayRevisions, loading } = useStore();

  useEffect(() => {
    fetchTodayRevisions();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* --- LEFT PANEL: REVISIONS (65%) --- */}
      <div className="w-full lg:w-[65%] space-y-6">
        
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Today's Focus</h2>
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {todayRevisions.length} Due
                </span>
                <span className="text-dim text-sm">{new Date().toDateString()}</span>
            </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
            <div className="text-center py-20 text-dim animate-pulse">
                Loading your schedule...
            </div>
        )}

        {/* EMPTY STATE */}
        {!loading && todayRevisions.length === 0 && (
            <div className="bg-surface border border-surface rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-dim text-center">
               <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🎉</span>
               </div>
               <p className="text-lg text-white font-medium">All caught up!</p>
               <p className="text-sm mt-1">No revisions due today. Add a new problem to build your streak.</p>
            </div>
        )}

        {/* LIST STATE */}
        <div className="space-y-4">
            {todayRevisions.map((rev) => (
                <RevisionCard key={rev.id} revision={rev} />
            ))}
        </div>

      </div>

      {/* --- RIGHT PANEL: ADD NEW (35%) --- */}
      <div className="w-full lg:w-[35%]">
        <NewProblemPanel />
      </div>

    </div>
  );
};

export default Dashboard;