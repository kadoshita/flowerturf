import { AccountCircle, HeadsetMic, Settings } from '@mui/icons-material';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useState } from 'react';
import DeviceChangeDialog from './deviceChangeDialog';
import UserNameInputDialog from './userNameInputDialog';

export type MenuAppBarProps = {
  userName: string;
  roomName: string;
};
const MenuAppBar = (props: MenuAppBarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userNameInputDialogOpen, setUserNameInputDialogOpen] = useState<boolean>(false);
  const [deviceChangeDialogOpen, setDeviceChangeDialogOpen] = useState<boolean>(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onOpenUserNameChangeDialog = () => {
    setUserNameInputDialogOpen(!userNameInputDialogOpen);
    handleClose();
  };
  const onCloseUserNameChangeDialog = () => {
    setUserNameInputDialogOpen(!userNameInputDialogOpen);
  };

  const onOpenDeviceChangeDialog = () => {
    setDeviceChangeDialogOpen(!deviceChangeDialogOpen);
    handleClose();
  };
  const onCloseDeviceChangeDialog = () => {
    setDeviceChangeDialogOpen(!deviceChangeDialogOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" style={{ zIndex: '3' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.roomName}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenu}
          >
            <Settings />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={onOpenUserNameChangeDialog}>
              <ListItemIcon>
                <AccountCircle></AccountCircle>
              </ListItemIcon>
              <ListItemText>ユーザー名を変更</ListItemText>
            </MenuItem>
            <MenuItem onClick={onOpenDeviceChangeDialog}>
              <ListItemIcon>
                <HeadsetMic></HeadsetMic>
              </ListItemIcon>
              <ListItemText>音声デバイスを変更</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
        <UserNameInputDialog open={userNameInputDialogOpen} onClose={onCloseUserNameChangeDialog}></UserNameInputDialog>
        <DeviceChangeDialog open={deviceChangeDialogOpen} onClose={onCloseDeviceChangeDialog}></DeviceChangeDialog>
      </AppBar>
    </Box>
  );
};

export default MenuAppBar;
