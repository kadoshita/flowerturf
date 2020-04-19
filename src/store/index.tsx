import { createStore } from 'redux';
import Reducer from '../reducers/index';

let store = createStore(Reducer);

store.subscribe(() => console.log(store.getState()))
