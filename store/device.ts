import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeviceInfo = {
  deviceId: string;
};

export type DeviceState = {
  audioInput: DeviceInfo;
};

export type UpdateAudioInputDevicePayload = string;
const initialState: DeviceState = {
  audioInput: {
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
    reset(): DeviceState {
      return initialState;
    }
  }
});

export const { updateAudioInputDevice, reset } = deviceSlice.actions;
export default deviceSlice.reducer;