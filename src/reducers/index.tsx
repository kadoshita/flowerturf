import { ROOM_NAME_STORE, USER_NAME_STORE } from '../actions/index';

interface IAction {
    type: string,
    name: string
};
export default (state = { username: '', roomname: '' }, action: IAction) => {
    switch (action.type) {
        case ROOM_NAME_STORE:
            state.roomname = action.name;
            return state;
        case USER_NAME_STORE:
            state.username = action.name;
            return state;
        default:
            return state;
    }
}