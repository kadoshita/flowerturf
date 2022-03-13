import { Stack } from '@mui/material';
import AudioInputDeviceSelect from '../ui/audioInputDeviceSelect';
import AudioOutputDeviceSelect from '../ui/audioOutputDeviceSelect';

const DeviceSelect = () => {
  return (
    <Stack spacing={2}>
      <AudioInputDeviceSelect></AudioInputDeviceSelect>
      <AudioOutputDeviceSelect></AudioOutputDeviceSelect>
    </Stack>
  );
};

export default DeviceSelect;
