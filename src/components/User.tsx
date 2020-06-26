import React, { useRef, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { RoomStream } from 'skyway-js';

type UserProps = {
    name: string,
    icon: string,
    stream?: RoomStream,
    isSpeaking: boolean
};
const User = (props: UserProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const $audio = audioRef.current;
        if ($audio !== null && props.stream) {
            $audio.srcObject = props.stream;
        }
    }, [props.stream]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <p>{props.name}</p>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <img src={(props.icon !== '') ? props.icon : 'user.png'} alt="user icon" style={{ width: '80%', height: 'auto', borderColor: (props.isSpeaking ? '#108675' : '#ffffff'), borderStyle: 'solid', borderWidth: '2px' }}></img>
                <audio ref={audioRef} autoPlay></audio>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
    )
};

export default User;