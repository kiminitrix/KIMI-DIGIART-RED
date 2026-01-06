
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className={`p-8 rounded-3xl border text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-lg'}`}>
        <h2 className="text-2xl font-bold mb-2">Image to Prompt</h2>
        <p className="opacity-60 mb-8">Upload an image to reverse-engineer its creative prompt.</p>

        <label className={`block w-full h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
          ${darkMode ? 'border-white/20 hover:border-red-600/50 bg-white/5' : 'border-red-200 hover:border-red-500 bg-red-50/30'}
        `}>
          {image ? (
            <img src={image} className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="p-5 bg-red-600 text-white rounded-full mb-4 shadow-lg shadow-red-900/40">
                <Upload size={32} />
              </div>
              <span className="font-bold text-lg">Drop your art here</span>
              <span className="text-sm opacity-50">Supports PNG, JPG, WEBP</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>

      {isGenerating ? (
        <div className={`p-12 rounded-3xl border flex flex-col items-center justify-center gap-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100'}`}>
          <Loader2 className="animate-spin text-red-600" size={48} />
          <p className="font-medium">Analyzing artistic style and composition...</p>
        </div>
      ) : resultPrompt && (
        <div className={`p-8 rounded-3xl border transition-all animate-in fade-in slide-in-from-bottom-4 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-red-100 shadow-xl'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-600">
              <FileText size={20} />
              <span className="font-bold uppercase tracking-widest text-xs">Generated Prompt</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${copied ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}
              `}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'COPIED!' : 'COPY PROMPT'}
            </button>
          </div>
          <div className={`p-6 rounded-2xl font-medium leading-relaxed italic text-lg
            ${darkMode ? 'bg-black/40 text-gray-200' : 'bg-red-50/50 text-gray-800'}
          `}>
            "{resultPrompt}"
          </div>
        </div>
      )}
    </div>
  );
};

export default Promptable;
