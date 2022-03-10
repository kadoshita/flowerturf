import { useDispatch, useSelector } from 'react-redux';
import { ChatMessage, sendChatMessage, updateChatMessage } from '../../store/chat';
import { RootState } from '../../store';
import { Button, List, TextField } from '@mui/material';
import ChatMessageItem from '../ui/chatMessageItem';
import { themeOptions } from '../../styles/theme';
import { ChangeEvent, useState } from 'react';

const TextChat = () => {
  const userName: string = useSelector((state: RootState) => state.user.user.name);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [message, setMessage] = useState<string>('');
  const dispatch = useDispatch();

  const handleOnSend = () => {
    if (message === '') {
      return;
    }
    const m: ChatMessage = {
      sender: userName,
      message,
      sendTime: new Date().toLocaleTimeString(),
      direction: 'outgoing',
    };
    dispatch(sendChatMessage(m));
    dispatch(updateChatMessage(m));
    setMessage('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vmin - 64px)',
        backgroundColor: themeOptions.palette?.background?.paper,
      }}
    >
      <div style={{ overflowY: 'scroll', height: 'calc(100% - 112px)' }}>
        <List>
          {messages.map((m, i) => (
            <ChatMessageItem
              key={i}
              isLatest={i === messages.length - 1}
              sender={m.sender}
              sendAt={m.sendTime}
              message={m.message}
              direction={m.direction}
            ></ChatMessageItem>
          ))}
        </List>
      </div>

      <TextField
        fullWidth
        style={{ height: '64px' }}
        onChange={handleChange}
        value={message}
        color="secondary"
      ></TextField>
      <Button fullWidth style={{ height: '48px' }} color="secondary" variant="contained" onClick={handleOnSend}>
        送信
      </Button>
    </div>
  );
};
export default TextChat;
