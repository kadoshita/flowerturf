import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeviceInfo = {
  deviceId: string;
};

export type DeviceState = {
  audioInput: DeviceInfo;
  audioOutput: DeviceInfo;
};

export type UpdateAudioInputDevicePayload = string;
export type UpdateAudioOutputDevicePayload = string;
const initialState: DeviceState = {
  audioInput: {
    deviceId: ''
  },
  audioOutput: {
    deviceId: ''
  }
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    updateAudioInputDevice(state, action: PayloadAction<UpdateAudioInputDevicePayload>) {
      state.audioInput = { deviceId: action.payload };
    },
    updateAudioOutputDevice(state, action: PayloadAction<UpdateAudioOutputDevicePayload>) {
      state.audioOutput = { deviceId: action.payload };
    }
  }
});

export const { updateAudioInputDevice, updateAudioOutputDevice } = deviceSlice.actions;
export default deviceSlice.reducer;