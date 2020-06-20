import React, { useState } from 'react';
import { Button, Grid, List, ListItem, ListItemText, Input, Divider } from '@material-ui/core';

type ChatMessage = {
    user: string,
    message: string
};
type TextChatProps = {
    chatMessages: ChatMessage[],
    sendChatMessage: any
}

const TextChat = (props: TextChatProps) => {
    const [sendMessage, setSendMessage] = useState('');
    return (
        <Grid container style={{ height: '100%', paddingLeft: '8px', paddingRight: '8px' }}>
            <Grid item xs={12} style={{ overflowY: 'scroll', height: '90%' }}>
                <List>
                    {props.chatMessages.map((msg, i) => {
                        return (
                            <ListItem key={i}>
                                <ListItemText
                                    primary={msg.user}
                                    secondary={msg.message}></ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
            <Grid item xs={12} style={{ height: '1%' }}>
                <Divider></Divider>
            </Grid>
            <Grid item xs={10} style={{ height: '9%' }}>
                <Input fullWidth value={sendMessage} onChange={e => setSendMessage(e.target.value)}></Input>
            </Grid>
            <Grid item xs={2} style={{ height: '9%' }}>
                <Button fullWidth color='primary' variant='contained' onClick={() => { props.sendChatMessage(sendMessage); setSendMessage('') }}>送信</Button>
            </Grid>
        </Grid>
    );
};

export default TextChat;