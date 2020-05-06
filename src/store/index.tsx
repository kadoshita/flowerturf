import { createStore } from 'redux';
import Reducer from '../reducers/index';

let store = createStore(Reducer);

export default store;