import { Stack } from '@mui/material';
import RoomNameTextInput from '../ui/roomNameTextInput';
import UserNameTextInput from '../ui/userNameTextInput';

const NameInput = () => {
  return (
    <Stack spacing={2}>
      <RoomNameTextInput></RoomNameTextInput>
      <UserNameTextInput></UserNameTextInput>
    </Stack>
  );
};

export default NameInput;
