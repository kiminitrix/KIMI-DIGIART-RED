
import React from 'react';
import { Crown, Image, Edit, Search, FolderHeart, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab, darkMode }) => {
  const tabs = [
    { id: AppTab.IMAGINABLE, icon: <Image size={20} />, label: 'Imaginable' },
    { id: AppTab.EDITABLE, icon: <Edit size={20} />, label: 'Editable' },
    { id: AppTab.PROMPTABLE, icon: <Search size={20} />, label: 'Promptable' },
    { id: AppTab.COLLECTABLE, icon: <FolderHeart size={20} />, label: 'Collectable' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-50 flex flex-col
        ${isOpen ? 'w-64' : 'w-20'} 
        ${darkMode ? 'bg-black border-r border-red-900' : 'bg-white border-r border-red-100'}
      `}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-lg text-white">
          <Crown size={24} />
        </div>
        {isOpen && (
          <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
            KIMI <span className="text-red-600">DIGIART</span>
          </span>
        )}
      </div>

      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : `${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'}`
                  }
                `}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                {isOpen && <span className="font-medium whitespace-nowrap">{tab.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`m-4 p-2 rounded-full border border-red-600/30 flex items-center justify-center
          ${darkMode ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-black/10'}
        `}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
};

export default Sidebar;
