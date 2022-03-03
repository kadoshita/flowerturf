import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateAudioInputDevice } from '../../store/device';
import { themeOptions } from '../../styles/theme';

const AudioInputDeviceSelect = () => {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const currentDevice = useSelector((state: RootState) => state.device.audioInput.deviceId);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter((d) => d.kind === 'audioinput');
      if (currentDevice === '') {
        dispatch(updateAudioInputDevice(audioInputDevices[0].deviceId));
      }
      setAudioInputDevices(audioInputDevices);
      stream.getTracks().forEach((t) => t.stop());
    })();
  }, []);

  const handleChange = (e: SelectChangeEvent) => {
    dispatch(updateAudioInputDevice(e.target.value));
  };
  return (
    <FormControl>
      <InputLabel id="audio-input-device-label" style={{ color: themeOptions.palette?.text?.primary }}>
        音声入力デバイス
      </InputLabel>
      <Select
        onChange={handleChange}
        value={currentDevice}
        labelId="audio-input-device-label"
        label="音声入力デバイス"
        sx={{
          '& fieldset': {
            borderColor: themeOptions.palette?.text?.primary,
          },
        }}
      >
        {audioInputDevices.map((device, index) => (
          <MenuItem key={index} value={device.deviceId} style={{ color: themeOptions.palette?.text?.secondary }}>
            {device.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AudioInputDeviceSelect;
