import { createStore } from 'redux';
import { rootReducer } from './Redux/rootreducer.js';


export const store = createStore(rootReducer);