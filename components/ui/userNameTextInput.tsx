import { FormControl, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateUserName } from '../../store/user';
import { themeOptions } from '../../styles/theme';

const UserNameTextInput = () => {
  const currentUserName = useSelector((state: RootState) => state.user.user.name);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateUserName(e.target.value));
  };

  return (
    <FormControl>
      <TextField
        onChange={handleChange}
        label="ユーザー名"
        value={currentUserName}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: themeOptions.palette?.text?.primary,
            },
          },
        }}
        InputLabelProps={{ style: { color: themeOptions.palette?.text?.primary } }}
      ></TextField>
    </FormControl>
  );
};

export default UserNameTextInput;
