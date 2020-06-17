import React from 'react';
import { Button, Grid, List, ListItem, ListItemText, Input } from '@material-ui/core';

const TextChat = () => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={10}>
                <Input fullWidth></Input>
            </Grid>
            <Grid item xs={2}>
                <Button fullWidth color='primary' variant='contained'>送信</Button>
            </Grid>
        </Grid>
    );
};

export default TextChat;