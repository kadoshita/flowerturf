import React, { useState } from 'react';
import { Container, Grid, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DeviceSelect from './DeviceSelect';

import store from '../store/index';
import { USER_NAME_STORE, ROOM_NAME_STORE } from '../actions/index';

const Home = () => {
    const [roomName, setRoomName] = useState('');

    return (
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <h1>FlowerTurf</h1>
                    <img src="logo.png" alt="ロゴ" style={{ width: 'auto', height: '256px' }}></img>
                    <p>FlowerTurfは複数人対応、インストール不要のボイスチャットツールです。URLを共有すれば、誰でも参加できます。</p>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="ルーム名" required color="primary" onChange={e => { setRoomName(e.target.value); store.dispatch({ type: ROOM_NAME_STORE, name: e.target.value }); }}></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="ユーザー名" color="primary" onChange={e => store.dispatch({ type: USER_NAME_STORE, name: e.target.value })}></TextField>
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
        </Container>
    )
};

export default Home;