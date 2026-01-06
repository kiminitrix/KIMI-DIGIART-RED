
import React from 'react';
import { Trash2, Copy, Download, HeartOff, LayoutGrid } from 'lucide-react';
import { GeneratedImage } from '../types';

interface CollectableProps {
  darkMode: boolean;
  collections: GeneratedImage[];
  onRemove: (id: string) => void;
}

const Collectable: React.FC<CollectableProps> = ({ darkMode, collections, onRemove }) => {
  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `kimi-collect-${Date.now()}.png`;
    link.click();
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied!");
  };

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] opacity-30">
        <LayoutGrid size={80} />
        <h2 className="mt-6 text-2xl font-bold">Your collection is empty</h2>
        <p className="mt-2 text-lg">Save some art pieces to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">My Gallery</h2>
          <p className="opacity-60">Your saved masterpieces</p>
        </div>
        <div className="px-4 py-2 bg-red-600/10 text-red-600 rounded-full font-bold text-sm">
          {collections.length} Items
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collections.map((img) => (
          <div 
            key={img.id}
            className={`group rounded-3xl overflow-hidden border flex flex-col transition-all hover:scale-[1.02]
              ${darkMode ? 'bg-white/5 border-white/10 hover:border-red-600/30' : 'bg-white border-red-100 shadow-md hover:shadow-xl'}
            `}
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={img.url} className="w-full h-full object-cover" alt="Art" />
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                <button 
                  onClick={() => downloadImage(img.url)}
                  className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={() => onRemove(img.id)}
                  className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-black hover:text-white transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <p className={`text-sm italic line-clamp-3 mb-4 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  "{img.prompt}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-red-500/10">
                <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">
                  {new Date(img.timestamp).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => copyPrompt(img.prompt)}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-500 transition-colors"
                >
                  <Copy size={14} />
                  COPY PROMPT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collectable;
