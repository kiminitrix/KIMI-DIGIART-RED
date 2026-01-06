
import React from 'react';
import { Crown, Image, Edit, Search, FolderHeart, X } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab, darkMode }) => {
  const tabs = [
    { id: AppTab.IMAGINABLE, icon: <Image size={20} />, label: 'Imaginable' },
    { id: AppTab.EDITABLE, icon: <Edit size={20} />, label: 'Editable' },
    { id: AppTab.PROMPTABLE, icon: <Search size={20} />, label: 'Promptable' },
    { id: AppTab.COLLECTABLE, icon: <FolderHeart size={20} />, label: 'Collectable' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Off-canvas Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full w-72 transition-transform duration-300 ease-in-out z-[60] flex flex-col shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${darkMode ? 'bg-slate-950 border-r border-red-900/30' : 'bg-white border-r border-red-100'}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Crown size={24} />
            </div>
            <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
              KIMI <span className="text-red-600">DIGIART</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    onClose(); // Close on mobile after selection
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                      : `${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'}`
                    }
                  `}
                >
                  <span className="flex-shrink-0">{tab.icon}</span>
                  <span className="font-medium whitespace-nowrap">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6">
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-red-50 border-red-100 text-red-800'} text-xs font-medium`}>
            Premium AI Art Studio
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
