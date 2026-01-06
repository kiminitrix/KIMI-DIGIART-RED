
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Inputs (Image + Prompt) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Source Image Upload Area */}
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <h3 className="font-bold text-lg mb-4">Source Image</h3>
            <label className={`w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
              ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
            `}>
              {baseImage ? (
                <img src={baseImage} className="w-full h-full object-contain" />
              ) : (
                <>
                  <Upload className="text-red-600 mb-2" size={32} />
                  <span className="text-sm opacity-60">Upload image to edit</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* Modification Controls Section */}
          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-50">Modification Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'Add a cyberpunk visor', 'Change the sky to sunset'..."
                  className={`w-full p-4 rounded-2xl min-h-[120px] focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none
                    ${darkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-red-50/20 border-red-100 text-black'}
                  `}
                />
              </div>
              <button
                onClick={handleEdit}
                disabled={isEditing || !baseImage || !prompt}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 transition-all disabled:opacity-50"
              >
                {isEditing ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
                <span className="tracking-widest uppercase">Apply Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Result Preview */}
        <div className="lg:col-span-7">
          <div className={`p-6 rounded-3xl min-h-[600px] border flex flex-col ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <h3 className="font-bold text-lg mb-6">Edit Result</h3>
            {isEditing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Loader2 className="animate-spin text-red-600" size={64} />
                  <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
                </div>
                <p className="animate-pulse font-medium text-red-600 text-lg">Refining pixels...</p>
                <p className="text-sm opacity-50">Reimagining your artwork</p>
              </div>
            ) : result ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <ImageResult url={result.url} prompt={result.prompt} darkMode={darkMode} onSave={() => onSave(result)} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <Sparkles size={80} />
                <p className="mt-6 text-xl font-medium">Edit preview will appear here</p>
                <p className="mt-2 text-sm text-center max-w-xs">Upload an image and describe your changes on the left panel to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editable;
