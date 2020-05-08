import React from 'react';
import { Grid } from '@material-ui/core';
import Peer from 'skyway-js';
import { ROOM_NAME_STORE } from '../actions/index';
import User from './User';

import store from '../store/index';

const parseQueryParameter = (query: string): { [key: string]: string } => {
    let params: Array<string> = query.split('&');
    let paramObject: { [key: string]: string } = {};
    params.forEach(p => {
        let key = p.split('=')[0];
        let value = p.split('=')[1];
        paramObject[key] = value;
    });

    return paramObject;
}

const Chat = () => {
    const state = store.getState();
    const parameters = parseQueryParameter(window.location.search.replace('?', ''));
    const roomName = (state.roomname === '') ? parameters.room : state.roomname;
    if (roomName === '') {
        window.location.href = window.location.origin;
    } else if (!Object.keys(parameters).includes('room')) {
        window.history.replaceState('', '', `${window.location.origin}/chat?room=${roomName}`);
    } else {
        store.dispatch({ type: ROOM_NAME_STORE, name: roomName });
    }

    const apiKey = process.env.REACT_APP_SKYWAY_API_KEY || '';
    const peer = new Peer({
        key: apiKey
    });
    peer.on('open', async id => {
        console.log(`Conenction established between SkyWay Server!! My ID is ${id}`);
        const localAudioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                sampleSize: 16,
                echoCancellation: true
            }
        });
        const meshRoom = peer.joinRoom(roomName, {
            mode: 'mesh',
            stream: localAudioStream
        });
        meshRoom.on('open', () => {
            console.log(`Join room ${roomName}`);
        });
    });
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>SkyWay Multi VoiceChat</h1>
                <p>Room: {roomName}</p>
            </Grid>
            <Grid item xs={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <p style={{ fontSize: '130%' }}>{state.username}</p>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <img src='user.png' alt="user icon" style={{ width: '50%', height: 'auto' }}></img>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
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