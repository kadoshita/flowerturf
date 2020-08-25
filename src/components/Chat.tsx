import React, { useState, useEffect, useRef } from 'react';
import { Grid, TextField, Fab } from '@material-ui/core';
import { Close, Mic, MicOff, ScreenShare, StopScreenShare } from '@material-ui/icons';
import Peer, { MeshRoom } from 'skyway-js';
import hark from 'hark';
import getYoutubeId from 'get-youtube-id';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ROOM_NAME_STORE, USER_NAME_STORE } from '../actions/index';
import User from './User';
import TextChat from './TextChat';
import RatingDialog from './RatingDialog';
import YoutubeView from './YoutubeView';

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
    stream: MediaStream | null,
    isSpeaking: boolean
};

enum ActionType {
    NOTICE_NAME,
    MESSAGE,
    NOTICE_IS_SPEAKING,
    NOTICE_YOUTUBE_ID,
    NOTICE_YOUTUBE_CURRENT_TIME,
    NOTICE_YOUTUBE_PAUSE
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
    const [peer, setPeer] = useState<Peer | null>(null);
    const [userName, setUserName] = useState(state.username);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMicMute, setIsMicMute] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isYoutubeOwner, setIsYoutubeOwner] = useState(false);
    const [youtubeVideoId, setYoutubeVideoId] = useState('');
    const [youtubeVideoStartPosition, setYoutubeVideoStartPosition] = useState<number>(0);
    const [isYoutubePause, setIsYoutubePause] = useState<boolean>(false);
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);
    const [audioStream, setAudioStream] = useState<MediaStream | null>();
    const [screenStream, setScreenStream] = useState<MediaStream | null>();
    const [meshRoom, setMeshRoom] = useState<MeshRoom | null>(null);
    const [userList, setUserList] = useState<UserListItem[]>([]);
    const [newChatMessage, setNewChatMessage] = useState<ChatMessage>();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const screenRef = useRef<HTMLVideoElement>(null);
    const parameters = parseQueryParameter(window.location.search.replace('?', ''));
    const roomName = (state.roomname === '') ? parameters.room : state.roomname;
    const userIconUrl = state.usericon;
    let screenSharingUserId: string = '';

    if (roomName === '') {
        window.location.href = window.location.origin;
    } else if (!Object.keys(parameters).includes('room')) {
        window.history.replaceState('', '', `${window.location.origin}/chat?room=${roomName}`);
    } else {
        store.dispatch({ type: ROOM_NAME_STORE, value: roomName });
    }

    const sendChatMessage = (msg: string) => {
        if (msg === '' || !meshRoom || !peer) {
            return;
        }
        if (isYoutubeOwner && msg === 'stop') {
            setYoutubeVideoId('');
            setIsYoutubeOwner(false);
            setYoutubeVideoStartPosition(0);
            const sendData = {
                message: 'stop',
                type: ActionType.NOTICE_YOUTUBE_ID
            };
            meshRoom.send(sendData);
            return;
        }
        const getYoutubeIdResult = getYoutubeId(msg);
        if (getYoutubeIdResult) {
            setYoutubeVideoId(getYoutubeIdResult);
            setIsYoutubeOwner(true);
        }
        const sendData = {
            message: msg,
            type: (getYoutubeIdResult) ? ActionType.NOTICE_YOUTUBE_ID : ActionType.MESSAGE
        };
        meshRoom.send(sendData);
        setNewChatMessage({ user: peer.id, message: msg });
    };
    const joinMeshRoom = (_peer: Peer, _roomName: string, stream: MediaStream): (MeshRoom | null) => {
        if (!_peer || _roomName === '' || !stream) {
            console.error(`joinMeshRoom() args error ${_peer} ${_roomName} ${stream}`);
            return null;
        }
        const _meshRoom: MeshRoom = _peer.joinRoom(_roomName, {
            mode: 'mesh',
            stream: stream
        });
        _meshRoom.on('open', () => {
            console.log(`Join room ${_roomName}`);
            if (userName !== '') {
                _meshRoom.send({
                    type: ActionType.NOTICE_NAME,
                    name: userName,
                    icon: userIconUrl
                });
            }
        });

        _meshRoom.on('peerJoin', peerId => {
            console.log(`${peerId} joined`);
            const sound = new Audio('sound.mp3');
            sound.play();
            toast('新規参加者が入室しました');
            _meshRoom.send({
                type: ActionType.NOTICE_NAME,
                name: userName,
                icon: userIconUrl
            });
            setUserList(currentUserList => {
                const newUserList = [...currentUserList];
                newUserList.push({
                    id: peerId,
                    name: '',
                    icon: '',
                    stream: null,
                    isSpeaking: false
                });
                return newUserList;
            });
        });
        _meshRoom.on('peerLeave', peerId => {
            console.log(`${peerId} leave`);
            if (screenSharingUserId === peerId) {
                console.log(`screensharing stop`);
                setScreenStream(null);
                screenSharingUserId = '';
            }
            setUserList(currentUserList => {
                const newUserList = [...currentUserList];
                const leaveUserIndex = newUserList.findIndex(s => s.id === peerId);
                newUserList.splice(leaveUserIndex, 1);
                return newUserList;
            });
        });

        _meshRoom.on('stream', stream => {
            console.log(`${stream.peerId} streaming start`);
            const videoTracks = stream.getVideoTracks();
            const audioTracks = stream.getAudioTracks();
            let receivedAudioStream = new MediaStream();
            if (videoTracks.length > 0) {//screen
                const screenSharingStartUserID = stream.peerId;
                console.log(`screensharing start ${screenSharingStartUserID}`);
                toast(`${screenSharingStartUserID} さんが画面共有を開始しました`);
                screenSharingUserId = screenSharingStartUserID;
                let receivedVideoStream = new MediaStream();
                videoTracks.forEach(t => receivedVideoStream.addTrack(t.clone()));
                setScreenStream(receivedVideoStream);
            }
            audioTracks.forEach(t => receivedAudioStream.addTrack(t.clone()));
            setUserList(currentUserList => {
                const newUserList = [...currentUserList];
                const streamStartUserIndex = newUserList.findIndex(u => u.id === stream.peerId);
                if (streamStartUserIndex === -1) {
                    newUserList.push({
                        id: stream.peerId,
                        name: '',
                        icon: '',
                        isSpeaking: false,
                        stream: stream
                    });
                } else {
                    newUserList[streamStartUserIndex].stream = receivedAudioStream;
                }
                return newUserList;
            });
        });
        _meshRoom.on('data', ({ data, src }) => {
            switch (data.type) {
                case ActionType.NOTICE_NAME:
                    setUserList(currentUserList => {
                        return currentUserList.map(u => {
                            if (u.id === src) {
                                u.name = data.name;
                            }
                            return u;
                        });
                    });
                    break;
                case ActionType.MESSAGE: setNewChatMessage({ user: src, message: data.message }); break;
                case ActionType.NOTICE_IS_SPEAKING:
                    setUserList(currentUserList => {
                        return currentUserList.map(u => {
                            if (src === u.id) {
                                u.isSpeaking = data.isSpeaking;
                            }
                            return u;
                        });
                    });
                    break;
                case ActionType.NOTICE_YOUTUBE_ID:
                    if (data.message === 'stop') {
                        setYoutubeVideoId('');
                        setYoutubeVideoStartPosition(0);
                        setIsYoutubePause(false);
                        break;
                    }
                    const getYoutubeIdResult = getYoutubeId(data.message);
                    if (getYoutubeIdResult) {
                        setYoutubeVideoId(getYoutubeIdResult);
                    }
                    setNewChatMessage({ user: src, message: data.message });
                    break;
                case ActionType.NOTICE_YOUTUBE_CURRENT_TIME:
                    setYoutubeVideoStartPosition(data.message);
                    setIsYoutubePause(false);
                    break;
                case ActionType.NOTICE_YOUTUBE_PAUSE:
                    setIsYoutubePause(true);
                    break;
            }
        });

        return _meshRoom;
    };
    const onPositionChange = (currentTime: number) => {
        if (meshRoom && isYoutubeOwner) {
            const sendData = {
                message: currentTime,
                type: ActionType.NOTICE_YOUTUBE_CURRENT_TIME
            };
            meshRoom.send(sendData);
        }
    };
    const onPause = () => {
        if (meshRoom && isYoutubeOwner) {
            const sendData = {
                message: '',
                type: ActionType.NOTICE_YOUTUBE_PAUSE
            };
            meshRoom.send(sendData);
        }
    };
    useEffect(() => {
        let _localAudioStream: MediaStream | null = null;
        let _meshRoom: MeshRoom | null = null;
        const apiKey = process.env.REACT_APP_SKYWAY_API_KEY || '';
        const _peer: Peer = new Peer({
            key: apiKey
        });
        _peer.on('open', async id => {
            console.log(`Conenction established between SkyWay Server!! My ID is ${id}`);
            setSessionStartTime((new Date()).getTime());
            setUserName((userName === '') ? id : userName);
            const audioTrackConstraints = getMediaTrackConstraints()
            _localAudioStream = await navigator.mediaDevices.getUserMedia({
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
            _meshRoom = joinMeshRoom(_peer, roomName, _localAudioStream);
            setAudioStream(_localAudioStream);
            setMeshRoom(_meshRoom);
        });
        setPeer(_peer);

        return () => {
            _localAudioStream?.getTracks().forEach(t => t.stop());
            _meshRoom?.close();
            _peer.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomName]);
    useEffect(() => {
        if (newChatMessage) {
            setChatMessages(prevChatMessages => {
                const newChatMessages = [...prevChatMessages];
                const sendMessageUserName = userList.find(u => u.id === newChatMessage.user)?.name;
                const chatMessage = { ...newChatMessage };
                chatMessage.user = (sendMessageUserName) ? sendMessageUserName : (newChatMessage.user === peer?.id && userName) ? userName : newChatMessage.user;
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
        const sendUserName = (userName !== '') ? userName : peer?.id;
        if (!sendUserName) {
            return;
        }
        meshRoom?.send({
            type: ActionType.NOTICE_NAME,
            name: sendUserName,
            icon: userIconUrl
        });
        store.dispatch({ type: USER_NAME_STORE, value: sendUserName });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);
    useEffect(() => {
        const tracks = audioStream?.getAudioTracks();
        tracks?.forEach(t => t.enabled = !isMicMute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMicMute]);
    useEffect(() => {
        const startScreenShare = async () => {
            if (!peer) {
                return;
            }
            const mediaDevices = navigator.mediaDevices as any;
            const _screenStream: MediaStream = await mediaDevices.getDisplayMedia();
            audioStream?.getAudioTracks().forEach(t => _screenStream.addTrack(t.clone()));
            meshRoom?.close();
            const _meshRoom = joinMeshRoom(peer, roomName, _screenStream);
            setMeshRoom(_meshRoom);
            setScreenStream(_screenStream);
        };
        const stopScreenShare = async () => {
            if (audioStream && peer) {
                meshRoom?.close();
                const _meshRoom = joinMeshRoom(peer, roomName, audioStream);
                setMeshRoom(_meshRoom);
            }
            screenStream?.getTracks().forEach(t => t.stop());
            setScreenStream(null);
        };

        if (isScreenSharing) {
            startScreenShare();
        } else {
            stopScreenShare();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScreenSharing]);
    useEffect(() => {
        const $screen = screenRef.current;
        console.log(`play screen stream ${$screen !== null} ${screenStream}`);
        if ($screen !== null) {
            if (screenStream) {
                $screen.srcObject = screenStream;
                $screen.play();
                const videoWidth = $screen.offsetWidth;
                $screen.style.height = `${((9 / 16) * videoWidth)}px`;
            } else {
                $screen.pause();
                $screen.srcObject = null;
            }
        }
    }, [screenStream]);

    const micButton = <Fab color={isMicMute ? 'secondary' : 'primary'} aria-label={isMicMute ? 'mic-off' : 'mic'} onClick={() => setIsMicMute(!isMicMute)}>{isMicMute ? <MicOff></MicOff> : <Mic></Mic>}</Fab>;
    const screenShareButton = <Fab color={isScreenSharing ? 'secondary' : 'primary'} aria-label={isScreenSharing ? 'desktop-access-disabled' : 'desktop-windows'} disabled={!isScreenSharing && !!screenStream} onClick={() => setIsScreenSharing(!isScreenSharing)}>{isScreenSharing ? <StopScreenShare></StopScreenShare> : <ScreenShare></ScreenShare>}</Fab>;
    const screenVideo = (screenStream) ? <video ref={screenRef} autoPlay style={{ width: '100%', marginTop: '20px' }} muted={isScreenSharing}></video> : <></>;
    const youtube = (youtubeVideoId && !isScreenSharing) ? <YoutubeView videoId={youtubeVideoId} onPositionChange={onPositionChange} youtubeVideoStartPosition={youtubeVideoStartPosition} onPause={onPause} isPause={isYoutubePause}></YoutubeView> : <></>;

    return (
        <Grid container style={{ height: '100%' }}>
            <Grid item xs={11} style={{ height: '5%' }}>
                <p style={{ margin: '0px' }}>ルーム: {roomName}</p>
            </Grid>
            <Grid item xs={1} style={{ height: '5%', paddingTop: '4px' }}>
                <Fab color='secondary' aria-label='close' onClick={() => setIsRatingDialogOpen(true)}>
                    <Close></Close>
                </Fab>
                <RatingDialog isOpen={isRatingDialogOpen} sessionDuration={(new Date()).getTime() - sessionStartTime} toggleOpen={() => { setIsRatingDialogOpen(!isRatingDialogOpen); window.location.href = window.location.origin }}></RatingDialog>
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
                    <Grid item xs={2} style={{ height: '20%', textAlign: 'center' }}>
                        {micButton}
                    </Grid>
                    <Grid item xs={2} style={{ height: '20%', textAlign: 'center' }}>
                        {screenShareButton}
                    </Grid>
                    <Grid item xs={12} style={{ height: '75%' }}>
                        <TextChat chatMessages={chatMessages} sendChatMessage={sendChatMessage}></TextChat>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={8} style={{ height: '95%' }}>
                <Grid container>
                    <Grid item xs={12}>
                        {screenVideo}
                    </Grid>
                    <Grid item xs={12}>
                        {youtube}
                    </Grid>
                    {userList.map((u, i) => <Grid item xs={2} key={i}><User name={u.name || u.id} icon={u.icon} stream={u.stream} isSpeaking={u.isSpeaking}></User></Grid>)}
                </Grid>
            </Grid>
            <ToastContainer
                position='bottom-right'
                hideProgressBar
            ></ToastContainer>
        </Grid >
    )
};

export default Chat;