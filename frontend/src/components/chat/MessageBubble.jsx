import React from 'react';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 ml-4' : 'bg-primary mr-4'}`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-background" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-tr-sm' 
              : 'glass-panel rounded-tl-sm'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>

          {/* Source Cards */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-surfaceHover border border-border px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-xs text-gray-300 max-w-[200px]"
                >
                  <div className="w-4 h-4 bg-gray-700 text-gray-300 rounded flex items-center justify-center font-mono text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="truncate">{source.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default MessageBubble;
