import React from 'react';
import { BookOpen, Code, Search, Lightbulb } from 'lucide-react';
import InputBar from './InputBar';
import { motion } from 'framer-motion';

const Hero = ({ onSendMessage, loading }) => {
  const suggestions = [
    { icon: <Lightbulb />, text: "Explain quantum computing simply" },
    { icon: <Code />, text: "Write a React authentication hook" },
    { icon: <Search />, text: "Latest news on space exploration" },
    { icon: <BookOpen />, text: "Summarize the plot of Dune" }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 w-full h-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
          Where knowledge begins
        </h1>
        <p className="text-lg text-gray-400">
          Ask anything. Search everything.
        </p>
      </motion.div>

      <div className="w-full mb-12">
        <InputBar onSendMessage={onSendMessage} loading={loading} />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl"
      >
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage({ message: item.text, modelChoice: 'groq', webSearch: false })}
            className="flex items-center space-x-3 glass-panel p-4 rounded-xl hover:bg-surfaceHover transition-colors text-left group"
          >
            <div className="text-primary group-hover:scale-110 transition-transform">
              {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
            </div>
            <span className="text-sm text-gray-300 font-medium">{item.text}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;
