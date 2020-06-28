import React, { useState, useEffect } from 'react';
import { Grid, TextField, Fab } from '@material-ui/core';
import { Close, Mic, MicOff } from '@material-ui/icons';
import Peer, { RoomStream, MeshRoom } from 'skyway-js';
import hark from 'hark';
import { ROOM_NAME_STORE, USER_NAME_STORE } from '../actions/index';
import User from './User';
import TextChat from './TextChat';

import store from '../store/index';
import deviceStore from '../store/device';

type ChatMessage = {
    user: string,
    message: string
};

type UserListItem = {
    id: string,
    name: string,
    icon: string,
    stream?: RoomStream,
    isSpeaking: boolean
};

enum ActionType {
    NOTICE_NAME,
    MESSAGE,
    NOTICE_IS_SPEAKING
};

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
const getMediaTrackConstraints = (): MediaTrackConstraints => {
    const { deviceId } = deviceStore.getState().inputDevice;
    if (deviceId !== '') {
        return {
            sampleSize: 16,
            echoCancellation: true,
            deviceId: deviceId
        };
    } else {
        return {
            sampleSize: 16,
            echoCancellation: true
        };
    }
};

const Chat = () => {
    const state = store.getState();
    const [myId, setMyId] = useState('');
    const [userName, setUserName] = useState(state.username)
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMicMute, setIsMicMute] = useState(false);
    const [localAudioStream, setLocalAudioStream] = useState<MediaStream>();
    const [meshRoom, setMeshRoom] = useState<MeshRoom>();
    const [userList, setUserList] = useState<UserListItem[]>([]);
    const [newChatMessage, setNewChatMessage] = useState<ChatMessage>();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const parameters = parseQueryParameter(window.location.search.replace('?', ''));
    const roomName = (state.roomname === '') ? parameters.room : state.roomname;
    const userIconUrl = state.usericon;

    if (roomName === '') {
        window.location.href = window.location.origin;
    } else if (!Object.keys(parameters).includes('room')) {
        window.history.replaceState('', '', `${window.location.origin}/chat?room=${roomName}`);
    } else {
        store.dispatch({ type: ROOM_NAME_STORE, value: roomName });
    }

    const sendChatMessage = (msg: string) => {
        const sendData = {
            message: msg,
            type: ActionType.MESSAGE
        };
        meshRoom?.send(sendData);
        setNewChatMessage({ user: myId, message: msg });
    };
    useEffect(() => {
        const apiKey = process.env.REACT_APP_SKYWAY_API_KEY || '';
        const peer = new Peer({
            key: apiKey
        });
        peer.on('open', async id => {
            console.log(`Conenction established between SkyWay Server!! My ID is ${id}`);
            setMyId(id);
            setUserName((userName === '') ? id : userName);
            const audioTrackConstraints = getMediaTrackConstraints()
            const _localAudioStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: audioTrackConstraints
            });
            const speechEvent = hark(_localAudioStream, {});
            speechEvent.on('speaking', () => {
                setIsSpeaking(true);
            });
            speechEvent.on('stopped_speaking', () => {
                setIsSpeaking(false);
            });
            const _meshRoom = peer.joinRoom(roomName, {
                mode: 'mesh',
                stream: _localAudioStream
            });
            _meshRoom.on('open', () => {
                console.log(`Join room ${roomName}`);
                if (userName !== '') {
                    _meshRoom.send({
                        type: ActionType.NOTICE_NAME,
                        name: userName,
                        icon: userIconUrl
                    });
                }
            });

            _meshRoom.on('peerJoin', () => {
                if (userName !== '') {
                    _meshRoom.send({
                        type: ActionType.NOTICE_NAME,
                        name: userName,
                        icon: userIconUrl
                    });
                }
            });
            _meshRoom.on('peerLeave', peerId => {
                console.log(`User ${peerId} leave`);
                setUserList(currentUserList => {
                    const newUserList = [...currentUserList];
                    const leaveUserIndex = newUserList.findIndex(s => s.id === peerId);
                    newUserList.splice(leaveUserIndex, 1);
                    return newUserList;
                });
            });

            _meshRoom.on('stream', stream => {
                console.log(`User ${stream.peerId} streaming start`);
                setUserList(currentUserList => {
                    const newUserList = [...currentUserList];
                    const streamStartUserIndex = newUserList.findIndex(u => u.id === stream.peerId);
                    if (streamStartUserIndex === -1) {
                        newUserList.push({
                            id: stream.peerId,
                            name: '',
                            icon: 'user.png',
                            stream: stream,
                            isSpeaking: false
                        });
                    } else {
                        newUserList[streamStartUserIndex].stream = stream;
                    }
                    return newUserList;
                });
            });
            _meshRoom.on('data', data => {
                switch (data.data.type) {
                    case ActionType.NOTICE_NAME:
                        setUserList(currentUserList => {
                            const newUserList = [...currentUserList];
                            const newUserIndex = newUserList.findIndex(u => u.id === data.src);
                            if (newUserIndex === -1) {
                                newUserList.push({
                                    id: data.src,
                                    name: data.data.name,
                                    icon: (data.data.icon !== '') ? data.data.icon : 'user.png',
                                    stream: undefined,
                                    isSpeaking: false
                                });
                                return newUserList;
                            } else {
                                return [...currentUserList].map(u => {
                                    if (u.id === data.src) {
                                        u.name = data.data.name;
                                    }
                                    return u;
                                });
                            }
                        });
                        break;
                    case ActionType.MESSAGE: setNewChatMessage({ user: data.src, message: data.data.message }); break;
                    case ActionType.NOTICE_IS_SPEAKING:
                        setUserList(currentUserList => {
                            const newUserList = [...currentUserList].map(u => {
                                if (data.src === u.id) {
                                    u.isSpeaking = data.data.isSpeaking;
                                }
                                return u;
                            });
                            return newUserList;
                        });
                        break;
                }
            });

            setLocalAudioStream(_localAudioStream);
            setMeshRoom(_meshRoom as MeshRoom);
        });

        return () => {
            localAudioStream?.getTracks().forEach(t => t.stop());
            peer.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomName]);
    useEffect(() => {
        if (newChatMessage) {
            setChatMessages(prevChatMessages => {
                const newChatMessages = [...prevChatMessages];
                const sendMessageUserName = userList.find(u => u.id === newChatMessage.user)?.name;
                const chatMessage = { ...newChatMessage };
                chatMessage.user = (sendMessageUserName) ? sendMessageUserName : (newChatMessage.user === myId && userName) ? userName : newChatMessage.user;
                newChatMessages.push(chatMessage);
                return newChatMessages;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newChatMessage]);
    useEffect(() => {
        meshRoom?.send({
            isSpeaking: isSpeaking,
            type: ActionType.NOTICE_IS_SPEAKING
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpeaking]);
    useEffect(() => {
        const sendUserName = (userName !== '') ? userName : myId;
        meshRoom?.send({
            type: ActionType.NOTICE_NAME,
            name: sendUserName,
            icon: userIconUrl
        });
        store.dispatch({ type: USER_NAME_STORE, value: sendUserName });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);
    useEffect(() => {
        const tracks = localAudioStream?.getAudioTracks();
        tracks?.forEach(t => t.enabled = !isMicMute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMicMute]);

    const micButton = <Fab color={isMicMute ? 'secondary' : 'primary'} aria-label={isMicMute ? 'mic-off' : 'mic'} onClick={() => setIsMicMute(!isMicMute)}>{isMicMute ? <MicOff></MicOff> : <Mic></Mic>}</Fab>;
    return (
        <Grid container style={{ height: '100%' }}>
            <Grid item xs={11} style={{ height: '5%' }}>
                <p style={{ margin: '0px' }}>ルーム: {roomName}</p>
            </Grid>
            <Grid item xs={1} style={{ height: '5%', paddingTop: '4px' }}>
                <Fab color='secondary' aria-label='close' onClick={() => window.location.href = window.location.origin}>
                    <Close></Close>
                </Fab>
            </Grid>
            <Grid item xs={4} style={{ height: '95%' }}>
                <Grid container style={{ height: '100%' }}>
                    <Grid item xs={12} style={{ height: '5%' }}>
                        <TextField
                            style={{ fontSize: '130%', margin: '0px' }}
                            value={userName}
                            onChange={e => { setUserName(e.target.value) }}
                        ></TextField>
                    </Grid>
                    <Grid item xs={4} style={{ height: '20%' }}></Grid>
                    <Grid item xs={4} style={{ height: '20%' }}>
                        <img src={(userIconUrl !== '') ? userIconUrl : 'user.png'} alt="user icon" style={{ width: 'auto', height: '80%', borderColor: (isSpeaking ? '#108675' : '#ffffff'), borderStyle: 'solid', borderWidth: '2px' }}></img>
                    </Grid>
                    <Grid item xs={4} style={{ height: '20%', textAlign: 'left', verticalAlign: 'bottom' }}>
                        {micButton}
                    </Grid>
                    <Grid item xs={12} style={{ height: '75%' }}>
                        <TextChat chatMessages={chatMessages} sendChatMessage={sendChatMessage}></TextChat>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={8} style={{ height: '95%' }}>
                <Grid container>
                    {userList.map((u, i) => <Grid item xs={2} key={i}><User name={u.name || u.id} icon={u.icon} stream={u.stream} isSpeaking={u.isSpeaking}></User></Grid>)}
                </Grid>
            </Grid>
        </Grid >
    )
};

export default Chat;