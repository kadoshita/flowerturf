import React from 'react';
import { Grid } from '@material-ui/core';
import User from './User';

const Chat = () => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>SkyWay Multi VoiceChat</h1>
            </Grid>
            <Grid item xs={2}>
                <User></User>
            </Grid>
        </Grid>
    )
};

export default Chat;