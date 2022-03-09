import { ListItem, ListItemText } from '@mui/material';
import { useEffect, useRef } from 'react';
import Linkify from 'linkify-react';

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
            <Linkify tagName="span" options={{ rel: 'nofollow noopener', target: '_blank' }}>
              {props.message}
            </Linkify>
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
