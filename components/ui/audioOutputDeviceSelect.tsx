import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateAudioOutputDevice } from '../../store/device';

const AudioOutputDeviceSelect = () => {
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const currentDevice = useSelector((state: RootState) => state.device.audioOutput.deviceId);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter((d) => d.kind === 'audiooutput');
      if (currentDevice === '') {
        dispatch(updateAudioOutputDevice(audioOutputDevices[0].deviceId));
      }
      setAudioOutputDevices(audioOutputDevices);
      stream.getTracks().forEach((t) => t.stop());
    })();
  }, []);

  const handleChange = (e: SelectChangeEvent) => {
    dispatch(updateAudioOutputDevice(e.target.value));
  };
  return (
    <FormControl>
      <InputLabel id="audio-output-device-label">
        音声出力デバイス
      </InputLabel>
      <Select
        onChange={handleChange}
        value={currentDevice}
        labelId="audio-output-device-label"
        label="音声出力デバイス"
      >
        {audioOutputDevices.map((device, index) => (
          <MenuItem key={index} value={device.deviceId}>
            {device.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AudioOutputDeviceSelect;
