import React, { useRef, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { RoomStream } from 'skyway-js';

type UserProps = {
    stream: RoomStream
};
const User = (props: UserProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const $audio = audioRef.current;
        if ($audio !== null) {
            $audio.srcObject = props.stream;
        }
    }, [props.stream]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <p>{props.stream.peerId}</p>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <img src='user.png' alt="user icon" style={{ width: '50%', height: 'auto' }}></img>
                <audio ref={audioRef} autoPlay></audio>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
    )
};

export default User;