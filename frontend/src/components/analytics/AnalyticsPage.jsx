import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, CheckCircle, Database, TrendingUp } from 'lucide-react';
import useStore from '../../store/useStore';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-surface border border-dim/20 rounded-xl p-6 flex items-center justify-between">
    <div>
        <p className="text-dim text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
        <Icon size={24} />
    </div>
  </div>
);

const AnalyticsPage = () => {
  const { analyticsData, fetchAnalytics, loading } = useStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analyticsData) {
    return <div className="text-center py-20 text-dim animate-pulse">Crunching the numbers...</div>;
  }

  // Sort categories by count (High to Low) for better chart
  const chartData = [...analyticsData.category_breakdown].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Your Progress</h2>
        <p className="text-dim">Tracking your journey to mastery.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Current Streak" 
            value={`${analyticsData.current_streak} Days`} 
            icon={Flame} 
            color="warning" // Orange
        />
        <StatCard 
            title="Total Solved" 
            value={analyticsData.total_problems} 
            icon={Database} 
            color="primary" // Blue
        />
        <StatCard 
            title="Total Revisions" 
            value={analyticsData.total_revisions} 
            icon={CheckCircle} 
            color="success" // Green
        />
      </div>

      {/* Charts Row */}
      <div className="bg-surface border border-dim/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Category Distribution
        </h3>
        
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis 
                        dataKey="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;