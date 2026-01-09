
import React, { useState } from 'react';
import { Upload, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { GeneratedImage } from '../types';
import ImageResult from '../components/ImageResult';

interface EditableProps {
  darkMode: boolean;
  onSave: (img: GeneratedImage) => void;
}

const Editable: React.FC<EditableProps> = ({ darkMode, onSave }) => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBaseImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!baseImage || !prompt) return;
    setIsEditing(true);
    try {
      const url = await GeminiService.editImage(baseImage, prompt);
      const newImg = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        prompt: `Edited: ${prompt}`,
        timestamp: Date.now(),
      };
      setResult(newImg);
    } catch (err) {
      alert("Editing failed. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="h-full max-w-7xl mx-auto flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: Source & Modification Prompt */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
          
          {/* Source Image */}
          <div className={`p-4 rounded-2xl border flex flex-col ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <h3 className="font-bold text-sm mb-2">Source Image</h3>
            <label className={`flex-1 min-h-[150px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
              ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
            `}>
              {baseImage ? (
                <img src={baseImage} className="w-full h-full object-contain" />
              ) : (
                <>
                  <Upload className="text-red-600 mb-1" size={24} />
                  <span className="text-xs opacity-60">Upload Source</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* Modification Controls Section */}
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block opacity-50">Modification Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'Add a cyberpunk visor'..."
                  className={`w-full p-3 rounded-xl min-h-[80px] focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none text-sm
                    ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-red-50/20 border-red-100 text-black'}
                  `}
                />
              </div>
              <button
                onClick={handleEdit}
                disabled={isEditing || !baseImage || !prompt}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 text-xs"
              >
                {isEditing ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                <span className="tracking-widest uppercase">Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Result Preview */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <div className={`flex-1 p-4 rounded-2xl border flex flex-col overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <h3 className="font-bold text-sm mb-3">Edit Result</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isEditing ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={16} />
                  </div>
                  <p className="animate-pulse font-bold text-red-600">Reimagining...</p>
                </div>
              ) : result ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <ImageResult url={result.url} prompt={result.prompt} darkMode={darkMode} onSave={() => onSave(result)} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <Sparkles size={60} />
                  <p className="mt-4 font-bold">Pixel Evolution Awaits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editable;
