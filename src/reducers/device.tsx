import { AUDIO_INPUT_DEVICE_ID_STORE } from '../actions/device';

type TAudioDevice = {
    deviceId: string,
    deviceLabel: string
};
type TAudioDeviceStoreAction = {
    type: string,
    deviceInfo: TAudioDevice
};

export default (state = { inputDevice: {}, outputDevice: {} }, action: TAudioDeviceStoreAction) => {
    switch (action.type) {
        case AUDIO_INPUT_DEVICE_ID_STORE:
            state.inputDevice = action.deviceInfo;
            return state;
        default:
            return state;
    }
}