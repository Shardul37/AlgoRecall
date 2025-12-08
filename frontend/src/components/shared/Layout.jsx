import React from 'react';
import { LayoutGrid, Calendar, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // <--- Import these

// Helper Component for Links
const NavItem = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive 
        ? 'bg-primary/20 text-primary' 
        : 'text-dim hover:text-white hover:bg-surface'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <nav className="h-16 border-b border-surface bg-background/50 backdrop-blur-md fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-400 rounded-lg flex items-center justify-center">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AlgoRecall</span>
          </div>

          <div className="flex gap-1">
            <NavItem icon={LayoutGrid} label="Dashboard" to="/dashboard" />
            <NavItem icon={Calendar} label="Calendar" to="/calendar" />
            <NavItem icon={BarChart2} label="Analytics" to="/analytics" />
          </div>

        </div>
      </nav>

      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;