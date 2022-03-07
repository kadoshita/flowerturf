import { AccountCircle } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateUserName } from '../../store/user';

export type UserNameInputDialogProps = {
  open: boolean;
  onClose: () => void;
};
const UserNameInputDialog = (props: UserNameInputDialogProps) => {
  const currentUserName = useSelector((state: RootState) => state.user.user.name);
  const [open, setOpen] = useState(props.open);
  const [userName, setUserName] = useState<string>(currentUserName);

  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    setUserName(currentUserName);
    props.onClose();
  };

  const handleCancel = () => {
    setOpen(false);
    setUserName(currentUserName);
    props.onClose();
  };

  const handleStore = () => {
    dispatch(updateUserName(userName));
    setOpen(false);
    props.onClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <AccountCircle></AccountCircle> ユーザー名を変更
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ユーザー名"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={userName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleStore}>設定</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserNameInputDialog;
