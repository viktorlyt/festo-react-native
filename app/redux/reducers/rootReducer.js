import { combineReducers } from 'redux';
import auth from './auth/reducer';
import language from './language/reducer';
import notification from './notification/reducer';
import socket from './Socket/reducer';

const rootReducer = combineReducers({
  auth,
  language,
  notification,
  socket,
});

export default rootReducer;
