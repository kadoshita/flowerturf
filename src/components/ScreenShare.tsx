import React, { useState, useRef, useEffect } from 'react';
import Peer, { MeshRoom } from 'skyway-js';
import { Grid, Fab } from '@material-ui/core';
import { ROOM_NAME_STORE } from '../actions/index';
import store from '../store/index';
import { DesktopAccessDisabled, DesktopWindows } from '@material-ui/icons';

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

const ScreenShare = () => {
    const state = store.getState();
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<Peer | null>();
    const [meshRoom, setMeshRoom] = useState<MeshRoom>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const parameters = parseQueryParameter(window.location.search.replace('?', ''));
    const roomName = (state.roomname === '') ? parameters.room : state.roomname;
    if (roomName === '') {
        window.location.href = window.location.origin;
    } else if (!Object.keys(parameters).includes('room')) {
        window.history.replaceState('', '', `${window.location.origin}/screen?room=${roomName}`);
    } else {
        store.dispatch({ type: ROOM_NAME_STORE, value: roomName });
    }

    useEffect(() => {
        const startScreenShare = async () => {
            const mediaDevices = navigator.mediaDevices as any;
            const _screenStream: MediaStream = await mediaDevices.getDisplayMedia();
            _screenStream.getTracks().forEach(t => {
                t.onended = () => {
                    setIsScreenSharing(false);
                };
            });
            const apiKey = process.env.REACT_APP_SKYWAY_API_KEY || '';
            const _peer = new Peer(`${roomName}-screen`, {
                key: apiKey
            });
            _peer.on('open', () => {
                const _meshRoom: MeshRoom = _peer.joinRoom(roomName, {
                    mode: 'mesh',
                    stream: _screenStream
                });
                _meshRoom.on('open', () => {
                    console.log(`Join room ${roomName}`);
                });
                setMeshRoom(_meshRoom);
            });
            setPeer(_peer);
            setScreenStream(_screenStream);
        };
        const stopScreenShare = () => {
            if (screenStream) {
                screenStream.getTracks().forEach(t => t.stop());
                setScreenStream(null);
                meshRoom?.close();
                peer?.disconnect();
                peer?.destroy();
            }
        }
        if (isScreenSharing) {
            startScreenShare();
        } else {
            stopScreenShare();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScreenSharing]);
    useEffect(() => {
        if (screenStream) {
            const $screen = videoRef.current;
            if ($screen && $screen.srcObject === null) {
                $screen.srcObject = screenStream;
                const videoHeight = $screen.offsetHeight;
                $screen.style.width = `${((16 / 9) * videoHeight)}px`;
            }
        } else {
            const $screen = videoRef.current;
            if ($screen) {
                $screen.pause();
                $screen.srcObject = null;
            }
        }
    }, [screenStream]);

    const screenShareButton = <Fab color={isScreenSharing ? 'secondary' : 'primary'} aria-label={isScreenSharing ? 'desktop-access-disabled' : 'desktop-windows'} onClick={() => setIsScreenSharing(!isScreenSharing)}>{isScreenSharing ? <DesktopAccessDisabled></DesktopAccessDisabled> : <DesktopWindows></DesktopWindows>}</Fab>;

    return (
        <Grid container style={{ height: '100%' }}>
            <Grid item xs={12} style={{ height: '90%' }}>
                <video ref={videoRef} muted autoPlay style={{ height: '100%' }}></video>
            </Grid>
            <Grid item xs={12} style={{ height: '10%', textAlign: 'center' }}>
                {screenShareButton}
            </Grid>
        </Grid>
    );
};

export default ScreenShare;