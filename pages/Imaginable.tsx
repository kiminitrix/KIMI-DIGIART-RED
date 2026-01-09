
import React, { useState } from 'react';
import { ImagePlus, Sparkles, Loader2, Wand2, X } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { GeneratedImage, RATIO_OPTIONS, AspectRatio } from '../types';
import ImageResult from '../components/ImageResult';

interface ImaginableProps {
  darkMode: boolean;
  onSave: (img: GeneratedImage) => void;
}

const Imaginable: React.FC<ImaginableProps> = ({ darkMode, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<AspectRatio>('1:1');
  const [count, setCount] = useState(1);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - attachments.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      filesToAdd.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, reader.result as string].slice(0, 5));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleEnhance = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await GeminiService.enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const newResults: GeneratedImage[] = [];
      for (let i = 0; i < count; i++) {
        const url = await GeminiService.generateImage(prompt, ratio, attachments);
        newResults.push({
          id: Math.random().toString(36).substr(2, 9),
          url,
          prompt,
          timestamp: Date.now(),
        });
      }
      setResults(newResults);
    } catch (err) {
      alert("Failed to generate image. Please check API key or prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full max-w-7xl mx-auto flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column: Inputs & Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Reference Images Section */}
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Reference Images</h3>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Max 5</span>
            </div>
            
            <div className={`flex items-center gap-3 ${attachments.length > 0 ? 'overflow-x-auto custom-scrollbar pb-2' : ''}`}>
              {/* Upload Box */}
              <label className={`shrink-0 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[0.98] active:scale-95
                ${attachments.length === 0 ? 'w-full h-28' : 'w-20 h-20'}
                ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
              `}>
                <ImagePlus className="text-red-600 mb-1" size={attachments.length === 0 ? 24 : 18} />
                <span className={`${attachments.length === 0 ? 'text-[11px]' : 'text-[8px]'} opacity-60 text-center px-1 font-medium`}>
                  {attachments.length === 0 ? 'Click to upload' : 'Click to upload'}
                </span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>

              {/* Thumbnails */}
              {attachments.map((img, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-red-600/30 group">
                  <img src={img} className="w-full h-full object-cover" alt="ref" />
                  <button 
                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Section */}
          <div className={`p-4 rounded-2xl border flex-1 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
            <div className="flex flex-col h-full gap-4">
              <div className="relative flex-1 flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block opacity-50">Prompt</label>
                <div className="relative flex-1">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what's on your mind..."
                    className={`w-full h-full p-3 pr-10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none text-sm
                      ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-red-50/20 border-red-100 text-black'}
                    `}
                  />
                  <button
                    onClick={handleEnhance}
                    disabled={isEnhancing || !prompt}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    title="Enhance Prompt"
                  >
                    {isEnhancing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block opacity-50">Ratio</label>
                  <select 
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value as AspectRatio)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-600 outline-none text-xs
                      ${darkMode ? 'bg-black border-white/10' : 'bg-white border-red-100'}
                    `}
                  >
                    {RATIO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-1 block opacity-50">Count</label>
                  <select 
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-red-600 outline-none text-xs
                      ${darkMode ? 'bg-black border-white/10' : 'bg-white border-red-100'}
                    `}
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 text-xs"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                <span className="tracking-widest uppercase">Generate Art</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 h-full flex flex-col">
          <div className={`flex-1 p-4 rounded-2xl border flex flex-col overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
            <h3 className="font-bold text-sm mb-3">Generated Results</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={16} />
                  </div>
                  <p className="animate-pulse font-bold text-red-600 uppercase tracking-tighter">Forging art...</p>
                </div>
              ) : results.length > 0 ? (
                <div className={`grid gap-4 ${count > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {results.map((res) => (
                    <ImageResult 
                      key={res.id} 
                      url={res.url} 
                      prompt={res.prompt} 
                      darkMode={darkMode} 
                      onSave={() => onSave(res)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <Wand2 size={60} />
                  <p className="mt-4 font-bold uppercase tracking-widest text-sm">Canvas Awaiting Inspiration</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imaginable;
