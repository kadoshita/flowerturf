import { ROOM_NAME_STORE, USER_NAME_STORE } from '../actions/index';

interface IAction {
    type: string,
    name: string
};
export default (state = '', action: IAction) => {
    switch (action.type) {
        case ROOM_NAME_STORE:
            return state;
        case USER_NAME_STORE:
            return state;
        default:
            return state;
    }
}