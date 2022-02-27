import { Avatar, Fab, Stack, Tooltip, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import { ScreenShare, StopScreenShare, VolumeOff, VolumeUp } from '@mui/icons-material';
import { useState } from 'react';

export type UserItemProps = {
  name: string;
  onChangeMute: () => void;
  onChangeShareScreen: () => void;
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

const style: { box: SxProps; avatar: (name: string) => SxProps; fabs: React.CSSProperties; fab: React.CSSProperties } =
  {
    box: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      border: 2,
      borderColor: 'grey.200',
      borderRadius: '16px',
    },
    avatar: (name: string) => ({
      bgcolor: stringToColor(name),
      width: '10vmin',
      height: '10vmin',
      fontSize: '5vmin',
    }),
    fabs: {
      alignSelf: 'end',
      marginRight: '8px',
      marginBottom: '8px',
    },
    fab: {
      marginLeft: '4px',
    },
  };
const MySelfUserItem = (props: UserItemProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  const handleMuteChange = () => {
    setIsMuted(!isMuted);
    props.onChangeMute();
  };
  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    props.onChangeShareScreen();
  };
  return (
    <Box sx={style.box}>
      <Typography variant="h5">{props.name}</Typography>
      <Avatar sx={style.avatar(props.name)}>{props.name.at(0)}</Avatar>
      <Stack direction="row" style={style.fabs}>
        <Tooltip title={`画面共有${isScreenSharing ? '停止' : ''}します`}>
          <Fab size="medium" style={style.fab} onClick={handleScreenShare}>
            {isScreenSharing ? <StopScreenShare></StopScreenShare> : <ScreenShare></ScreenShare>}
          </Fab>
        </Tooltip>
        <Tooltip title={`ミュート${isMuted ? '解除' : ''}します`}>
          <Fab size="medium" style={style.fab} onClick={handleMuteChange}>
            {isMuted ? <VolumeOff></VolumeOff> : <VolumeUp></VolumeUp>}
          </Fab>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default MySelfUserItem;
