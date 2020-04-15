import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
                <Link to='/chat'>
                    <Button variant="contained" color="primary">Enter Now!</Button>
                </Link>
            </Grid>
        </Grid>
    )
};

export default Home;