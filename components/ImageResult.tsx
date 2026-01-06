
import React, { useState } from 'react';
import { Download, Heart, Maximize2, X } from 'lucide-react';

interface ImageResultProps {
  url: string;
  prompt: string;
  onSave?: () => void;
  darkMode: boolean;
}

const ImageResult: React.FC<ImageResultProps> = ({ url, prompt, onSave, darkMode }) => {
  const [isFullView, setIsFullView] = useState(false);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `kimi-art-${Date.now()}.png`;
    link.click();
  };

  return (
    <>
      <div className={`group relative rounded-2xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
        <img src={url} alt="Generated Art" className="w-full aspect-square object-cover" />
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={() => setIsFullView(true)}
            className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all"
            title="View Large"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            onClick={downloadImage}
            className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all"
            title="Download"
          >
            <Download size={20} />
          </button>
          {onSave && (
            <button 
              onClick={onSave}
              className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg transition-all"
              title="Save to Collections"
            >
              <Heart size={20} />
            </button>
          )}
        </div>
      </div>

      {isFullView && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
          <button 
            onClick={() => setIsFullView(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
          >
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full flex flex-col items-center gap-4">
            <img src={url} alt="Full View" className="max-h-[80vh] object-contain rounded-lg" />
            <p className="text-white text-center max-w-2xl text-lg italic opacity-80">
              "{prompt}"
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageResult;
