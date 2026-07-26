import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setActiveChat, clearActiveChat, deleteChat } from '../../store/slices/chatSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { Plus, MessageSquare, LogOut, Settings, Menu, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleNewChat = () => {
    dispatch(clearActiveChat());
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surfaceHover rounded-md text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-border border-y-0 border-l-0 flex flex-col h-full rounded-none"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="font-bold text-xl tracking-tight text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-background text-sm">P</span>
                <span>Perplexity</span>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button 
                onClick={handleNewChat}
                className="w-full flex items-center justify-center space-x-2 bg-surfaceHover hover:bg-white/10 text-white py-2.5 rounded-lg transition-colors border border-border"
              >
                <Plus className="w-4 h-4" />
                <span>New Thread</span>
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Recent Threads
              </div>
              {chats.map((chat) => (
                <div 
                  key={chat._id}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    activeChatId === chat._id ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-surfaceHover'
                  }`}
                  onClick={() => dispatch(setActiveChat(chat._id))}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{chat.title}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteChat(chat._id));
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold uppercase flex-shrink-0">
                    {user?.username?.[0] || 'U'}
                  </div>
                  <div className="truncate text-sm font-medium text-gray-200">
                    {user?.username}
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(logoutUser())}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
