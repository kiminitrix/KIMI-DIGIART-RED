
import React, { useState } from 'react';
import { Upload, Loader2, Copy, Check, FileText } from 'lucide-react';
import { GeminiService } from '../services/gemini';

interface PromptableProps {
  darkMode: boolean;
}

const Promptable: React.FC<PromptableProps> = ({ darkMode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [resultPrompt, setResultPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        generatePrompt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePrompt = async (base64: string) => {
    setIsGenerating(true);
    try {
      const prompt = await GeminiService.imageToPrompt(base64);
      setResultPrompt(prompt);
    } catch (err) {
      alert("Failed to analyze image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col gap-4 overflow-hidden">
      <div className={`p-6 rounded-2xl border text-center shrink-0 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
        <h2 className="text-xl font-bold mb-1 uppercase tracking-tight">Image to Prompt</h2>
        <p className="text-[10px] opacity-60 mb-4">Reverse-engineer art into text</p>

        <label className={`block w-full h-48 md:h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
          ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
        `}>
          {image ? (
            <img src={image} className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="p-3 bg-red-600 text-white rounded-full mb-2 shadow-lg">
                <Upload size={20} />
              </div>
              <span className="font-bold text-sm">Drop your art here</span>
              <span className="text-[10px] opacity-50">Supports PNG, JPG, WEBP</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isGenerating ? (
          <div className={`p-8 rounded-2xl border flex flex-col items-center justify-center gap-3 h-full ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100'}`}>
            <Loader2 className="animate-spin text-red-600" size={32} />
            <p className="text-xs font-bold text-red-600 animate-pulse uppercase tracking-widest">Decoding Visuals...</p>
          </div>
        ) : resultPrompt && (
          <div className={`p-6 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-xl'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-600">
                <FileText size={16} />
                <span className="font-bold uppercase tracking-widest text-[10px]">Generated Prompt</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                  ${copied ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}
                `}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <div className={`p-4 rounded-xl font-medium leading-relaxed italic text-sm
              ${darkMode ? 'bg-black border border-white/5 text-gray-200' : 'bg-red-50/50 text-gray-800'}
            `}>
              "{resultPrompt}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promptable;
