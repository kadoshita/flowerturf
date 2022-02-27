import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalVideoStream, RemoteVideoStream } from '@skyway-sdk/core';

export type LocalScreenStream = {
  isSharing: true;
  stream: LocalVideoStream;
};
export type RemoteScreenStream = {
  isSharing: false;
  stream: RemoteVideoStream | null;
};
export type ScreenStream = LocalScreenStream | RemoteScreenStream;
export type StreamState = {
  screen: ScreenStream;
};

export type UpdateScreenStreamPayload = ScreenStream;

const initialState: StreamState = {
  screen: {
    isSharing: false,
    stream: null
  }
};

export const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    updateScreenStream(state, action: PayloadAction<UpdateScreenStreamPayload>) {
      state.screen = action.payload;
    }
  }
});

export const { updateScreenStream } = streamSlice.actions;
export default streamSlice.reducer;