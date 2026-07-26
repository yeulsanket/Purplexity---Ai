import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/sidebar/Sidebar';
import Hero from '../components/chat/Hero';
import ChatArea from '../components/chat/ChatArea';
import { fetchMessages, sendMessage, fetchChats } from '../store/slices/chatSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { activeChatId, messageLoading } = useSelector((state) => state.chat);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (activeChatId) {
      dispatch(fetchMessages(activeChatId));
    }
  }, [activeChatId, dispatch]);

  const handleSendMessage = async (payload) => {
    const isNewChat = !activeChatId;
    
    // Add activeChatId to payload if we are in an existing chat
    const actionResult = await dispatch(sendMessage({
      ...payload,
      chatId: activeChatId
    }));
    
    // If we just sent a message to a new chat, refresh the chat list in the sidebar
    if (isNewChat && sendMessage.fulfilled.match(actionResult)) {
      dispatch(fetchChats());
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {activeChatId ? (
          <ChatArea onSendMessage={handleSendMessage} />
        ) : (
          <Hero onSendMessage={handleSendMessage} loading={messageLoading} />
        )}
      </main>
    </div>
  );
};

export default Home;
