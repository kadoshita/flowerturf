import { ROOM_NAME_STORE, USER_NAME_STORE, USER_ICON_URL_STORE } from '../actions/index';

interface IAction {
    type: string,
    value: string
};
export default (state = { username: '', roomname: '', usericon: '' }, action: IAction) => {
    switch (action.type) {
        case ROOM_NAME_STORE:
            state.roomname = action.value;
            return state;
        case USER_NAME_STORE:
            state.username = action.value;
            return state;
        case USER_ICON_URL_STORE:
            state.usericon = action.value;
            return state;
        default:
            return state;
    }
}