import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChatMessage = {
  message: string;
  sender: string;
  sendTime: string;
  direction: 'incoming' | 'outgoing';
};
export type ChatMessageState = {
  messages: ChatMessage[];
  sendMessage: ChatMessage | null;
};

export type UpdateChatMessagePayload = ChatMessage;
export type SendMessagePayload = ChatMessage;
const initialState: ChatMessageState = {
  messages: [],
  sendMessage: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateChatMessage(state, action: PayloadAction<UpdateChatMessagePayload>) {
      state.messages = [...state.messages, action.payload];
    },
    sendMessage(state, action: PayloadAction<SendMessagePayload>) {
      state.sendMessage = action.payload;
    }
  }
});

export const { updateChatMessage, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;