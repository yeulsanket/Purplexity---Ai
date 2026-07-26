import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Send, Loader2, Search, Globe, Square } from 'lucide-react';
import { stopGeneration } from '../../store/slices/chatSlice';

const InputBar = ({ onSendMessage, loading }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [modelChoice, setModelChoice] = useState('groq');
  const [webSearch, setWebSearch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSendMessage({ message, modelChoice, webSearch });
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 relative">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-3 flex flex-col focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent text-white resize-none outline-none max-h-48 min-h-[56px] px-2 py-2"
          rows={1}
        />
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center space-x-2">
            {/* Model Selector */}
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              className="bg-surfaceHover text-xs text-gray-300 rounded-md px-2 py-1.5 outline-none cursor-pointer border border-border"
            >
              <option value="groq">Groq (Fast)</option>
              <option value="gemini">Gemini</option>
              <option value="mistral">Mistral</option>
            </select>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={() => setWebSearch(!webSearch)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                webSearch 
                  ? 'bg-primary/20 text-primary border-primary/50' 
                  : 'bg-transparent text-gray-400 border-border hover:bg-surfaceHover'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Search</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {loading ? (
              <button
                type="button"
                onClick={() => dispatch(stopGeneration())}
                className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/30 transition-colors flex items-center justify-center"
                title="Stop Generation"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-primary text-background p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputBar;
