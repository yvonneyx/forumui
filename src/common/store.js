import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import history from './history';
import rootReducer from './rootReducer';

const router = routerMiddleware(history);

const middlewares = [thunk, router];

let devToolsExtension = f => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__();
  }
}

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      devToolsExtension,
    ),
  );

  /* istanbul ignore if  */
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

export default configureStore();
