import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Peer, { RoomStream, MeshRoom } from 'skyway-js';
import hark from 'hark';
import { ROOM_NAME_STORE } from '../actions/index';
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
    stream?: RoomStream,
    isSpeaking: boolean
};

enum ActionType {
    NOTICE_NAME,
    MESSAGE
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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [meshRoom, setMeshRoom] = useState<MeshRoom>();
    const [userList, setUserList] = useState<UserListItem[]>([]);
    const [newChatMessage, setNewChatMessage] = useState<ChatMessage>();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const parameters = parseQueryParameter(window.location.search.replace('?', ''));
    const roomName = (state.roomname === '') ? parameters.room : state.roomname;
    const userName = state.username;

    if (roomName === '') {
        window.location.href = window.location.origin;
    } else if (!Object.keys(parameters).includes('room')) {
        window.history.replaceState('', '', `${window.location.origin}/chat?room=${roomName}`);
    } else {
        store.dispatch({ type: ROOM_NAME_STORE, name: roomName });
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
            const audioTrackConstraints = getMediaTrackConstraints()
            const localAudioStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: audioTrackConstraints
            });
            const speechEvent = hark(localAudioStream, {});
            speechEvent.on('speaking', () => {
                setIsSpeaking(true);
            });
            speechEvent.on('stopped_speaking', () => {
                setIsSpeaking(false);
            });
            const _meshRoom = peer.joinRoom(roomName, {
                mode: 'mesh',
                stream: localAudioStream
            });
            _meshRoom.on('open', () => {
                console.log(`Join room ${roomName}`);
                if (userName !== '') {
                    _meshRoom.send({
                        type: ActionType.NOTICE_NAME,
                        name: userName
                    });
                }
            });

            _meshRoom.on('peerJoin', () => {
                if (userName !== '') {
                    _meshRoom.send({
                        type: ActionType.NOTICE_NAME,
                        name: userName
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
                                    stream: undefined,
                                    isSpeaking: false
                                });
                            }
                            return newUserList;
                        })
                        break;
                    case ActionType.MESSAGE: setNewChatMessage({ user: data.src, message: data.data.message }); break;
                }
            });

            setMeshRoom(_meshRoom as MeshRoom);
        });

        return () => {
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
        sendChatMessage(isSpeaking ? 'speech start' : 'speech stop');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpeaking]);
    return (
        <Grid container style={{ height: '100%' }}>
            <Grid item xs={12} style={{ height: '5%' }}>
                <p style={{ margin: '0px' }}>ルーム: {roomName}</p>
            </Grid>
            <Grid item xs={4} style={{ height: '95%' }}>
                <Grid container style={{ height: '100%' }}>
                    <Grid item xs={12} style={{ height: '5%' }}>
                        <p style={{ fontSize: '130%', margin: '0px' }}>{(state.username !== '') ? state.username : myId}</p>
                    </Grid>
                    <Grid item xs={4} style={{ height: '20%' }}></Grid>
                    <Grid item xs={4} style={{ height: '20%' }}>
                        <img src='user.png' alt="user icon" style={{ width: 'auto', height: '80%', borderColor: (isSpeaking ? '#108675' : '#ffffff'), borderStyle: 'solid', borderWidth: '2px' }}></img>
                    </Grid>
                    <Grid item xs={4} style={{ height: '20%' }}></Grid>
                    <Grid item xs={12} style={{ height: '75%' }}>
                        <TextChat chatMessages={chatMessages} sendChatMessage={sendChatMessage}></TextChat>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={8} style={{ height: '95%' }}>
                <Grid container>
                    {userList.map((u, i) => <Grid item xs={2} key={i}><User name={u.name || u.id} stream={u.stream} isSpeaking={u.isSpeaking}></User></Grid>)}
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Chat;