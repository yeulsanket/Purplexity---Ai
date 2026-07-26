import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { Loader2 } from 'lucide-react';

const ChatArea = ({ onSendMessage }) => {
  const { messages, loading, messageLoading } = useSelector((state) => state.chat);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messageLoading]);

  return (
    <div className="flex-1 flex flex-col h-full w-full relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <MessageBubble key={msg._id || idx} message={msg} />
              ))}
              {messageLoading && (
                <div className="flex w-full justify-start mb-6">
                  <div className="flex max-w-[85%] flex-row">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary mr-4 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-background animate-spin" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="px-5 py-4 rounded-2xl glass-panel rounded-tl-sm flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-4 w-full shrink-0">
        <InputBar onSendMessage={onSendMessage} loading={messageLoading} />
      </div>
    </div>
  );
};

export default ChatArea;
