import { ListItem, ListItemText } from '@mui/material';
import { useEffect, useRef } from 'react';
import { themeOptions } from '../../styles/theme';

export type ChatMessageItemProps = {
  sender: string;
  message: string;
  sendAt: string;
  direction: 'incoming' | 'outgoing';
  isLatest: boolean;
};

const ChatMessageItem = (props: ChatMessageItemProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (props.isLatest) {
      messageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.isLatest]);

  return (
    <ListItem divider>
      <ListItemText
        primary={props.sender}
        secondary={
          <div>
            <span>{props.message}</span>
            <div style={{ textAlign: 'right' }}>
              <small>{props.sendAt}</small>
            </div>
          </div>
        }
        ref={messageRef}
        style={{ overflowWrap: 'break-word' }}
      ></ListItemText>
    </ListItem>
  );
};

export default ChatMessageItem;
