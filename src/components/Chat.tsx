import React from 'react';
import { Grid } from '@material-ui/core';
import Peer from 'skyway-js';
import User from './User';

import store from '../store/index';

const Chat = () => {
    const apiKey = process.env.REACT_APP_SKYWAY_API_KEY || '';
    const peer = new Peer({
        key: apiKey
    });
    peer.on('open', id => {
        console.log(`Conenction established between SkyWay Server!! My ID is ${id}`);
        const meshRoom = peer.joinRoom(store.getState().roomname, {
            mode: 'mesh'
        });
        meshRoom.on('open', () => {
            console.log(`Join room ${store.getState().roomname}`);
        });
    });
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>SkyWay Multi VoiceChat</h1>
            </Grid>
            <Grid item xs={4}>
                <User name="me"></User>
            </Grid>
            <Grid item xs={8}>
                <Grid container>
                    {['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12'].map((u, i) => <Grid item xs={2} key={i}><User name={u}></User></Grid>)}
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Chat;