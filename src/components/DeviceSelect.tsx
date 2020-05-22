import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

import store from '../store/device';
import { AUDIO_INPUT_DEVICE_ID_STORE } from '../actions/device';

const DeviceSelect = () => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [inputDevice, setInputDevice] = useState('');
    useEffect(() => {
        async function getMediaDeviceInfo() {
            const mediaDevices = await (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput');
            setDevices(mediaDevices);
            setInputDevice(mediaDevices[0].deviceId);
        }
        getMediaDeviceInfo();
    }, []);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const deviceLabel = devices.find(d => d.deviceId === event.target.value)?.label as string;
        store.dispatch({ type: AUDIO_INPUT_DEVICE_ID_STORE, deviceInfo: { deviceId: event.target.value as string, deviceLabel: deviceLabel } });
        setInputDevice(event.target.value as string);
    };
    return (
        <FormControl fullWidth style={{ width: '20%' }}>
            <InputLabel id="audio-input-device-select-label">音声入力デバイス</InputLabel>
            <Select
                labelId="audio-input-device-select-label"
                value={inputDevice}
                onChange={handleChange}
            >
                {devices.map((d, i) => <MenuItem key={i} value={d.deviceId}>{d.label}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default DeviceSelect;