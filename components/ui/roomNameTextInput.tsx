import { FormControl, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateRoomName } from '../../store/room';
import { themeColor, themeOptions } from '../../styles/theme';

const RoomNameTextInput = () => {
  const currentRoomName = useSelector((state: RootState) => state.room.room.name);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRoomName(e.target.value));
  };

  return (
    <FormControl>
      <TextField
        onChange={handleChange}
        label="Room名"
        color="info"
        value={currentRoomName}
        required
      ></TextField>
    </FormControl>
  );
};

export default RoomNameTextInput;
