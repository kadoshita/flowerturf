import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DeviceSelect from './DeviceSelect';

import store from '../store/index';
import { USER_NAME_STORE, ROOM_NAME_STORE } from '../actions/index';

const Home = () => {
    const [roomName, setRoomName] = useState('');

    return (
        <Container style={{ height: '100%' }}>
            <Grid container style={{ height: '100%' }}>
                <Grid item xs={12} style={{ height: '10%' }}>
                    <h1>FlowerTurf</h1>
                </Grid>
                <Grid item xs={12} style={{ height: '20%' }}></Grid>
                <Grid item xs={6} style={{ height: '70%' }}>
                    <Grid item xs={12} style={{ height: '15%' }}></Grid>
                    <Grid item xs={12}>
                        <p>FlowerTurfは複数人対応、インストール不要のボイスチャットツールです。URLを共有すれば、誰でも参加できます。</p>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="ルーム名" required color="primary" fullWidth onChange={e => { setRoomName(e.target.value); store.dispatch({ type: ROOM_NAME_STORE, name: e.target.value }); }}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="ユーザー名" color="primary" fullWidth onChange={e => store.dispatch({ type: USER_NAME_STORE, name: e.target.value })}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <DeviceSelect></DeviceSelect>
                    </Grid>
                    <Grid item xs={12}>
                        <Link to='/chat' hidden={!roomName}>
                            <Button variant="contained" color="primary" style={{ marginTop: '4px' }}>通話開始</Button>
                        </Link>
                    </Grid>
                </Grid>
                <Grid item xs={6} style={{ height: '70%' }}>
                    <Grid item xs={12} style={{ padding: '8px' }}>
                        <Paper elevation={2} variant='elevation'>
                            <img src="screenshot.png" alt="ロゴ" style={{ width: '100%', height: 'auto' }}></img>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
};

export default Home;