import { HeadsetMic } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateAudioInputDevice, updateAudioOutputDevice } from '../../store/device';

export type DeviceChangeDialogProps = {
  open: boolean;
  onClose: () => void;
};
const DeviceChangeDialog = (props: DeviceChangeDialogProps) => {
  const currentAudioInputDevice = useSelector((state: RootState) => state.device.audioInput.deviceId);
  const currentAudioOutputDevice = useSelector((state: RootState) => state.device.audioOutput.deviceId);

  const [open, setOpen] = useState(props.open);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioInputDevice, setAudioInputDevice] = useState<string>(currentAudioInputDevice);
  const [audioOutputDevice, setAudioOutputDevice] = useState<string>(currentAudioOutputDevice);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    updateAudiiDevices();
  }, []);

  const updateAudiiDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputDevices = devices.filter((d) => d.kind === 'audioinput');
    const outputDevices = devices.filter((d) => d.kind === 'audiooutput');
    setAudioInputDevices(inputDevices);
    setAudioOutputDevices(outputDevices);
  };

  const handleClose = () => {
    setOpen(false);
    setAudioInputDevice(currentAudioInputDevice);
    setAudioOutputDevice(currentAudioOutputDevice);
    props.onClose();
  };

  const handleCancel = () => {
    setOpen(false);
    setAudioInputDevice(currentAudioInputDevice);
    setAudioOutputDevice(currentAudioOutputDevice);
    props.onClose();
  };

  const handleStore = () => {
    dispatch(updateAudioInputDevice(audioInputDevice));
    dispatch(updateAudioOutputDevice(audioOutputDevice));
    setOpen(false);
    props.onClose();
  };

  const handleAudioInputChange = (e: SelectChangeEvent) => {
    setAudioInputDevice(e.target.value);
  };
  const handleAudioOutputChange = (e: SelectChangeEvent) => {
    setAudioOutputDevice(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <HeadsetMic></HeadsetMic> 音声デバイスを変更
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} paddingTop={2}>
            <FormControl>
              <InputLabel id="audio-input-device-label">音声入力デバイス</InputLabel>
              <Select
                onChange={handleAudioInputChange}
                value={audioInputDevice}
                labelId="audio-input-device-label"
                label="音声入力デバイス"
              >
                {audioInputDevices.map((device, index) => (
                  <MenuItem key={index} value={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="audio-output-device-label">音声出力デバイス</InputLabel>
              <Select
                onChange={handleAudioOutputChange}
                value={audioOutputDevice}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleStore}>設定</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeviceChangeDialog;
