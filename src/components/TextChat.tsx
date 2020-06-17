import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

const TextChat = () => {
    return (
        <List>
            <ListItem>
                <ListItemText
                    primary='user1'
                    secondary='sample message'
                ></ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary='user2'
                    secondary='sample message2'
                ></ListItemText>
            </ListItem>
        </List>
    );
};

export default TextChat;