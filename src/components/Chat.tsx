import React from 'react';
import { Grid } from '@material-ui/core';
import User from './User';

const Chat = () => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>SkyWay Multi VoiceChat</h1>
            </Grid>
            {['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12'].map((u, i) => <Grid item xs={2} key={i}><User name={u}></User></Grid>)}
        </Grid>
    )
};

export default Chat;