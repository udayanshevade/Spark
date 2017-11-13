import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer, { initialState } from './reducers';

const isClient = typeof document !== 'undefined';
const isDeveloping = process.env.NODE_ENV !== 'production';

const enhancers = [];
if (isClient && isDeveloping) {
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const middlewares = [thunk];

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

const store = createStore(
  reducer,
  initialState,
  composedEnhancers
);

export default store;
