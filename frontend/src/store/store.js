import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import errorReducer from './slices/errorSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    chat: chatReducer,
  },
});

export default store;
