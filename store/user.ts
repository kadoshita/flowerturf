import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserInfo = {
  name: string;
};

export type UserState = {
  user: UserInfo;
};

export type UpdateUserNamePayload = string;

const initialState: UserState = {
  user: {
    name: ''
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserName(state, action: PayloadAction<UpdateUserNamePayload>) {
      state.user.name = action.payload;
    }
  }
});

export const { updateUserName } = userSlice.actions;
export default userSlice.reducer;