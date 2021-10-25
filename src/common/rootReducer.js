import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { connectRouter } from 'connected-react-router'
import history from './history';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import chatReducer from '../features/chat/redux/reducer';
import postReducer from '../features/post/redux/reducer';

const reducerMap = {
  router: connectRouter(history),
  home: homeReducer,
  common: commonReducer,
  chat: chatReducer,
  post: postReducer,
};

export default combineReducers(reducerMap);
