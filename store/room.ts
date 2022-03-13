import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RoomInfo = {
  name: string;
};

export type RoomState = {
  room: RoomInfo;
};

export type UpdateRoomNamePayload = string;

const initialState: RoomState = {
  room: {
    name: ''
  }
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateRoomName(state, action: PayloadAction<UpdateRoomNamePayload>) {
      state.room.name = action.payload;
    }
  }
});

export const { updateRoomName } = roomSlice.actions;
export default roomSlice.reducer;