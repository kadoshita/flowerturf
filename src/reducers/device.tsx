import { AUDIO_INPUT_DEVICE_ID_STORE } from '../actions/device';

type TAudioDevice = {
    deviceId: string,
    deviceLabel: string
};
type TAudioDeviceStoreAction = {
    type: string,
    deviceInfo: TAudioDevice
};

const initState: TAudioDevice = {
    deviceId: '',
    deviceLabel: ''
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = { inputDevice: initState, outputDevice: initState }, action: TAudioDeviceStoreAction) => {
    switch (action.type) {
        case AUDIO_INPUT_DEVICE_ID_STORE:
            state.inputDevice = action.deviceInfo;
            return state;
        default:
            return state;
    }
}