import React from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <h1>SkyWay Multi VoiceChat</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Room ID"></TextField>
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" color="primary">Enter Now!</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
