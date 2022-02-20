import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './device';
import roomReducer from './room';

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    room: roomReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;