import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import ProductsNew from './containers/products/ProductsNew'
import reducers from './reducers/index'

import './index.css';

const createStoreWithMiddleware = compose(applyMiddleware(promise, thunk))(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router>
      <App>
      </App>
    </Router>
  </Provider>
  , document.getElementById('root')
)
registerServiceWorker();
