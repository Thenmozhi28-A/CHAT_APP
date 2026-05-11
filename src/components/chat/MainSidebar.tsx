import React from 'react';
import { LogOut, Activity, Radio, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '@/assets/LOGO.png';

interface MainSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-[#0F0F15] z-20">
      <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <img src={logo} alt="nxtReach" className="w-10 h-10 object-contain" />
      </div>
      
      <div className="flex flex-col gap-6 flex-1 items-center w-full">
          <div className="relative flex items-center justify-center w-full">
            {activeTab === 'PROCESS1' && (
              <div className="absolute left-0 w-1 h-8 bg-[#8B5CF6] rounded-r-full shadow-[0_0_15px_#8B5CF6]" />
            )}
            <button 
              type="button"
              aria-label="Process Activity"
              className={`p-4 rounded-2xl transition-all ${activeTab === 'PROCESS1' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-xl border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
              onClick={() => onTabChange('PROCESS1')}
            >
                <Activity className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative flex items-center justify-center w-full">
            {activeTab === 'CHAT' && (
              <div className="absolute left-0 w-1 h-8 bg-[#8B5CF6] rounded-r-full shadow-[0_0_15px_#8B5CF6]" />
            )}
            <button 
              type="button"
              aria-label="Chats"
              className={`p-4 rounded-2xl transition-all ${activeTab === 'CHAT' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-xl border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
              onClick={() => onTabChange('CHAT')}
            >
                <MessageSquare className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center w-full">
            {activeTab === 'PROCESS2' && (
              <div className="absolute left-0 w-1 h-8 bg-[#8B5CF6] rounded-r-full shadow-[0_0_15px_#8B5CF6]" />
            )}
            <button 
              type="button"
              aria-label="Radio"
              className={`p-4 rounded-2xl transition-all ${activeTab === 'PROCESS2' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-xl border border-white/10' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
              onClick={() => onTabChange('PROCESS2')}
            >
                <Radio className="w-5 h-5" />
            </button>
          </div>
      </div>

      <button 
        type="button"
        aria-label="Logout"
        onClick={onLogout}
        className="p-4 rounded-2xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MainSidebar;
