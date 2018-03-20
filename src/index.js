import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import './index.css';

import authReducer from './store/reducers/auth';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
  auth: authReducer
});

// eslint-disable-next-line no-undef
const composeEnhancers = process.env.NODE_ENV === 'development'
// eslint-disable-next-line no-underscore-dangle
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('ko-card-root'));
registerServiceWorker();
