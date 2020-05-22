import React, { useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DeviceSelect from './DeviceSelect';

import store from '../store/index';
import { USER_NAME_STORE, ROOM_NAME_STORE } from '../actions/index';

const Home = () => {
    const [roomName, setRoomName] = useState('');

    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>FlowerTurf</h1>
            </Grid>
            <Grid item xs={12}>
                <TextField label="Room ID" required color="primary" style={{ width: '20%' }} onChange={e => { setRoomName(e.target.value); store.dispatch({ type: ROOM_NAME_STORE, name: e.target.value }); }}></TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField label="User Name" color="primary" style={{ width: '20%' }} onChange={e => store.dispatch({ type: USER_NAME_STORE, name: e.target.value })}></TextField>
            </Grid>
            <Grid item xs={12}>
                <DeviceSelect></DeviceSelect>
            </Grid>
            <Grid item xs={12}>
                <Link to='/chat' hidden={!roomName}>
                    <Button variant="contained" color="primary" style={{ marginTop: '4px' }}>Enter Now!</Button>
                </Link>
            </Grid>
        </Grid>
    )
};

export default Home;