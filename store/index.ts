import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './device';
import roomReducer from './room';
import userReducer from './user';
import chatReducer from './chat';
import streamReducer from './stream';

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    room: roomReducer,
    user: userReducer,
    chat: chatReducer,
    stream: streamReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['stream/updateScreenStream'],
      ignoredPaths: ['stream.screen.stream']
    }
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;