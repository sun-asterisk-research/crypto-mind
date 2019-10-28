import quesReducer from './quesReducer';
import rankReducer from './rankReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import tomoReducer from './tomoReducer';

const rootReducer = combineReducers({
  ques: quesReducer,
  rank: rankReducer,
  firestore: firestoreReducer,
  tomo: tomoReducer
});

export default rootReducer;
