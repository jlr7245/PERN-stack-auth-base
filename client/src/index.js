import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'

import App from './App'
import store, { history } from './store'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
