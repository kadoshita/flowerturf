import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateAudioInputDevice } from '../../store/device';

const AudioInputDeviceSelect = () => {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const currentDevice = useSelector((state: RootState) => state.device.audioInput.deviceId);
  const dispatch = useDispatch();
  useEffect(() => {
    updateAudioInputDevices();
  }, []);
  const updateAudioInputDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter((d) => d.kind === 'audioinput');
    setAudioInputDevices(audioInputDevices);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateAudioInputDevice(e.target.value));
  };
  return (
    <select onChange={handleChange} value={currentDevice}>
      {audioInputDevices.map((device, index) => (
        <option key={index} value={device.deviceId}>
          {device.label}
        </option>
      ))}
    </select>
  );
};

export default AudioInputDeviceSelect;
