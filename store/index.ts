import { combineReducers, configureStore } from '@reduxjs/toolkit';
import deviceReducer from './device';
import roomReducer from './room';
import userReducer from './user';
import chatReducer from './chat';
import streamReducer from './stream';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const combinedReducers = combineReducers({
  device: deviceReducer,
  room: roomReducer,
  user: userReducer,
  chat: chatReducer,
  stream: streamReducer
});

// ref: https://github.com/vercel/next.js/discussions/15687#discussioncomment-45319
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const _storage = typeof window !== 'undefined' ? storage : createNoopStorage();
const persistConfig = {
  key: 'root',
  storage: _storage,
  whitelist: ['device', 'user']
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'stream/updateScreenStream'],
      ignoredPaths: ['stream.screen.stream']
    }
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);