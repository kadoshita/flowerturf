import { Avatar, Fab, Tooltip, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import { VolumeOff, VolumeUp } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from '@skyway-sdk/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export type UserItemProps = {
  name: string;
  subscription: Subscription | undefined;
};

// ref: https://github.com/mui/material-ui/blob/master/docs/data/material/components/avatars/BackgroundLetterAvatars.js
const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    const s = `00${value.toString(16)}`;
    color += s.substring(s.length - 2, s.length);
  }

  return color;
};

const style: { box: SxProps; avatar: (name: string) => SxProps; fab: React.CSSProperties } = {
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    border: 2,
    borderColor: 'white',
    borderRadius: '16px',
  },
  avatar: (name: string) => ({
    bgcolor: stringToColor(name),
    width: '10vmin',
    height: '10vmin',
    fontSize: '5vmin',
  }),
  fab: {
    alignSelf: 'end',
    marginRight: '8px',
    marginBottom: '8px',
  },
};
const UserItem = (props: UserItemProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioOutputDevice = useSelector((state: RootState) => state.device.audioOutput.deviceId);
  const audioRef = useRef<HTMLAudioElement>();

  const handleMuteChange = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  useEffect(() => {
    (async () => {
      if (props.subscription === undefined) {
        audioRef.current.srcObject = null;
        audioRef.current.pause();
      } else {
        const { stream } = props.subscription;
        if (stream && stream.contentType === 'audio') {
          stream.attach(audioRef.current);
          await audioRef.current.play();
        }
      }
    })();
  }, [props.subscription]);

  useEffect(() => {
    (async () => {
      await audioRef.current.setSinkId(audioOutputDevice);
    })();
  }, [audioOutputDevice]);
  return (
    <Box sx={style.box}>
      <Typography variant="h5">{props.name}</Typography>
      <Avatar sx={style.avatar(props.name)}>{props.name.at(0)}</Avatar>
      <audio ref={audioRef} autoPlay></audio>
      <Tooltip title={`ミュート${isMuted ? '解除' : ''}します`}>
        <Fab size="medium" style={style.fab} onClick={handleMuteChange}>
          {isMuted ? <VolumeOff></VolumeOff> : <VolumeUp></VolumeUp>}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default UserItem;
