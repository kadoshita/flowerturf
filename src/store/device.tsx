import { createStore } from 'redux';
import Reducer from '../reducers/device';

let store = createStore(Reducer);

export default store;