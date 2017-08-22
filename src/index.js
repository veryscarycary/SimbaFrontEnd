import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import { Helmet } from 'react-helmet'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

import './style/vendor/bootstrap.css'
import './style/vendor/font-awesome.min.css'
import './style/vendor/ionicons.css'

import reducers from './reducers/index'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const createStoreWithMiddleware = composeEnhancers(applyMiddleware(promise, thunk))(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SIMBA</title>
        <link href="https://fonts.googleapis.com/css?family=Lemonada" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/grids-responsive-min.css" />
      </Helmet>
      <App />
    </div>
  </Provider>
  , document.getElementById('root')
)
registerServiceWorker();
