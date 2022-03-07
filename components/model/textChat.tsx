import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import Linkify from 'react-linkify';
import { useDispatch, useSelector } from 'react-redux';
import { ChatMessage, sendMessage, updateChatMessage } from '../../store/chat';
import { RootState } from '../../store';

const TextChat = () => {
  const userName: string = useSelector((state: RootState) => state.user.user.name);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();

  const handleOnSend = (html: string, message: string) => {
    const m: ChatMessage = {
      sender: userName,
      message,
      sendTime: new Date().toLocaleTimeString(),
      direction: 'outgoing',
    };
    dispatch(sendMessage(m));
    dispatch(updateChatMessage(m));
  };
  return (
    <div style={{ position: 'relative', height: 'calc(100vmin - 64px)' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList style={{ backgroundColor: '#202020' }}>
            {messages.map((m, i) => {
              return (
                <Message
                  key={i}
                  model={{
                    direction: m.direction,
                    message: m.message,
                    sender: m.sender,
                  }}
                >
                  <Message.CustomContent>
                    <Linkify
                      componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a target="blank" rel="noopener" href={decoratedHref} key={key}>
                          {decoratedText}
                        </a>
                      )}
                    >
                      {m.message}
                    </Linkify>
                    <div>
                      <small>
                        {m.sender} {m.sendTime}
                      </small>
                    </div>
                  </Message.CustomContent>
                </Message>
              );
            })}
          </MessageList>
          <MessageInput
            attachButton={false}
            onSend={handleOnSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
export default TextChat;
