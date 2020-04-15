import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';

const Home = () => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>SkyWay Multi VoiceChat</h1>
            </Grid>
            <Grid item xs={12}>
                <TextField label="Room ID" color="primary"></TextField>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary">Enter Now!</Button>
            </Grid>
        </Grid>
    )
};

export default Home;