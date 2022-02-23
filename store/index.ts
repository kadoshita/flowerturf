import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './device';
import roomReducer from './room';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    room: roomReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;