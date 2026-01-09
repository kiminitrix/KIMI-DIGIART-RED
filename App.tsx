
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Imaginable from './pages/Imaginable';
import Editable from './pages/Editable';
import Promptable from './pages/Promptable';
import Collectable from './pages/Collectable';
import { AppTab, GeneratedImage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.IMAGINABLE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [collections, setCollections] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kimi_digiart_collections');
    if (saved) {
      setCollections(JSON.parse(saved));
    }
  }, []);

  const saveToCollection = (image: GeneratedImage) => {
    const newCollections = [image, ...collections];
    setCollections(newCollections);
    localStorage.setItem('kimi_digiart_collections', JSON.stringify(newCollections));
    alert("Saved to Collectable!");
  };

  const removeFromCollection = (id: string) => {
    const newCollections = collections.filter(img => img.id !== id);
    setCollections(newCollections);
    localStorage.setItem('kimi_digiart_collections', JSON.stringify(newCollections));
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.IMAGINABLE:
        return <Imaginable darkMode={darkMode} onSave={saveToCollection} />;
      case AppTab.EDITABLE:
        return <Editable darkMode={darkMode} onSave={saveToCollection} />;
      case AppTab.PROMPTABLE:
        return <Promptable darkMode={darkMode} />;
      case AppTab.COLLECTABLE:
        return <Collectable darkMode={darkMode} collections={collections} onRemove={removeFromCollection} />;
      default:
        return <Imaginable darkMode={darkMode} onSave={saveToCollection} />;
    }
  };

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'bg-black text-white' : 'bg-slate-50 text-black'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          title={activeTab}
        />
        <div className="flex-1 p-3 md:p-4 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
