import { Avatar, Fab, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import { VolumeOff, VolumeUp } from '@mui/icons-material';
import { useState } from 'react';

export type UserItemProps = {
  name: string;
  isMuted: boolean;
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
    borderColor: 'grey.200',
    borderRadius: '16px',
  },
  avatar: (name: string) => ({
    bgcolor: stringToColor(name),
    width: 192,
    height: 192,
    fontSize: 160,
  }),
  fab: {
    alignSelf: 'end',
    marginRight: '8px',
    marginBottom: '8px',
  },
};
const UserItem = (props: UserItemProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(props.isMuted);

  const handleMuteChange = () => {
    setIsMuted(!isMuted);
  };
  return (
    <Box sx={style.box}>
      <Typography variant="h4">{props.name}</Typography>
      <Avatar sx={style.avatar(props.name)}>{props.name.at(0)}</Avatar>
      <Fab size="medium" style={style.fab} onClick={handleMuteChange}>
        {isMuted ? <VolumeUp></VolumeUp> : <VolumeOff></VolumeOff>}
      </Fab>
    </Box>
  );
};

export default UserItem;
