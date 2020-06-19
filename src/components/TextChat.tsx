import React, { useState } from 'react';
import { Button, Grid, List, ListItem, ListItemText, Input } from '@material-ui/core';

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
        <Grid container spacing={4}>
            <Grid item xs={12}>
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
            <Grid item xs={10}>
                <Input fullWidth onChange={e => setSendMessage(e.target.value)}></Input>
            </Grid>
            <Grid item xs={2}>
                <Button fullWidth color='primary' variant='contained' onClick={() => props.sendChatMessage(sendMessage)}>送信</Button>
            </Grid>
        </Grid>
    );
};

export default TextChat;