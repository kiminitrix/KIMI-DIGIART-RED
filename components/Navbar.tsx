
import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, toggleSidebar }) => {
  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b sticky top-0 z-40 backdrop-blur-md
      ${darkMode ? 'bg-black/80 border-red-900/50' : 'bg-white/80 border-red-100'}
    `}>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'}`}
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <h2 className={`font-semibold hidden sm:block ${darkMode ? 'text-white' : 'text-black'}`}>Studio Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-colors
            ${darkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-black/5 text-slate-600 hover:bg-black/10'}
          `}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold leading-none">Artist Studio</p>
            <p className="text-[10px] opacity-50">PRO ACCESS</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-red-600/20">
            KD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
