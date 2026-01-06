
import React, { useState } from 'react';
import { ImagePlus, Sparkles, Loader2, Wand2 } from 'lucide-react';
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
      const files = Array.from(e.target.files).slice(0, 5);
      // Added explicit type to 'file' to fix 'unknown' type error in reader.readAsDataURL
      files.forEach((file: File) => {
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Upload Column */}
        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Reference Images</h3>
            <span className="text-xs text-red-500 font-medium">Up to 5 images</span>
          </div>
          <label className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
          `}>
            <ImagePlus className="text-red-600 mb-2" size={32} />
            <span className="text-sm opacity-60">Click to upload reference images</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {attachments.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-red-600/30">
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl-lg"
                >
                  < Loader2 size={12} className="rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Results Column */}
        <div className={`p-6 rounded-3xl min-h-[400px] border flex flex-col ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-sm'}`}>
          <h3 className="font-bold text-lg mb-4">Generated Results</h3>
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className="animate-spin text-red-600" size={48} />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={20} />
              </div>
              <p className="animate-pulse font-medium text-red-600">Forging your imagination...</p>
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
            <div className="flex-1 flex flex-col items-center justify-center opacity-30">
              <Wand2 size={64} />
              <p className="mt-4 font-medium">Your art will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Controls */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what's on your mind..."
              className={`w-full p-5 pr-32 rounded-2xl min-h-[120px] focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none
                ${darkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-red-50/20 border-red-100 text-black'}
              `}
            />
            <button
              onClick={handleEnhance}
              disabled={isEnhancing || !prompt}
              className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isEnhancing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              ENHANCE
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold uppercase tracking-wider mb-1 block opacity-50">Aspect Ratio</label>
              <select 
                value={ratio}
                onChange={(e) => setRatio(e.target.value as AspectRatio)}
                className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-red-600 outline-none
                  ${darkMode ? 'bg-black/50 border-white/10' : 'bg-white border-red-100'}
                `}
              >
                {RATIO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="text-xs font-bold uppercase tracking-wider mb-1 block opacity-50">Count</label>
              <select 
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-red-600 outline-none
                  ${darkMode ? 'bg-black/50 border-white/10' : 'bg-white border-red-100'}
                `}
              >
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="flex-shrink-0 h-[48px] mt-5 px-8 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-red-900/20 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imaginable;
