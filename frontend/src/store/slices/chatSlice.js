import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, thunkAPI) => {
  try {
    const response = await api.get('/chats');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId, thunkAPI) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`);
    return { chatId, messages: response.data.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
  }
});

export const createChat = createAsyncThunk('chat/createChat', async (_, thunkAPI) => {
  try {
    const response = await api.post('/chats');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to create chat');
  }
});

export const deleteChat = createAsyncThunk('chat/deleteChat', async (chatId, thunkAPI) => {
  try {
    await api.delete(`/chats/${chatId}`);
    return chatId;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to delete chat');
  }
});

// Store the controller outside so we can access it via a regular export or action
let abortController = null;

export const sendMessage = createAsyncThunk('chat/sendMessage', async (payload, thunkAPI) => {
  try {
    if (abortController) abortController.abort(); // abort any existing request
    abortController = new AbortController();
    
    const response = await api.post('/chats/message', payload, {
      signal: abortController.signal
    });
    return response.data.data; // { chatId, userMessage, aiMessage }
  } catch (error) {
    if (error.name === 'CanceledError' || error.message === 'canceled') {
      return thunkAPI.rejectWithValue('Generation stopped');
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

export const stopGeneration = () => (dispatch) => {
  if (abortController) {
    abortController.abort();
    dispatch(chatSlice.actions.setStopped());
  }
};

const initialState = {
  chats: [],
  activeChatId: null,
  messages: [], // Messages for the active chat
  loading: false,
  messageLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      state.messages = []; // Clear messages when switching chats (will be loaded by fetchMessages)
    },
    clearActiveChat: (state) => {
      state.activeChatId = null;
      state.messages = [];
    },
    setStopped: (state) => {
      state.messageLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => { state.loading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state) => { state.loading = false; })
      
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (state.activeChatId === action.payload.chatId) {
          state.messages = action.payload.messages;
        }
      })
      
      // Create Chat
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.activeChatId = action.payload._id;
        state.messages = [];
      })
      
      // Delete Chat
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(c => c._id !== action.payload);
        if (state.activeChatId === action.payload) {
          state.activeChatId = null;
          state.messages = [];
        }
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => { state.messageLoading = true; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        const { chatId, userMessage, aiMessage } = action.payload;
        
        // If it was a new chat, add it to the list
        if (!state.chats.find(c => c._id === chatId)) {
          // We don't have the full chat object with title here from the response, 
          // but we can trigger a refetch of chats or mock it.
          // For simplicity, we just set the activeChatId and let the UI handle fetching.
          state.activeChatId = chatId;
        }
        
        // Append messages to current active view
        state.messages.push(userMessage, aiMessage);
      })
      .addCase(sendMessage.rejected, (state) => { state.messageLoading = false; });
  },
});

export const { setActiveChat, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
